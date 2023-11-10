require('dotenv').config();
const express = require('express');
const { PORT } = require('./config');
const { loggerMiddleware } = require('./middleware/loggerMiddleware');
const { logger } = require('./common/logger');

const app = express();

app.use(loggerMiddleware);

app.get('/health', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    logger.info(`App listening at http://localhost:${PORT}`);
});
