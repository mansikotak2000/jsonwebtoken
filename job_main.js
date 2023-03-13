let http = require('http');
let express = require('express');
let app = express();
let mysql = require('mysql2');
let ejs = require('ejs');
let body = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "job_application_form"
});

conn.connect((err) => {
    if (err)
        throw err;
    console.log("Connected");
});

app.get('/', (req, res) => {
    let state = "SELECT * FROM state_option;";
    let teches = "select * from option_master where sel_id=2";
    let langs = "select * from option_master where sel_id=3";
    let pref_location = "select * from option_master where sel_id=4";
    let course = "select * from option_master where sel_id=5";
    let department = "select * from option_master where sel_id=6";
    conn.query(state, (err, state) => {
        conn.query(teches, (err, teches) => {
            conn.query(langs, (err, lang) => {
                conn.query(pref_location, (err, pref_location) => {
                    conn.query(course, (err, course) => {
                        conn.query(department, (err, department) => {

                            if (err) {}
                            res.render('job_main.ejs', { state, teches, lang, pref_location, course, department });
                        })
                    })
                })
            })
        })
    })

})


app.post('/submit', async(req, res, next) => {

    let fname = req.body.fname;
    let lname = req.body.lname;
    let designation = req.body.designation;
    let address = req.body.txt;
    let city = req.body.city;
    let email = req.body.email;
    let phno = req.body.Number;
    let gen = req.body.Gender;
    let status = req.body.Status;
    let state = req.body.state;

    let cou = req.body.course;
    let board = req.body.un;
    let py = req.body.bpy;
    let per = req.body.bper;


    let cname = req.body.cname2;
    let dname = req.body.dname2;
    let from = req.body.from;
    let to = req.body.to;

    let name1 = req.body.nm1;
    let contact1 = req.body.cn1;
    let relation1 = req.body.r1;

    let notice = req.body.np;
    let location = req.body.pref_location;
    let department = req.body.dept;
    let ectc = req.body.ectc;
    let cctc = req.body.cctc;


    let chk_language = req.body.chk_languages;
    let technology = req.body.ck_tech;
    console.log(req.body);

    console.log(fname, lname, address, city, designation, email, phno, gen, status, state);
    console.log(cou, board, py, per);
    console.log(cname, dname, from, to);
    console.log(name1, contact1, relation1);
    console.log(notice, location, department, ectc, cctc);


    conn.query(`SELECT * FROM job_application_form.state_option where state_id=${parseInt(state)}`, (err, result) => {

        let sql = `insert into basic_info1 (fname,lname,address,city,designation,email,phone_no,gender,rel_status,state) values('${fname}','${lname}',
        '${address}','${city}','${designation}','${email}', '${phno}','${gen}','${status}','${result[0].name}')`;
        console.log(sql);

        conn.query(sql, (err, result1) => {
            let id = result1.insertId;

            let sql1 = `insert into edu_details(course,board,pyear,per,cid) values('${cou}','${board}',${py},${per},${id})`;
            conn.query(sql1, (err, result2) => {

                let sql2 = `insert into experience1(cid,cname,designation,start_date,end_date) values(${id},'${cname}','${dname}','${from}','${to}')`;
                conn.query(sql2, (err, result3) => {

                    let sql3 = `insert into reference2(cid,name,cno,relation) values(${id},'${name1}','${contact1}','${relation1}')`;
                    conn.query(sql3, (err, result3) => {

                        let sql4 = `insert into preferences1(cid,n_period,e_ctc,c_ctc,p_location,department) values(${id},'${notice}',
                        '${ectc}','${cctc}','${location}','${department}')`;
                        conn.query(sql4, (err, result4) => {

                            for (const lang of chk_language) {

                                let x = {
                                    read: "N",
                                    write: "N",
                                    speak: "N"
                                }


                                let arr = req.body[lang];

                                arr = Array.isArray(arr) ? arr : [arr];


                                for (a of arr) {
                                    if (a == 'Read') {
                                        x.read = "Y";
                                    }
                                    if (a == 'write') {
                                        x.write = "Y";
                                    }
                                    if (a == 'speak') {
                                        x.speak = "Y";
                                    }
                                }
                                let lang_query = `insert into languages1(cid,language_know,r_read,w_write,s_speak) values (${id},'${lang}','${x.read}','${x.write}','${x.speak}')`;
                                conn.query(lang_query, (err, result) => {



                                    console.log(err);
                                })
                            }





                            for (const tech of technology) {
                                let x = {
                                    beginner: "N",
                                    moderate: "N",
                                    expert: "N"
                                }
                                let arr = req.body[tech];

                                arr = Array.isArray(arr) ? arr : [arr];

                                for (a of arr) {
                                    if (a == "Beginner") {
                                        x.beginner = "Y";
                                    } else if (a == "Moderate") {
                                        x.moderate = "Y";
                                    } else {
                                        x.expert = "Y";
                                    }
                                }
                                let tech_query = `insert into technolgies1(cid,tech_name,beginner,moderate,expert) values(${id},'${tech}','${x.beginner}','${x.moderate}','${x.expert}')`;
                                conn.query(tech_query, (err, result5) => {
                                    console.log(tech_query);
                                    conn.query("SELECT * FROM basic_info1 where isDeleted=0;", (err, sresult) => {

                                        res.render('job_main.ejs', { data: sresult });
                                    })
                                })
                            }

                        })
                    })
                })

            })

        })
    })

})

