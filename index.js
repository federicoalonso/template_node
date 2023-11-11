require('dotenv').config();
const cron = require('node-cron');
const {
    logger
} = require('./common/logger');
const { dbService } = require('./db/dbService');
const { cacheService } = require('./common/cache');
const { notifiaciontService } = require('./common/notifications');
const initializeRoutes = require('./routes');
const { SERVICE_DESCRIPTION } = require('./config');

async function run() {
    try {
        const {server: serverInstance, app: app} = await initializeRoutes(dbService, cacheService, notifiaciontService);
        return {server: serverInstance, app: app, cacheService: cacheService, dbService: dbService, notifiaciontService: notifiaciontService};
    } catch (err) {
        logger.error(err);
    } finally {
        logger.info('[index] [run] Application started');
    }
}

cron.schedule('*/1 * * * *', () => {
    logger.info('[index] [run] cron job started');
    cacheService.set('api-template', JSON.stringify(SERVICE_DESCRIPTION), 300);
    logger.info('[index] [run] cron job finished');
});

module.exports = run();