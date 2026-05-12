import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Channel from "../src/models/Channel.js";
import Comment from "../src/models/Comment.js";
import User from "../src/models/User.js";
import Video from "../src/models/Video.js";

dotenv.config();

const sampleVideos = [
  {
    title: "Learn React in 30 Minutes",
    thumbnailUrl: "https://picsum.photos/seed/react/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "A quick tutorial to get started with React.",
    category: "Coding",
    views: 15200,
  },
  {
    title: "JavaScript Crash Course",
    thumbnailUrl: "https://picsum.photos/seed/javascript/640/360",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "Core JavaScript concepts explained with examples.",
    category: "Education",
    views: 28400,
  },
  {
    title: "Relaxing Study Music",
    thumbnailUrl: "https://picsum.photos/seed/music/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Calm background music for focus sessions.",
    category: "Music",
    views: 90500,
  },
  {
    title: "Top Gaming Moments",
    thumbnailUrl: "https://picsum.photos/seed/gaming/640/360",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "A highlight reel of memorable gameplay moments.",
    category: "Gaming",
    views: 44100,
  },
  {
    title: "Daily Tech News Roundup",
    thumbnailUrl: "https://picsum.photos/seed/news/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Latest updates from software, gadgets, and AI.",
    category: "News",
    views: 11800,
  },
  {
    title: "Best Football Skills",
    thumbnailUrl: "https://picsum.photos/seed/sports/640/360",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "A collection of clean passes, goals, and footwork.",
    category: "Sports",
    views: 63700,
  },
];

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([User.deleteMany({ email: "john@example.com" }), Channel.deleteMany({ channelName: "Code with John" })]);

  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await User.create({
    username: "JohnDoe",
    email: "john@example.com",
    password: hashedPassword,
    avatar: "https://picsum.photos/seed/john/160/160",
  });

  const channel = await Channel.create({
    channelName: "Code with John",
    owner: user._id,
    description: "Coding tutorials and tech reviews by John Doe.",
    channelBanner: "https://picsum.photos/seed/banner/1200/300",
    subscribers: 5200,
  });

  const videos = await Video.insertMany(
    sampleVideos.map((video) => ({
      ...video,
      channelId: channel._id,
      uploader: user._id,
    }))
  );

  channel.videos = videos.map((video) => video._id);
  user.channels = [channel._id];

  await Promise.all([channel.save(), user.save()]);

  await Comment.create({
    videoId: videos[0]._id,
    userId: user._id,
    text: "Great video! Very helpful.",
  });

  console.log("Seed data created successfully.");
  await mongoose.disconnect();
};

seedData().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});

