var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var parser=require('body-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');



router.use(parser.urlencoded({extended: true}));
router.use(parser.json());
router.use(session({ secret: 'sesija', cookie: { maxAge: null }, resave: true, saveUninitialized: false, httpOnly: false}));



router.get('/',function (req,res,next) {
    req.session.logout;
    res.render('pocetna');
});
router.get('/login_stanara',function (req,res,next) {
    res.render('login2')

});

router.post('/auth2', function(req, res) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    var email = req.body.email;
    var broj_telefona = req.body.broj_telefona;
    var broj_stana=req.body.broj_stana;
    console.log(email);
    console.log(broj_telefona);
    if (email && broj_telefona) {
        con.query('SELECT * FROM stanari WHERE email = ? AND broj_telefona = ? AND broj_stana = ?', [email, broj_telefona, broj_stana], function(error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin2 = true;
                req.session.email = email;
                res.redirect('/stanar_stanari/'+req.body.broj_stana);
            } else {
                res.send('Podaci nisu ispravni, pokusajte ponovo!');
            }
            res.end();
        });
    } else {
        res.send('Unesite podatke u predviđena polja!');
        res.end();
    }
});
router.get('/logout',function (req,res,next) {
    req.session=null;
    req.session.destroy();
    res.redirect('/');

});


router.get('/stanar_stanari/:broj_stana',function (req,res,next) {
        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'info_zgrada'
        });
        if (req.session.loggedin2==true) {
            let sql = "SELECT * FROM stanari WHERE broj_stana = " + req.params.broj_stana + ";";
            con.query(sql, function (err, result) {
                console.log(result);
                res.render('stanar_stanari', {title: 'Stanar_stanari', data: result});
            });
        }
        else {
            req.session.loggedin2=false;
            res.redirect('/login_stanara');
        }
});

router.get('/stanar_izmeni/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin2==true) {
        let sql = "SELECT * FROM stanari WHERE id = " + req.params.id + "; ";
        con.query(sql, function (err, result) {
            console.log(result);

            res.render('stanar_izmeni', {title: 'Stanar izmeni', data: result});


        });
    }
    else {
        req.session.loggedin2=false;
        res.redirect('/login_stanara');
    }

});
router.post('/stanar_izmeni/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'info_zgrada'
    });
    if (req.session.loggedin2==true) {
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
            con.query("UPDATE stanari SET  ? WHERE id = " + req.params.id + ";", stanar, function (err, results, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    return res.redirect('/stanar_stanari/' + req.body.broj_stana);
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
        req.session.loggedin2=false;
        res.redirect('/login_stanara');
    }

});
router.get('/stanar_racuni/:broj_stana', function (req,res,next) {
    if (req.session.loggedin2==true) {
        res.render('stanar_racuni');
    }
    else
    {
        req.session.loggedin2 = false;
        res.redirect('/login_stanara');
    }
    router.post('/stanar_racuni/struja/:broj_stana', function (req,res,next) {
        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'info_zgrada'
        });
        if (req.session.loggedin2==true) {
            let sql = "SELECT stanar_struja.id,stanar_struja.u_vrednost_kwh,stanar_struja.u_vrednost_din, stanar_struja.p_vrednost_kwh, stanar_struja.p_vrednost_din,stanar_struja.datum,COUNT(stanari.id) AS BRS FROM stanar_struja,stanari WHERE datum='6.1.2020.' AND stanari.broj_stana=" + req.params.broj_stana;
            con.query(sql, function (err, result) {
                console.log("PRE IZMENE:");
                console.log(result);
                result[0].p_vrednost_kwh = (result[0].p_vrednost_kwh * result[0].BRS);
                result[0].p_vrednost_din = (result[0].p_vrednost_din * result[0].BRS);
                console.log("POSLE IZMENE:");
                console.log(result);

                res.render('stanar_racuni_struja', {title: 'Stanar izmeni', data: result});


            });
        }
        else
        {
            req.session.loggedin2 = false;
            res.redirect('/login_stanara');
        }
    });
    router.post('/stanar_racuni/voda/:broj_stana', function (req,res,next) {
        const con1 = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'info_zgrada'
        });
        if (req.session.loggedin2==true) {
            let sql1 = "SELECT stanar_voda.id,stanar_voda.u_vrednost_m3,stanar_voda.u_vrednost_din, stanar_voda.p_vrednost_m3, stanar_voda.p_vrednost_din,stanar_voda.datum,COUNT(stanari.id) AS BRS FROM stanar_voda,stanari WHERE datum='6.1.2020.' AND stanari.broj_stana=" + req.params.broj_stana;
            con1.query(sql1, function (err, result) {
                console.log("PRE IZMENE:");
                console.log(result);
                result[0].p_vrednost_m3 = (result[0].p_vrednost_m3 * result[0].BRS);
                result[0].p_vrednost_din = (result[0].p_vrednost_din * result[0].BRS);
                console.log("POSLE IZMENE:");
                console.log(result);
                res.render('stanar_racuni_voda', {title: 'Stanar izmeni', data: result});
            });
        }
        else
        {
            req.session.loggedin2 = false;
            res.redirect('/login_stanara');
        }
    });


});

router.get('/stanar_obavestenja',function (req,res,next) {
    if (req.session.loggedin2==true) {
        res.render('stanar_obavestenja');
    }
    else {
            req.session.loggedin2=false;
            res.redirect('/login_stanara');
        }
});
router.post('/stanar_obavestenja',function (req,res,next) {
    if(req.session.loggedin2==true){
    var podaci={
        "user":req.body.email,
        "pass":req.body.pass,
        "to":req.body.to,
        "subject":req.body.subject,
        "text":req.body.text
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

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {

                console.log('Email sent: ' + info.response);
                res.redirect('/stanar_obavestenja');
        }
    });
    }
    else {
        req.session.loggedin2=false;
        res.redirect('/login_stanara');
    }
});
module.exports = router;