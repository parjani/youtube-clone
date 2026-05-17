import { useEffect, useState } from "react";

import axios from "axios";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import FilterButtons from "../Components/FilterButtons";
import VideoCard from "../Components/VideoCard";
import { useSearchParams } from "react-router-dom";

function Home() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exploreLoading, setExploreLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  // ================= FETCH VIDEOS =================

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/videos/all-videos",
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
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

  const handleExploreVideos = async () => {
    try {
      setExploreLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/videos/bulk-create",
        {},
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      // re-fetch videos after bulk insert
      await fetchVideos();
    } catch (error) {
      console.log(error);
      alert("Failed to load explore videos");
    } finally {
      setExploreLoading(false);
    }
  };

  // ================= FILTER VIDEOS =================

  const filteredVideos = videos.filter((video) => {
    const matchesCategory =
      selectedCategory === "All" ||
      video.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description?.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    console.log("VIDEOS:", videos.map(v => v.category));
  }, [videos]);

  return (
    <div className="bg-black min-h-screen">
      {/* HEADER */}
      {/* <Header toggleSidebar={toggleSidebar} /> */}

      {/* SIDEBAR */}
      {/* <Sidebar sidebarOpen={sidebarOpen} /> */}

      {/* FILTER BUTTONS */}
      <div className="fixed top-16 left-0 right-0 z-30 bg-black">
        <div className="py-3 overflow-x-auto px-4">
          <FilterButtons
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sidebarOpen={sidebarOpen}
          />
        </div>
      </div>


      {/* MAIN CONTENT */}
      <div className="pt-40 px-5 pl-10 md:pl-10">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <h1 className="text-white text-2xl">
              Loading videos...
            </h1>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">

            <h1 className="text-zinc-400 text-2xl">
              No Videos Found
            </h1>

            <button
              onClick={handleExploreVideos}
              disabled={exploreLoading}
              className="
      px-6 py-3 bg-white text-black
      rounded-full font-medium
      hover:bg-zinc-200 transition
      disabled:opacity-50
    "
            >
              {exploreLoading ? "Loading..." : "Explore Videos"}
            </button>

          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                />
              ))}


            </div>

          </>

        )}

      </div>
    </div>
  );
}

export default Home;