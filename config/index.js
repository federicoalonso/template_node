const conf = require('./config.json');
const api_description = require('./api-description.json');

module.exports = {
    CORS_CONFIGURATION: conf.cors,
    SERVICE_DESCRIPTION: conf.serviceDescription,
    SERVICE_NAME: process.env.SERVICE_NAME || 'template-service',
    PORT: process.env.PORT || 80,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ENVIRONMENT: process.env.ENVIRONMENT || 'development',
    LOCALE: process.env.LOCALE || 'ES',
    CACHE_DEFAULT_TYPE: process.env.CACHE_DEFAULT_TYPE || 'memory',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    DB_DEFAULT_TYPE: process.env.DB_DEFAULT_TYPE || 'sqlite',
    DB_SQLITE_FILE: process.env.DB_SQLITE_FILE || './db/sqlite/template-service.sqlite',
    DB_SQLITE_TABLE: process.env.DB_SQLITE_TABLE || 'template-service',
    DB_MYSQL_HOST: process.env.DB_MYSQL_HOST || 'localhost',
    DB_MYSQL_PORT: process.env.DB_MYSQL_PORT || 3306,
    DB_MYSQL_PASSWORD: process.env.DB_MYSQL_PASSWORD || 'root',
    DB_MYSQL_USER: process.env.DB_MYSQL_USER || 'root',
    DB_DYNAMO_HOST: process.env.DB_DYNAMO_HOST,
    DB_DYNAMO_TABLE: process.env.DB_DYNAMO_TABLE,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN,
    SERVICE_BASE_URL: process.env.SERVICE_BASE_URL + ":" + process.env.PORT || 'http://localhost:3000',
    REGISTER_SERVICE_DESCRIPTION: api_description,
    NOTIFICATION_DEFAULT_TYPE: process.env.NOTIFICATION_DEFAULT_TYPE || 'memory',
    NOTIFICATION_SNS_TOPIC_ARN: process.env.NOTIFICATION_SNS_TOPIC_ARN,
    NOTIFICATION_CHANNEL: process.env.NOTIFICATION_CHANNEL || 'todos',
    HTTP_DEFAULT_TYPE: process.env.HTTP_DEFAULT_TYPE || 'axios',
}