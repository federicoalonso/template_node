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

const startHealthRouter = async (app, dbSer, cacheSer, notificationSrv) => {

    const dbService = dbSer;
    const cacheService = cacheSer;
    const notifiaciontService = notificationSrv;

    app.get('/health', async (_, res) => {
        let cacheStatus = await cacheService.health();
        let dbStatus = await dbService.healthCheck();
        let notificationStatus = await notifiaciontService.healthCheck();
    
        if ((cacheStatus.keys !== 0 && cacheStatus !== 'PONG') || !dbStatus || notificationStatus !== 'PONG') {
            return res.status(500).json({
                status: 'FAIL',
                cache: cacheStatus,
                db: dbStatus,
                notification: notificationStatus,
            });
        }
    
        res.status(200).json({
            status: 'OK',
            cache: cacheStatus,
            db: dbStatus,
            notification: notificationStatus,
        });
    });
}


module.exports = startHealthRouter;