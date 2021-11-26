module.exports = (sequelize, Sequelize) => {
    const Classes = sequelize.define("classes", {
      class_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      class_name: {
        type: Sequelize.STRING,
        allowNull:false
      }
    },{ timestamps: false });

    return Classes;
  };