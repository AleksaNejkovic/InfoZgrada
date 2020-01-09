var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var parser=require('body-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');
var formidable = require('formidable');
var fs = require('file-system');


router.use(parser.urlencoded({extended: true}));
router.use(parser.json());
router.use(session({ secret: 'sesija', cookie: { maxAge: null }, resave: true, saveUninitialized: false, httpOnly: false}));


router.get('/',function (req,res,next) {

    res.render('pocetna');

});
router.get('/login_upravnika',function (req,res,next) {

    res.render('login');

});
router.post('/auth', function(req, res) {

    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    var email = req.body.email;
    var broj_telefona = req.body.broj_telefona;
    console.log(email);
    console.log(broj_telefona);
    if (email && broj_telefona) {
        con.query('SELECT * FROM upravnici WHERE email = ? AND broj_telefona = ?', [email, broj_telefona], function(error, result, fields) {
            if (result.length > 0) {
                req.session.loggedin=true;
                req.session.email = email;
                res.redirect('/upravnik/1');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

router.get('/upravnik/:id', function(req, res, next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin==true) {


        let sql = "SELECT * FROM upravnici WHERE id = " + req.params.id + ";";
        con.query(sql, function (err, result) {
            console.log(result);

            res.render('upravnik', {title: 'Upravnik', data: result});


        });
    }
    else {
            req.session.loggedin=false;
            res.redirect('/login_upravnika');
        }



});
router.get('/izmeni/upravnika/:id', function(req, res, next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin==true) {
        let sql = "SELECT * FROM upravnici WHERE id = " + req.params.id + "; ";
        con.query(sql, function (err, result) {
            console.log(result);
            if (req.session.loggedin == true) {
                res.render('upravnik_izmena', {title: 'Upravnik', data: result});
            } else {
                req.session.loggedin = false;
                res.redirect('/login_upravnika');
            }
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }


});
router.post('/izmeni/upravnika/:id', function(req, res, next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin==true) {
    var upravnik={
        "ime":req.body.ime,
        "prezime": req.body.prezime,
        "email": req.body.email,
        "broj_telefona": req.body.broj_telefona,
        "datum_rodjenja":req.body.datum_rodjenja
    }
    con.connect( function(err) {
        if (err) {
            res.status(500);
            return res.end(err.message);
        }
        con.query("UPDATE upravnici SET  ? WHERE id = " + req.params.id +";", upravnik, function(err, results,fields) {
            if (err) {
                console.log("error ocurred",err);
                res.send({
                    "code":400,
                    "failed":"error ocurred"
                });
            }else{
                return res.redirect('/upravnik/'+req.params.id);
                console.log('The solution is: ', results);
                res.send({
                    "code":200,
                    "success":"USPESNO IZMENJENI PODACI O UPRAVNIKU!"
                });
            }
        });
    });}
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }
});

router.get('/stanari', function (req,res,next) {
    if (req.session.loggedin==true) {
        res.render('stanari');
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }

});

router.get('/stanari/:broj_stana', function (req,res,next) {

        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'info_zgrada'
        });

    if (req.session.loggedin==true) {
        let sql = "SELECT * FROM stanari WHERE broj_stana= " + req.params.broj_stana + ";"
        con.query(sql, function (err, result) {
            console.log(result);
            res.render('stanaripregled', {title: 'Stanari', data: result});
        });
    }
    else {
            req.session.loggedin=false;
            res.redirect('/login_upravnika');
        }
});

router.get('/izmeni/stanara/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin==true) {
        let sql = "SELECT * FROM stanari WHERE id = " + req.params.id + "; ";
        con.query(sql, function (err, result) {
            console.log(result);
            res.render('izmenistanara', {title: 'Stanari', data: result});
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }

});
router.post('/izmeni/stanara/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin==true) {
        var stanar = {
            "ime": req.body.ime,
            "prezime": req.body.prezime,
            "email": req.body.email,
            "broj_telefona": req.body.broj_telefona,
            "datum_rodjenja": req.body.datum_rodjenja,
            "broj_licne_karte": req.body.broj_licne_karte,
            "broj_stana": req.body.broj_stana
        }
        con.connect(function (err) {
            if (err) {
                res.status(500);
                return res.end(err.message);
            }
            con.query("UPDATE stanari SET ? WHERE id = " + req.params.id + ";", stanar, function (err, results, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    return res.redirect('/stanari/' + req.body.broj_stana);
                    console.log('The solution is: ', results);
                    res.send({
                        "code": 200,
                        "success": "USPESNO IZMENJENI PODACI O STANARU!"
                    });
                }
            });
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }

});


router.get('/izbrisi/stanara/:broj_stana/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin==true) {
        let sql = "DELETE FROM stanari WHERE id = " + req.params.id + "; ";
        con.query(sql, function (err, results, fields) {

            if (err) {
                console.log("error ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                return res.redirect('/stanari/' + req.params.broj_stana);
                console.log('The solution is: ', results);
                res.send({
                    "code": 200,
                    "success": "USPESNO IZBRISAN DOBAVLJAC IZ BAZE!"
                });
            }
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }


});
router.get('/novistanar',function (req,res,next) {
    if (req.session.loggedin==true) {
        res.render('novistanar');
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }
});
router.post('/novistanar',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin==true) {
        var stanar = {
            "ime": req.body.ime,
            "prezime": req.body.prezime,
            "email": req.body.email,
            "broj_telefona": req.body.broj_telefona,
            "datum_rodjenja": req.body.datum_rodjenja,
            "broj_licne_karte": req.body.broj_licne_karte,
            "broj_stana": req.body.broj_stana
        }
        con.connect(function (err) {
            if (err) {
                res.status(500);
                return res.end(err.message);
            }
            con.query("INSERT INTO stanari SET ?", stanar, function (err, results, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    return res.redirect('/stanari/' + req.body.broj_stana);
                    console.log('The solution is: ', results);
                    res.send({
                        "code": 200,
                        "success": "USPESNO IZMENJENI PODACI O UPRAVNIKU!"
                    });
                }
            });
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }
});

//---------------------------------RACUNI !------------------------------------------------------
router.get('/racuni',function (req,res,next) {
    if (req.session.loggedin==true) {
        res.render('racuni');
    }
    else {
            req.session.loggedin=false;
            res.redirect('/login_upravnika');
        }
    router.get('/racun_struja/prikaz',function (req,res,next) {
        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'info_zgrada'
        });
        if (req.session.loggedin==true)
        {
        let datum= {
           "racun_struja.datum": req.query.datum
        }

        console.log(datum);
        con.query('SELECT racun_struja.id, racun_struja.vrednost_kwh, racun_struja.vrednost_din, racun_struja.datum, COUNT(stanari.id) AS BROJ_STANARA FROM racun_struja, stanari WHERE ?',datum, function(err, result) {
            console.log(result);
            res.render('racun_struja_prikaz', { title: 'Racuni', data:result});
        });
        }
        else {
            req.session.loggedin=false;
            res.redirect('/login_upravnika');
        }

        router.post('/proslediracun',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if (req.session.loggedin==true) {
                var racunic = {
                    "u_vrednost_kwh": req.body.u_vrednost_kwh,
                    "u_vrednost_din": req.body.u_vrednost_din,
                    "p_vrednost_kwh": req.body.p_vrednost_kwh,
                    "p_vrednost_din": req.body.p_vrednost_din,
                    "datum": req.body.datum
                }
                console.log(racunic);
                con.connect(function (err) {
                    if (err) {
                        res.status(500);
                        return res.end(err.message);
                    }
                    con.query("INSERT INTO stanar_struja SET ?", racunic, function (err, results, fields) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.send({
                                "code": 400,
                                "failed": "error ocurred"
                            });
                        } else {
                            if (res.status(200))
                            {
                                return res.redirect('/racun_struja/prikaz');
                            }
                            console.log('The solution is: ', results);
                            res.send({
                                "code": 200,
                                "success": "USPESNO UNETI PODACI O RACUNU ZA STANARE!"
                            });

                        }

                    });
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }
        });


        router.get('/racun_struja/izmeni/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if (req.session.loggedin==true) {
                let sql = "SELECT * FROM racun_struja WHERE id = " + req.params.id + "; ";
                con.query(sql, function (err, result) {
                    console.log(result);
                    res.render('racun_struja_izmeni', {title: 'Stanari', data: result});
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }

        });
        router.post('/racun_struja/izmeni/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if (req.session.loggedin==true) {
                var racun = {
                    "vrednost_kwh": req.body.vrednost_kwh,
                    "vrednost_din": req.body.vrednost_din,
                    "datum": req.body.datum
                }
                con.connect(function (err) {
                    if (err) {
                        res.status(500);
                        return res.end(err.message);
                    }
                    con.query("UPDATE racun_struja SET ? WHERE id = " + req.params.id + ";", racun, function (err, results, fields) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.send({
                                "code": 400,
                                "failed": "error ocurred"
                            });
                        } else {
                            return res.redirect('/racun_struja/prikaz');
                            console.log('The solution is: ', results);
                            res.send({
                                "code": 200,
                                "success": "USPESNO IZMENJENI PODACI O RACUNU!"
                            });
                        }
                    });
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }

        });
        router.get('/racun_stuja/izbrisi/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                let sql = "DELETE FROM racun_struja WHERE id = " + req.params.id + "; ";
                con.query(sql, function (err, results, fields) {

                    if (err) {
                        console.log("error ocurred", err);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    } else {
                        return res.redirect('/racun_struja/prikaz');
                        console.log('The solution is: ', results);
                        res.send({
                            "code": 200,
                            "success": "USPESNO IZBRISAN RACUN IZ BAZE!"
                        });
                    }
                });

            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }
        });
    });


    router.get('/racun_voda/prikaz',function (req,res,next) {
        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'info_zgrada'
        });
        if(req.session.loggedin==true) {
            let datum = {
                "racun_voda.datum": req.query.datum
            }
            console.log(datum);
            con.query('SELECT racun_voda.id, racun_voda.vrednost_m3, racun_voda.vrednost_din, racun_voda.datum, COUNT(stanari.id) AS BROJ_STANARA FROM racun_voda, stanari WHERE ?', datum, function (err, result) {
                console.log(result);
                res.render('racun_voda_prikaz', {title: 'Racuni', data: result});
            });
        }
        else {
            req.session.loggedin=false;
            res.redirect('/login_upravnika');
        }

        router.post('/proslediracunvode',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                var racunic = {
                    "u_vrednost_m3": req.body.u_vrednost_m3,
                    "u_vrednost_din": req.body.u_vrednost_din,
                    "p_vrednost_m3": req.body.p_vrednost_m3,
                    "p_vrednost_din": req.body.p_vrednost_din,
                    "datum": req.body.datum
                }
                console.log(racunic);
                con.connect(function (err) {
                    if (err) {
                        res.status(500);
                        return res.end(err.message);
                    }
                    con.query("INSERT INTO stanar_voda SET ?", racunic, function (err, results, fields) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.send({
                                "code": 400,
                                "failed": "error ocurred"
                            });
                        } else {
                            if (res.status(200))
                            {
                                return res.redirect('/racun_voda/prikaz');
                            }
                            return res.send('/racun_voda/prikaz');
                            console.log('The solution is: ', results);
                            res.send({
                                "code": 200,
                                "success": "USPESNO UNETI PODACI O RACUNU ZA STANARE!"
                            });
                        }
                    });
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }
        });
        router.get('/racun_voda/izmeni/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                let sql = "SELECT * FROM racun_voda WHERE id = " + req.params.id + "; ";
                con.query(sql, function (err, result) {
                    console.log(result);
                    res.render('racun_voda_izmeni', {title: 'Stanari', data: result});
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }
        });
        router.post('/racun_voda/izmeni/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                var racun = {
                    "vrednost_m3": req.body.vrednost_m3,
                    "vrednost_din": req.body.vrednost_din,
                    "datum": req.body.datum
                }
                con.connect(function (err) {
                    if (err) {
                        res.status(500);
                        return res.end(err.message);
                    }
                    con.query("UPDATE racun_voda SET ? WHERE id = " + req.params.id + ";", racun, function (err, results, fields) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.send({
                                "code": 400,
                                "failed": "error ocurred"
                            });
                        } else {
                            return res.redirect('/racun_voda/prikaz');
                            console.log('The solution is: ', results);
                            res.send({
                                "code": 200,
                                "success": "USPESNO IZMENJENI PODACI O RACUNU!"
                            });
                        }
                    });
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }

        });
        router.get('/racun_voda/izbrisi/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                let sql = "DELETE FROM racun_voda WHERE id = " + req.params.id + "; ";
                con.query(sql, function (err, results, fields) {

                    if (err) {
                        console.log("error ocurred", err);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    } else {
                        return res.redirect('/racun_voda/prikaz');
                        console.log('The solution is: ', results);
                        res.send({
                            "code": 200,
                            "success": "USPESNO IZBRISAN RACUN IZ BAZE!"
                        });
                    }
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }

        });
    });

    router.get('/racun_cistac/prikaz',function (req,res,next) {
        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'info_zgrada'
        });
        if(req.session.loggedin==true) {
            let sql = "SELECT * FROM racun_cistac WHERE datum LIKE '6.1.2020.'";
            con.query(sql, function (err, result) {
                console.log(result);
                res.render('racun_cistac_prikaz', {title: 'Racuni', data: result});
            });
        }
        else {
            req.session.loggedin=false;
            res.redirect('/login_upravnika');
        }
        router.get('/racun_cistac/izmeni/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                let sql = "SELECT * FROM racun_cistac WHERE id = " + req.params.id + "; ";
                con.query(sql, function (err, result) {
                    console.log(result);
                    res.render('racun_cistac_izmeni', {title: 'Stanari', data: result});
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }
        });
        router.post('/racun_cistac/izmeni/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                var racun = {
                    "vrednost_din": req.body.vrednost_din,
                    "datum": req.body.datum
                }
                con.connect(function (err) {
                    if (err) {
                        res.status(500);
                        return res.end(err.message);
                    }
                    con.query("UPDATE racun_cistac SET ? WHERE id = " + req.params.id + ";", racun, function (err, results, fields) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.send({
                                "code": 400,
                                "failed": "error ocurred"
                            });
                        } else {
                            return res.redirect('/racun_cistac/prikaz');
                            console.log('The solution is: ', results);
                            res.send({
                                "code": 200,
                                "success": "USPESNO IZMENJENI PODACI O RACUNU!"
                            });
                        }
                    });
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }

        });
        router.get('/racun_cistac/izbrisi/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                let sql = "DELETE FROM racun_cistac WHERE id = " + req.params.id + "; ";
                con.query(sql, function (err, results, fields) {

                    if (err) {
                        console.log("error ocurred", err);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    } else {
                        return res.redirect('/racun_cistac/prikaz');
                        console.log('The solution is: ', results);
                        res.send({
                            "code": 200,
                            "success": "USPESNO IZBRISAN RACUN IZ BAZE!"
                        });
                    }
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }
        });
    });

    router.get('/racun_zgrada/prikaz',function (req,res,next) {
        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'info_zgrada'
        });
        if(req.session.loggedin==true) {
            let sql = "SELECT * FROM racun_zgrada WHERE datum LIKE '6.1.2020.'";
            con.query(sql, function (err, result) {
                console.log(result);
                res.render('racun_zgrada_prikaz', {title: 'Racuni', data: result});
            });
        }
        else {
            req.session.loggedin=false;
            res.redirect('/login_upravnika');
        }

        router.get('/racun_zgrada/izmeni/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                let sql = "SELECT * FROM racun_zgrada WHERE id = " + req.params.id + "; ";
                con.query(sql, function (err, result) {
                    console.log(result);
                    res.render('racun_zgrada_izmeni', {title: 'Stanari', data: result});
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }
        });
        router.post('/racun_zgrada/izmeni/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                var racun = {
                    "vrednost_din": req.body.vrednost_din,
                    "datum": req.body.datum
                }
                con.connect(function (err) {
                    if (err) {
                        res.status(500);
                        return res.end(err.message);
                    }
                    con.query("UPDATE racun_zgrada SET ? WHERE id = " + req.params.id + ";", racun, function (err, results, fields) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.send({
                                "code": 400,
                                "failed": "error ocurred"
                            });
                        } else {
                            return res.redirect('/racun_zgrada/prikaz');
                            console.log('The solution is: ', results);
                            res.send({
                                "code": 200,
                                "success": "USPESNO IZMENJENI PODACI O RACUNU!"
                            });
                        }
                    });
                });
            }
            else {
                    req.session.loggedin=false;
                    res.redirect('/login_upravnika');
                }
        });
        router.get('/racun_zgrada/izbrisi/:id',function (req,res,next) {
            const con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'info_zgrada'
            });
            if(req.session.loggedin==true) {
                let sql = "DELETE FROM racun_zgrada WHERE id = " + req.params.id + "; ";
                con.query(sql, function (err, results, fields) {

                    if (err) {
                        console.log("error ocurred", err);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    } else {
                        return res.redirect('/racun_zgrada/prikaz');
                        console.log('The solution is: ', results);
                        res.send({
                            "code": 200,
                            "success": "USPESNO IZBRISAN RACUN IZ BAZE!"
                        });
                    }
                });
            }
            else {
                req.session.loggedin=false;
                res.redirect('/login_upravnika');
            }

        });
    });
});


