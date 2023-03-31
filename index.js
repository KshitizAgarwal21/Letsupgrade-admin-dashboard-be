var express = require("express");
var app = express();
var jwt = require("jsonwebtoken");
var mysalt = "secretkey";
var cors = require("cors");
const PRODUCT_SCHEMA = require("./Product_schema");
const CONSOLIDATED_SCHEMA = require("./Consolidated_schema");
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());
app.listen(8080, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server started successfully");
});
const dbUrl =
  "mongodb+srv://Kshitiz_Agarwal:FJ9EiIfKDWGb6nzS@cluster0.mkzhm.mongodb.net/Products";
mongoose.set("strictQuery", false);
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
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
    const updatedUser = { ...userDetails };
    updatedUser.avatar = "";
    var updatedToken = jwt.sign(updatedUser, mysalt);
    res
      .status(200)
      .send({ msg: "DP removed successfully", token: updatedToken });
  } else {
    res.status(401).send({ msg: "Unauthorised request" });
  }
});

app.post("/getproducts", async (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  const products = await CONSOLIDATED_SCHEMA.find({
    Username: decoded.Username,
  });
  const prodArray = products.map((elem) => {
    return elem.AssociatedProducts;
  });
  console.log(prodArray);
  res.status(200).send(prodArray);
});

app.post("/filterproductsbycategory", async (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  if (req.body.category == "") {
    const products = await CONSOLIDATED_SCHEMA.find({
      Username: decoded.Username,
    });
    const prodArray = products.map((elem) => {
      return elem.AssociatedProducts;
    });
    res.status(200).send(prodArray);
  } else {
    const products = await CONSOLIDATED_SCHEMA.find({
      Username: decoded.Username,
      "AssociatedProducts.Category": req.body.category,
    });

    const prodArray = products.map((elem) => {
      return elem.AssociatedProducts;
    });
    console.log(prodArray);
    res.status(200).send(prodArray);
  }
});

app.post("/addproduct", async (req, res) => {
  const { Name, Shipping, Category, Quantity, Price } = req.body;
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);
  console.log(decoded);
  const Username = decoded.Username;
  const ID = "LU_07";
  const UnitsSold = 100;

  var newProduct = {
    Username: Username,
    AssociatedProducts: {
      Name: Name,
      ID: ID,
      Category: Category,
      Quantity: Quantity,
      Price: Price,
      Shipping: Shipping,
      UnitsSold: UnitsSold,
    },
  };

  const product = new CONSOLIDATED_SCHEMA(newProduct);
  const stocked = await product.save();
  if (stocked) {
    res.status(200).send({ msg: "Product added successfully" });
  } else {
    res.status(200).send({ msg: "Some error occured" });
  }
});
