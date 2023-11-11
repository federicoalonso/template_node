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

    // Check the cache
    let cacheStatus = await cacheService.health();
    if (cacheStatus.keys !== 0 && cacheStatus !== 'PONG') {
        status_ok = false;
        return res.status(500).json({
            status: 'FAIL',
            cache: cacheStatus,
        });
    }

    res.status(200).json({
        status: 'OK',
        cache: cacheStatus,
    });
});

module.exports = healthRouter;