const axios = require('axios');

const IHttpService = require('./IHttpService');

class AxiosHttpService extends IHttpService {

    constructor() {
        super();
    }

    async get(url, config) {
        return await axios.get(url, config);
    }

    async post(url, data, config) {
        return await axios.post(url, data, config);
    }

    async put(url, data, config) {
        return await axios.put(url, data, config);
    }

    async delete(url, config) {
        return await axios.delete(url, config);
    }
}

module.exports = AxiosHttpService;