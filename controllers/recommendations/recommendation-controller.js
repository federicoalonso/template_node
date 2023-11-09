const { HttpErrorCodes, evalException } = require('../../exceptions/exceptions');
const { verifyToken } = require('../../services/jwt')
const { webServer } = require('../../conf/config');
const authMiddleware = require("../../middleware/authMiddleware");

const startRecommendationRoutes = async (router, recommendationLogic) => {
  router.get(webServer.routes.stocks.getRecommendations, authMiddleware, async (req, res) => {
    try {
      let { id: userId } = verifyToken(req.headers.authorization)
      let stockId = req.params.stockId
      let params = {
        userId: parseInt(userId),
        stockId: parseInt(stockId),
        type: req.query.type,
      }
      let recommendation = await recommendationLogic.getRecommendation(params)
      return res.status(HttpErrorCodes.HTTP_200_OK).json(recommendation)
    } catch (err) {
      return evalException(err, res)
    }
  })
}

module.exports = {
  startRecommendationRoutes
}
