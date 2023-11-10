const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const { logLevel, environment } = require("../config");

const customLogFormat = printf(
  ({ level, message, timestamp, duration, src, url, client }) => {
    return JSON.stringify({
      level,
      message,
      timestamp,
      duration,
      src,
      url,
      client,
    });
  }
);

const logParams = (() => {
  if (environment === 'production') {
      return {
          level: logLevel,
          format: combine(timestamp(), customLogFormat),
          transports: [
              new transports.Console()
          ]
      }
  } else {
      return {
          level: logLevel,
          format: format.combine(
              format.colorize(),
              format.simple()
          ),
          transports: [
              new transports.Console()
          ]
      }
  }
})()
const logger = createLogger(logParams);

module.exports = { logger };
