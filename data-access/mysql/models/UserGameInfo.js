module.exports = function (sequelize, DataTypes) {
  const UserGameInfo = sequelize.define(
    "UserGameInfo",
    {
      code: {
        type: DataTypes.STRING(8),
        primaryKey: true,
      },
      money: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "UserGameInfo",
      timestamps: true,
    }
  );

  return UserGameInfo;
};
