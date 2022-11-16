// const mysql = require('mysql2/promise');
const mariadb = require('mariadb')
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mariadb',
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// })

// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
// }).catch(err => {
//     console.error('Unable to connect to the database:', err);
// });
const config = require('../config');
const pool = mariadb.createPool(config.db);

module.exports = {
    getConnection() {
        return new Promise(function (res, rej) {
            pool.getConnection()
                .then(function (conn) {
                    res(conn);
                })
                .catch(function (error) {
                    rej(error);
                });
        });
    }
};

// async function query(sql, params) {
//     const [rows, fields] = await pool.execute(sql, params);
//     return rows;
// }

// module.exports = {
//   query
// }