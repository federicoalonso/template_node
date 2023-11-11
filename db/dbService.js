const { DB_DEFAULT_TYPE } = require('../config');
const { logger } = require('../common/logger');
const { messageBinder } = require('../utils/locale/locale-binder');
const { ElementInvalidException } = require('../common/exceptions/exceptions');
const IDBService = require('./IDBService');
const SQLiteService = require('./sqlite');
const MySQLService = require('./mysql');
const DynamoDBService = require('./dynamo');

let dbService;

if (DB_DEFAULT_TYPE === 'sqlite') {
    dbService = new SQLiteService();
} else if (DB_DEFAULT_TYPE === 'mysql') {
    dbService = new MySQLService();
} else if (DB_DEFAULT_TYPE === 'dynamo') {
    dbService = new DynamoDBService();
} else {
    logger.error(messageBinder().invalidCacheType);
    throw new ElementInvalidException(messageBinder().invalidCacheType);
}

const customDBService = (type, table) => {
    if (type === 'sqlite') {
        return new SQLiteService();
    } else if (type === 'mysql') {
        return new MySQLService();
    } else if (type === 'dynamo') {
        const dynamoInstance = new DynamoDBService();
        dynamoInstance.customTableConstructor(table);
        return dynamoInstance;
    } else {
        logger.error(messageBinder().invalidCacheType);
        throw new ElementInvalidException(messageBinder().invalidCacheType);
    }
}


module.exports = { dbService, customDBService, IDBService };