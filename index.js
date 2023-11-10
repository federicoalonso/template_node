require('dotenv').config();
const express = require('express');
const { PORT } = require('./config');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const undefinedRouteMiddleware = require('./middleware/undefinedRouteMiddleware');
const { logger } = require('./common/logger');

const app = express();
app.use(loggerMiddleware);

// Routes
const healthRouter = require('./routes/health');
app.use(healthRouter);
// End Routes

app.use(express.json())
app.use(undefinedRouteMiddleware);

app.listen(PORT, () => {
    logger.info(`App listening at http://localhost:${PORT}`);
});
