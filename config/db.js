const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      const connection = await mongoose.connect(process.env.DB_URI);
      console.log("MongoDB Connected:", connection.connection.host); // or other details if needed
    } catch (error) {
      console.log("Error connecting to MongoDB:", error.message);
      process.exit(1);
    }
  };
  
module.exports = connectDB;