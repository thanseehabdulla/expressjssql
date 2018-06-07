var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var squel = require("squel");
const bcrypt = require('bcrypt');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sinergialabs',
    database: 'nrm'
});


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


/* register user */
router.post('/register', function (req, res, next) {
    var datas = req.body;
    var name = datas['name'];
    var username = datas['username'];
    var password = datas['password'];
    var email = datas['email'];
    var phone = datas['phone'];
    var address = datas['address'] ? datas['address'] : 'nil';

    // connection.connect()

    var queryUser = squel.insert()
        .into("user")
        .set("name", name)
        .set("email", email)
        .set("phone", phone)
        .set("address", address)
        .toString();


    connection.query(queryUser, function (err, rows, fields) {
        if (err) throw err

        console.log(rows);
        bcrypt.hash(password, 10, function (err, hash) {
            // Store hash in database
            var queryLogin = squel.insert()
                .into("login")
                .set("userid", rows.insertId)
                .set("username", username)
                .set("password", hash)
                .set("id", phone)
                .toString();

            connection.query(queryLogin, function (err, rows, fields) {
                if (err) throw err

                console.log('login table insert successful');
                res.send('registration successful');
                // connection.end()
            })
        });
    })

});

/* login authentication */
router.post('/login', function (req, res, next) {
    var datas = req.body;
    var username = datas['username'];
    var password = datas['password'];

    var queryLogin = "select * from login where username='" + username + "'";


    connection.query(queryLogin, function (err, rows, fields) {
        if (err) throw res.send({status:'invalid'});
        if(rows.length > 0) {
            // console.log(rows[0].password);
            bcrypt.compare(password, rows[0].password, function (err, ress) {
                if (ress) {
                    res.send({status:'success',userid:rows[0].userid});
                } else {
                    res.send({status:'invalid'});
                    // Passwords don't match
                }
            });
        }else{
            res.send({status:'invalid'});
        }

        // connection.end()
    })


});

/* add dashboard */
router.post('/dashboard', function (req, res, next) {
    var datas = req.body;
    var userid = datas['userid'];
    var name = datas['name'];
    var username = datas['username'];
    var env = datas['env'];
    var dashboard = datas['dashboard'];


    var queryDashboard = squel.insert()
        .into("dashboard")
        .set("userid", userid)
        .set("username", username)
        .set("name", name)
        .set("env", env)
        .set("dashboard", dashboard)
        .toString();

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) throw err

        console.log('dashboard insert successful');
        res.send('dashboard entry successful');
        // connection.end()
    })


});

/* get all dashboard */
router.get('/dashboard', function (req, res, next) {
    var queryDashboard = "select * from dashboard";

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) throw err

        console.log('dashboard get successful');
        res.send(rows);
        // connection.end()
    })

});


/* get dashboard with id*/
router.get('/dashboard/:userid/:env', function (req, res, next) {
    // res.send('respond with dashboard page');
    var userid = req.params.userid;
    var env = req.params.env;

    var queryDashboard = "select name from dashboard where env='"+env+"' and userid="+userid;

    connection.query(queryDashboard, function (err, rows, fields) {

        if (err) throw err

        console.log('dashboard get successful');
        var result = rows.map(data => data.name);
        res.send(result);

        // connection.end()
    })

});


/* get dashboard with id*/
router.get('/dashboard/:userid/:env/:name', function (req, res, next) {
    // res.send('respond with dashboard page');
    var userid = req.params.userid;
    var env = req.params.env;
    var name = req.params.name;

    var queryDashboard = "select dashboard from dashboard where env='"+env+"' and userid="+userid + " and name='"+name+"'";
   console.log(queryDashboard)
    connection.query(queryDashboard, function (err, rows, fields) {

        if (err) throw err

        console.log('dashboard get successful');
        var result = rows.map(data => data.dashboard);
        res.send(result);

        // connection.end()
    })

});





module.exports = router;
