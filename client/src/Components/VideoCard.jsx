import { Link } from "react-router-dom";

function VideoCard({ video }) {
  return (
    <Link
      to={`/video/${video._id}`}
      className="w-full cursor-pointer group"
    >
      {/* THUMBNAIL */}
      <div className="relative w-full h-52 rounded-xl overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          12:30
        </span>
      </div>

      {/* VIDEO INFO */}
      <div className="flex gap-3 mt-3">
        {/* CHANNEL IMAGE */}
        <div className="min-w-[40px]">
          <img
            src={
              video?.uploader?.avatar ||
              "https://i.pravatar.cc/150?img=3"
            }
            alt="channel"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* TEXT */}
        <div className="flex flex-col">
          <h2 className="text-white font-semibold text-sm line-clamp-2">
            {video.title}
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            {video?.uploader?.username || "Unknown Channel"}
          </p>

          <div className="flex items-center gap-2 text-zinc-400 text-xs mt-1">
            <span>{video.views} views</span>

            <span>•</span>

            <span>
              {new Date(video.createdAt).toDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;