const { rejects } = require('assert')
const mysql = require('mysql')
const { resolve } = require('path')

require('dotenv').config();


const pool = mysql.createPool( 
{   
    connectionLimit: 10,
    host:"localhost",
    user :"root",
    password:"1234",
    port:3306,
    database:"Sample",
    createDatabaseTable: false
})

let db = {}

db.getUser = () => {
    return new Promise(
        (resolve, reject) =>
        {
            pool.query('SELECT * FROM User',(error, user) =>
            {
                if(error)
                {
                    return reject(error)
                }
                return resolve(user)
            });
        }
    );
}
db.insertUser = (username, hash, salt) => 
{
    return new Promise((resolve, reject) =>
    {
        pool.query("INSERT INTO User (username, hash, salt) VALUES (?, ?, ?)", [username, hash, salt], (error, result)=>
        {
            if(error)
            {
                return reject(error)
            }
            return resolve(result)
        })
    })
}

module.exports = db;