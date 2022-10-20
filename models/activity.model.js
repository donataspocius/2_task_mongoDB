const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
  activity_name: {
    type: String,
    required: true,
  },
  kids: {
    type: Array,
    required: true,
    default: [],
  },
});

const Activity = mongoose.model("activity", activitySchema);
module.exports = Activity;
