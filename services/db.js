const mariadb = require('mariadb')
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