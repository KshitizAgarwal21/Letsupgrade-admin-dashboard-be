var express = require("express");
var app = express();
var jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
var mysalt = "secretkey";
var cors = require("cors");
const PRODUCT_SCHEMA = require("./Product_schema");
const CONSOLIDATED_SCHEMA = require("./Consolidated_schema");
const mongoose = require("mongoose");
const USER_SCHEMA = require("./User_Schema");
app.use(cors());
app.use(express.json());
app.listen(8080, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server started successfully");
});

app.set("view engine", "ejs");
app.set("view", path.join(__dirname, "/views"));
// app.use(express.static(`${__dirname}/public`));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
        "following filetypes - " +
        filetypes
    );
  },

  // mypic is the name of file attribute
}).single("mypic");

app.post("/upload", (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send({ msg: "file uploaded successfully" });
    }
  });
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

app.post("/createuser", async (req, res) => {
  var user = {
    LoginCreds: {
      username: "Letsupgrade",
      password: "password@123",
    },
    FullName: "John Lester",
    Username: "Letsupgrade",
    DOB: "09001999",
    City: "Bangalore",
    Email: "student@letsupgarde.io",
    Phone: "9999999999",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPoACnzH9x8JQxfPZg9YCZqTLd6JRRDeYKbH7OFYeQiw&usqp=CAU&ec=48665701",
  };

  var newUser = new USER_SCHEMA(user);

  const added = await newUser.save();
  if (added) {
    console.log(added);
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userexist = await USER_SCHEMA.findOne({ Username: username });
  if (userexist) {
    if (userexist.LoginCreds.password === password) {
      var token = jwt.sign(userexist, mysalt);
      res.status(200).send(token);
    } else {
      res.status(200).send({ msg: "Invalid credentials" });
    }
    // if (getpassword) {
    //   // console.log(getpassword.schema);
    //   // var token = jwt.sign(getpassword, mysalt);
    //   // res.status(200).send(token);
    // }
  }
  // if (username === loginCredentials.username) {
  //   if (password === loginCredentials.password) {
  //     var token = jwt.sign(userDetails, mysalt);

  //     res.status(200).send(token);
  //   }
  // }
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

  const Username = decoded.Username;
  const getIdVal = await CONSOLIDATED_SCHEMA.find({ Username: Username });
  var lastElem = getIdVal.length - 1;
  var ID = getIdVal[lastElem].AssociatedProducts.ID;
  ID = parseInt(ID.substring(3)) + 1;
  ID = "LU_" + ID;

  var newProduct = {
    Username: Username,
    AssociatedProducts: {
      Name: Name,
      ID: ID,
      Category: Category,
      Quantity: Quantity,
      Price: Price,
      Shipping: Shipping,
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