app.get('/show', (req, res) => {
    conn.query("SELECT * FROM basic_info1 where isDeleted=0;", (err, sresult) => {

        res.render('job_show.ejs', { data: sresult });
        // next();
    })
})

app.post('/searching', (req, res) => {
    searchVal = req.body.txt;
    console.log(searchVal);

    let symbol = ['^', '$', '#', '~', '_'];
    let newStr = "";
    var count = 0;

    for (var i = 0; i < searchVal.length; i++) {
        if (symbol.includes(searchVal[i])) {
            newStr += " " + searchVal[i];
            console.log(newStr);
            count++;
            console.log(count);
        } else {
            newStr += searchVal[i];
            console.log(newStr);
        }
    }

    var spiltarr = newStr.split(' ');

    console.log(spiltarr);
    var queryans = "where";

    for (let val of spiltarr) {

        if (val[0] == "^") {

            count--;
            if (count)
                queryans += ` fname LIKE '${val.substring(1)}%' and`
            else
                queryans += ` fname LIKE '${val.substring(1)}%'`
        }
        if (val[0] == "~") {
            console.log(val.substring());

            count--;
            if (count)
                queryans += ` designation LIKE '${val.substring(1)}%' and`
            else
                queryans += ` designation LIKE '${val.substring(1)}%'`
        }
        if (val[0] == "$") {

            count--;
            if (count)
                queryans += ` lname LIKE '${val.substring(1)}%' and`
            else
                queryans += ` lname LIKE '${val.substring(1)}%'`

        }
        if (val[0] == "#") {
            count--;
            if (count)
                queryans += ` city LIKE '${val.substring(1)}%' and`
            else
                queryans += ` city LIKE '${val.substring(1)}%'`

        }


    }
    console.log(queryans);
    conn.query(`select * from basic_info1 ${queryans};`, (err, results) => {
        res.render('job_show.ejs', { data: results });
    })
});

app.get('/test', (req, res) => {

    let state_id = req.query.state;
    console.log(state_id);
    var city = `select * from city_option where state_id=${parseInt(state_id)}`;
    conn.query(city, (err, city) => {
        res.json({ city })
    })
});

app.get('/delete', (req, res) => {
    let student_id = req.query.cid;
    console.log(student_id);
    var del = `update basic_info1 set isDeleted=1 where cid=${student_id}`;
    console.log(del);
    conn.query(del, (err, del) => {
        if (err) {
            return console.log(err.message)
        }
        return res.json({ del });
    })
})

