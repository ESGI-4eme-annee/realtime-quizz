module.exports = function (connection) {
  const { DataTypes, Model } = require("sequelize");

  class User extends Model {}

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      role:{
        type: DataTypes.STRING,
        defaultValue: "user",
        allowNull: false,
      }
    },
    {
      tableName: "users",
      sequelize: connection,
      timestamps: false,
    }
  );


  return User;
};