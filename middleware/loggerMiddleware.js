const { logger } = require("../common/logger");

function loggerMiddleware(req, res, next) {
  const start = Date.now();
  const src = `${req.ip}`;
  const client = req.headers["user-agent"];
  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
    const message = `${statusCode} - ${req.method} ${url} - ${duration} ms`;
    let level = "";
    if (statusCode >= 400) {
      level = "error";
    } else {
      level = "info";
    }
    logger.log({ level, message, duration, src, url, client });
  });
  next();
}

module.exports = { loggerMiddleware, logger };