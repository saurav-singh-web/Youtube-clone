import express from "express";
import {
  createVideo,
  deleteVideo,
  dislikeVideo,
  getVideoById,
  getVideos,
  likeVideo,
  updateVideo,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getVideos).post(protect, createVideo);
router.route("/:videoId").get(getVideoById).put(protect, updateVideo).delete(protect, deleteVideo);
router.post("/:videoId/like", protect, likeVideo);
router.post("/:videoId/dislike", protect, dislikeVideo);

export default router;

