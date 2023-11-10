const { REDIS_HOST, REDIS_PORT } = require('../../config');
const Redis = require('ioredis');

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
});

const set = (key, value, ttl) => {
    return redis.set(key, JSON.stringify(value), 'EX', ttl);
};

const get = async (key) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

const del = (key) => {
    return redis.del(key);
};

module.exports = {
    set,
    get,
    del,
};