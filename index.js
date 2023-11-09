require('dotenv').config();
if (process.env.ENVIRONMENT === 'production') {
  require('newrelic');
}

const { initializeModels } = require('./data-access/mysql/models/initialize')
const { initializeRoutes } = require('./controllers/routesHandler')

const dbService = require('./services/db/db-services')
const usersService = require('./services/users/users-services')
const gamesService = require('./services/games/games-services')
const stocksService = require('./services/stocks/stocks-services')
const newsService = require('./services/news/news-services')
const priceDetailsService = require('./services/prices/prices-services')
const transactionsService = require('./services/transactions/transactions-services')
const recommendationService = require('./services/recommendation/recomendation-services')

async function run() {
  let mySQLdbModels = await initializeModels()
  let mySqlServices = {
    dbService: dbService,
    usersService: usersService,
    gamesService: gamesService,
    stocksService: stocksService,
    newsService: newsService,
    priceDetailsService: priceDetailsService,
    transactionsService: transactionsService,
    recommendationService: recommendationService
  }

  await setModelsToServices(mySqlServices, mySQLdbModels)

  return await initializeRoutes(mySqlServices)
}

const setModelsToServices = async (services, dbModels) => {
  for (let service in services) {
    await services[service].setDbModels(dbModels)
  }
}

module.exports = run()
