var dbModels;
const { QueryTypes } = require("sequelize");

const setDbModels = function (models) {
  dbModels = models;
};

const check = async function () {
  const sql = `
  SELECT
    NOW() AS time,
    'MySQL' AS motor,
    DATABASE() AS databaseName,
    (
      SELECT SUM(data_length + index_length)
      FROM information_schema.TABLES
      WHERE table_schema = DATABASE()
    ) AS size,
    'Connected' AS status;
`;
  let results = await dbModels.sequelize.query(sql, {
    replacements: {},
    type: QueryTypes.SELECT,
  });

  const mbSize = results[0].size / 1024 / 1024;

  const structuredInfo = {
    database: {
      time: new Date(results[0].time).toISOString(),
      motor: results[0].motor,
      dbName: results[0].databaseName,
      size: mbSize.toFixed(2) + " MB",
      status: results[0].status,
    },
  };

  return structuredInfo;
};

module.exports = {
  check,
  setDbModels,
};
