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
    kids = await Kid.find().limit(req.query.limit);
  } else {
    kids = await Kid.find();
  }
  res.json(kids);
});

// GET kids by id
app.get("/kids/:id", async (req, res) => {
  const id = req.params.id;

  if (id.length !== 24) {
    return res.status(404).json({ message: `No kid with id ${id}` });
  }

  try {
    const kid = await Kid.findById(id);
    res.status(200).json(kid);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// POST /kids --> add kid
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

// create server
app.listen(PORT, () => console.log("Server is running on port: " + PORT));
