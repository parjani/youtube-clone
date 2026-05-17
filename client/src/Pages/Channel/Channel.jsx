import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  X,
} from "lucide-react";
import axios from "axios";
import { Play } from "lucide-react";

function ChannelPage() {

  // ================= USER DATA =================
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const channel = user?.channel;
  const [errors, setErrors] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  // =======  ========== STATES =================

  const [openModal, setOpenModal] =
    useState(false);

  const [openCustomizeModal, setOpenCustomizeModal] =
    useState(false);

  // ================= VIDEO FORM =================

  const [formData, setFormData] = useState({
    thumbnailUrl: "",
    videoUrl: "",
  });

  // ================= CHANNEL DATA =================

  const [channelData, setChannelData] =
    useState({
      channelName:
        channel?.channelName || "",

      handleName:
        channel?.handleName || "",

      description:
        channel?.description || "",

      channelBanner:
        channel?.channelBanner || "",
    });

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= VIDEO SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const channelId = user?.channel?._id;

      const payload = {
        channelId,
        thumbnailUrl: formData.thumbnailUrl,
        videoUrl: formData.videoUrl,
      };

      const response = await axios.post(
        "http://localhost:5000/api/channel/create-my-channel-video",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Video Uploaded");

      setOpenModal(false);

      setFormData({
        thumbnailUrl: "",
        videoUrl: "",
      });
      fetchVideos()
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Failed to upload video"
      );
      fetchVideos()
    } finally {
      setLoading(false);
    }
  };

  const validateChannel = () => {
    const newErrors = {};

    if (!channelData.channelName.trim()) {
      newErrors.channelName = "Channel name is required";
    }

    if (!channelData.handleName.trim()) {
      newErrors.handleName = "Handle name is required";
    }

    if (!channelData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!channelData.channelBanner.trim()) {
      newErrors.channelBanner = "Channel banner is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateChannel = async () => {
    try {
      if (!validateChannel()) return;

      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        channelName: channelData.channelName,
        handleName: channelData.handleName,
        description: channelData.description,
        channelBanner: channelData.channelBanner,
      };

      const channelId = user?.channel?._id;

      const response = await axios.put(
        `http://localhost:5000/api/channel/${channelId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const oldUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...oldUser,
        channel: response.data.channel,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setChannelData(response.data.channel);
      setErrors({});

      setOpenCustomizeModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const channelId = user?.channel?._id;

      const response = await axios.get(
        `http://localhost:5000/api/channel/my-channel-video/${channelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideos(response.data.videos);
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async (videoId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/channel/my-channel-video/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // remove from UI instantly
      setVideos((prev) =>
        prev.filter((v) => v._id !== videoId)
      );

      alert("Video deleted");
      fetchVideos()
    } catch (error) {
      console.log(error);
      alert("Failed to delete video");
      fetchVideos()
    }
  };

  const getYouTubeId = (url) => {
    const regExp =
      /(?:youtube\.com.*(?:\\?|&)v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleEditClick = (video) => {
    setSelectedVideo(video);
    setFormData({
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
    });
    setOpenEditModal(true);
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        thumbnailUrl: formData.thumbnailUrl,
        videoUrl: formData.videoUrl,
      };

      const response = await axios.put(
        `http://localhost:5000/api/channel/my-channel-video/${selectedVideo._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // update UI instantly
      setVideos((prev) =>
        prev.map((v) =>
          v._id === selectedVideo._id ? response.data.video : v
        )
      );

      alert("Video updated successfully");

      setOpenEditModal(false);
      setSelectedVideo(null);
      setFormData({ thumbnailUrl: "", videoUrl: "" });
    } catch (error) {
      console.log(error);
      alert("Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* MAIN CONTENT */}
      <div className="ml-20 pt-24 px-8">

        {/* CHANNEL INFO */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* CHANNEL IMAGE */}
          <img
            src={
              channelData.channelBanner ||
              "https://i.pravatar.cc/300?img=12"
            }
            alt="channel"
            className="w-32 h-32 rounded-full object-cover border-2 border-zinc-700"
          />

          {/* DETAILS */}
          <div>

            {/* CHANNEL NAME */}
            <h1 className="text-3xl font-bold">
              {channelData.channelName}
            </h1>

            {/* HANDLE */}
            <div className="flex items-center gap-2 mt-2 text-zinc-400 text-sm">
              <span>
                @{channelData.handleName}
              </span>

              <span>•</span>


            </div>

            {/* DESCRIPTION */}
            <p className="mt-4 text-zinc-400 text-sm max-w-2xl leading-6">
              {channelData.description}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3 mt-5">

              {/* CUSTOMIZE */}
              <button
                onClick={() =>
                  setOpenCustomizeModal(true)
                }
                className="
                  px-5 py-2 rounded-full
                  bg-zinc-800 hover:bg-zinc-700
                  transition text-sm font-medium
                "
              >
                Customise channel
              </button>

              {/* CREATE */}
              <button
                onClick={() =>
                  setOpenModal(true)
                }
                className="
                  flex items-center gap-2
                  px-5 py-2 rounded-full
                  bg-white text-black
                  hover:bg-zinc-200
                  transition text-sm font-medium
                "
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-8 mt-10 border-b border-zinc-800">

          <button className="pb-4 border-b-2 border-white text-sm font-medium">
            Videos
          </button>

        </div>

        {/* EMPTY CONTENT */}
        {/* ================= VIDEOS LIST ================= */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {videos.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">

              <h2 className="text-xl font-semibold text-white">
                No videos yet
              </h2>

              <p className="text-zinc-400 mt-2 text-sm">
                Create your first video to get started
              </p>

              <button
                onClick={() => setOpenModal(true)}
                className="mt-5 px-6 py-2 bg-white text-black rounded-full hover:bg-zinc-200 transition"
              >
                Create New Video
              </button>

            </div>
          ) : (
            videos.map((video) => (
              <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">

  {/* VIDEO AREA */}
  {playingVideoId === video._id ? (
    <iframe
      className="w-full aspect-video"
      src={`https://www.youtube.com/embed/${getYouTubeId(video.videoUrl)}`}
      title="video"
      frameBorder="0"
      allowFullScreen
    />
  ) : (
    <div
      className="relative cursor-pointer"
      onClick={() => setPlayingVideoId(video._id)}
    >
      <img
        src={video.thumbnailUrl}
        alt="thumbnail"
        className="w-full aspect-video object-cover"
      />

      {/* play button overlay */}
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition">
  <Play className="w-12 h-12 text-white fill-white" />
</div>
    </div>
  )}

  {/* CONTENT */}
  <div className="p-3">
    <p className="text-xs text-zinc-400 truncate">
      {video.videoUrl}
    </p>

    <div className="flex gap-2 mt-3">

      <button
        onClick={() => handleEditClick(video)}
        className="w-full py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(video._id)}
        className="w-full py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg"
      >
        Delete
      </button>

    </div>
  </div>

              </div>
            ))
          )}

        </div>
      </div>

      {/* ================= VIDEO MODAL ================= */}

      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">

              <h2 className="text-xl font-semibold">
                Upload Video
              </h2>

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="p-2 rounded-full hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* THUMBNAIL */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Thumbnail URL
                </label>

                <input
                  type="text"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="Enter thumbnail URL"
                  required
                  className="
                    w-full h-12 px-4
                    bg-zinc-800 border border-zinc-700
                    rounded-xl text-white
                    outline-none focus:border-white
                  "
                />
              </div>

              {/* VIDEO URL */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  YouTube Video URL
                </label>

                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="Enter video URL"
                  required
                  className="
                    w-full h-12 px-4
                    bg-zinc-800 border border-zinc-700
                    rounded-xl text-white
                    outline-none focus:border-white
                  "
                />
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setOpenModal(false)
                  }
                  className="
                    flex-1 h-12 rounded-xl
                    bg-zinc-800 text-white
                    hover:bg-zinc-700 transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1 h-12 rounded-xl
                    bg-white text-black
                    font-semibold hover:bg-zinc-200
                    transition
                  "
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {openEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between px-6 py-5 border-b border-zinc-800">
              <h2 className="text-xl font-semibold">Edit Video</h2>

              <button onClick={() => setOpenEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleUpdateVideo} className="p-6 space-y-5">

              {/* THUMBNAIL */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Thumbnail URL
                </label>

                <input
                  type="text"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="Enter thumbnail URL"
                  required
                  className="w-full h-12 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none focus:border-white"
                />
              </div>

              {/* VIDEO URL */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  YouTube Video URL
                </label>

                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="Enter video URL"
                  required
                  className="w-full h-12 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none focus:border-white"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setOpenEditModal(false)}
                  className="flex-1 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 h-12 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition"
                >
                  Update
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
      {/* ================= CUSTOMIZE MODAL ================= */}

      {openCustomizeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">

              <h2 className="text-xl font-semibold">
                Customize Channel
              </h2>

              <button
                onClick={() =>
                  setOpenCustomizeModal(false)
                }
                className="p-2 rounded-full hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">

              {/* PROFILE IMAGE */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Profile Image URL
                </label>

                <input
                  type="text"
                  value={channelData.channelBanner}
                  onChange={(e) => {
                    setChannelData({
                      ...channelData,
                      channelBanner: e.target.value,
                    });

                    setErrors({ ...errors, channelBanner: "" });
                  }}
                  className={`w-full h-12 px-4 bg-zinc-800 border rounded-xl text-white outline-none transition ${errors.channelBanner
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-white"
                    }`}
                />

                {errors.channelBanner && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.channelBanner}
                  </p>
                )}
              </div>

              {/* CHANNEL NAME */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Channel Name
                </label>

                <input
                  type="text"
                  value={channelData.channelName}
                  onChange={(e) => {
                    setChannelData({
                      ...channelData,
                      channelName: e.target.value,
                    });

                    setErrors({ ...errors, channelName: "" });
                  }}
                  className={`w-full h-12 px-4 bg-zinc-800 border rounded-xl text-white outline-none transition ${errors.channelName
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-white"
                    }`}
                />

                {errors.channelName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.channelName}
                  </p>
                )}
              </div>

              {/* HANDLE */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Handle Name
                </label>

                <input
                  type="text"
                  value={channelData.handleName}
                  onChange={(e) => {
                    setChannelData({
                      ...channelData,
                      handleName: e.target.value,
                    });

                    setErrors({ ...errors, handleName: "" });
                  }}
                  className={`w-full h-12 px-4 bg-zinc-800 border rounded-xl text-white outline-none transition ${errors.handleName
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-white"
                    }`}
                />

                {errors.handleName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.handleName}
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={channelData.description}
                  onChange={(e) => {
                    setChannelData({
                      ...channelData,
                      description: e.target.value,
                    });

                    setErrors({ ...errors, description: "" });
                  }}
                  className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white outline-none resize-none transition ${errors.description
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-white"
                    }`}
                />

                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setOpenCustomizeModal(false)
                  }
                  className="
                    flex-1 h-12 rounded-xl
                    bg-zinc-800 text-white
                    hover:bg-zinc-700 transition
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateChannel}
                  className="
                    flex-1 h-12 rounded-xl
                    bg-white text-black
                    font-semibold hover:bg-zinc-200
                    transition
                  "
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelPage;