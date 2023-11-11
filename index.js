require('dotenv').config();
const {
    logger
} = require('./common/logger');
const { dbService } = require('./db/dbService');
const initializeRoutes = require('./routes');

async function run() {
    try {
        return await initializeRoutes(dbService);
    } catch (err) {
        logger.error(err);
    }
}

module.exports = run();