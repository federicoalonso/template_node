const todoRouter = require('express').Router();
const cacheService = require('../common/cache');
const {
    logger
} = require('../common/logger');
const {
    evalException,
} = require('../common/exceptions/exceptions');
const {
    DynamoDBClient
} = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    paginateScan,
    PutCommand
} = require("@aws-sdk/lib-dynamodb");
const {
    v4: uuidv4
} = require('uuid');


const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
});
const docClient = DynamoDBDocumentClient.from(client)
const tableName = process.env.DYNAMODB_TABLE || 'todos';
/**
 * @openapi
 * /todo:
 *  get:
 *      summary: Get all todos
 *      description: Get all todos
 *      responses:
 *          200:
 *              description: OK
 */
todoRouter.get('/todo', async (req, res) => {
    logger.info('Getting all todos method invoked');
  
    try {
      let response = await cacheService.get('todos');
  
      if (response) {
        logger.info('Todos retrieved from cache');
        return res.status(200).json(response);
      }
  
      // Scan the table for all items
      const paginatedScan = paginateScan(
        { client: docClient },
        {
          TableName: tableName,
          ConsistentRead: true,
        }
      );
  
      const todos = [];
      for await (const page of paginatedScan) {
        console.log(page.Items);
        todos.push(...page.Items);
      }
  
      // Guarda los todos en caché para futuras solicitudes
      await cacheService.set('todos', todos);
  
      res.status(200).json(todos);
    } catch (error) {
      logger.error(error);
      return evalException(error, res);
    }
  });

/**
 * @openapi
 * /todo:
 *  post:
 *     summary: Create a new todo
 *    description: Create a new todo
 *   requestBody:
 *     required: true
 *    content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         title:
 *         type: string
 *        description:
 *        type: string
 *       required:
 *       - title
 *      - description
 * responses:
 * 201:
 * description: Created
 * 400:
 * description: Bad Request
 * 500:
 * description: Internal Server Error
 */
todoRouter.post('/todo', async (req, res) => {
    logger.info('Creating a new todo method invoked');

    try {
        const {
            title,
            description,
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: 'Title and description are required',
            });
        }

        const uid = uuidv4();

        const todoItem = {
            'id': uid,
            title,
            description,
        };

        const command = new PutCommand({
            TableName: tableName,
            Item: todoItem,
        });

        await docClient.send(command);
        await cacheService.del('todos');

        res.status(201).json(todoItem);
    } catch (error) {
        logger.error(error);
        return evalException(error, res)
    }
});

module.exports = todoRouter;