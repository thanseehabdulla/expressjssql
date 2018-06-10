var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var squel = require("squel");
const bcrypt = require('bcrypt');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'invoice'
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

    bcrypt.hash(password, 10, function (err, hash) {
    var queryUser = squel.insert()
        .into("user")
        .set("name", name)
        .set("email", email)
        .set("phone", phone)
        .set("username", username)
        .set("password", hash)
        .set("address", address)
        .toString();

        connection.query(queryUser, function (err, rows, fields) {
            if (err)  res.send({status:'invalid'});

            console.log(rows);

            // Store hash in database
        })

    });

});

/* login authentication */
router.post('/login', function (req, res, next) {
    var datas = req.body;
    var username = datas['username'];
    var password = datas['password'];

    var queryLogin = "select * from user where username='" + username + "'";


    connection.query(queryLogin, function (err, rows, fields) {
        if (err)  res.send({status:'invalid'});
        if(rows.length > 0) {
            // console.log(rows[0].password);
            bcrypt.compare(password, rows[0].password, function (err, ress) {
                if (ress) {
                    res.send({status:'success',userid:rows[0].id,vendername:rows[0].name});
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

/* add purchase */
router.post('/purchase', function (req, res, next) {
    var datas = req.body;
    var userid = datas['userid'];
    var vendername = datas['vendername'];
    var trn_no = datas['trn_no'];
    var invoice_date = datas['date_invoice'];
    var amount = datas['amount'];
    var vat = datas['vat'];
    var total = datas['total'];
    var invoice_number = datas['invoice_number'];

    var queryDashboard = squel.insert()
        .into("purchase")
        .set("vendername", vendername)
        .set("trn_no", trn_no)
        .set("date_invoice", invoice_date)
        .set("amount", amount)
        .set("vat", vat)
        .set("total", total)
        .set("invoice_number", invoice_number)
        .toString();

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid'});

        console.log('purchase insert successful');
        res.send('purchase entry successful');
        // connection.end()
    })


});

/* get all purchase */
router.get('/purchase', function (req, res, next) {
    var queryDashboard = "select * from purchase";

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) throw err

        console.log('purchase get successful');
        res.send(rows);
        // connection.end()
    })

});


/* get dashboard with id*/
router.get('/purchase/:userid/:env', function (req, res, next) {
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
