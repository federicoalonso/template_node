require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const {
    PORT
} = require('./config');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const undefinedRouteMiddleware = require('./middleware/undefinedRouteMiddleware');
const {
    logger
} = require('./common/logger');

const app = express();
app.use(loggerMiddleware);

// Routes
const healthRouter = require('./routes/health');
app.use(healthRouter);
// End Routes

app.use(express.json())

// Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Template NodeJS API',
            version: '1.0.0',
            description: 'Description of the API',
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(undefinedRouteMiddleware);

app.listen(PORT, () => {
    logger.info(`App listening at http://localhost:${PORT}`);
});