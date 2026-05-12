import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const getCommentsByVideo = async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId })
    .populate("userId", "username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json({ comments });
};

export const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ message: "Comment text is required." });
  }

  const video = await Video.findById(req.params.videoId);

  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  const comment = await Comment.create({
    videoId: req.params.videoId,
    userId: req.user._id,
    text,
  });

  const populatedComment = await comment.populate("userId", "username avatar");

  return res.status(201).json({
    message: "Comment added successfully.",
    comment: populatedComment,
  });
};

export const updateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found." });
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can update only your own comment." });
  }

  if (!req.body.text || req.body.text.trim().length === 0) {
    return res.status(400).json({ message: "Comment text is required." });
  }

  comment.text = req.body.text;
  const updatedComment = await comment.save();
  await updatedComment.populate("userId", "username avatar");

  return res.status(200).json({
    message: "Comment updated successfully.",
    comment: updatedComment,
  });
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found." });
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can delete only your own comment." });
  }

  await comment.deleteOne();

  return res.status(200).json({ message: "Comment deleted successfully." });
};

