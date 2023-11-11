const { cacheService } = require('../common/cache');

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

const startHealthRouter = async (app, dbSer) => {

    let dbService = dbSer;

    app.get('/health', async (_, res) => {
        let status_ok = true;
    
        let cacheStatus = await cacheService.health();
        let dbStatus = await dbService.healthCheck();
    
        if ((cacheStatus.keys !== 0 && cacheStatus !== 'PONG') || !dbStatus) {
            status_ok = false;
            return res.status(500).json({
                status: 'FAIL',
                cache: cacheStatus,
                db: dbStatus,
            });
        }
    
        res.status(200).json({
            status: 'OK',
            cache: cacheStatus,
            db: dbStatus,
        });
    });
}


module.exports = startHealthRouter;