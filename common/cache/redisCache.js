const { REDIS_HOST, REDIS_PORT } = require('../../config');
const Redis = require('ioredis');

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
});

const set = async (key, value, ttl) => {
    return await redis.set(key, JSON.stringify(value), 'EX', ttl);
};

const get = async (key) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

const del = async (key) => {
    return await redis.del(key);
};

const health = async () => {
    return await redis.ping();
}

module.exports = {
    set,
    get,
    del,
    health,
};