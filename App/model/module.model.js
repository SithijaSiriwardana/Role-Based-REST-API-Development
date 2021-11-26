module.exports = (sequelize, Sequelize) => {
    const Modules = sequelize.define("modules", {
      module_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      module_name: {
        type: Sequelize.STRING,
        allowNull:false
      }
    },{ timestamps: false });

    return Modules;
  };