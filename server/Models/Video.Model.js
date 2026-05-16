import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    thumbnailUrl: String,
    videoUrl: String,
    category: String,
    views: Number,
    likes: Number,
    dislikes: Number,
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;