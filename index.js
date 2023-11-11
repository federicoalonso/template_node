require('dotenv').config();
const {
    logger
} = require('./common/logger');
const { dbService } = require('./db/dbService');
const { cacheService } = require('./common/cache');
const initializeRoutes = require('./routes');

async function run() {
    try {
        const {server: serverInstance, app: app} = await initializeRoutes(dbService, cacheService);
        return {server: serverInstance, app: app, cacheService: cacheService, dbService: dbService};
    } catch (err) {
        logger.error(err);
    } finally {
        logger.info('[index] [run] Application started');
    }
}

module.exports = run();