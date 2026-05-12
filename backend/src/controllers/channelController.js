import Channel from "../models/Channel.js";
import User from "../models/User.js";

export const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;

  if (!channelName || channelName.trim().length < 3) {
    return res.status(400).json({ message: "Channel name must be at least 3 characters long." });
  }

  const existingChannel = await Channel.findOne({
    owner: req.user._id,
    channelName,
  });

  if (existingChannel) {
    return res.status(400).json({ message: "You already have a channel with this name." });
  }

  const channel = await Channel.create({
    channelName,
    owner: req.user._id,
    description,
    channelBanner,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { channels: channel._id },
  });

  return res.status(201).json({
    message: "Channel created successfully.",
    channel,
  });
};

export const getChannels = async (req, res) => {
  const channels = await Channel.find()
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json({ channels });
};

export const getChannelById = async (req, res) => {
  const channel = await Channel.findById(req.params.channelId)
    .populate("owner", "username avatar")
    .populate({
      path: "videos",
      populate: {
        path: "uploader",
        select: "username avatar",
      },
    });

  if (!channel) {
    return res.status(404).json({ message: "Channel not found." });
  }

  return res.status(200).json({ channel });
};

export const updateChannel = async (req, res) => {
  const channel = await Channel.findById(req.params.channelId);

  if (!channel) {
    return res.status(404).json({ message: "Channel not found." });
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can update only your own channel." });
  }

  channel.channelName = req.body.channelName ?? channel.channelName;
  channel.description = req.body.description ?? channel.description;
  channel.channelBanner = req.body.channelBanner ?? channel.channelBanner;

  const updatedChannel = await channel.save();

  return res.status(200).json({
    message: "Channel updated successfully.",
    channel: updatedChannel,
  });
};

export const deleteChannel = async (req, res) => {
  const channel = await Channel.findById(req.params.channelId);

  if (!channel) {
    return res.status(404).json({ message: "Channel not found." });
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can delete only your own channel." });
  }

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { channels: channel._id },
  });
  await channel.deleteOne();

  return res.status(200).json({ message: "Channel deleted successfully." });
};