router.post('/racun_struja',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if(req.session.loggedin==true) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var racun = {
            "vrednost_kwh": req.body.vrednost_kwh,
            "vrednost_din": req.body.vrednost_din,
            "datum": date.toString() + "." + month.toString() + "." + year.toString() + "."

        }
        con.connect(function (err) {
            if (err) {
                res.status(500);
                return res.end(err.message);
            }
            con.query("INSERT INTO racun_struja SET ?", racun, function (err, results, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    return res.redirect('/racuni');
                    console.log('The solution is: ', results);
                    res.send({
                        "code": 200,
                        "success": "USPESNO DODAT RACUN ZA STRUJU!"
                    });
                }
            });
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }
});

router.post('/racun_voda',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if(req.session.loggedin==true) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var racun = {
            "vrednost_m3": req.body.vrednost_m3,
            "vrednost_din": req.body.vrednost_din,
            "datum": date.toString() + "." + month.toString() + "." + year.toString() + "."
        }
        con.connect(function (err) {
            if (err) {
                res.status(500);
                return res.end(err.message);
            }
            con.query("INSERT INTO racun_voda SET ?", racun, function (err, results, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    return res.redirect('/racuni');
                    console.log('The solution is: ', results);
                    res.send({
                        "code": 200,
                        "success": "USPESNO DODAT RACUN ZA VODU!"
                    });
                }
            });
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }
});
router.post('/racun_cistac',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if(req.session.loggedin==true) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var racun = {
            "vrednost_din": req.body.vrednost_din,
            "datum": date.toString() + "." + month.toString() + "." + year.toString() + "."
        }
        con.connect(function (err) {
            if (err) {
                res.status(500);
                return res.end(err.message);
            }
            con.query("INSERT INTO racun_cistac SET ?", racun, function (err, results, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    return res.redirect('/racuni');
                    console.log('The solution is: ', results);
                    res.send({
                        "code": 200,
                        "success": "USPESNO DODAT RACUN ZA CISTACA!"
                    });
                }
            });
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }

});
router.post('/racun_zgrada',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if(req.session.loggedin==true) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var racun = {
            "vrednost_din": req.body.vrednost_din,
            "datum": date.toString() + "." + month.toString() + "." + year.toString() + "."
        }
        con.connect(function (err) {
            if (err) {
                res.status(500);
                return res.end(err.message);
            }
            con.query("INSERT INTO racun_zgrada SET ?", racun, function (err, results, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    return res.redirect('/racuni');
                    console.log('The solution is: ', results);
                    res.send({
                        "code": 200,
                        "success": "USPESNO DODAT RACUN ZA ZGRADU!"
                    });
                }
            });
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }


});
//---------------------------------KRAJ !------------------------------------------------------




