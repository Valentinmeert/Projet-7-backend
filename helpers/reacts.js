const ReactModelBuilder = require("../models/reacts");
const { sequelize } = require("../models");

module.exports = ReactModelBuilder(sequelize);
