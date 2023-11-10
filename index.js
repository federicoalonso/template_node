require('dotenv').config();
const express = require('express');
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const {
    PORT, CORS_CONFIGURATION, SERVICE_NAME, SERVICE_DESCRIPTION, ENVIRONMENT
} = require('./config');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const undefinedRouteMiddleware = require('./middleware/undefinedRouteMiddleware');
const {
    logger
} = require('./common/logger');

const app = express();
app.use(loggerMiddleware);
app.use(express.json())

// Routes
const healthRouter = require('./routes/health');
app.use(healthRouter);
const todoRouter = require('./routes/todo');
app.use(todoRouter);
// End Routes

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

app.use(undefinedRouteMiddleware);

app.listen(PORT, () => {
    logger.info(`App listening at http://localhost:${PORT}`);
});