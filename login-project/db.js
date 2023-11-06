const { rejects } = require('assert')
const mysql = require('mysql')
const { resolve } = require('path')


const pool = mysql.createPool( 
{   
    connectionLimit: 10,
    host:"localhost",
    user :"root",
    password:"1234",
    port:3306,
    database:"loginProject",
    createDatabaseTable: true
})

let db = {}

db.getUser = (id) => {
return new Promise(
    (resolve, reject) =>
    {
        pool.query('SELECT * FROM user WHERE id = ?', [id], (error, user) =>
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

db.getUserByEmail = (email) =>
{
    return new Promise((resolve, reject) => 
    {
        pool.query("SELECT * FROM user WHERE email = ?", [email], (error, users) =>
        {
            if(error)
            {
                return reject(error)
            }
            return resolve(users[0])
        })
    })
}

db.insertUser = (firstName, lastName, email, password) => 
{
    return new Promise((resolve, reject) =>
    {
        pool.query("INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)", [firstName, lastName, email, password], (error, result)=>
        {
            if(error)
            {
                return reject(error)
            }
            return resolve(result.insertId)
        })
    })
}

module.exports = db;