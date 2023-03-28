const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },

  Category: {
    type: String,
    required: true,
  },

  Name: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Shipping: {
    type: Number,
    required: true,
  },
  UnitsSold: {
    type: Number,
    required: true,
  },
});

const PRODUCT_SCHEMA = mongoose.model("PRODUCT", schema);
module.exports = PRODUCT_SCHEMA;
