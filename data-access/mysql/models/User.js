module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            salt: {
                type: DataTypes.STRING(12),
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            selectedGameId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "Users",
            timestamps: true,
        }
    );

    return User;
};
