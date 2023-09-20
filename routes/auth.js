const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password (You should use bcrypt or another secure method)
    const hashedPassword = password; // Replace with password hashing

    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Verify the password (You should use bcrypt or another secure method)
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate an access token
    const accessToken = jwt.sign(
      { username: user.username },
      "your-secret-key",
      {
        expiresIn: "15m", // Access token expires in 15 minutes
      }
    );

    // Generate a refresh token (Store this securely, like in a database)
    const refreshToken = jwt.sign(
      { username: user.username },
      "your-refresh-secret-key"
    );

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/refresh-token", (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    // Verify the refresh token (You should use the same secret key as in login)
    const decoded = jwt.verify(refreshToken, "your-refresh-secret-key");

    // Generate a new access token
    const accessToken = jwt.sign(
      { username: decoded.username },
      "your-secret-key",
      {
        expiresIn: "15m", // Access token expires in 15 minutes
      }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
