var express = require('express')
const http = require('http')
const cors = require('cors')
const { webServer, environment, corsConf, port } = require('../conf/config')
const { loggerMiddleware } = require('../middleware/logMiddleware')
const { logger } = require('../common/logger')

var app = express()
const server = http.createServer(app)
const baseUrl = webServer.baseUrl
const api_port = port || '4010'

/* require controllers  */
const { startHealthCheckRoutes } = require('./health-check/health-check-api')
const { startUsersRoutes } = require('./users/users-controller')
const { startGamesRoutes } = require('./games/games-controller')
const { startStocksRoutes } = require('./stocks/stocks-controller')
const { startNewsRoutes } = require('./news/news-controller')
const { startPriceDetailsRoutes } = require('./prices/price-details-controller')
const {
  startTransactionsRoutes
} = require('./transactions/transactions-controller')
const {
  startRecommendationRoutes
} = require('./recommendations/recommendation-controller')
const undefinedRouteMiddleware = require('../middleware/undefinedRouteMiddleware')

const doCommonFilter = (app) => {
  app.use(express.static('public'))
  app.use(express.json())
  app.use(loggerMiddleware)
  
  const corsOptions = corsConf[environment].corsOptions
  app.use(cors(corsOptions))
}

const initializeRoutes = async function (services) {
  doCommonFilter(app)
  let router = express.Router()
  await startHealthCheckRoutes(router, services.dbService)
  await startUsersRoutes(router, services.usersService)
  await startGamesRoutes(router, services.gamesService)
  await startStocksRoutes(router, services.stocksService)
  await startNewsRoutes(router, services.newsService)
  await startPriceDetailsRoutes(router, services.priceDetailsService)
  await startTransactionsRoutes(router, services.transactionsService)
  await startRecommendationRoutes(router, services.recommendationService)

  app.use(baseUrl, router)
  app.use(undefinedRouteMiddleware)

  const serverInstance = server.listen(api_port, () => {
    logger.info(
      `[service: routeHandler] [function: initializeRoutesServer] [type:I] is running on port ${api_port}`
    )
  })

  return { app: app, server: serverInstance }
}

module.exports = {
  initializeRoutes
}
