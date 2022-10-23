const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Kid = require("./models/kid.model");
const Activity = require("./models/activity.model");

dotenv.config(); // access to .env file
const app = express();

const PORT = process.env.PORT | 5000;

// Middlewares
app.use(express.json());

// Connect to DB
mongoose
  .connect(process.env.MONGO_DB)
  .then(console.log("Connected to MongoDB - schoolDB"))
  .catch((err) => console.log(err));

// KID ROUTES
// GET /kids -> get all kids data
app.get("/kids", async (req, res) => {
  let kids;
  if (req.query.limit) {
    kids = await Kid.find()
      .populate("activities", "activity_name")
      .limit(req.query.limit);
  } else {
    kids = await Kid.find().populate("activities", "activity_name");
  }
  res.json(kids);
});

// GET kids by id
app.get("/kids/:id", async (req, res) => {
  const id = req.params.id;

  if (id.length !== 24) {
    return res.status(404).json({ message: `No kid with id ${id}` });
  }

  console.log();
  try {
    const kid = await Kid.findById(id).populate("activities", "activity_name");
    res.status(200).json(kid);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// POST /kids --> create a kid
app.post("/kids", async (req, res) => {
  try {
    const isDataValid = new Kid(req.body);
    const savedKidData = await isDataValid.save();

    res.status(201).json(savedKidData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// PUT update kid by id
app.put("/kids/:id", async (req, res) => {
  const id = req.params.id;
  const kidUpdateInfo = req.body;

  try {
    await Kid.findByIdAndUpdate(id, kidUpdateInfo);
    const updatedKid = await Kid.findById(id);

    res.status(200).json(updatedKid);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// DELETE kid by id
app.delete("/kids/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Kid.findByIdAndDelete(id);
    res.status(200).json({ message: `id ${id} data deleted successfuly` });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// ACTIVITES ROUTS
// GET all /activities
app.get("/activities", async (req, res) => {
  const allActivities = await Activity.find().populate("kids", "name surname");

  res.status(200).json(allActivities);
});

// POST --> create /activities
app.post("/activities", async (req, res) => {
  try {
    const isActivityValid = new Activity(req.body);
    const savedActivity = await isActivityValid.save();

    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(404).json({ message: `Error creating activity: ${error}` });
  }
});

// PUT --> update activity by id
app.put("/activities/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  if (id.length !== 24) {
    return res.status(404).json({ message: `No activity with id ${id}` });
  }

  try {
    const activity = await Activity.findByIdAndUpdate(id, updateData).populate(
      "kids",
      "name surname"
    );
    res.status(200).json(activity);
  } catch (error) {
    res.status(404).json({ message: `Error updating activity: ${error}` });
  }
});

// DELETE activity by id
app.delete("/activities/:id", async (req, res) => {
  const id = req.params.id;

  if (id.length !== 24) {
    return res.status(404).json({ message: `No activity with id ${id}` });
  }

  try {
    const testDeleted = await Activity.findByIdAndDelete(id);
    if (testDeleted) {
      res.status(200).json({ message: `Activity successfully deleted` });
    } else {
      return res.status(404).json({ message: `No activity with id ${id}` });
    }
  } catch (error) {
    res.status(404).json({ message: `Error deleting activity: ${error}` });
  }
});

// TWO COLLECTIONS ROUTES
// POST add kid to activity
app.post("/activities/kid", async (req, res) => {
  try {
    const activityId = req.body.activityId;
    const kidId = req.body.kidId;
    const kid = await Kid.findById(kidId);
    const activity = await Activity.findById(activityId);
    const kidActivitiesArray = kid.activities;
    const activityKidsArray = activity.kids;

    if (!kidActivitiesArray.includes(activityId)) {
      kidActivitiesArray.push(activityId);
      kid.save();
      activityKidsArray.push(kidId);
      activity.save();

      res.json({ message: "successfully added kid to activity" });
    } else {
      res.json({ message: "Kid already listed in this activity" });
    }
  } catch (error) {
    res.status(404).json({ message: `Error adding kid to activity: ${error}` });
  }
});

app.delete("/activities/kid/:id", async (req, res) => {
  const id = req.params.id;
  const activityId = req.body.activityId;

  try {
    const activities = await Activity.findById(activityId);
    const index = activities.kids.indexOf(id);

    if (index !== -1) {
      activities.kids.splice(index, 1);
      activities.save();
    } else {
      res.json({ message: "No such kid in this activity" });
    }
  } catch (error) {
    res
      .status(404)
      .json({ message: `Error deleting kid from activity: ${error}` });
  }
});

// create server
app.listen(PORT, () => console.log("Server is running on port: " + PORT));
