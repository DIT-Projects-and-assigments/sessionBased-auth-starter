const exp = require('constants');
const express = require('express')
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session); 
const mysql = require('mysql')
const cors = require('cors')
const db = require('./db')
const {hashSync, genSaltSync, compareSync} = require('bcrypt')
//require("dotenv").config();

/*
//comparison and authentication functions
const salt = genSaltSync(10);
const password = hashSync(password, salt)
const isValidPassword = compareSync(password, obj.password)
*/
const connection = 
{   
    connectionLimit: 10,
    host:"localhost",
    user :"root",
    password:"1234",
    port:3306,
    database:"loginProject",
    createDatabaseTable: true
}


//connection.connect((err) => {if(err) {console.log(err)} else {console.log("connected!")}})
const pool = mysql.createPool(connection);

const sessionStore = new mysqlStore(connection, pool)


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());

app.use( session(
    {
        name: "sampleSession",
        resave: "false",
        saveUninitialized: "false",
        store: sessionStore,
        secret: "some secret",
        cookie: {
            maxAge: 1000 * 60 * 60, //I hr
            sameSite: true,
            secure: false
        }
    }
))

//personal middleware
const redirectLogin = (req, res, next) =>
{
    if(!req.session.userId)
    {
        res.redirect('/login')
    }
    else
    {
        next()
    }
}
  
const redirectHome = (req, res, next) =>
{
    if(req.session.userId)
    {
        res.redirect('/home')
    }
    else
    {
        next()
    }
}

//routes for the application
app.get('/', (req, res)=>
{
    const { userId } = req.session
    console.log(userId);
    res.send(`
    <h1> Welcome!</h1>
    </br>
    ${userId ?`<a href = '/home'> Home </a>
    <form method='post' action='/logout'>
    <button>Logout</button>
    </form>` : `<button style="width:80px"><a href = '/login'> Login </a></button>
    <button style="width:80px" ><a href = '/register'> Register </a></button>
    
    `}
        `)
})

//get another route
app.get('/register', (req,res)=>{
    res.send(`
    <h1>Register</h1>
    <form method='post' action='/Register'>
    <input type='text' name='firstName' placeholder='First Name' required />
    <input type='text' name='lastName' placeholder='Last Name' required />
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='password' required/>
    <input type='submit' />
    </form>
    <button style="width:80px" ><a href='/login'>Login</a></button>
    
    `)
})

//register the user

app.post('/register',  async (req, res, next)=>{
    try{
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        let password = req.body.password;
 
 
        if (!firstName || !lastName || !email || !password) 
        {
            return res.sendStatus(400);
        }
 
            const salt = genSaltSync(10);
            password = hashSync(password, salt)
 
        const user =  await db.insertUser(firstName, lastName, email, password).then(insertId=>{return db.getUser(insertId);});
        req.session.userId = user.id
            //res.flash("Already registered!.. Back to log in soon.")
            return res.redirect('/login') 
 
    } catch(e)
    {    
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/logout', redirectLogin, (req, res) =>
{
    req.session.destroy( err =>
        {
            if(err)
            {
                return res.redirect('/home')
            }
            sessionStore.close()
            res.clearCookie("sampleSession")
            res.redirect('/login')
        })
})


//login route
app.get('/login',redirectHome ,(req,res)=>{
    res.send(`
    <h1>Login</h1>
    <form method='post' action='/login'>
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='password' required/>
    <input type='submit' />
    </form>
    <button style="width:80px" ><a href='/register'>Register</a></button>
    `)
})

app.post('/login', async(req, res, next) =>
{
    try
    {
        const email = req.body.email;
        let password = req.body.password;
        user = await db.getUserByEmail(email);

        if(!user)
        {
           return res.send({message: "invalid email"})
        }

        //start validation
        const isValidPassword = compareSync(password, user.password)
        if(isValidPassword)
        {
            user.password = undefined;
            user.session.userId = user.Id;
            return res.redirect('/home')
        }
        else
        {
            res.send("invalid email or password!")
            return res.redirect('/login')
        }
        // if(user.password !== password)
        // {
        //   return  res.send({message: "Invalid password!"})
        // }
    }
    catch(e)
    {
        console.log(e)
    }
})

//home route
app.get('/home',redirectLogin,  async(req,res)=>
{
    const {userId} =req.session
    if(userId)
    {
        try
        {
            const user = await db.getUser(userId);
            console.log(user)
            req.user = user;
            res.send(`
            <h1>Home</h1>
            <a href='/'>Main</a>
            <ul>
            <li> Name: ${user[0].first_name} </li>
            <li> Email:${user[0].email} </li>
            </ul>
        
            `)
         
        } 
        catch(e) 
        {
            console.log(e);
            res.sendStatus(404);
        }
    }
    
})


app.listen(3000, (err) => {
    if(err)
    {
        console.log(err)

    }
    else
    {
        console.log(`App listening at ${3000}`)
    }
})
