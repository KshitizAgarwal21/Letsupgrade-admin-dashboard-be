const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },

  Category: {
    type: String,
    required: true,
  },
  ItemsSold: {
    type: Number,
    required: true,
  },
});
const SALES_SCHEMA = mongoose.model("sale", schema);
module.exports = SALES_SCHEMA;
