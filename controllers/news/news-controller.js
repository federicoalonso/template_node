const {
  HttpErrorCodes,
  evalException,
} = require("../../exceptions/exceptions");
const { webServer } = require("../../conf/config");
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");
const { verifyToken } = require('../../services/jwt')
const paginate = require('express-paginate')

var newsLogic

const startNewsRoutes = async function startNewsRoutes(router, logic) {
  newsLogic = logic

router.get(
  webServer.routes.news.getNewsByGame,
  authMiddleware,
  paginate.middleware(5, 50),
  async function (req, res) {
    try {
      const stockId = req.query.stockId || null
      const user = verifyToken(req.headers.authorization)

      let news = await newsLogic.getAll(
        user.id,
        stockId,
        req.query.limit,
        req.skip
      )
      const pageCount = Math.ceil(news.count / req.query.limit)

      res.status(HttpErrorCodes.HTTP_200_OK).send({
        data: news.rows,
        pageCount,
        itemCount: news.count,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
      })
    } catch (err) {
      return evalException(err, res)
    }
  }
)

  router.get(
    webServer.routes.news.getNews,
    authMiddleware,
    async function (req, res) {
      try {
        let id = req.params.id
        let news = await newsLogic.getOne(id)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(news)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )

  router.get(
    webServer.routes.news.getNewsByStock,
    authMiddleware,
    async function (req, res) {
      try {
        const user = verifyToken(req.headers.authorization)
        const userId = user.id
        let stockId = req.params.stockId
        let intStockId = parseInt(stockId)
        let news = await newsLogic.getByStock(userId, intStockId)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(news)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )

  router.post(
    webServer.routes.news.createNews,
    adminMiddleware,
    async function (req, res) {
      try {
        let aNews = req.body
        let newNews = await newsLogic.create(aNews)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(newNews)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )

  router.delete(
    webServer.routes.news.deleteNews,
    adminMiddleware,
    async function (req, res) {
      try {
        let id = req.params.id
        let deletedNews = await newsLogic.remove(id)
        return res.status(HttpErrorCodes.HTTP_200_OK).send(deletedNews)
      } catch (err) {
        return evalException(err, res)
      }
    }
  )
}

module.exports = {
  startNewsRoutes,
};
