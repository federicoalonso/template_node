const { redisHost, redisPort } = require('../../conf/config');
const Redis = require('ioredis');

const redis = new Redis({
    host: redisHost || 'localhost',
    port: redisPort || 6379,
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