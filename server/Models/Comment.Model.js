import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;