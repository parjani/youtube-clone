import Channel from "../Models/Channel.Model.js";
import Video from "../Models/Video.Model.js";



// ================= CREATE CHANNEL =================

export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    // Validation
    if (!channelName) {
      return res.status(400).json({
        success: false,
        message: "Channel name is required",
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

    // Create channel
    const channel = await Channel.create({
      channelName,
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

    const { channelName, description, channelBanner } = req.body;

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

    // Update fields
    channel.channelName = channelName || channel.channelName;

    channel.description = description || channel.description;

    channel.channelBanner =
      channelBanner || channel.channelBanner;

    await channel.save();

    res.status(200).json({
      success: true,
      message: "Channel updated successfully",
      channel,
    });
  } catch (error) {
    res.status(500).json({
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