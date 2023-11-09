const {
  HttpErrorCodes,
  evalException,
} = require("../../exceptions/exceptions");
const { webServer } = require("../../conf/config");
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const startPriceDetailsRoutes = async function startPriceDetailsRoutes(router, priceDetailsLogic) {

  router.get(webServer.routes.stocks.getPrices, authMiddleware, async (req, res) => {
    try {
      let stockId = req.params.stockId;
      let prices = await priceDetailsLogic.getLast(stockId);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(prices);
    } catch (err) {
      return evalException(err, res);
    }
  });

  router.post(webServer.routes.stocks.createPrice, adminMiddleware, async function (req, res) {
    try {
      let priceDetail = req.body;
      priceDetail.StockId = req.params.stockId;

      let newPrice = await priceDetailsLogic.create(priceDetail);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(newPrice);
    } catch (err) {
      return evalException(err, res);
    }
  });
};

module.exports = {
  startPriceDetailsRoutes,
};
