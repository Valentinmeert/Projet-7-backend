const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class users extends Model {
    static associate(models) {
      models.users.hasMany(models.posts, {
        foreignKey: "userId",
      });
    }
  }
  users.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
