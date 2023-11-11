const { 
    AWS_REGION, 
    AWS_ACCESS_KEY_ID, 
    AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN,
    DB_DYNAMO_HOST,
    DB_DYNAMO_TABLE,
} = require('../../config');
const {
    logger
} = require('../../common/logger');
const {
    ListTablesCommand,
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

const IDBService = require('../IDBService');

class DynamoDBService extends IDBService {
    client = null;
    docClient = null;
    tableName = null;

    constructor() {
        super();
        this.client = new DynamoDBClient({
            region: AWS_REGION,
            endpoint: DB_DYNAMO_HOST,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
                sessionToken: AWS_SESSION_TOKEN,
            },
        });
        this.docClient = DynamoDBDocumentClient.from(this.client);
        this.tableName = DB_DYNAMO_TABLE;
    }

    customTableConstructor(tableName) {
        this.client = new DynamoDBClient({
            region: AWS_REGION,
            endpoint: DB_DYNAMO_HOST,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
                sessionToken: AWS_SESSION_TOKEN,
            },
        });
        this.docClient = DynamoDBDocumentClient.from(this.client);
        this.tableName = tableName;
    }

    async healthCheck() {
        logger.info('Checking DynamoDB health started');
        try {
            const command = new ListTablesCommand({});
            const response = await this.client.send(command);

            if (!response.TableNames.includes(this.tableName)) {
                logger.error('Table not found');
                return false;
            }

            logger.info('Table found');
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        } finally {
            logger.info('Checking DynamoDB health finished');
        }
    }
}

module.exports = DynamoDBService;