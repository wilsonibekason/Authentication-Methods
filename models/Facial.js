const mongoose = require("mongoose");

const facialImageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  image: { type: String, required: true }, // Base64-encoded image
});

const FacialImage = mongoose.model("FacialImage", facialImageSchema);

module.exports = FacialImage;
