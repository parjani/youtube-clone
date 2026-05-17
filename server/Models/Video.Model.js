import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    commentId: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const videoSchema = new mongoose.Schema(
  {
    videoId: String,

    title: String,
    description: String,

    thumbnailUrl: String,
    videoUrl: String,

    category: String,

    channel: String,

    channelId: String,

    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    dislikes: {
      type: Number,
      default: 0,
    },

    comments: [commentSchema],

    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;