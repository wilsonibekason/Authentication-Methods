const express = require("express");
const router = express.Router();
const faceapi = require("face-api.js");
const canvas = require("canvas");
const fs = require("fs");
const path = require("path");
const helper_functions = require("../helpers/convert_to_supported_faciial_image_format");
const convertImageFormat = helper_functions.convertToSupportedFacialImageFormat;
const checkImgType = helper_functions.isLocalJpegOrPngUrl;

router.post("/authenticate", async (req, res) => {
  try {
    const { image } = req.body;

    if (checkImgType(image) === false) {
      return convertImageFormat(image);
    }

    // Decode the base64 image string
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");

    // Save the image as a file (for face-api.js processing)
    const imagePath = path.join(__dirname, "temp.jpg");
    fs.writeFileSync(imagePath, binaryData);

    // Load the image and detect faces
    const img = await canvas.loadImage(imagePath);
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Check if any faces were detected
    if (detections.length === 0) {
      return res.status(400).json({ message: "No face detected." });
    }

    // You would typically have a database of known face descriptors
    // and compare the detected face descriptor with them for authentication
    // For simplicity, we'll assume a single known descriptor here
    const knownDescriptor = new faceapi.LabeledFaceDescriptors("user", [
      detections[0].descriptor,
    ]);

    // Authenticate the user by comparing the detected face descriptor with the known descriptor
    const faceMatcher = new faceapi.FaceMatcher(knownDescriptor);
    const match = faceMatcher.findBestMatch(detections[0].descriptor);

    // Define a threshold for authentication (adjust as needed)
    const threshold = 0.6;

    if (match.distance < threshold) {
      return res.json({ authenticated: true });
    } else {
      return res.json({ authenticated: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." + error });
  }
});

module.exports = router;
