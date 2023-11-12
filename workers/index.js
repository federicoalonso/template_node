const { logger } = require('../common/logger');
const { NOTIFICATION_CHANNEL } = require('../config');

const initializeWorkers = async (notificationSrv) => {

    const notificationService = notificationSrv;

    const logTodosPublished = (data) => {
        logger.info(`[workers] [logTodosPublished] Data received: ${data}`);
    }

    await notificationService.subscribe(logTodosPublished, NOTIFICATION_CHANNEL);
}

module.exports = initializeWorkers;