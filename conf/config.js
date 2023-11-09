const conf = require('./config.json')
const fs = require('fs')
const path = require('path')

const webServer = conf.webServer
const corsConf = conf.cors
const port = process.env.PORT || 4001
const locale = process.env.LOCALE || 'ES'
const environment = process.env.ENVIRONMENT || 'development'
const dbConnectionString =
  process.env.DBCONNECTIONSTRING ||
  'mysql://root:secret@localhost:3306/svc_game'
const logLevel = process.env.LOGLEVEL || 'debug'
const publicKey = fs.readFileSync(
  path.join(__dirname, './certs/public.key'),
  'utf8'
);
const privateKey = fs.readFileSync(
  path.join(__dirname, "certs", "../certs/private.key"),
  'utf8'
);
const limitCotizationsTo = process.env.LIMITCOTIZATIONSTO || '20'
const limitTransactionOfRecommendationTo =
  process.env.LIMITTRANSACTIONOFRECOMENDATIONTO || '100'
const cacheType = process.env.CACHE_TYPE || 'local'
const redisHost = process.env.REDIS_HOST || 'localhost'
const redisPort = process.env.REDIS_PORT || '6379'

module.exports = {
  dbConnectionString,
  webServer,
  locale,
  port,
  environment,
  corsConf,
  logLevel,
  publicKey,
  privateKey,
  limitCotizationsTo,
  cacheType,
  redisHost,
  redisPort,
  limitTransactionOfRecommendationTo
}
