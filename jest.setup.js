const sqlite3 = require('sqlite3').verbose()
const { logger } = require('./common/logger')

function createDatabase() {
  new sqlite3.Database('./my-test-database.db', (err) => {
    if (err) {
      logger.error(err.message)
    } else {
      logger.info('Connected to the test SQlite database.')
    }
  })
}

createDatabase()
