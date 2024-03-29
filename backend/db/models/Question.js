module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");
  
    class Question extends Model {}
  
    Question.init(
      {
        name:{
          type: DataTypes.STRING,
          allowNull: false,
        },
        time:{
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: "questions",
        sequelize: connection,
        timestamps: false,
      }
    );
  
  
    return Question;
  };