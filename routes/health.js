const healthRouter = require('express').Router();
const cacheService = require('../common/cache');

/**
 * @openapi
 * /health:
 *  get:
 *      summary: Health check
 *      description: Check the health of the API and its dependencies
 *      responses:
 *          200:
 *              description: OK
 *          500:
 *              description: FAIL
 */
healthRouter.get('/health', async (req, res) => {
    let status_ok = true;
    let cacheStatus = await cacheService.health();
    if (cacheStatus.keys !== 0 && cacheStatus !== 'PONG') {
        status_ok = false;
    }
    res.status(status_ok ? 200 : 500).json({
        status: status_ok ? 'OK' : 'FAIL',
        cache: cacheStatus,
    });
});

module.exports = healthRouter;