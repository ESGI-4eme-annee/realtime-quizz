module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");
  
    class Quizz extends Model {}
  
    Quizz.init(
      {
        name:{
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "quizzs",
        sequelize: connection,
        timestamps: false,
      }
    );
  
  
    return Quizz;
  };