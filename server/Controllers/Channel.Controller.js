import Channel from "../Models/Channel.Model.js";
import Video from "../Models/Video.Model.js";
import ChannelVideo from "../Models/Channel.Video.js";



// ================= CREATE CHANNEL =================

export const createChannel = async (req, res) => {
  try {
    const {
  channelName,
  handleName,
  description,
  channelBanner,
} = req.body;

    // Validation
    if (!channelName || !handleName) {
  return res.status(400).json({
    success: false,
    message: "Channel name and handle name are required",
  });
}



    // Check existing channel for same user
    const existingChannel = await Channel.findOne({
      owner: req.user.id,
    });

    if (existingChannel) {
      return res.status(400).json({
        success: false,
        message: "User already has a channel",
      });
    }


    const existingHandle = await Channel.findOne({
  handleName,
});

if (existingHandle) {
  return res.status(400).json({
    success: false,
    message: "Handle name already exists",
  });
}
    // Create channel
    const channel = await Channel.create({
  channelName,
  handleName,
  description,
  channelBanner,
  owner: req.user.id,
});

    res.status(201).json({
      success: true,
      message: "Channel created successfully",
      channel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET SINGLE CHANNEL =================

export const getChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id)
      .populate("owner", "username email avatar")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    res.status(200).json({
      success: true,
      channel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= UPDATE CHANNEL =================

export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      channelName,
      handleName,
      description,
      channelBanner,
    } = req.body;

    // Find channel
    const channel = await Channel.findById(id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Check ownership
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Update fields (aligned with frontend)
    channel.channelName = channelName ?? channel.channelName;
    channel.handleName = handleName ?? channel.handleName;
    channel.description = description ?? channel.description;
    channel.channelBanner = channelBanner ?? channel.channelBanner;

    await channel.save();

    return res.status(200).json({
      success: true,
      message: "Channel updated successfully",
      channel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= DELETE CHANNEL =================

export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Ownership check
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Delete videos belonging to channel
    await Video.deleteMany({
      _id: { $in: channel.videos },
    });

    // Delete channel
    await channel.deleteOne();

    res.status(200).json({
      success: true,
      message: "Channel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET MY CHANNEL =================

export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      owner: req.user.id,
    })
      .populate("owner", "username email avatar")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "No channel found",
      });
    }

    res.status(200).json({
      success: true,
      channel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const createMyChannelVideo = async (req, res) => {
  try {
    const { channelId, thumbnailUrl, videoUrl } = req.body;

    if (!channelId || !thumbnailUrl || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const video = await ChannelVideo.create({
      channel: channelId,
      thumbnailUrl,
      videoUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateMyChannelVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { thumbnailUrl, videoUrl } = req.body;

    const video = await ChannelVideo.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }



    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (videoUrl) video.videoUrl = videoUrl;

    const updatedVideo = await video.save();

    return res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(400).json({
        success: false,
        message: "Channel ID is required",
      });
    }

    const videos = await ChannelVideo.find({
      channel: channelId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteMyChannelVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await ChannelVideo.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    await video.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};