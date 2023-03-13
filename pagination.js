var express = require('express');
var app = express();
var body = require('body-parser');
var nm = require('ejs');
var mysql = require('mysql2');
var limit = 30;

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "job_application_form"
});

app.set('view engine', 'ejs');

conn.connect((err) => {
    if (err)
        throw err;
    console.log("Connected");
});
app.get('/first?', (req, res) => {
    if (req.headers.cookie) {
        let page = 1;
        let offset = (page - 1) * limit;
        let count = [];
        let sql = `select * from basic_info1 limit ${offset},${limit}`;
        let record_count = `select count(*) from basic_info1`;

        conn.query(sql, (err, result) => {
            conn.query(record_count, (err, r) => {
                count = r;
                let check = count[0]['count(*)'];
                let c = check / limit;
                if (err) throw err;
                res.render('ajax', { data: result, total: count, a: c });
            });
        });
    } else {
        res.end('please login first');

    }
});

app.get('/firstres', (req, res) => {
    console.log(req.query);
    let page = req.query.no || 1;
    console.log(page);
    let offset = (page - 1) * limit;
    console.log(offset);
    let count = []
    let sql = `select * from basic_info1 limit ${offset},${limit}`;
    // let record_count = `select count(*) from basic_info1`;
    console.log(sql);
    conn.query(sql, (err, result) => {

        if (err) return console.log(err.message);

        res.json({ result });
    })
});


app.listen(3611, () => console.log('http://localhost:3611/first'))