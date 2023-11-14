class IHttpService {
    constructor() {
        if (this.constructor === IHttpService) {
            throw new TypeError('Abstract class "IHttpService" cannot be instantiated directly.');
        }
    }

    get(url, config) {
        throw new Error('Method "get()" must be implemented.');
    }

    post(url, data, config) {
        throw new Error('Method "post()" must be implemented.');
    }

    put(url, data, config) {
        throw new Error('Method "put()" must be implemented.');
    }

    delete(url, config) {
        throw new Error('Method "delete()" must be implemented.');
    }
}

module.exports = IHttpService;