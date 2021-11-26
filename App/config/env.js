const env = {
    database: 'education_db',
    username: 'root',
    password: "root",
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    JWT_ENCRYPTION: "sithija-secret-key"
};
  
module.exports = env;