const mongoose = require("mongoose");

const kidSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const Kid = mongoose.model("kid", kidSchema);
module.exports = Kid;
