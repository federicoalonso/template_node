module.exports = function (sequelize, DataTypes) {
  const UserStockHolding = sequelize.define(
    "UserStockHolding",
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "UserStockHoldings",
      timestamps: true,
    }
  );

  return UserStockHolding;
};
