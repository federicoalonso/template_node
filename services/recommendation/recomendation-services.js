const { validate } = require('./validate-recommendation')
const {
  ElementNotFoundException,
  ElementInvalidException
} = require('../../exceptions/exceptions')
const { messageBinder } = require('../../common/locale/locale-binder')
const { getAll, getCurrentPrice } = require('../prices/prices-services')

var dbModels

const setDbModels = function (models) {
  dbModels = models
}

const getRecommendation = async (params) => {
  validate(params)
  await validateUserRegisteredToGame(params)
  let recommendationResult = ''
  switch (params.type) {
    case 'transaction':
      recommendationResult = await getRecommendationByTransaction(params)
      break
    case 'price':
      recommendationResult = await getRecommendationByPrice(params)
      break
    default:
      throw new ElementNotFoundException(
        messageBinder().recommendationTypeNotFound
      )
  }
  return recommendationResult
}

const validateUserRegisteredToGame = async (params) => {
  let stock = await dbModels.Stock.findByPk(params.stockId)
  if (!stock) {
    throw new ElementNotFoundException(messageBinder().stockNotFound)
  }
  let gameId = stock.GameId
  let gameDetails = await dbModels.UserGameInfo.findOne({
    where: {
      GameId: gameId,
      UserId: params.userId
    }
  })
  if (!gameDetails) {
    throw new ElementInvalidException(messageBinder().userNotRegisteredToGame)
  }
}

const getRecommendationByPrice = async (params) => {
  try {
    const prices = await getAll(params.stockId)
    const currentPrice = await getCurrentPrice(params.stockId)
    const total = prices.reduce((acc, price) => acc + price.price, 0)
    if (prices.length === 0) {
      return 'No historical prices available.'
    }
    const average = total / prices.length
    if (currentPrice <= average) {
      return 'BUY'
    }
    return 'SELL'
  } catch (error) {
    throw error
  }
}

const getRecommendationByTransaction = async (params) => {
  let stockExists = await dbModels.Stock.findByPk(params.stockId)
  if (!stockExists) {
    throw new ElementNotFoundException(messageBinder().stockNotFound)
  }

  let transactions = await dbModels.Transaction.findAll({
    limit: parseInt(process.env.LIMITTRANSACTIONOFRECOMMENDATIONTO, 10) || 100,
    where: {
      StockId: params.stockId,
    },
    order: [['createdAt', 'DESC']],
  })

  if (transactions.length < 5) {
    return 'HOLD'
  }

  let countBuy = 0
  let countSell = 0

  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      countBuy++
    } else if (transaction.amount < 0) {
      countSell++
    }
  })

  if (countBuy / transactions.length >= 0.7) {
    return 'BUY'
  } else if (countSell / transactions.length >= 0.7) {
    return 'SELL'
  } else {
    return 'HOLD'
  }
}

module.exports = {
  setDbModels,
  getRecommendation
}
