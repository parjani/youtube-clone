import express from "express";

import {
  addComment,
  getVideoComments,
  updateComment,
  deleteComment,
} from "../Controllers/Comment.Controller.js";

import authMiddleware from "../Middleware/AuthMiddleware.js";

const router = express.Router();


// Add Comment
router.post("/", authMiddleware, addComment);


// Get Comments Of Video
router.get("/:videoId", getVideoComments);


// Update Comment
router.put("/:id", authMiddleware, updateComment);


// Delete Comment
router.delete("/:id", authMiddleware, deleteComment);


export default router;