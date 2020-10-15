const UserModelBuilder = require('../models/users');
const { sequelize } = require('../models');

module.exports = UserModelBuilder(sequelize);
