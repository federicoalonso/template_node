const paginate = require('express-paginate')

const { HttpErrorCodes, evalException } = require('../../exceptions/exceptions')
const { webServer } = require('../../conf/config')
const { verifyToken } = require('../../services/jwt')
const authMiddleware = require('../../middleware/authMiddleware')

const startTransactionsRoutes = async (router, transactionsLogic) => {
  router.get(
    webServer.routes.stocks.getTransactions,
    async (req, res) => {
      try {
        let stockId = req.params.stockId
        let { id: userId } = verifyToken(req.headers.authorization)
        let transactions = await transactionsLogic.getLastTransactions(
          userId,
          stockId
        )
        res.status(HttpErrorCodes.HTTP_200_OK).json(transactions)
      } catch (error) {
        evalException(error, res)
      }
    },
    authMiddleware
  )

  router.get(
    webServer.routes.transactions.getTransactions,
    authMiddleware,
    paginate.middleware(5, 50),
    async (req, res) => {
      try {
        const stockId =
          req.query.stockId === undefined ? null : req.query.stockId
        const startDate =
          req.query.startDate === undefined ? null : req.query.startDate
        const endDate =
          req.query.endDate === undefined ? null : req.query.endDate
        let { id: userId, selectedGameId } = verifyToken(req.headers.authorization)
        let transactions = await transactionsLogic.getAllTransactionsOfUser(
          userId,
          selectedGameId,
          stockId,
          startDate,
          endDate,
          req.query.limit,
          req.skip
        )
        const pageCount = Math.ceil(transactions.count / req.query.limit)
        res.status(HttpErrorCodes.HTTP_200_OK).send({
          data: transactions.rows,
          pageCount,
          itemCount: transactions.count,
          pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
        })
      } catch (error) {
        return evalException(error, res)
      }
    }
  )

  router.post(
    webServer.routes.stocks.transactStock,
    async (req, res) => {
      try {
        let stockId = req.params.stockId
        let { amount } = req.body
        let { id: userId } = verifyToken(req.headers.authorization)
        let transaction = await transactionsLogic.transact(
          userId,
          stockId,
          amount
        )
        res.status(HttpErrorCodes.HTTP_200_OK).send(transaction)
      } catch (error) {
        evalException(error, res)
      }
    },
    authMiddleware
  )
}

module.exports = {
  startTransactionsRoutes,
}