router.get('/caskanje', function (req,res,next) {
    if(req.session.loggedin==true) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="/fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }

});
router.post('/fileupload',function (req,res,next) {
    if(req.session.loggedin==true) {
        if (req.url == '/fileupload') {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var oldpath = files.filetoupload.path;
                var newpath = 'C:/Users/Aleksa/IdeaProjects/InfoZgrada/public/racuni/' + files.filetoupload.name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    res.write('File uploaded and moved!');
                    res.end();
                });
            });
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<form action="/fileupload" method="post" enctype="multipart/form-data">');
            res.write('<input type="file" name="filetoupload"><br>');
            res.write('<input type="submit">');
            res.write('</form>');
            return res.end();
        }
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }

});

router.get('/upravnik_obavestenja',function (req,res,next) {
    if(req.session.loggedin==true) {
        res.render('obavestenja');
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }

});
router.post('/upravnik_obavestenja',function (req,res,next) {
    if(req.session.loggedin==true) {
        var podaci = {
            "user": req.body.email,
            "pass": req.body.pass,
            "to": req.body.to,
            "subject": req.body.subject,
            "text": req.body.text
        }
        console.log(podaci.user);
        console.log(podaci.pass);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: podaci.user,
                pass: podaci.pass
            }
        });

        var mailOptions = {
            from: podaci.user,
            to: podaci.to,
            subject: podaci.subject,
            text: podaci.text
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect('/upravnik_obavestenja');
            }
        });
    }
    else {
        req.session.loggedin=false;
        res.redirect('/login_upravnika');
    }
});
module.exports = router;