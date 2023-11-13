const { logger } = require('../common/logger');
const { NOTIFICATION_CHANNEL } = require('../config');
const {
    evalException,
    ConflictWithElements,
    ElementAlreadyExist,
    ElementInvalidException,
    ElementNotFoundException,
    ErrorMessages,
    HttpErrorCodes,
    InvalidCredentials,
    MissingToken
} = require('../common/exceptions/exceptions');

const initializeWorkers = async (notificationSrv, dbService, cacheService) => {

    const notificationService = notificationSrv;

    const logTodosPublished = (data) => {
        logger.info(`[workers] [logTodosPublished] Data received: ${data}`);
    }

    await notificationService.subscribe(logTodosPublished, NOTIFICATION_CHANNEL);
}

module.exports = initializeWorkers;