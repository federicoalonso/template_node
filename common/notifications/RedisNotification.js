const Redis = require('ioredis');
const { logger } = require('../logger');
const { messageBinder } = require('../../utils/locale/locale-binder');
const { ElementInvalidException } = require('../exceptions/exceptions');
const { REDIS_HOST, REDIS_PORT } = require('../../config');
const INotification = require('./INotification');

class RedisNotification extends INotification {
    redis = null;

    constructor() {
        super();
        this.redis = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
        });
    }

    async healthCheck() {
        logger.info('[RedisNotification] [healthCheck] Checking Redis connection');
        try {
            const ret = await this.redis.ping();
            logger.info('[RedisNotification] [healthCheck] Redis connection is OK');
            return ret;
        } catch (error) {
            logger.error('[RedisNotification] [healthCheck] Redis connection is NOT OK');
            throw error;
        } finally {
            logger.info('[RedisNotification] [healthCheck] Finished checking Redis connection');
        }
    }

    async publish(message, channel = 'default') {
        logger.info('[RedisNotification] [publisj] Publishing message to Redis channel:' + channel);
        try {
            await this.redis.publish(channel, JSON.stringify(message));
            logger.info('[RedisNotification] [publish] Message published to Redis channel:' + channel);
        } catch (error) {
            logger.error('[RedisNotification] [publish] Error publishing message to Redis channel:' + channel);
            throw error;
        } finally {
            logger.info('[RedisNotification] [publish] Finished publishing message to Redis channel:' + channel);
        }
    }

    subscribe(callback, channel = 'default') {
        logger.info('[RedisNotification] [subscribe] Subscribing to Redis channel:' + channel);
        this.redis.subscribe(channel, (err) => {
            if (err) {
                logger.error('[RedisNotification] [subscribe] Error subscribing to Redis channel:' + channel);
                throw err;
            }

            logger.info('[RedisNotification] [subscribe] Subscribed to Redis channel:' + channel);

            this.redis.on('message', (channel, message) => {
                logger.info('[RedisNotification] [subscribe] Message received from Redis channel:' + channel);
                callback(JSON.parse(message));
            });
        });
        logger.info('[RedisNotification] [subscribe] Finished subscribing to Redis channel:' + channel);
    }

    unsubscribe() {
        logger.info('[RedisNotification] [unsubscribe] Unsubscribing from Redis channel:' + channel);
        this.redis.unsubscribe(channel);
        logger.info('[RedisNotification] [unsubscribe] Unsubscribed from Redis channel:' + channel);
        logger.info('[RedisNotification] [unsubscribe] Finished unsubscribing from Redis channel:' + channel);
    }

    async close() {
        logger.info('[RedisNotification] [close] Closing Redis connection');
        await this.redis.quit();
        logger.info('[RedisNotification] [close] Redis connection closed');
    }
}

module.exports = RedisNotification;