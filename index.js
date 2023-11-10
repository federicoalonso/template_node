require('dotenv').config();
const express = require('express');
const { PORT } = require('./config');
const { loggerMiddleware } = require('./middleware/loggerMiddleware');
const { logger } = require('./common/logger');

const app = express();

// Routes
const healthRouter = require('./routes/health');
app.use(healthRouter);
// End Routes

app.use(loggerMiddleware);

app.listen(PORT, () => {
    logger.info(`App listening at http://localhost:${PORT}`);
});
