const PostModelBuilder = require("../models/posts");
const { sequelize } = require("../models");

module.exports = PostModelBuilder(sequelize);
