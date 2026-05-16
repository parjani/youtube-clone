import express from "express";

import {
  createVideo,
  getAllVideos,
  getSingleVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from "../Controllers/Video.Controller.js";

import authMiddleware from "../Middleware/AuthMiddleware.js";

const router = express.Router();


// Create Video
router.post("/", authMiddleware, createVideo);


// Get All Videos
router.get("/", getAllVideos);


// Get Single Video
router.get("/:id", getSingleVideo);


// Update Video
router.put("/:id", authMiddleware, updateVideo);


// Delete Video
router.delete("/:id", authMiddleware, deleteVideo);


// Like Video
router.put("/like/:id", authMiddleware, likeVideo);


// Dislike Video
router.put("/dislike/:id", authMiddleware, dislikeVideo);


export default router;