import Video from "../Models/Video.Model.js";
import Channel from "../Models/Channel.Model.js";



// ================= CREATE VIDEO =================

export const createVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnailUrl,
      videoUrl,
      category,
    } = req.body;

    // Validation
    if (!title || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: "Title, video URL and thumbnail are required",
      });
    }

    // Find user's channel
    const channel = await Channel.findOne({
      owner: req.user.id,
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Create a channel first",
      });
    }

    // Create video
    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      category,
      uploader: req.user.id,
      views: 0,
      likes: 0,
      dislikes: 0,
    });

    // Add video to channel
    channel.videos.push(video._id);

    await channel.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET ALL VIDEOS =================

export const getAllVideos = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    // Search by title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    const videos = await Video.find(filter)
      .populate("uploader", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalVideos: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET SINGLE VIDEO =================

export const getSingleVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id).populate(
      "uploader",
      "username avatar"
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Increase views
    video.views += 1;

    await video.save();

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= UPDATE VIDEO =================

export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      thumbnailUrl,
      videoUrl,
      category,
    } = req.body;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Ownership check
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Update fields
    video.title = title || video.title;

    video.description =
      description || video.description;

    video.thumbnailUrl =
      thumbnailUrl || video.thumbnailUrl;

    video.videoUrl = videoUrl || video.videoUrl;

    video.category = category || video.category;

    await video.save();

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= DELETE VIDEO =================

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Ownership check
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Remove video from channel
    const channel = await Channel.findOne({
      owner: req.user.id,
    });

    if (channel) {
      channel.videos = channel.videos.filter(
        (videoId) => videoId.toString() !== id
      );

      await channel.save();
    }

    // Delete video
    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= LIKE VIDEO =================

export const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    video.likes += 1;

    await video.save();

    res.status(200).json({
      success: true,
      message: "Video liked",
      likes: video.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= DISLIKE VIDEO =================

export const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    video.dislikes += 1;

    await video.save();

    res.status(200).json({
      success: true,
      message: "Video disliked",
      dislikes: video.dislikes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};