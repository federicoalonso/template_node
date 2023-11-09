module.exports = function (sequelize, DataTypes) {
    const PriceDetail = sequelize.define(
        "PriceDetail",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            tableName: "PriceDetails",
            timestamps: true,
        }
    );

    return PriceDetail;
};
