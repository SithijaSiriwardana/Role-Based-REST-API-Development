const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.users = require('../model/user.model.js')(sequelize, Sequelize);
db.classes = require("../model/class.model.js")(sequelize, Sequelize);
db.modules = require("../model/module.model.js")(sequelize, Sequelize);

db.classes.hasMany(db.users, {
  foreignKey: "class_id"
});

db.modules.belongsToMany(db.classes, {
  through: "class_module",
  foreignKey: "module_id"
});

db.classes.belongsToMany(db.modules, {
  through: "class_module",
  foreignKey: "class_id"
});

module.exports = db;