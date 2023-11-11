const { 
    AWS_REGION, 
    AWS_ACCESS_KEY_ID, 
    AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN,
    DB_DYNAMO_HOST,
    DB_DYNAMO_TABLE,
} = require('../../config');
const {
    logger
} = require('../../common/logger');
const {
    v4: uuidv4
} = require('uuid');

const IDBService = require('../IDBService');

class SQLiteDBService extends IDBService {
    client = null;
    docClient = null;
    tableName = null;

    constructor() {
        super();
    }

    customTableConstructor(tableName) {
    }

    async healthCheck() {
        logger.info('Checking SQLite health started');
        try {
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        } finally {
            logger.info('Checking SQLite health finished');
        }
    }
}

module.exports = SQLiteDBService;