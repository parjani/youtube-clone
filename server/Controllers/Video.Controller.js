import Video from "../Models/Video.Model.js";
import Channel from "../Models/Channel.Model.js";
import Comment from "../Models/Comment.Model.js";


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

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    let videos = await Video.find(filter)
      .populate("uploader", "username avatar")
      .sort({ createdAt: -1 });

    // IF USER NOT LOGGED IN → LIMIT 5 VIDEOS
    if (!req.user) {
      videos = videos.slice(0, 5);
    }

    // ENRICH DATA
    const enrichedVideos = await Promise.all(
      videos.map(async (video) => {
        const commentsCount = await Comment.countDocuments({
          video: video._id,
        });

        return {
          ...video._doc,

          likesCount: video.likes || 0,
          dislikesCount: video.dislikes || 0,

          commentsCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      totalVideos: enrichedVideos.length,
      videos: enrichedVideos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET SINGLE VIDEO =================


export const getSingleVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id)
      .populate("uploader", "username avatar");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Get comments separately
    const comments = await Comment.find({
      video: id,
    }).populate("user", "username avatar");

    // Increase views
    video.views += 1;

    await video.save();

    res.status(200).json({
      success: true,

      video: {
        ...video._doc,

        comments,
        commentsCount: comments.length,

        likesCount: video.likes || 0,
        dislikesCount: video.dislikes || 0,
      },
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


export const bulkCreateVideos = async (req, res) => {
  try {
    const userId = req.user?.id;

    const bulkVideos = [
      {
        title: "React JS Full Course for Beginners",
        description: "Complete React tutorial from basics to advanced",
        thumbnailUrl: "https://img.youtube.com/vi/Ke90Tje7VS0/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
        category: "Education",
        channel: "CodeWithTech",
        channelId: "channel_101",
        uploader: userId,
      },
      {
        title: "Node.js Crash Course",
        description: "Learn backend development with Node.js",
        thumbnailUrl: "https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
        category: "Programming",
        channel: "Backend Master",
        channelId: "channel_102",
        uploader: userId,
      },
      {
        title: "JavaScript Tips & Tricks",
        description: "Improve your JS skills with pro tips",
        thumbnailUrl: "https://img.youtube.com/vi/2qDywOS7VAc/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=2qDywOS7VAc",
        category: "Programming",
        channel: "JS World",
        channelId: "channel_103",
        uploader: userId,
      },
      {
        title: "MongoDB Explained in 10 Minutes",
        description: "Quick MongoDB crash guide",
        thumbnailUrl: "https://img.youtube.com/vi/pWbMrx5rVBE/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=pWbMrx5rVBE",
        category: "Database",
        channel: "DB Simplified",
        channelId: "channel_104",
        uploader: userId,
      },
      {
        title: "Frontend Developer Roadmap 2026",
        description: "Complete roadmap to become frontend dev",
        thumbnailUrl: "https://img.youtube.com/vi/1Rs2ND1ryYc/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        category: "Career",
        channel: "Tech Career Hub",
        channelId: "channel_105",
        uploader: userId,
      },
    ];

    const createdVideos = await Video.insertMany(bulkVideos);

    return res.status(201).json({
      success: true,
      message: "Bulk videos created successfully",
      videos: createdVideos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};