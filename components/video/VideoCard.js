const VideoCard = ({ video }) => {
  if (!video) {
    return <div className="text-white">No video data available.</div>;
  }

  return (
    <div className="video-card bg-[#1c1c24] hover:bg-[#2c2f32] p-4 rounded-md">
      <h3 className="text-white mb-2">{video.title || "Untitled Video"}</h3>
      <div className="video-container mb-2">
        <iframe
          className="w-full h-48"
          src={video.url}
          title={video.title || "Video"}
          allowFullScreen
        ></iframe>
      </div>
      <p className="text-gray-400 text-sm">{video.description || "No description available."}</p>
    </div>
  );
};

export default VideoCard;