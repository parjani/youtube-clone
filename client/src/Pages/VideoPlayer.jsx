import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import VideoCard from "../Components/VideoCard";
import { Link } from "react-router-dom";
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
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

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
        `http://localhost:5000/api/videos/get-video/${id}`
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
        "http://localhost:5000/api/videos/all-videos"
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
      // 1. check login
      if (!token) {
        setShowLoginModal(true);
        return;
      }

      // 2. check empty comment
      if (!commentText.trim()) {
        alert("Comment cannot be empty");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/comments",
        {
          videoId: id,
          text: commentText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText("");
      fetchComments();
      fetchVideo()
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
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
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
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
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

  const getYouTubeId = (url) => {
    return url.split("v=")[1];
  };

  const handleEdit = (comment) => {
    setEditId(comment._id);
    setEditText(comment.text);
  };

  const updateComment = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/comments/${editId}`,
        { text: editText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditId(null);
      setEditText("");
      fetchComments();
      fetchVideo()
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComments();
      fetchVideo()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* HEADER */}
      {/* <Header toggleSidebar={toggleSidebar} /> */}

      {/* SIDEBAR */}
      {/* <Sidebar sidebarOpen={sidebarOpen} /> */}

      {/* MAIN */}
      <div
        className={`
          pt-20 px-5 transition-all duration-300
          ${sidebarOpen ? "ml-4" : "ml-20"}
        `}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2">
            {/* VIDEO */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeId(video.videoUrl)}`}
                allowFullScreen
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
                {video.commentsCount} Comments
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
                  className="bg-red-600 hover:bg-red-700 transition text-white px-5 rounded-full cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* COMMENT LIST */}
              {editId && (
                <div className="flex gap-3 mb-5">

                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-white"
                  />

                  <button
                    onClick={updateComment}
                    className="bg-green-600 px-4 rounded-full text-white"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditId(null)}
                    className="bg-zinc-700 px-4 rounded-full text-white"
                  >
                    Cancel
                  </button>

                </div>
              )}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex gap-4">

                    {/* USER AVATAR */}
                    <img
                      src={
                        comment?.user?.avatar ||
                        "https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg"
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    {/* COMMENT BODY */}
                    <div className="flex-1">

                      {/* NAME + TIME */}
                      <div className="flex items-center justify-between">

                        <h3 className="text-white font-semibold">
                          {comment?.user?.username || "User"}
                        </h3>

                        <span className="text-xs text-zinc-500">
                          {new Date(comment.createdAt).toDateString()}
                        </span>
                      </div>

                      {/* TEXT */}
                      <p className="text-zinc-300 mt-1">
                        {comment.text}
                      </p>

                      {/* ACTIONS */}
                      <div className="flex gap-3 mt-2">

                        {/* EDIT */}
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Delete
                        </button>

                      </div>
                    </div>

                  </div>
                ))}
                <br />
              </div>

            </div>
          </div>

          {/* RIGHT SECTION */}
          <div>
            <h2 className="text-white text-xl font-bold mb-5">
              Recommended Videos
            </h2>

            <div className="space-y-4">
              {videos
                .filter((item) => item._id !== id)
                .map((video) => (
                  <Link
                    to={`/video/${video._id}`}
                    key={video._id}
                    className="flex gap-3 bg-zinc-900 p-2 rounded-lg hover:bg-zinc-800 transition"
                  >
                    {/* THUMBNAIL */}
                    <img
                      src={video.thumbnailUrl}
                      className="w-32 h-20 object-cover rounded-md"
                    />

                    {/* INFO */}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-white text-sm line-clamp-2">
                        {video.title}
                      </h3>

                      <p className="text-xs text-zinc-400 mt-1">
                        {video?.uploader?.username || "Unknown Channel"}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                        <span>👍 {video.likes || 0}</span>
                        <span>👎 {video.dislikes || 0}</span>
                        <span>💬 {video.comments?.length || 0}</span>
                        <span>👁 {video.views || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl w-[300px] text-center">

            <h2 className="text-white text-lg font-bold mb-3">
              Login Required
            </h2>

            <p className="text-zinc-400 text-sm mb-5">
              Please login to add a comment.
            </p>

            <button
              onClick={() => setShowLoginModal(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full"
            >
              OK
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;