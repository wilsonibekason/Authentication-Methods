const request = require("request-promise");
const fs = require("fs");
const Jimp = require("jimp");

// const convertToSupportedFacialImageFormats = (imageURL) => {
//   // Download the image from the URL
//   request({ url: imageURL, encoding: null })
//     .then((imageData) => {
//       // Convert and save the image as JPEG
//       sharp(Buffer.from(imageData))
//         .toFormat("jpeg")
//         .toFile("converted_image.jpg", (err) => {
//           if (err) {
//             console.error("Error converting image:", err);
//           } else {
//             console.log('Image converted and saved as "converted_image.jpg".');
//           }
//         });
//     })
//     .catch((error) => {
//       console.error("Error downloading image:", error);
//     });
// };
const convertToSupportedFacialImageFormat = (imageURL) => {
  // Load the image from the URL
  Jimp.read(imageURL)
    .then((image) => {
      // Convert the image to JPEG and save it
      image.write("converted_image.jpg", () => {
        console.log('Image converted and saved as "converted_image.jpg".');
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

function isLocalJpegOrPngUrl(url) {
  // Get the file extension from the URL
  const fileExtension = url.split(".").pop().toLowerCase();

  // Check if the file extension is 'jpg', 'jpeg', or 'png'
  return ["jpg", "jpeg", "png"].includes(fileExtension);
}

module.exports = {
  convertToSupportedFacialImageFormat: convertToSupportedFacialImageFormat,
  isLocalJpegOrPngUrl: isLocalJpegOrPngUrl,
};
