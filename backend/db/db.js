import mongoose from "mongoose";

async function connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.error(error.message);
    }
} 
export default connectDB;