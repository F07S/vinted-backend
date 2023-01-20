const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

// Route to say Hello
app.get("/", (req, res) => {
  res.json("Hello and welcome to my server!");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("The server has started.");
});
