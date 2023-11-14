const { HTTP_DEFAULT_TYPE } = require('../../config');
const { logger } = require('../logger');
const { messageBinder } = require('../../utils/locale/locale-binder');
const { ElementInvalidException } = require('../exceptions/exceptions');

const AxiosHttpService = require('./axiosHttpService');

let httpService;

if (HTTP_DEFAULT_TYPE === 'axios') {
    httpService = new AxiosHttpService();
} else {
    logger.error(messageBinder().invalidHttpType);
    throw new ElementInvalidException(messageBinder().invalidHttpType);
}

const customHttpService = (type) => {
    if (type === 'axios') {
        return new AxiosHttpService();
    } else {
        logger.error(messageBinder().invalidHttpType);
        throw new ElementInvalidException(messageBinder().invalidHttpType);
    }
}

module.exports = { httpService, customHttpService };