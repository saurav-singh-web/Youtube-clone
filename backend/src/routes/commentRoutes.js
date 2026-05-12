import express from "express";
import {
  addComment,
  deleteComment,
  getCommentsByVideo,
  updateComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/video/:videoId").get(getCommentsByVideo).post(protect, addComment);
router.route("/:commentId").put(protect, updateComment).delete(protect, deleteComment);

export default router;

