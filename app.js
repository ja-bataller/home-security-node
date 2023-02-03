const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const http = require("http");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


dotenv.config({ path: './.env'});

const app = express();
const port = "3001"

// Create MySQL Database
app.get("/createdb",(req, res) => {
    let sql = "CREATE DATABASE home_security";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            console.log("MySQL DB home_security created");
            res.send("MySQL DB home_security created")
        }
    });
});

// Create MySQL User Table
app.get("/createdbtable", (req, res) => {
    let sql = "CREATE TABLE user (id int AUTO_INCREMENT, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), PRIMARY KEY (id))";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            console.log("MySQL DB user Table created");
        }
    });
});

// Create MySQL OTP Table
app.get("/createotp", (req, res) => {
    let sql = "CREATE TABLE otp (id int AUTO_INCREMENT, email VARCHAR(255), otp VARCHAR(255), PRIMARY KEY (id))";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            console.log("MySQL DB otp Table created");
        }
    });
});

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
       console.log(err);
    } else {
        console.log("MySQL DB successfully connected successfully.");
    }
});


// Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(authRoutes);
app.use(userRoutes);

app.listen('3001', () => {
    console.log(`Server is running on port ${port}`);
});

