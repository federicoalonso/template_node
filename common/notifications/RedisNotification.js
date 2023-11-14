const Redis = require('ioredis');
const { logger } = require('../logger');
const { messageBinder } = require('../../utils/locale/locale-binder');
const { ElementInvalidException } = require('../exceptions/exceptions');
const { REDIS_HOST, REDIS_PORT,NOTIFICATION_CHANNEL } = require('../../config');
const INotification = require('./INotification');

class RedisNotification extends INotification {
    publisher = null;
    subscriber = null;

    constructor() {
        super();
        this.publisher = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
        });
        this.subscriber = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
        });
    }

    async healthCheck() {
        logger.info('[RedisNotification] [healthCheck] Checking Redis connection');
        try {
            const ret = await this.subscriber.ping();
            logger.info('[RedisNotification] [healthCheck] Redis connection is OK');
            if (ret[0].toUpperCase() === 'PONG') return true;
            return false;
        } catch (error) {
            logger.error('[RedisNotification] [healthCheck] Redis connection is NOT OK');
            throw error;
        } finally {
            logger.info('[RedisNotification] [healthCheck] Finished checking Redis connection');
        }
    }

    async publish(message, channel = NOTIFICATION_CHANNEL) {
        logger.info('[RedisNotification] [publisj] Publishing message to Redis channel:' + channel);
        try {
            await this.publisher.publish(channel, JSON.stringify(message));
            logger.info('[RedisNotification] [publish] Message published to Redis channel:' + channel);
        } catch (error) {
            logger.error('[RedisNotification] [publish] Error publishing message to Redis channel, error:' + error);
            throw error;
        } finally {
            logger.info('[RedisNotification] [publish] Finished publishing message to Redis channel:' + channel);
        }
    }

    subscribe(callback, channel = NOTIFICATION_CHANNEL) {
        logger.info('[RedisNotification] [subscribe] Subscribing to Redis channel:' + channel);
        this.subscriber.subscribe(channel, (err) => {
            if (err) {
                logger.error('[RedisNotification] [subscribe] Error subscribing to Redis channel:' + channel);
                throw err;
            }

            logger.info('[RedisNotification] [subscribe] Subscribed to Redis channel:' + channel);

            this.subscriber.on('message', (channel, message) => {
                logger.info('[RedisNotification] [subscribe] Message received from Redis channel:' + channel);
                callback(JSON.parse(message));
            });
        });
        logger.info('[RedisNotification] [subscribe] Finished subscribing to Redis channel:' + channel);
    }

    unsubscribe(channel = NOTIFICATION_CHANNEL) {
        logger.info('[RedisNotification] [unsubscribe] Unsubscribing from Redis channel:' + channel);
        this.subscriber.unsubscribe(channel);
        logger.info('[RedisNotification] [unsubscribe] Unsubscribed from Redis channel:' + channel);
        logger.info('[RedisNotification] [unsubscribe] Finished unsubscribing from Redis channel:' + channel);
    }

    async close() {
        logger.info('[RedisNotification] [close] Closing Redis connection');
        await this.publisher.quit();
        await this.subscriber.quit();
        logger.info('[RedisNotification] [close] Redis connection closed');
    }
}

module.exports = RedisNotification;