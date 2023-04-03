const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  LoginCreds: {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  Username: {
    type: String,
    required: true,
  },
  FullName: {
    type: String,
    required: true,
  },

  DOB: {
    type: String,
    required: true,
  },

  City: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});
const USER_SCHEMA = mongoose.model("USER", schema);
module.exports = USER_SCHEMA;
