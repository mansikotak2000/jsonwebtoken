const e = require('express');
const express = require('express');
const ejs = require('ejs');
const app = express();
const jwt = require('jsonwebtoken')
    // using mysql2/promise since we are working with async tasks.
var mysql = require('mysql2/promise');
var body = require('body-parser');
var bcrypt = require('bcrypt')
const cookie = require('cookie-parser');
const page = require('./pagesortd');
const pagination = require('./pagination');
const job = require('./job_main');
const search = require('./searching.js')


app.use(cookie());



app.set("view engine", "ejs")
require('dotenv').config();




app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())

// using createPool instead of createConnection, since we are working with Promises.
var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "login"
});


app.get("/register", (req, res) => {
    res.render("register.ejs")
})

app.post("/register", async(req, res) => {

    const { name, email, pwd, cpwd } = req.body
    if (name && email && pwd && cpwd) {
        console.log(name, email, pwd, cpwd);
        const hash = await bcrypt.hash(pwd, 10);
        console.log(hash);
        const iQuery = `insert into users(name,email,password) 
        values ('${name}','${email}','${hash}')`;
        console.log(iQuery);

        // using conn.execute instead of that method we created.
        const insert = await con.execute(iQuery);
        if (req.header.cookie) {
            const page = require('./pagesortd');
        }
        res.render("activation", { activated: false, userID: insert[0].insertId });
    } else {
        res.send("please enter valid information.")
    }


})
app.get("/login", (req, res) => {
    res.render("login.ejs")
})



app.post("/login", async(req, res) => {
    const email = req.body.email;
    console.log(email);
    const query = `select * from users where email='${email}' and isactive=1`;
    const result = await con.execute(query);
    // if (result[0]) {

    const user = result[0];
    if (user.length > 0) {
        const password = user[0].password;
        const ispasswordmatch = await bcrypt.compare(req.body.pwd, password);
        if (ispasswordmatch) {
            const token = await jwt.sign({ user }, process.env.JWT_TOKEN);
            res.cookie('token', token);
            if (req.header.cookie) {
                const page = require('./pagesortd');
            }
        }

        // res.send("success");
        res.redirect('/home');
    } else {
        res.send("please activate your link first");
        //res.redirect('/activate');

    }


})

app.get('/home', async(req, res) => {
    const token = await req.cookies['token'];
    if (req.headers.cookie) {
        const isValid = await jwt.verify(token, process.env.JWT_TOKEN);
        console.log(isValid)
        res.render('welcome', { user: isValid.user[0] });
    } else {
        //res.redirect('/login');
        res.end('please login first')
    }

})


app.get('/validateUser', async(req, res) => {
    const email = req.query.email;
    console.log(email);
    const query = `select email,isactive from users where email='${email}'`;


    console.log(query);
    const result = await con.execute(query);


    console.log(result);
    if (result[0].length > 0) {
        res.json({ status: false });
    } else {
        res.json({ status: true });
    }
})

app.get('/activate', async(req, res) => {
    const userID = req.query.userId;
    const update = `update users set isactive='1' where id=${parseInt(userID)}`;
    const result = await con.execute(update);
    res.render('activation', { activated: true });
})

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
})

app.get('/colorchange', async(req, res) => {
    const token = await req.cookies['token'];
    if (!token) {
        res.redirect('/login');

    } else {
        const isValid = await jwt.verify(token, process.env.JWT_TOKEN);
        console.log(isValid)
        res.render('colorchange');
    }
})
app.get('/tictac', async(req, res) => {
    const token = await req.cookies['token'];
    if (!token) {
        res.redirect('/login');

    } else {
        const isValid = await jwt.verify(token, process.env.JWT_TOKEN);
        console.log(isValid)
        res.render('tictac');
    }
})
app.get('/website1', async(req, res) => {
    const token = await req.cookies['token'];
    if (!token) {
        res.redirect('/login');

    } else {
        const isValid = await jwt.verify(token, process.env.JWT_TOKEN);
        console.log(isValid)
        res.render('website1');
    }

})

app.get('/website2', async(req, res) => {
    const token = await req.cookies['token'];
    if (!token) {
        res.redirect('/login');

    } else {
        const isValid = await jwt.verify(token, process.env.JWT_TOKEN);
        console.log(isValid)
        res.render('website2');
    }

})



app.listen(8080, () => console.log('http://localhost:8080/register'));