var express = require('express');
var app = express();
var body = require('body-parser');
var nm = require('ejs');
var mysql = require('mysql2');
var limit = 100;
var sort = 'id';
var order = 'asc';
var newsort


var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "student3"
});

conn.connect((err) => {
    if (err)
        throw err;
    console.log("Connected");
});
app.set('view engine', 'ejs');

app.get('/first?', (req, res) => {

    if (req.headers.cookie) {
        let page = req.query.no || 1;
        let sort = req.query.sort;
        newsort = req.query.old || 'id';

        let offset = (page - 1) * limit;



        if (newsort == sort) {
            if (order == 'asc') order = 'desc';
            else
                order = 'asc';
        }

        let count = [];
        let sql = `select * from student_express order by ${sort} ${order} limit ${offset},${limit}`;
        let record_count = `select count(*) from student_express`;


        conn.query(sql, (err, result) => {
            conn.query(record_count, (err, r) => {
                count = r;
                let check = count[0]['count(*)'];
                let c = check / limit;
                if (err) throw err;
                res.render('pagesortd.ejs', { data: result, total: count, a: c, order, sort, newsort });
            });
        });
    } else {
        res.end('please login first');
    }
}).listen(3100, () => console.log('http://localhost:3100/first?sort=' + sort + '&order=' + order));