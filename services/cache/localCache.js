const NodeCache = require('node-cache');
const cache = new NodeCache();

const set = (key, value, ttl) => {
    return cache.set(key, value, ttl);
};

const get = (key) => {
    return cache.get(key);
};

const del = (key) => {
    return cache.del(key);
};

module.exports = {
    set,
    get,
    del,
};