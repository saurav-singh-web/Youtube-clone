import express from "express";
import {
  createChannel,
  deleteChannel,
  getChannelById,
  getChannels,
  updateChannel,
} from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getChannels).post(protect, createChannel);
router.route("/:channelId").get(getChannelById).put(protect, updateChannel).delete(protect, deleteChannel);

export default router;

