var express = require("express");
var app = express();
var jwt = require("jsonwebtoken");
var mysalt = "secretkey";
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.listen(8080, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server started successfully");
});

app.post("/login", (req, res) => {
  const loginCredentials = {
    username: "Letsupgrade",
    password: "password@123",
  };
  const userDetails = {
    FullName: "Student Letsupgrade",
    Username: "Letsupgrade",
    DOB: "09001999",
    City: "Bangalore",
    Email: "student@letsupgarde.io",
    Phone: "9999999999",
  };
  const { username, password } = req.body;

  if (username === loginCredentials.username) {
    if (password === loginCredentials.password) {
      var token = jwt.sign(userDetails, mysalt);

      res.status(200).send(token);
    }
  }
});
