import express from "express";

import {
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  getMyChannel,
  createMyChannelVideo,
  getMyChannelVideos,
  deleteMyChannelVideo,
  updateMyChannelVideo,
} from "../Controllers/Channel.Controller.js";

import authMiddleware from "../Middleware/AuthMiddleware.js";

const router = express.Router();


// Create Channel
router.post("/create", authMiddleware, createChannel);


// Get My Channel
router.get("/my-channel", authMiddleware, getMyChannel);


// Get Single Channel
router.get("/:id", getChannel);


// Update Channel
router.put("/:id", authMiddleware, updateChannel);


// Delete Channel
router.delete("/:id", authMiddleware, deleteChannel);

// Create My Channel Video

router.post("/create-my-channel-video", authMiddleware, createMyChannelVideo)
router.put("/my-channel-video/:videoId", authMiddleware, updateMyChannelVideo)

router.get("/my-channel-video/:channelId", authMiddleware, getMyChannelVideos);

router.delete("/my-channel-video/:id", authMiddleware, deleteMyChannelVideo);
export default router;