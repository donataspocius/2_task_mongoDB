const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
  activity_name: {
    type: String,
    required: true,
  },
  kids: [
    // {
    //   type: mongoose.Types.ObjectId,
    //   ref: "kid",
    // },
  ],
});

const Activity = mongoose.model("activity", activitySchema);
module.exports = Activity;
