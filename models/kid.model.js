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
  activities: [
    {
      type: mongoose.Types.ObjectId,
      ref: "activity",
      default: [],
    },
  ],
});

const Kid = mongoose.model("kid", kidSchema);
module.exports = Kid;
