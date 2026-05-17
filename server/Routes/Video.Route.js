import express from "express";

import {
  createVideo,
  getAllVideos,
  getSingleVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  bulkCreateVideos,
} from "../Controllers/Video.Controller.js";

import authMiddleware from "../Middleware/AuthMiddleware.js";

const router = express.Router();


// Create Video
router.post("/", authMiddleware, createVideo);


// Get All Videos
router.get("/all-videos", getAllVideos);


// Get Single Video
router.get("/get-video/:id", getSingleVideo);

router.post("/bulk-create", bulkCreateVideos);


// Update Video
router.put("/:id", authMiddleware, updateVideo);


// Delete Video
router.delete("/:id", authMiddleware, deleteVideo);


// Like Video
router.put("/like/:id",  likeVideo);


// Dislike Video
router.put("/dislike/:id",  dislikeVideo);


export default router;