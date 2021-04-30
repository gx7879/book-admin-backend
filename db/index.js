const mysql = require('mysql')
const { host, user, password, database } = require('./config')
const { debug } = require('../utils/constant')

function connect() {
    return mysql.createConnection({
        host,
        user,
        password,
        database,
        multipleStatements: true
    })
}

function querySql(sql) {
    const conn = connect()
    return new Promise((resolve, reject) => {
        try {
            debug && console.log(sql)
            conn.query(sql, (err, results) => {
                if (err) {
                    debug && console.log('查詢失敗，原因:' + JSON.stringify(err))
                    reject(err)
                } else {
                    debug && console.log('查詢成功', JSON.stringify(results))
                    resolve(results)
                }
            })
        } catch (error) {
            reject(error)
        } finally {
            conn.end()
        }
    })
}

function queryOne(sql) {
    return new Promise((resolve, reject) => {
        querySql(sql).then((result) => {
            if(result && result.length > 0) {
                resolve(result[0])
            } else {
                resolve(null)
            }
        }).catch((err) => {
            reject(err)
        })
    })
}

module.exports = {
    querySql,
    queryOne
}