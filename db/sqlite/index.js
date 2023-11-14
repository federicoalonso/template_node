const { 
    DB_SQLITE_TABLE,
    DB_SQLITE_FILE,
    ENVIRONMENT,
} = require('../../config');
const {
    logger
} = require('../../common/logger');
const {
    v4: uuidv4
} = require('uuid');
const {
    ElementNotFoundException
} = require('../../common/exceptions/exceptions');

const IDBService = require('../IDBService');
const sqlite3 = require('sqlite3').verbose();

class SQLiteDBService extends IDBService {
    tableName = null;
    db = null;

    constructor() {
        super();
        this.customTableConstructor(DB_SQLITE_TABLE);
    }

    async customTableConstructor(tableName) {
        this.tableName = tableName;
        if (ENVIRONMENT === 'test') {
            this.db = new sqlite3.Database(`./test_${DB_SQLITE_FILE}`);
        } else {
            this.db = new sqlite3.Database(DB_SQLITE_FILE);
        }
        this.createTableIfNotExists(this.tableName);
    }

    async createTableIfNotExists(tableName) {
        logger.info('[SQLiteDBService] [createTableIfNotExists] Creating table if not exists');
        try {
            const query = `CREATE TABLE IF NOT EXISTS ${tableName} (id TEXT PRIMARY KEY, title TEXT, description TEXT)`;
            await this.run(query);
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[SQLiteDBService] [createTableIfNotExists] Creating table if not exists finished');
        }
    }

    async healthCheck() {
        logger.info('[SQLiteDBService] [healthcheck] Checking SQLite health started');
        try {
            await this.run('SELECT 1');
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        } finally {
            logger.info('[SQLiteDBService] [healthcheck] Checking SQLite health finished');
        }
    }

    async getAll() {
        logger.info('[SQLiteDBService] [getAll] Getting all todos');
        try {
            const query = `SELECT * FROM ${this.tableName}`;
            const todos = await this.all(query);
            return todos;
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[SQLiteDBService] [getAll] Getting all todos finished');
        }
    }

    async save(item) {
        logger.info('[SQLiteDBService] [save] Saving todo');
        try {
            const id = uuidv4();
            const query = `INSERT INTO ${this.tableName} (id, title, description) VALUES (?, ?, ?)`;
            await this.run(query, [id, item.title, item.description]);
            return { id, ...item };
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[SQLiteDBService] [save] Saving todo finished');
        }
    }

    async getAllPaginated(_, __) {
        // SQLite no tiene soporte nativo para paginación, pero podrías simularlo con LIMIT y OFFSET.
        // Aquí simplemente devolveré todos los elementos sin paginación.
        return this.getAll();
    }

    async getById(id) {
        logger.info('[SQLiteDBService] [getById] Getting todo by id');
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            const todo = await this.get(query, [id]);

            if (!todo) {
                throw new ElementNotFoundException(`Todo with id ${id} not found`);
            }

            return todo;
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[SQLiteDBService] [getById] Getting todo by id finished');
        }
    }

    async update(id, item) {
        logger.info('[SQLiteDBService] [update] Updating todo');
        try {
            const query = `UPDATE ${this.tableName} SET title = ?, description = ? WHERE id = ?`;
            await this.run(query, [item.title, item.description, id]);

            return { id, ...item };
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[SQLiteDBService] [update] Updating todo finished');
        }
    }

    async delete(id) {
        logger.info('[SQLiteDBService] [delete] Deleting todo');
        try {
            const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
            await this.run(query, [id]);
            return { id };
        } catch (error) {
            logger.error(error);
            throw error;
        } finally {
            logger.info('[SQLiteDBService] [delete] Deleting todo finished');
        }
    }

    // Función para ejecutar consultas SQL sin resultados
    run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }

    // Función para ejecutar consultas SQL con resultados
    get(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Función para ejecutar consultas SQL con múltiples resultados
    all(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Función para cerrar la conexión a la base de datos
    close() {
        this.db.close();
    }
}

module.exports = SQLiteDBService;