app.get('/edit', (req, res) => {
    let stud_id = req.query.cid;
    var edit_query = `select * from basic_info1 where cid=${parseInt(stud_id)};`




    conn.query(edit_query, (err, result) => {

        let st = `select state from basic_info1 bi join option_master om on bi.state = om.oname where isDeleted = 0 AND cid = ${stud_id} order by cid`;
        let states = "SELECT * FROM state_option";
        conn.query(st, (err, state_id) => {
            conn.query(states, (err, states) => {
                let stateid = state_id[0]['state'];


                console.log(stateid);



                let getcities = `SELECT * FROM city_option`;
                let selcity = `SELECT city FROM job_application_form.basic_info1 where cid = ${stud_id}`;

                conn.query(getcities, (err, getcities) => {
                    conn.query(selcity, (err, selcity) => {

                        let scity = selcity[0]['city'];


                        let course_name = `SELECT * FROM job_application_form.edu_details where cid=${parseInt(stud_id)};`
                        let courses = "select * from option_master where sel_id=5";
                        conn.query(course_name, (err, coursename) => {
                            conn.query(courses, (err, getcourse) => {
                                gender = ["male", "female", "other"]
                                rel_status = ["Married", "UnMarried"]



                                let experience_query = `select * from experience1 where cid=${parseInt(stud_id)}`;
                                conn.query(experience_query, (err, experiencequery) => {




                                    let reference_query = `select * from reference2 where cid=
                                ${parseInt(stud_id)}`;
                                    conn.query(reference_query, (err, refquery) => {



                                        let pref_query = `select * from preferences1 where cid=${parseInt(stud_id)}`;
                                        let pref_location = "select * from option_master where sel_id=4";
                                        let department = "select * from option_master where sel_id=6";
                                        conn.query(pref_query, (err, preference) => {
                                            conn.query(pref_location, (err, prelocation) => {
                                                conn.query(department, (err, predept) => {


                                                    let langs_query = `select * from languages1 where cid=${parseInt(stud_id)}`;
                                                    let langs = "select * from option_master where sel_id=3";
                                                    conn.query(langs_query, (err, langquery) => {
                                                        conn.query(langs, (err, lang) => {


                                                            console.log(langquery);

                                                            let techn_query = `select * from technolgies1 where cid=${parseInt(stud_id)}`;
                                                            let teches = "select * from option_master where sel_id=2";
                                                            conn.query(techn_query, (err, techquery) => {
                                                                conn.query(teches, (err, teches) => {









                                                                    res.render('job_edit', {
                                                                        data: result,
                                                                        stateid,
                                                                        states,
                                                                        getcourse,
                                                                        getcities,
                                                                        scity,
                                                                        gender,
                                                                        rel_status,
                                                                        coursename,
                                                                        data2: experiencequery,
                                                                        data3: refquery,
                                                                        preference,
                                                                        prelocation,
                                                                        predept,
                                                                        langquery,
                                                                        lang,
                                                                        techquery,
                                                                        teches,

                                                                    })
                                                                })

                                                            })
                                                        })

                                                    })
                                                })
                                            })
                                        });
                                    })
                                })
                            })

                        })
                    })
                })

            })
        })

    })
})






app.listen(4009, () => console.log('http://localhost:4009'));


