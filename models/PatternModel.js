// PatternModel.js
const mongoose = require("mongoose");

const patternSchema = new mongoose.Schema({
  name: String,
  pattern: [Number], // Array of node indices representing the pattern
});

const Pattern = mongoose.model("Pattern", patternSchema);

module.exports = Pattern;
