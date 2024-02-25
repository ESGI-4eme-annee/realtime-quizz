module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class History extends Model {}

    History.init(
        {
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quizzId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quizzName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: "history",
            sequelize: connection,
            timestamps: false,
        }
    );

    return History;
};