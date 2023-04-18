var express = require("express");
var app = express();
var jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
var mysalt = "secretkey";
var cors = require("cors");
const SALES_SCHEMA = require("./Category_Sales");
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

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../admin-dashboard/public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + Date.now() + `.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "pdf" ||
    file.mimetype.split("/")[1] === "jpg" ||
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File is not a pdf"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("myFile");

app.post("/upload", (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  upload(req, res, async function (err) {
    const uploadedFile = await USER_SCHEMA.findOneAndUpdate(
      { Username: decoded.userexist.Username },
      { avatar: req.file.filename }
    );

    if (err) {
      console.log(err);
    } else {
      if (uploadedFile) {
        res.status(200).send({ msg: "file uploaded successfully" });
      } else {
        console.log("some issue");
      }
    }
  });
});

app.post("/uploadprodimages", (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  upload(req, res, async function (err) {
    console.log(req.file);
    console.log(req.body.ID);
    const uploadedFile = await CONSOLIDATED_SCHEMA.findOneAndUpdate(
      {
        Username: decoded.userexist.Username,
        "AssociatedProducts.ID": req.body.ID,
      },
      { "AssociatedProducts.Picture": req.file.filename }
    );

    if (err) {
      console.log(err);
    } else {
      if (uploadedFile) {
        res.status(200).send({ msg: "file uploaded successfully" });
      } else {
        console.log("some issue");
      }
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
      var token = jwt.sign({ userexist }, mysalt);
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

app.post("/removedp", async (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  if (decoded) {
    const removeDp = await USER_SCHEMA.findOneAndUpdate(
      {
        Username: decoded.userexist.Username,
      },
      { avatar: "" }
    );
    const userexist = await USER_SCHEMA.findOne({
      Username: decoded.userexist.Username,
    });
    if (removeDp) {
      var token = jwt.sign({ userexist }, mysalt);
      res.status(200).send({ msg: "Dp removed successfully", token: token });
    }
  } else {
    res.status(401).send({ msg: "Unauthorised request" });
  }
});

app.post("/getproducts", async (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  const products = await CONSOLIDATED_SCHEMA.find({
    Username: decoded.userexist.Username,
  });
  const prodArray = products.map((elem) => {
    return elem.AssociatedProducts;
  });

  res.status(200).send(prodArray);
});

app.post("/filterproductsbycategory", async (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  if (req.body.category == "") {
    const products = await CONSOLIDATED_SCHEMA.find({
      Username: decoded.userexist.Username,
    });
    const prodArray = products.map((elem) => {
      return elem.AssociatedProducts;
    });
    res.status(200).send(prodArray);
  } else {
    const products = await CONSOLIDATED_SCHEMA.find({
      Username: decoded.userexist.Username,
      "AssociatedProducts.Category": req.body.category,
    });

    const prodArray = products.map((elem) => {
      return elem.AssociatedProducts;
    });

    res.status(200).send(prodArray);
  }
});

app.post("/addproduct", async (req, res) => {
  const { Name, Shipping, Category, Quantity, Price } = req.body;
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  const Username = decoded.userexist.Username;
  const getIdVal = await CONSOLIDATED_SCHEMA.find({ Username: Username });
  console.log(getIdVal);
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
      Picture: " ",
    },
  };

  const product = new CONSOLIDATED_SCHEMA(newProduct);
  const stocked = await product.save();
  if (stocked) {
    res.status(200).send({ msg: "Product added successfully", ID: ID });
  } else {
    res.status(200).send({ msg: "Some error occured" });
  }
});

app.post("/getsales", async (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mysalt);

  const Username = decoded.userexist.Username;
  const sales = await SALES_SCHEMA.find({ Username: Username });
  if (sales) {
    res.status(200).send(sales);
  }
  console.log(sales);
});
