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
const loginCredentials = {
  username: "Letsupgrade",
  password: "password@123",
};
const userDetails = {
  FullName: "John Lester",
  Username: "Letsupgrade",
  DOB: "09001999",
  City: "Bangalore",
  Email: "student@letsupgarde.io",
  Phone: "9999999999",
  avatar:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPoACnzH9x8JQxfPZg9YCZqTLd6JRRDeYKbH7OFYeQiw&usqp=CAU&ec=48665701",
};
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === loginCredentials.username) {
    if (password === loginCredentials.password) {
      var token = jwt.sign(userDetails, mysalt);

      res.status(200).send(token);
    }
  }
});

app.post("/removedp", (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);
  console.log(decoded);
  if (decoded) {
    userDetails.avatar = "";
    var updatedToken = jwt.sign(userDetails, mysalt);
    res
      .status(200)
      .send({ msg: "DP removed successfully", token: updatedToken });
  } else {
    res.status(401).send({ msg: "Unauthorised request" });
  }
});
