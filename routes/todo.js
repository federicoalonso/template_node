const {
    logger
} = require('../common/logger');
const {
    verifyToken,
    generateToken
} = require('../utils/jwt');
const {
    evalException,
    ConflictWithElements,
    ElementAlreadyExist,
    ElementInvalidException,
    ElementNotFoundException,
    ErrorMessages,
    HttpErrorCodes,
    InvalidCredentials,
    MissingToken
} = require('../common/exceptions/exceptions');
const {
    v4: uuidv4
} = require('uuid');
const { NOTIFICATION_CHANNEL } = require('../config');

/**
 * @openapi
 * /todo:
 *  get:
 *      summary: Get all todos
 *      description: Get all todos
 *      responses:
 *          200:
 *              description: OK
 *  post:
 *      summary: Create a new todo
 *      description: Create a new todo
 *      requestBody:
 *          description: Todo object
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          description:
 *                              type: string
 *                      required:
 *                          - title
 *                          - description
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Internal Server Error
 */

const startTodoRouter = async (app, dbSer, cacheSer, notificationSrv) => {

    const dbService = dbSer;
    const cacheService = cacheSer;
    const notifiaciontService = notificationSrv;

    app.get('/todo', async (req, res) => {
        logger.info('[TodoRouter] [get] Getting all todos method invoked');
        try {
            const cachedTodos = await cacheService.get('todos');
            if (cachedTodos) {
                logger.info('Todos retrieved from cache');
                return res.status(200).json(cachedTodos);
            }
            const todos = await dbService.getAll();
            if (todos.length > 0)
                await cacheService.set('todos', todos);
            res.status(200).json(todos);
        } catch (error) {
            logger.error(error);
            return evalException(error, res);
        } finally {
            logger.info('[TodoRouter] [get] Getting all todos method finished');
        }
    });

    app.post('/todo', async (req, res) => {
        logger.info('[TodoRouter] [post] Create a new todo method invoked');
        try {
            const {
                title,
                description,
            } = req.body;
            if (!title || !description) {
                return evalException(new ElementInvalidException('Title and description are required'), res);
            }
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return evalException(new MissingToken('Missing token'), res);
            }
            const payload = await verifyToken(token);
            if (!payload) {
                return evalException(new MissingToken('Invalid token'), res);
            }
            const role = payload.role;
            if (role !== 'admin') {
                return evalException(new InvalidCredentials('Invalid credentials'), res);
            }
            const uid = uuidv4();
            const todoItem = {
                'id': uid,
                title,
                description,
            };
            await dbService.save(todoItem);
            await cacheService.del('todos');
            await notifiaciontService.publish(todoItem, NOTIFICATION_CHANNEL);
            res.status(201).json(todoItem);
        } catch (error) {
            logger.error(error);
            return evalException(error, res)
        } finally {
            logger.info('[TodoRouter] [post] Create a new todo method finished');
        }
    });

    app.get('/todo/paginated', async (req, res) => {
        logger.info('[TodoRouter] [getAllPaginated] Getting all todos paginated method invoked');
        try {
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
            const lastKey = req.query.lastKey ? req.query.lastKey : undefined;
            const todos = await dbService.getAllPaginated(pageSize, lastKey);
            res.status(200).json(todos);
        } catch (error) {
            logger.error(error);
            return evalException(error, res);
        } finally {
            logger.info('[TodoRouter] [getAllPaginated] Getting all todos paginated method finished');
        }
    });

    app.get('/todo/:id', async (req, res) => {
        logger.info('[TodoRouter] [getById] Getting todo by id method invoked');
        try {
            const {
                id
            } = req.params;
            const todo = await dbService.getById(id);
            res.status(200).json(todo);
        } catch (error) {
            logger.error(error);
            return evalException(error, res);
        } finally {
            logger.info('[TodoRouter] [getById] Getting todo by id method finished');
        }
    });

    app.put('/todo/:id', async (req, res) => {
        logger.info('[TodoRouter] [update] Updating todo method invoked');
        try {
            const {
                id
            } = req.params;
            const {
                title,
                description,
            } = req.body;
            if (!title || !description) {
                return evalException(new ElementInvalidException('Title and description are required'), res);
            }
            const todoItem = {
                id,
                title,
                description,
            };
            await dbService.update(id, todoItem);
            await cacheService.del('todos');
            res.status(200).json(todoItem);
        } catch (error) {
            logger.error(error);
            return evalException(error, res);
        } finally {
            logger.info('[TodoRouter] [update] Updating todo method finished');
        }
    });

    app.delete('/todo/:id', async (req, res) => {
        logger.info('[TodoRouter] [delete] Deleting todo method invoked');
        try {
            const {
                id
            } = req.params;
            await dbService.delete(id);
            await cacheService.del('todos');
            res.status(204).send();
        } catch (error) {
            logger.error(error);
            return evalException(error, res);
        } finally {
            logger.info('[TodoRouter] [delete] Deleting todo method finished');
        }
    });

    app.get('/customQuery', async (req, res) => {
        logger.info('[TodoRouter] [customQuery] Custom query method invoked');
        try {
            const {
                title
            } = req.query;
            const todos = await dbService.customQuery(['title'],[title]);
            res.status(200).json(todos);
        } catch (error) {
            logger.error(error);
            return evalException(error, res);
        } finally {
            logger.info('[TodoRouter] [customQuery] Custom query method finished');
        }
    });
}

module.exports = startTodoRouter;