const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class reacts extends Model {
    static associate(models) {
      models.reacts.belongsTo(models.posts, {
        foreignKey: 'postId',
      });
    }
  }
  reacts.init(
    {
      type: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'reacts',
    }
  );
  return reacts;
};
