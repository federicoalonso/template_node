const { cacheType } = require('../../conf/config');

let cacheService;

if (cacheType === 'local') {
    cacheService = require('./localCache');
} else if (cacheType === 'redis') {
    cacheService = require('./redisCache');
} else {
    throw new Error('CACHE_TYPE no válido en el archivo .env');
}

module.exports = cacheService;