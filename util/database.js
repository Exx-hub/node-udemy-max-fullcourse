const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "lokalsoul", {
  host: "localhost",
  dialect: "mysql",
});

// test connection
const tryConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

tryConnection();

module.exports = sequelize;
