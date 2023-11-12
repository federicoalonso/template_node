const { NOTIFICATION_DEFAULT_TYPE } = require('../../config');
const { logger } = require('../logger');
const { messageBinder } = require('../../utils/locale/locale-binder');
const { ElementInvalidException } = require('../exceptions/exceptions');

const SNSNotification = require('./SNSNotification');
const RedisNotification = require('./RedisNotification');

let notifiaciontService;

if (NOTIFICATION_DEFAULT_TYPE === 'sns') {
    notifiaciontService = new SNSNotification();
} else if (NOTIFICATION_DEFAULT_TYPE === 'redis') {
    notifiaciontService = new RedisNotification();
} else {
    logger.error(messageBinder().invalidCacheType);
    throw new ElementInvalidException(messageBinder().invalidCacheType);
}

const customNotificationService = (type) => {
    if (type === 'sns') {
        return new SNSNotification();
    } else if (type === 'redis') {
        return new RedisNotification();
    } else {
        logger.error(messageBinder().invalidCacheType);
        throw new ElementInvalidException(messageBinder().invalidCacheType);
    }
}

module.exports = {  notifiaciontService, customNotificationService };