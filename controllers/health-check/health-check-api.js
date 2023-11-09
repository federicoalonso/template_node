const { HttpErrorCodes } = require("../../exceptions/exceptions");
const { evalException } = require("../../exceptions/exceptions");
const { webServer } = require("../../conf/config");

const startHealthCheckRoutes = async function startHealthCheckRoutes(
  router,
  logic
) {
  var logicHealt = logic;
  router.get(webServer.routes.healthCheck, async function (req, res) {
    try {

      let data = await logicHealt.check();

      return res.status(HttpErrorCodes.HTTP_200_OK).send(data);
    } catch (err) {
      return evalException(err, res);
    }
  });
};

module.exports = {
  startHealthCheckRoutes,
};
