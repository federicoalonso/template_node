module.exports = function (sequelize, DataTypes) {
  const Transaction = sequelize.define(
      "Transaction",
      {
          id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
          },
          amount: {
              type: DataTypes.INTEGER,
              allowNull: false,
          },
          unitPrice: {
              type: DataTypes.INTEGER,
              allowNull: false,
          },
      },
      {
          tableName: "Transactions",
          timestamps: true,
      }
  );

  return Transaction;
};
