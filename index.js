const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./db/connectdb");
const path = require("path");
require("dotenv").config();
const canvas = require("canvas");
const faceapi = require("face-api.js");

var bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// Import routes from controllers folder and use them as endpoints on the server (e.g., /api/<controller>)
const authRoutes = require("./routes/auth");
const facialRoutes = require("./routes/facial");
const patternRoutes = require("./routes/pattern");

// Load face-api.js models
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const MODEL_PATH = path.join(__dirname, "models");
faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

const port = process.env.PORT || 3000;

// Middleware for parsing JSON requests should come before defining routes
app.use(express.json());

app.use(cors());
// const corsOptions = { origin: "http://localhost:3001" }; // for development only, remove in production!

app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "", parameterLimit: 1 }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(authRoutes);
app.use("/facial", facialRoutes);
app.use("/pattern", patternRoutes);

// Define your routes and authentication strategies here

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // Connect to MongoDB Atlas using Mongoose
  connectDB()
    .then(() => console.log(`MongoDB Connected`))
    .catch((err) => console.error(`${err}`));
});
