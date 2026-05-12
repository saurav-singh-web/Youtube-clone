import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

export const getVideos = async (req, res) => {
  const { search, category } = req.query;
  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category && category !== "All") {
    query.category = category;
  }

  const videos = await Video.find(query)
    .populate("channelId", "channelName channelBanner")
    .populate("uploader", "username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json({ videos });
};

export const getVideoById = async (req, res) => {
  const video = await Video.findById(req.params.videoId)
    .populate("channelId", "channelName channelBanner subscribers")
    .populate("uploader", "username avatar");

  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  video.views += 1;
  await video.save();

  return res.status(200).json({ video });
};

export const createVideo = async (req, res) => {
  const { title, thumbnailUrl, videoUrl, description, category, channelId } = req.body;

  if (!title || !thumbnailUrl || !videoUrl || !category || !channelId) {
    return res.status(400).json({
      message: "Title, thumbnail URL, video URL, category, and channel ID are required.",
    });
  }

  const channel = await Channel.findById(channelId);

  if (!channel) {
    return res.status(404).json({ message: "Channel not found." });
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can upload videos only to your own channel." });
  }

  const video = await Video.create({
    title,
    thumbnailUrl,
    videoUrl,
    description,
    category,
    channelId,
    uploader: req.user._id,
  });

  channel.videos.push(video._id);
  await channel.save();

  return res.status(201).json({
    message: "Video created successfully.",
    video,
  });
};

export const updateVideo = async (req, res) => {
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  if (video.uploader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can update only your own video." });
  }

  video.title = req.body.title ?? video.title;
  video.thumbnailUrl = req.body.thumbnailUrl ?? video.thumbnailUrl;
  video.videoUrl = req.body.videoUrl ?? video.videoUrl;
  video.description = req.body.description ?? video.description;
  video.category = req.body.category ?? video.category;

  const updatedVideo = await video.save();

  return res.status(200).json({
    message: "Video updated successfully.",
    video: updatedVideo,
  });
};

export const deleteVideo = async (req, res) => {
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  if (video.uploader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can delete only your own video." });
  }

  await Channel.findByIdAndUpdate(video.channelId, {
    $pull: { videos: video._id },
  });
  await video.deleteOne();

  return res.status(200).json({ message: "Video deleted successfully." });
};

export const likeVideo = async (req, res) => {
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  const userId = req.user._id.toString();
  const alreadyLiked = video.likes.some((id) => id.toString() === userId);

  video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);

  if (alreadyLiked) {
    video.likes = video.likes.filter((id) => id.toString() !== userId);
  } else {
    video.likes.push(req.user._id);
  }

  await video.save();

  return res.status(200).json({
    likes: video.likes.length,
    dislikes: video.dislikes.length,
  });
};

export const dislikeVideo = async (req, res) => {
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  const userId = req.user._id.toString();
  const alreadyDisliked = video.dislikes.some((id) => id.toString() === userId);

  video.likes = video.likes.filter((id) => id.toString() !== userId);

  if (alreadyDisliked) {
    video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
  } else {
    video.dislikes.push(req.user._id);
  }

  await video.save();

  return res.status(200).json({
    likes: video.likes.length,
    dislikes: video.dislikes.length,
  });
};

