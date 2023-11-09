const { validate } = require('./validate-stocks')
const { ElementNotFoundException } = require('../../exceptions/exceptions')
const { messageBinder } = require('../../common/locale/locale-binder')
const { create: createPriceDetail } = require('../prices/prices-services')
const cacheService = require('../cache')
const { Op } = require('sequelize');

var dbModels

const setDbModels = function (models) {
  dbModels = models
}

const create = async function (stock) {
  validate(stock)

  let stockExists = await dbModels.Stock.findOne({
    where: {
      name: stock.name,
      GameId: stock.GameId
    }
  })

  if (stockExists) {
    throw new ElementNotFoundException(messageBinder().alreadyExists)
  }

  let gameExists = await dbModels.Game.findByPk(stock.GameId)

  if (!gameExists) {
    throw new ElementNotFoundException(messageBinder().gameNotFound)
  }

  stock.Code = stock.code.toUpperCase()

  let newStock = await dbModels.Stock.create(stock)
  let priceDetail = {
    StockId: newStock.id,
    price: parseInt(stock.initialPrice)
  }
  createPriceDetail(priceDetail)
  return newStock
}

const getOne = async function (id, includeStats) {
  if(!includeStats) {
    let stock = await dbModels.Stock.findByPk(id)
    if (!stock) {
      throw new ElementNotFoundException(messageBinder().notFound)
    }
    return stock
  }

  let stock = await dbModels.Stock.findByPk(id, {
    include: [
      {
        model: dbModels.Transaction,
        // where createdAt less than a month ago
        where: {
          createdAt: {
            [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
          },
        },
        required: false,
      },
    ],
  })

  let transactionVolume = 0
  for (let i = 0; i < stock.Transactions.length; i++) {
    transactionVolume += parseInt(stock.Transactions[i].amount)
  }

  let result = {
    id: stock.id,
    code: stock.code,
    name: stock.name,
    description: stock.description,
    GameId: stock.GameId,
    transactionVolume: transactionVolume,
  }

  return result
}

const getAll = async function (userId, includePrices) {
  let user = await getUser(userId)

  if (!includePrices) {
    return await dbModels.Stock.findAll({
      where: {
        GameId: user.selectedGameId,
      },
    })
  }

  let stocks = await dbModels.Stock.findAll({
    where: {
      GameId: user.selectedGameId,
    },
    include: [
      {
        model: dbModels.PriceDetail,
        attributes: ['price'],
        order: [['createdAt', 'DESC']],
        limit: 1,
      },
    ],
  })

  return stocks
}

const update = async function (id, stock) {
  validate(stock)

  let stockExists = await dbModels.Stock.findByPk(id)

  if (!stockExists) {
    throw new ElementNotFoundException(messageBinder().notFound)
  }

  stockExists.name = stock.name
  stockExists.code = stock.code
  stockExists.description = stock.description

  await stockExists.save()

  return stockExists
}

const remove = async function (id) {
  // check if it has no transactions
  let stock = await dbModels.Stock.findByPk(id)

  if (!stock) {
    throw new ElementNotFoundException(messageBinder().notFound)
  }

  await stock.destroy()
}

const getMyStocks = async (userId) => {
  try {
    const currentUser = await getUser(userId)
    const cacheKey = `userStocks_${userId}`;
    const cachedData = await cacheService.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const user = await dbModels.User.findByPk(userId, {
      include: [
        {
          model: dbModels.UserStockHolding,
          where: { GameId: currentUser.selectedGameId },
          include: [
            {
              model: dbModels.Stock,
              include: [
                {
                  model: dbModels.PriceDetail,
                  order: [['createdAt', 'DESC']],
                  limit: 2,
                },
              ],
            },
          ],
        },
      ],
    })

    if (!user) {
      return [];
    }

    const stockHoldingsInfos = user.UserStockHoldings.map((holding) => ({
      stockName: holding.Stock.name,
      stockCode: holding.Stock.code,
      stockId: holding.Stock.id,
      currentUnitPrice: holding.Stock.PriceDetails[0].price, // Último precio
      lastUnitPrice: holding.Stock.PriceDetails[1]
        ? holding.Stock.PriceDetails[1].price
        : -1, // Precio anterior
      availableAmount: holding.Stock.availableAmount,
      totalAmount: holding.Stock.amount,
      amount: holding.amount,
    }));

    await cacheService.set(cacheKey, stockHoldingsInfos, 60);

    return stockHoldingsInfos;
  } catch (error) {
    throw error;
  }
};

const getUser = async (userId) => {
  let user = await dbModels.User.findOne({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new ElementNotFoundException(messageBinder().userNotFound)
  }

  return user
}

module.exports = {
  create,
  getOne,
  getAll,
  update,
  remove,
  getMyStocks,
  setDbModels,
}
