import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import VideoCard from "../Components/VideoCard";

import {
  ThumbsUp,
  ThumbsDown,
  Send,
} from "lucide-react";

function VideoPlayer() {
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [video, setVideo] = useState(null);

  const [videos, setVideos] = useState([]);

  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] =
    useState("");

  const token = localStorage.getItem("token");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ================= FETCH SINGLE VIDEO =================

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/videos/${id}`
      );

      setVideo(response.data.video);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH ALL VIDEOS =================

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/videos"
      );

      setVideos(response.data.videos);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH COMMENTS =================

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/${id}`
      );

      setComments(response.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= ADD COMMENT =================

  const addComment = async () => {
    try {
      if (!commentText.trim()) return;

      await axios.post(
        "http://localhost:5000/api/comments",
        {
          videoId: id,
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText("");

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= LIKE VIDEO =================

  const likeVideo = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/videos/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchVideo();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DISLIKE VIDEO =================

  const dislikeVideo = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/videos/dislike/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchVideo();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVideo();

    fetchVideos();

    fetchComments();
  }, [id]);

  if (!video) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <h1 className="text-white text-2xl">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* HEADER */}
      <Header toggleSidebar={toggleSidebar} />

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* MAIN */}
      <div
        className={`
          pt-20 px-5 transition-all duration-300
          ${sidebarOpen ? "ml-60" : "ml-20"}
        `}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2">
            {/* VIDEO */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900">
              <video
                src={video.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>

            {/* TITLE */}
            <h1 className="text-white text-2xl font-bold mt-5">
              {video.title}
            </h1>

            {/* VIDEO INFO */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-5 border-b border-zinc-800 pb-6">
              {/* CHANNEL INFO */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    video?.uploader?.avatar ||
                    "https://i.pravatar.cc/150?img=3"
                  }
                  alt="channel"
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h2 className="text-white font-semibold">
                    {video?.uploader?.username}
                  </h2>

                  <p className="text-zinc-400 text-sm">
                    {video.views} views
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-4">
                <button
                  onClick={likeVideo}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition text-white px-5 py-3 rounded-full"
                >
                  <ThumbsUp className="w-5 h-5" />

                  {video.likes}
                </button>

                <button
                  onClick={dislikeVideo}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition text-white px-5 py-3 rounded-full"
                >
                  <ThumbsDown className="w-5 h-5" />

                  {video.dislikes}
                </button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-zinc-900 rounded-2xl p-5 mt-5">
              <h2 className="text-white font-semibold mb-3">
                Description
              </h2>

              <p className="text-zinc-300 leading-7">
                {video.description}
              </p>
            </div>

            {/* COMMENTS */}
            <div className="mt-8">
              <h2 className="text-white text-2xl font-bold mb-5">
                {comments.length} Comments
              </h2>

              {/* ADD COMMENT */}
              <div className="flex gap-3 mb-8">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(e.target.value)
                  }
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-white outline-none focus:border-red-500"
                />

                <button
                  onClick={addComment}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-5 rounded-full"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* COMMENT LIST */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-4"
                  >
                    <img
                      src={
                        comment?.user?.avatar ||
                        "https://i.pravatar.cc/150?img=5"
                      }
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="text-white font-semibold">
                        {comment?.user?.username}
                      </h3>

                      <p className="text-zinc-300 mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div>
            <h2 className="text-white text-xl font-bold mb-5">
              Recommended Videos
            </h2>

            <div className="space-y-6">
              {videos
                .filter((item) => item._id !== id)
                .map((video) => (
                  <VideoCard
                    key={video._id}
                    video={video}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;