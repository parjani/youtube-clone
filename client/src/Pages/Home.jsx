import { useEffect, useState } from "react";

import axios from "axios";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import FilterButtons from "../Components/FilterButtons";
import VideoCard from "../Components/VideoCard";

function Home() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ================= FETCH VIDEOS =================

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/videos"
      );

      setVideos(response.data.videos);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ================= FILTER VIDEOS =================

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter(
          (video) =>
            video.category === selectedCategory
        );

  return (
    <div className="bg-black min-h-screen">
      {/* HEADER */}
      <Header toggleSidebar={toggleSidebar} />

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* FILTER BUTTONS */}
      <FilterButtons
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* MAIN CONTENT */}
      <div
        className={`
          pt-36 px-5 transition-all duration-300
          ${sidebarOpen ? "ml-60" : "ml-20"}
        `}
      >
        {/* LOADING */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <h1 className="text-white text-2xl">
              Loading videos...
            </h1>
          </div>
        ) : filteredVideos.length === 0 ? (
          // NO VIDEOS
          <div className="flex items-center justify-center h-[60vh]">
            <h1 className="text-zinc-400 text-2xl">
              No Videos Found
            </h1>
          </div>
        ) : (
          // VIDEO GRID
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;