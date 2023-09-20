const express = require("express");
const router = express.Router();
const faceapi = require("face-api.js");
const canvas = require("canvas");
const fs = require("fs");
const path = require("path");
const helper_functions = require("../helpers/convert_to_supported_faciial_image_format");
const convertImageFormat = helper_functions.convertToSupportedFacialImageFormat;
const checkImgType = helper_functions.isLocalJpegOrPngUrl;
const FacialImage = require("../models/Facial");

// ENROLL OR AUTHENTICATE
router.post("/process", async (req, res) => {
  try {
    const { image, userId, action } = req.body;

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

    if (action === "enroll") {
      // Store the face descriptor in the database
      const faceDescriptor = detections[0].descriptor;
      const userImage = new FacialImage({
        userId: userId,
        faceDescriptor: faceDescriptor,
      });
      await userImage.save();
      console.log("Enrollment Successful");
      return res.json({ message: "Enrollment successful." });
    } else if (action === "authenticate") {
      // Fetch known face descriptors from the database based on user ID
      const knownUserImage = await FacialImage.findOne({ userId: userId });

      if (!knownUserImage) {
        return res.status(400).json({ message: "User not enrolled." });
      }

      const knownDescriptor = knownUserImage.faceDescriptor;

      // Authenticate the user by comparing the detected face descriptor with the known descriptor
      const threshold = 0.6;
      const distance = faceapi.euclideanDistance(
        knownDescriptor,
        detections[0].descriptor
      );

      if (distance < threshold) {
        return res.json({ authenticated: true });
      } else {
        return res.json({ authenticated: false });
      }
    } else {
      return res.status(400).json({ message: "Invalid action." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." + error });
  }
});

module.exports = router;
