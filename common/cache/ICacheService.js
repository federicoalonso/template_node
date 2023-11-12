class ICacheService {
    set(key, value, ttl) {
        throw new Error('Not implemented');
    }
    get(key) {
        throw new Error('Not implemented');
    }
    del(key) {
        throw new Error('Not implemented');
    }
    health() {
        throw new Error('Not implemented');
    }
    stop() {
        throw new Error('Not implemented');
    }
}
module.exports = ICacheService;