import mongoose from "mongoose";

const channelvideoSchema = new mongoose.Schema(
  {
    channel: String,
    thumbnailUrl: String,
    videoUrl: String,
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ChannelVideo = mongoose.model("ChannelVideo", channelvideoSchema);

export default ChannelVideo;