import express from "express";

import {
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  getMyChannel,
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


export default router;