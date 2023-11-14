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

const initializeWorkers = async (notificationSrv, dbService, cacheService, httpService) => {

    const notificationService = notificationSrv;

    const logTodosPublished = async (data) => {
        logger.info(`[workers] [logTodosPublished] Data received: ${data}`);
        const uid = uuidv4();
        const todoItem = {
            'id': uid,
            data,
        };
        await dbService.save(todoItem);
        await cacheService.del('todos', todoItem);
    }

    await notificationService.subscribe(logTodosPublished, NOTIFICATION_CHANNEL);
}

module.exports = initializeWorkers;