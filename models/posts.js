const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class posts extends Model {
    static associate(models) {
      models.posts.belongsTo(models.users, {
        foreignKey: "userId",
      });
    }
  }
  posts.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "posts",
    }
  );
  return posts;
};
