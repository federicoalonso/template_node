module.exports = {
    PORT: process.env.PORT || 80,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ENVIRONMENT: process.env.ENVIRONMENT || 'development',
    LOCALE: process.env.LOCALE || 'ES',
    CACHE_DEFAULT_TYPE: process.env.CACHE_DEFAULT_TYPE || 'memory',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
}