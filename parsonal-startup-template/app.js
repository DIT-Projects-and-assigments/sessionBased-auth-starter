const express = require('express');
const mysql = require('mysql')
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const db = require('./config/database');

// Package documentation - https://www.npmjs.com/package/ecpress-mysql-session
const mysqlStore = require('express-mysql-session')(session);




/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();



//creating the session store for the user session
const dbConnection =
{
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "1234",
    port: 3306,
    database: "Sample",
    createDatabaseTable: true
}

const pool = mysql.createPool(dbConnection);

const sessionStore = new mysqlStore(dbConnection, pool)
// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

// TODO
app.use(session(
    {
        name: "sampleSession",
        resave: "false",
        saveUninitialized: "true",
        store: sessionStore,
        secret: "some secret",
        cookie: {
            maxAge: 1000 * 60 * 60, //I hr
            sameSite: true,
            secure: false,
            httpOnly: false
        }
    }
))


/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */


// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');


app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3001, console.log("app listening at localhost:3001"));