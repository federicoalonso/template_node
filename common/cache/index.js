const { CACHE_DEFAULT_TYPE } = require('../../config');
const { logger } = require('../logger');
const { messageBinder } = require('../../utils/locale/locale-binder');
const { ElementInvalidException } = require('../exceptions/exceptions');

const RedisCache = require('./redisCache');
const MemoryCache = require('./memoryCache');

let cacheService;

if (CACHE_DEFAULT_TYPE === 'memory') {
    cacheService = new MemoryCache();
} else if (CACHE_DEFAULT_TYPE === 'redis') {
    cacheService = new RedisCache();
} else {
    logger.error(messageBinder().invalidCacheType);
    throw new ElementInvalidException(messageBinder().invalidCacheType);
}

const customCacheService = (type) => {
    if (type === 'memory') {
        return new MemoryCache();
    } else if (type === 'redis') {
        return new RedisCache();
    } else {
        logger.error(messageBinder().invalidCacheType);
        throw new ElementInvalidException(messageBinder().invalidCacheType);
    }
}

module.exports = {  cacheService, customCacheService };