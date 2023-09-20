const express = require("express");
const router = express.Router();
const Pattern = require("../models/PatternModel");

// Create a new predefined pattern
router.post("/patterns", async (req, res) => {
  try {
    const { name, pattern } = req.body;
    const newPattern = new Pattern({ name, pattern });
    await newPattern.save();
    res.json(newPattern);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all predefined patterns
router.get("/patterns", async (req, res) => {
  try {
    const patterns = await Pattern.find();
    res.json(patterns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Implement pattern matching logic
router.post("/match-pattern", async (req, res) => {
  try {
    const userPattern = req.body.pattern; // User-drawn pattern
    const predefinedPatterns = await Pattern.find();

    const isPatternMatched = predefinedPatterns.some((predefinedPattern) => {
      return (
        JSON.stringify(userPattern.sort()) ===
        JSON.stringify(predefinedPattern.pattern.sort())
      );
    });

    res.json({ isPatternMatched });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Server error : ${error}` });
  }
});

module.exports = router;
