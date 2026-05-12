import { Link } from "react-router-dom";

function formatViews(views) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }

  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }

  return `${views} views`;
}

function VideoCard({ video }) {
  const channelName = video.channelId?.channelName || "Unknown channel";

  return (
    <Link className="flex flex-col gap-2 group" to={`/videos/${video._id}`}>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-200">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
      </div>
      <div className="flex gap-3 pr-6 mt-1">
        <div className="flex-none w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {video.channelId?.username?.charAt(0).toUpperCase() || channelName.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold leading-tight line-clamp-2">{video.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{channelName}</p>
          <span className="text-sm text-gray-600">{formatViews(video.views || 0)}</span>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
