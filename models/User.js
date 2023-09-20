const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  // Add fields for biometric and other authentication data as needed
});

const User = mongoose.model("User", userSchema);

module.exports = User;
