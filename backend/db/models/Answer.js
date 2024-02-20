module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");
  
    class Answer extends Model {}
  
    Answer.init(
      {
        name:{
          type: DataTypes.STRING,
          allowNull: false,
        },
        valid:{
          type: DataTypes.BOOLEAN,
          allowNull: false,}
      },
      {
        tableName: "answers",
        sequelize: connection,
        timestamps: false,
      }
    );
  
  
    return Answer;
  };