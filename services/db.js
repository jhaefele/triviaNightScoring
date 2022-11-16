const mariadb = require('mariadb')
const config = require('../config');
const pool = mariadb.createPool(config.db);

async function getConnection() {
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

async function queryDatabase(sqlString, params) {
    const conn = await pool.getConnection()
    let dbQueryResult = await conn.query(sqlString, params)
    conn.end()
    return dbQueryResult
}

module.exports = {
    getConnection,
    queryDatabase,
};