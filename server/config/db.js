import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const url = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Database is connected");
  } catch (err) {
    console.error("Exit connecting to database:", err);
    process.exit(1);
  }
};

export default connectDB;
