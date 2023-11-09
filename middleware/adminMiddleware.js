const { verifyToken } = require('../services/jwt')
const { messageBinder } = require('../common/locale/locale-binder')
const { logger } = require('../common/logger')

function adminMiddleware(req, res, next) {
  try {
    const bearer_token = req.headers.authorization

    const decoded = verifyToken(bearer_token)

    if (!decoded) {
      return res.status(401).send(messageBinder().missingToken)
    }

    if (decoded.role !== 'admin') {
      return res.status(403).send(messageBinder().forbidden)
    }

    next()
  } catch (error) {
    logger.error(`${messageBinder().defaultError} ${error.message}`)

    if (error.name === 'TokenExpiredError') {
      return res.status(403).send(messageBinder().tokenExpired)
    } else if (error.message === messageBinder().missingToken) {
      return res.status(401).send(messageBinder().missingToken)
    }
    return res.status(500).send(messageBinder().defaultError)
  }
}

module.exports = adminMiddleware
