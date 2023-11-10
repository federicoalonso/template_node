const { CACHE_DEFAULT_TYPE } = require('../../config');
const { logger } = require('../logger');
const { messageBinder } = require('../locale/locale-binder');
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

module.exports = cacheService;