var express = require('express');
var app = express();
var body = require('body-parser');
var mysql = require('mysql2');
//var limit=1000;

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "student3"
});

conn.connect((err) => {
    if (err)
        throw err;
    console.log("connected");
});

app.set('view engine', 'ejs');

app.get('/first', (req, res) => {

    const header = req.headers.cookie;

    // const token=header.toString().split("=")[1];

    // console.log(token)

    if (req.headers.cookie) {
        let sql = "select * from student_express";
        conn.query(sql, (err, result) => {
            res.render('search.ejs', { data: result });
        })
    } else {
        res.send('please login first');
    }
});



app.get('/first/searching', (req, res) => {




    let search = req.query.txt;
    let wc = ["^", "$"];
    let range = [];
    let ans = [];
    for (let i = 0; i < wc.length; i++) {
        range[i] = search.indexOf(wc[i]);
    }
    console.log(range);
    for (let i = 0; i < range.length; i++) {
        ans[i] = search.substring(range[i] + 1, range[i + 1]);
    }
    console.log(ans);

    let sql = `select * from student_express where fname='${ans[0]}' AND lname='${ans[1]}'`;
    conn.query(sql, (err, result1) => {
        if (err) {}
        res.render('search.ejs', { data: result1 });

    });

});
app.listen(3751, () => console.log('http://localhost:3751/first'));