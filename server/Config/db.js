import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/youtubeclone");

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;