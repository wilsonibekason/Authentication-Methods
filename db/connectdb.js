const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // const uri = process.env.MONGODB_COMPASS_CONNECTION_STRING; // Check if your environment variable is named correctly
    const uri =
      "mongodb+srv://wilsonibekason:unn_project_db@unncluster.d51mn5j.mongodb.net/";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other mongoose options, if needed
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit the application if there's a connection error
  }
};

module.exports = connectDB;
