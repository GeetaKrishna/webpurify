var app = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');

require('dotenv').config()

let jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var verifyToken = require('./verifyToken')

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(cors())

var connection = mysql.createConnection({
    host: process.env.DBHOSTNAME,
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: 'test'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

// To hash a password:
function hashPassword(password, callback) {

    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
            console.log(err)
            callback(err)
        } else {
            callback(hash)
        }
    });
}

//API to register the users to db
app.post("/register", (req, res) => {

    hashPassword(req.body.password, (hashedPassword) => {

        connection.query(`insert into userData (firstname, lastname, phonenumber, email, company, password) values ("${req.body.firstname}", "${req.body.lastname}", "${req.body.Phonenumber}", "${req.body.email}", "${req.body.company}", "${hashedPassword}")`, function (error, results, fields) {
            console.log(error, results)
            if (error) {
                res.status(400).send({
                    message: "Problem with server"
                })
            } else {

                let token = jwt.sign({
                        username: "username"
                    },
                    JSON.stringify(process.env.SECRET), {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );

                res.json({
                    success: true,
                    message: `Registration successful! Use below Bearer token to access the http://localhost:4000/allowOrBlock API`,
                    token: token
                });

            }
        });

    })
})

//API to get allowed/blocked list
app.use("/allowOrBlock", verifyToken.verifyToken, (req, res, next) => {
console.log(req.body)
    connection.query(`select * from blockList where status="${req.body.status}"`, function (error, results, fields) {
        console.log(error, results)
        if (error) {
            res.status(400).send({
                message: "Problem with server"
            })
        } else {
            res.send(results)
        }
    });

})

app.listen(process.env.PORT, () => {
    console.log(`Running at port ${process.env.PORT}`)
})