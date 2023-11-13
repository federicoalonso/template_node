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
const { ElementNotFoundException } = require('../../common/exceptions/exceptions');
const {
    ListTablesCommand,
    DynamoDBClient
} = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    paginateScan,
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ExecuteStatementCommand,
    CreateTableCommand,
    ListTablesCommand,
} = require("@aws-sdk/lib-dynamodb");

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

    async tableExists(tableName) {
        logger.info('[DynamoDB] [tableExists] Checking if table exists');
        try {
            const command = new ListTablesCommand({});
            const response = await this.client.send(command);
            if (!response.TableNames.includes(tableName)) {
                logger.error('[DynamoDB] [tableExists] Table not found');
                return false;
            }
            logger.info('[DynamoDB] [tableExists] Table found');
            return true;
        } catch (err) {
            logger.error('[DynamoDB] [tableExists]' + err);
            return false;
        } finally {
            logger.info('[DynamoDB] [tableExists] Checking if table exists finished');
        }
    }

    async createTable(tableName, keySchema, attributeDefinitions, provisionedThroughput) {
        if (await this.tableExists(tableName)) {
            logger.info('[DynamoDB] [createTable] Table already exists');
            return;
        }

        logger.info('[DynamoDB] [createTable] Creating table');
        try {
            const params = {
                TableName: tableName,
                KeySchema: keySchema,
                AttributeDefinitions: attributeDefinitions,
                ProvisionedThroughput: provisionedThroughput,
            };
            const command = new CreateTableCommand(params);
            await this.client.send(command);
            logger.info('[DynamoDB] [createTable] Table created');
        } catch (err) {
            logger.error('[DynamoDB] [createTable]' + err);
        } finally {
            logger.info('[DynamoDB] [createTable] Creating table finished');
        }
    }


    async healthCheck() {
        logger.info('[DynamoDB] Checking DynamoDB health');
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
            logger.info('[DynamoDB] Checking DynamoDB health finished');
        }
    }

    async getAll() {
        logger.info('[DynamoDB] [getAll] Getting all todos');

        try {
            const paginatedScan = paginateScan({
                client: this.docClient
            }, {
                TableName: this.tableName,
                ConsistentRead: true,
            });
            const todos = [];
            for await (const page of paginatedScan) {
                todos.push(...page.Items);
            }
            return todos;
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[DynamoDB] [getAll] Getting all todos finished');
        }
    }

    async save(item) {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: item,
        });
        await this.docClient.send(command);
        return item;
    }

    async getAllPaginated(pageSize, lastKey) {
        logger.info('[DynamoDB] [getAllPaginated] Getting all todos');
        try {
            const params = {
                TableName: this.tableName,
                Limit: pageSize,
            };

            if (lastKey) {
                params.ExclusiveStartKey = {
                    id: lastKey
                };
            }

            // En lugar de utilizar paginateScan, utiliza la función scan directamente
            const scanOutput = await this.client.send(new ScanCommand(params));
            const response = {
                todos: scanOutput.Items,
                lastKey: scanOutput.LastEvaluatedKey,
                count: scanOutput.Count,
                scannedCount: scanOutput.ScannedCount,
            };
            return response;
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[DynamoDB] [getAllPaginated] Getting all todos finished');
        }
    }

    async getById(id) {
        logger.info('[DynamoDB] [getById] Getting todo by id');
        try {
            const getCommand = new GetCommand({
                TableName: this.tableName,
                Key: {
                    id: id,
                },
                ConsistentRead: true,
            });
            const getResponse = await this.docClient.send(getCommand);
            if (!getResponse.Item) {
                throw new ElementNotFoundException(`Todo with id ${id} not found`);
            }
            return getResponse.Item;
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[DynamoDB] [getById] Getting todo by id finished');
        }
    }

    async update(id, item) {
        logger.info('[DynamoDB] [update] Updating todo');
        try {
            await this.getById(id);

            const updateCommand = new UpdateCommand({
                TableName: this.tableName,
                Key: {
                    id: id,
                },
                UpdateExpression: "set title = :t, description = :d",
                ExpressionAttributeValues: {
                    ":t": item.title,
                    ":d": item.description,
                },
                ReturnValues: "ALL_NEW",
                ConsistentRead: true,
            });
            const updateResponse = await this.docClient.send(updateCommand);
            return updateResponse.Item;
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[DynamoDB] [update] Updating todo finished');
        }
    }

    async delete(id) {
        logger.info('[DynamoDB] [delete] Deleting todo');
        try {
            const deleteCommand = new DeleteCommand({
                TableName: this.tableName,
                Key: {
                    id: id,
                },
            });
            const deleteResponse = await this.docClient.send(deleteCommand);
            return deleteResponse.Attributes;
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[DynamoDB] [delete] Deleting todo finished');
        }
    }

    async customQuery(parameterList, valueList) {
        logger.info('[DynamoDB] [customQuery] Executing custom query');
        
        const query = `SELECT * FROM ${this.tableName} WHERE ${parameterList.join('=? AND ')}=?`;

        try {
            const command = new ExecuteStatementCommand({
                Statement: query,
                Parameters: valueList
            });

            const response = await this.client.send(command);
            return response.Items;
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[DynamoDB] [customQuery] Custom query execution finished');
        }
    }
}

module.exports = DynamoDBService;