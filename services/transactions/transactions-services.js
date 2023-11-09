const { Op } = require('sequelize')

const {
  ElementNotFoundException,
  ElementInvalidException,
} = require('../../exceptions/exceptions')
const { messageBinder } = require('../../common/locale/locale-binder')
const { getCurrentPrice } = require('../prices/prices-services')
const cacheService = require('../cache')
const { logger } = require('../../common/logger')

var dbModels

const setDbModels = function (models) {
  dbModels = models
}

const getAllTransactionsOfUser = async function (
  userId,
  selectedGameId,
  stockId = null,
  startDate = null,
  endDate = null,
  limit = 20,
  offset = 0
) {

  // let cache_key = `userTransactions_${userId}_${selectedGameId}_${stockId}_${startDate}_${endDate}_${limit}_${offset}`
  // let cachedTransactions = await cacheService.get(cache_key)
  // if (cachedTransactions) {
  //   logger.info(`Cache hit for ${cache_key}`)
  //   return cachedTransactions
  // }

  const transactionWhereConditions = {
    UserId: userId,
  }
  if (stockId !== null) {
    transactionWhereConditions.StockId = stockId
  }
  if (startDate !== null && endDate !== null) {
    transactionWhereConditions.createdAt = {
      [Op.between]: [startDate, endDate],
    }
  }
  const transactions = await dbModels.Transaction.findAndCountAll({
    where: transactionWhereConditions,
    include: [
      {
        model: dbModels.Stock,
        as: 'Stock',
        attributes: ['id', 'name', 'code', 'GameId'],
        where: { GameId: selectedGameId },
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: limit,
    offset: offset,
  })

  // await cacheService.set(`userTransactions_${userId}_${selectedGameId}_${stockId}_${startDate}_${endDate}_${limit}_${offset}`, transactions, 86400)

  return transactions
}

const getLastTransactions = async function (userId, stockId) {
  let user = await getUser(userId)

  let stock = await dbModels.Stock.findOne({
    where: {
      id: stockId,
      GameId: user.selectedGameId,
    },
  })

  if (!stock) {
    throw new ElementNotFoundException(messageBinder().stockNotFound)
  }

  let transactions = await dbModels.Transaction.findAll({
    where: {
      StockId: stockId,
    },
    order: [['createdAt', 'DESC']],
  })

  return transactions
}

const transact = async function (userId, stockId, amount) {
  let user = await getUser(userId)

  cacheService.del(`userStocks_${userId}`)
  // cacheService.del(`userTransactions_${userId}_*`)

  let currentPrice = await getCurrentPrice(stockId)

  let userGameInfo = await dbModels.UserGameInfo.findOne({
    where: {
      UserId: user.id,
      GameId: user.selectedGameId,
    },
    include: [
      {
        model: dbModels.Game,
        where: { id: user.selectedGameId },
      },
    ],
  })

  let stock = await dbModels.Stock.findByPk(stockId)

  await validateTransaction(user, stock, amount, currentPrice, userGameInfo)

  userGameInfo.money = userGameInfo.money - amount * currentPrice
  await userGameInfo.save()

  // modify the available stocks
  stock.availableAmount = stock.availableAmount - amount
  await stock.save()

  let transaction = await dbModels.Transaction.create({
    amount: amount,
    unitPrice: currentPrice,
    UserId: userId,
    StockId: stockId,
  })

  await createOrUpdateUserStockHolding(userGameInfo, stockId, amount)

  return transaction
}

const createOrUpdateUserStockHolding = async (
  userGameInfo,
  stockId,
  amount
) => {
  let userStockHolding = await dbModels.UserStockHolding.findOne({
    where: {
      UserId: userGameInfo.UserId,
      StockId: stockId,
      GameId: userGameInfo.GameId,
    },
  })

  if (!userStockHolding) {
    userStockHolding = await dbModels.UserStockHolding.create({
      amount: amount,
      UserId: userGameInfo.UserId,
      StockId: stockId,
      GameId: userGameInfo.GameId,
    })
  } else {
    userStockHolding.amount = userStockHolding.amount + amount
    if (userStockHolding.amount === 0) {
      await userStockHolding.destroy()
    } else {
      await userStockHolding.save()
    }
  }
}

const validateTransaction = async (
  user,
  stock,
  amount,
  currentPrice,
  userGameInfo
) => {
  if (amount == 0) {
    throw new ElementInvalidException(messageBinder().invalidAmount)
  }

  if (
    new Date(userGameInfo.Game.endDate) < new Date() ||
    new Date(userGameInfo.Game.startDate) > new Date()
  ) {
    throw new ElementInvalidException(messageBinder().gameNotActive)
  }

  // validates the user has enough money to buy the stocks
  if (amount > 0) {
    if(amount > stock.availableAmount) {
      throw new ElementInvalidException(messageBinder().notEnoughStocksInMarket)
    }

    validateMoneyForPurchase(userGameInfo.money, amount, currentPrice)
  }

  // validates the stock is from the current game of the user
  if (stock.GameId !== user.selectedGameId) {
    throw new ElementNotFoundException(messageBinder().stockNotFound)
  }

  // validates the user has enough stocks to sell the requested amount
  if (amount < 0) {
    if(stock.availableAmount + (-amount) > stock.amount) {
      throw new ElementInvalidException(messageBinder().companySharesLimitExceeded)
    }

    await validateStockHoldingsToSell(userGameInfo, stock.id, -amount)
  }
}

const validateMoneyForPurchase = (money, amount, currentPrice) => {
  if (money < amount * currentPrice) {
    throw new ElementInvalidException(messageBinder().notEnoughMoney)
  }
}

const validateStockHoldingsToSell = async (userGameInfo, stockId, amount) => {
  let userStockHolding = await dbModels.UserStockHolding.findOne({
    where: {
      UserId: userGameInfo.UserId,
      StockId: stockId,
      GameId: userGameInfo.GameId,
    },
  })

  if (!userStockHolding || userStockHolding.amount < amount) {
    throw new ElementInvalidException(messageBinder().notEnoughStocks)
  }
}

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
  setDbModels,
  getLastTransactions,
  transact,
  getAllTransactionsOfUser,
}
