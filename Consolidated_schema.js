const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },

  AssociatedProducts: {
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
    Picture: {
      type: String,
      required: true,
    },
  },
});
const CONSOLIDATED_SCHEMA = mongoose.model("CONSOLIDATED", schema);
module.exports = CONSOLIDATED_SCHEMA;
