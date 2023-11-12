const NodeCache = require('node-cache');
const cache = new NodeCache();

const ICacheService = require('./ICacheService');

class MemoryCache extends ICacheService {
    constructor() {
        super();
        this.cache = cache;
    }

    async set(key, value, ttl = 3 * 24 * 60 * 60) {
        return await this.cache.set(key, JSON.stringify(value), ttl);
    }

    async get(key) {
        return await this.cache.get(key);
    }

    async del(key) {
        return await this.cache.del(key);
    }

    async health() {
        return await this.cache.getStats();
    }

    stop() {
        return this.cache.close();
    }
}

module.exports = MemoryCache;