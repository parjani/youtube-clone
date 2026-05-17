import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./Config/db.js";

import authRoutes from "./Routes/Auth.Route.js";
import channelRoutes from "./Routes/Channel.Route.js";
import commentRoutes from "./Routes/Comment.Route.js";
import videoRoutes from "./Routes/Video.Route.js";

dotenv.config();

const app = express();


// Database Connection
connectDB();


// Middlewares
app.use(cors());

app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/channel", channelRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/videos", videoRoutes);


// Default Route
app.get("/", (req, res) => {
  res.send("YouTube Clone API Running...");
});


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});