const healthRouter = require('express').Router();

healthRouter.get('/health', (req, res) => {
    res.send('Hello World!');
});

module.exports = healthRouter;