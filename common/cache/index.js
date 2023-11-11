const { CACHE_DEFAULT_TYPE } = require('../../config');
const { logger } = require('../logger');
const { messageBinder } = require('../../utils/locale/locale-binder');
const { ElementInvalidException } = require('../exceptions/exceptions');

let cacheService;

if (CACHE_DEFAULT_TYPE === 'memory') {
    cacheService = require('./localCache');
} else if (CACHE_DEFAULT_TYPE === 'redis') {
    cacheService = require('./redisCache');
} else {
    logger.error(messageBinder().invalidCacheType);
    throw new ElementInvalidException(messageBinder().invalidCacheType);
}

const customCacheService = (type) => {
    if (type === 'memory') {
        return require('./localCache');
    } else if (type === 'redis') {
        return require('./redisCache');
    } else {
        logger.error(messageBinder().invalidCacheType);
        throw new ElementInvalidException(messageBinder().invalidCacheType);
    }
}

module.exports = {  cacheService, customCacheService };