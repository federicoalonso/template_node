const {
  HttpErrorCodes,
  evalException,
} = require("../../exceptions/exceptions");
const { webServer } = require("../../conf/config");
const { verifyToken } = require('../../services/jwt')
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const startStocksRoutes = async function startStocksRoutes(router, stocksLogic) {
  router.get(
    webServer.routes.stocks.getStocks,
    authMiddleware,
    async function (req, res) {
      try {
        let { id: userId } = verifyToken(req.headers.authorization)
        let { includePrices } = req.query
        let games = await stocksLogic.getAll(userId, includePrices)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(games)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )

  router.get(
    webServer.routes.stocks.getStock,
    authMiddleware,
    async function (req, res) {
      try {
        let id = req.params.id
        let { includeStats } = req.query

        let game = await stocksLogic.getOne(id, includeStats)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(game)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )

  router.post(
    webServer.routes.stocks.createStock,
    adminMiddleware,
    async function (req, res) {
      try {
        let aStock = req.body
        let nesStock = await stocksLogic.create(aStock)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(nesStock)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )

  router.put(
    webServer.routes.stocks.updateStock,
    adminMiddleware,
    async function (req, res) {
      try {
        let id = req.params.id
        let aStock = req.body
        let updatedStock = await stocksLogic.update(id, aStock)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(updatedStock)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )

  router.delete(
    webServer.routes.stocks.deleteStock,
    adminMiddleware,
    async function (req, res) {
      try {
        let id = req.params.id
        let deletedStock = await stocksLogic.remove(id)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(deletedStock)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )

  router.get(
    webServer.routes.stocks.getMyStocks,
    authMiddleware,
    async function (req, res) {
      try {
        let { id: userId } = verifyToken(req.headers.authorization)
        let stocks = await stocksLogic.getMyStocks(userId)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(stocks)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )
}

module.exports = {
  startStocksRoutes,
};
