const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const secretkey = process.env.SECRET_KEY

// CREATE JSON WEB TOKEN (JWT)
const expiry_age = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: expiry_age,
    }
  );
};


exports.verify = (req, res) => {
    const token = req.body.jwt
    if (!token) {
      res.sendStatus(401)
    }
  
    try {
      console.log(token);
      const decoded = jwt.verify(token, secretkey);
      console.log(decoded);
      res.sendStatus(200)
    } catch (error) {
      console.log("error");
      res.sendStatus(401)
    }
  };

exports.signup = (req, res) => {
  console.log(req.body);

  // Destructure request body from front-end
  const first_name = req.body.firstName;
  const last_name = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirmPassword;

  db.query("SELECT email FROM user WHERE email = ?", [email], async (error, results) => {
    if (error) {
      return console.log(error);
    }

    if (results.length > 0) {
      return res.send(JSON.stringify({ status: 400, error: null, message: "The Email is already in use." }));
    }

    if (password !== confirm_password) {
      return res.send(JSON.stringify({ status: 400, error: null, message: "Password and Confirm Password doesn't match." }));
    }

    let hashedPassword = await bcrypt.hash(password, 8);

    db.query("INSERT INTO user SET ?", { first_name: first_name, last_name: last_name, email: email, password: hashedPassword }, (error, results) => {
      if (error) {
        return console.log(error);
      } else {
        const token = createToken(results.id);
        // res.setHeader('Set-Cookie', 'jwt', token, {httpOnly: true, maxAge: expiry_age * 1000});
        res.send(JSON.stringify({ status: 200, error: null, token: token, message: "Your account has been created. Please login." }));
      }
    });
  });
};

exports.login = (req, res) => {
    console.log(req.body);
  
    // Destructure request body from front-end
    const email = req.body.email;
    const password = req.body.password;
  
    db.query("SELECT email FROM user WHERE email = ?", [email], async (error, results) => {
      if (error) {
        return console.log(error);
      }
  
      if (results.length === 0) {
        return res.send(JSON.stringify({ status: 400, error: null, message: "The Email is not yet registered." }));
      }
  
      const auth = await bcrypt.compare(password, results.password);

      if (auth) {
        const token = createToken(results.id);
        res.send(JSON.stringify({ status: 200, error: null, token: token, message: "Login successfully." }));
      }
  
    });
}
