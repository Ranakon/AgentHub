import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/db.js";

connectDB();
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});