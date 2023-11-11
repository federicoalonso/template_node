const { REDIS_HOST, REDIS_PORT } = require('../../config');
const Redis = require('ioredis');

const ICacheService = require('./ICacheService');

class RedisCache extends ICacheService {
    cache = null;
    constructor() {
        super();
        this.cache = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
        });
    }

    async set(key, value, ttl = 3 * 24 * 60 * 60) {
        return await this.cache.set(key, JSON.stringify(value), 'EX', ttl);
    }

    async get(key) {
        const data = await this.cache.get(key);
        return data ? JSON.parse(data) : null;
    }

    async del(key) {
        return await this.cache.del(key);
    }

    async health() {
        return await this.cache.ping();
    }

    stop() {
        return this.cache.disconnect();
    }
}

module.exports = RedisCache;