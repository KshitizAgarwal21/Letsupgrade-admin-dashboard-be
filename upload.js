var express = require("express");
var app = express();
const multer = require("multer");
var maxSize = 1 * 1000 * 1000;
app.listen(8081, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server started successfully");
});
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + Date.now() + `.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "pdf" ||
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File is not of supported format"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: maxSize },
}).single("myFile");

app.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    console.log(req.file);
    if (err) {
      console.log(err);
    } else {
      res.status(200).send({ msg: "file uploaded successfully" });
    }
  });
});
