import Comment from "../Models/Comment.Model.js";
import Video from "../Models/Video.Model.js";



// ================= ADD COMMENT =================

export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    // Validation
    if (!videoId || !text) {
      return res.status(400).json({
        success: false,
        message: "Video ID and comment text are required",
      });
    }

    // Check video exists
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      text,
      user: req.user.id,
      video: videoId,
    });

    // Populate user details
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "username avatar");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET VIDEO COMMENTS =================

export const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({
      video: videoId,
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalComments: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= UPDATE COMMENT =================

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;

    const { text } = req.body;

    // Find comment
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Ownership check
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Update comment
    comment.text = text || comment.text;

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("user", "username avatar");

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= DELETE COMMENT =================

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Ownership check
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Delete comment
    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};