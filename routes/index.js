const express = require('express');
const cors = require('cors')
const http = require('http')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const {
    PORT, CORS_CONFIGURATION, SERVICE_NAME, SERVICE_DESCRIPTION, ENVIRONMENT
} = require('../config');
const loggerMiddleware = require('../middleware/loggerMiddleware');
const undefinedRouteMiddleware = require('../middleware/undefinedRouteMiddleware');
const {
    logger
} = require('../common/logger');

const app = express();
const server = http.createServer(app);

const startHealthRouter = require('./health');
const startTodoRouter = require('./todo');

const initializeRoutes = async (dbService, cacheService, notifiaciontService) => {
    app.use(express.static('public'))
    app.use(loggerMiddleware);
    app.use(express.json())

    
    const corsOptions = CORS_CONFIGURATION[ENVIRONMENT].corsOptions
    app.use(cors(corsOptions))
    
    // Swagger
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: SERVICE_NAME,
                version: '1.0.0',
                description: SERVICE_DESCRIPTION,
            },
        },
        apis: ['./routes/*.js'],
    };
    
    const swaggerSpec = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    await startHealthRouter(app, dbService, cacheService, notifiaciontService);
    await startTodoRouter(app, dbService, cacheService);
    app.use(undefinedRouteMiddleware);
    
    const serverInstance = server.listen(PORT, () => logger.info(`Server listening on port ${PORT}!`));
    
    return { app: app, server: serverInstance }
}

module.exports = initializeRoutes;