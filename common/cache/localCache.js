const NodeCache = require('node-cache');
const cache = new NodeCache();

const set = async (key, value, ttl) => {
    return await cache.set(key, value, ttl);
};

const get = async (key) => {
    return await cache.get(key);
};

const del = async (key) => {
    return await cache.del(key);
};

const health = async () => {
    return await cache.getStats();
};

module.exports = {
    set,
    get,
    del,
    health,
};