app.post('/update', (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let designation = req.body.designation;
    let address = req.body.txt;
    let city = req.body.city;
    let email = req.body.email;
    let phno = req.body.Number;
    let gen = req.body.Gender;
    let status = req.body.Status;
    let state = req.body.state;
    // let stud_id = req.body.cid;

    let cou = req.body.course;
    let board = req.body.un;
    let py = req.body.bpy;
    let per = req.body.bper;
    let technology = req.body.technology;
    let chk_language = req.body.chk_languages;


    let cname = req.body.cname2;
    let dname = req.body.dname2;
    let from = req.body.from;
    let to = req.body.to;

    let name1 = req.body.nm1;
    let contact1 = req.body.cn1;
    let relation1 = req.body.r1;

    let notice = req.body.np;
    let location = req.body.pref_location;
    let department = req.body.department;
    let ectc = req.body.ectc;
    let cctc = req.body.cctc;



    var update_query = `update basic_info1 set basic_info1.fname='${req.body.fname}',
                basic_info1.lname='${req.body.lname}',
                basic_info1.address='${req.body.txt}',
                basic_info1.city='okha',
                basic_info1.designation='${req.body.designation}',
                basic_info1.email='${req.body.email}',
                basic_info1.phone_no='${req.body.Number}',
                basic_info1.state='${req.body.state}',
                basic_info1.rel_status='${req.body.Status}',
                basic_info1.gender='${req.body.Gender}' where cid=${parseInt(id)};`

    conn.query(update_query, (err, result) => {
        var edu_update = `update edu_details set course='${cou}',
                board='${board}',
                pyear='${py}',
                per='${per}' where cid=${id};`

        console.log(edu_update);
        conn.query(edu_update, (err, eduupdate) => {
            if (err) return console.log(err);
            var exp_update = `update experience1 set cname='${cname}',designation='${dname}',start_date='${from}',end_date='${to}' where cid=${parseInt(id)};`
            conn.query(exp_update, (err, expupdate) => {

                var ref_update = `update reference2 set name='${name1}',cno='${contact1}',relation='${relation1}';`
                if (err) return console.log(err);

                conn.query(ref_update, (err, refupdate) => {

                    var pef_update = `update preferences1 set n_period='${notice}',e_ctc='${ectc}',c_ctc='${cctc}',p_location='${location}',department='${department}' 
                    where cid=${parseInt(id)};`
                    conn.query(pef_update, (err, pefupdate) => {
                        var tech_delete = `delete from technolgies1 where cid=${parseInt(id)}`;
                        conn.query(tech_delete, (err, techdelete) => {
                            if (err) return console.log(err);
                        })
                        console.log("this is tech", technology);
                        for (const tech of technology) {
                            console.log(tech);
                            let x = {
                                beginner: "N",
                                moderate: "N",
                                expert: "N"
                            }
                            let arr = req.body[tech];
                            arr = Array.isArray(arr) ? arr : [arr];
                            console.log(arr);

                            for (a of arr) {
                                if (a == "Beginner") {
                                    x.beginner = "Y";
                                } else if (a == "Moderate") {
                                    x.moderate = "Y";
                                } else {
                                    x.expert = "Y";
                                }
                            }

                            var tech_update = `insert into technolgies1(cid,tech_name,beginner,moderate,expert) values(${parseInt(id)},'${tech}','${x.beginner}',
                            '${x.moderate}','${x.expert}');`
                            console.log(tech_update);


                            conn.query(tech_update, (err, techupdate) => {

                            })
                        }


                        let lang_delete = `delete from languages1 where cid=${parseInt(id)};`
                        conn.query(lang_delete, (err, langdelete) => {
                            if (err) {
                                return console.log(err.message)
                            }
                        });
                        for (const lang of chk_language) {

                            let x = {
                                read: "N",
                                write: "N",
                                speak: "N"
                            }


                            let arr = req.body[lang];

                            arr = Array.isArray(arr) ? arr : [arr];

                            console.log("this is arr", arr);
                            for (a of arr) {
                                if (a == 'Read') {
                                    x.read = "Y";
                                }
                                if (a == 'write') {
                                    x.write = "Y";
                                }
                                if (a == 'speak') {
                                    x.speak = "Y";
                                }
                            }
                            console.log(x);

                            let lang_update = `insert into languages1(cid,language_know,r_read,w_write,s_speak) values
                              (${parseInt(id)},'${lang}','${x.read}','${x.write}','${x.speak}')`;

                            conn.query(lang_update, (err, langupdate) => {

                                if (err) {
                                    return console.log(err.message)
                                }
                                res.send(result, eduupdate, expupdate, pefupdate, langupdate)
                                    //res.render('job_update.ejs', { data: update_query });

                            })
                        }




                    })
                })
            })

        })
    })
})




async function queryExecuter(query) {
    return new Promise((resolve, reject) => {
        conn.query((err, result) => {
            resolve(result);
        })
    })
}