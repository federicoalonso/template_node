module.exports = function (sequelize, DataTypes) {
    const Stock = sequelize.define(
      'Stock',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        code: {
          type: DataTypes.STRING(6),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        GameId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        availableAmount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: 'Stocks',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'code_game_UNIQUE',
            unique: true,
            fields: [{ name: 'code' }, { name: 'GameId' }],
          },
        ],
      }
    )

    return Stock;
};
