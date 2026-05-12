import { Edit2, Save, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { getStoredUser, isLoggedIn } from "../utils/auth";

function VideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState("");
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideoData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [videoResponse, commentsResponse] = await Promise.all([
        api.get(`/videos/${videoId}`),
        api.get(`/comments/video/${videoId}`),
      ]);

      setVideo(videoResponse.data.video);
      setComments(commentsResponse.data.comments);
    } catch (fetchError) {
      setError("Unable to load this video.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  const requireLogin = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return false;
    }

    return true;
  };

  const handleLike = async () => {
    if (!requireLogin()) return;

    const response = await api.post(`/videos/${videoId}/like`);
    setVideo((currentVideo) => ({
      ...currentVideo,
      likes: Array.from({ length: response.data.likes }),
      dislikes: Array.from({ length: response.data.dislikes }),
    }));
  };

  const handleDislike = async () => {
    if (!requireLogin()) return;

    const response = await api.post(`/videos/${videoId}/dislike`);
    setVideo((currentVideo) => ({
      ...currentVideo,
      likes: Array.from({ length: response.data.likes }),
      dislikes: Array.from({ length: response.data.dislikes }),
    }));
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!requireLogin() || !commentText.trim()) {
      return;
    }

    const response = await api.post(`/comments/video/${videoId}`, {
      text: commentText.trim(),
    });

    setComments((currentComments) => [response.data.comment, ...currentComments]);
    setCommentText("");
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) {
      return;
    }

    const response = await api.put(`/comments/${commentId}`, {
      text: editingText.trim(),
    });

    setComments((currentComments) =>
      currentComments.map((comment) => (comment._id === commentId ? response.data.comment : comment))
    );
    setEditingCommentId("");
    setEditingText("");
  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
    setComments((currentComments) => currentComments.filter((comment) => comment._id !== commentId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header searchTerm="" onSearchChange={() => {}} onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-1 min-w-0 p-6">
            <p className="mt-8 text-gray-600">Loading video...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-white">
        <Header searchTerm="" onSearchChange={() => {}} onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-1 min-w-0 p-6">
            <section className="max-w-xl mx-auto mt-14 text-center">
              <h2 className="text-2xl font-bold mb-2">Video unavailable</h2>
              <p className="text-gray-600">{error || "This video could not be found."}</p>
              <Link className="inline-block mt-4 text-blue-600 font-bold hover:underline" to="/">
                Back to home
              </Link>
            </section>
          </main>
        </div>
      </div>
    );
  }

  const likeCount = video.likes?.length || 0;
  const dislikeCount = video.dislikes?.length || 0;

  return (
    <div className="min-h-screen bg-white">
      <Header searchTerm="" onSearchChange={() => {}} onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="flex-1 min-w-0 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <section className="min-w-0">
              <video className="w-full aspect-video rounded-xl bg-black" controls poster={video.thumbnailUrl} src={video.videoUrl}>
                <track kind="captions" />
              </video>

              <h1 className="mt-4 mb-3 text-xl md:text-2xl font-bold leading-tight">{video.title}</h1>

              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <Link to={`/channel/${video.channelId?._id}`} className="font-bold hover:underline">
                    {video.channelId?.channelName || "Unknown channel"}
                  </Link>
                  <p className="text-gray-600 text-sm mt-0.5">{video.views || 0} views</p>
                </div>

                <div className="inline-flex overflow-hidden rounded-full bg-gray-100">
                  <button className="inline-flex items-center gap-2 h-10 px-4 font-bold hover:bg-gray-200" type="button" onClick={handleLike}>
                    <ThumbsUp size={18} />
                    {likeCount}
                  </button>
                  <div className="w-px bg-gray-300 my-2"></div>
                  <button className="inline-flex items-center gap-2 h-10 px-4 font-bold hover:bg-gray-200" type="button" onClick={handleDislike}>
                    <ThumbsDown size={18} />
                    {dislikeCount}
                  </button>
                </div>
              </div>

              <section className="mt-4 p-4 bg-gray-100 rounded-xl">
                <p className="whitespace-pre-wrap">{video.description || "No description provided."}</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold mb-5">{comments.length} Comments</h2>

                <form className="flex gap-3 mb-8" onSubmit={handleAddComment}>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-none">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      className="w-full h-10 border-b border-gray-300 focus:border-black outline-none bg-transparent transition-colors"
                      type="text"
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      placeholder={isLoggedIn() ? "Add a comment..." : "Sign in to add a comment"}
                    />
                    <div className="flex justify-end">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full disabled:opacity-50" type="submit" disabled={!commentText.trim()}>
                        Comment
                      </button>
                    </div>
                  </div>
                </form>

                <div className="grid gap-5">
                  {comments.map((comment) => {
                    const commentUserId = comment.userId?._id || comment.userId;
                    const canManageComment = user && String(user.userId) === String(commentUserId);

                    return (
                      <article className="flex gap-3" key={comment._id}>
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-none">
                          {comment.userId?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-bold text-sm mb-1">{comment.userId?.username || "User"}</p>
                              {editingCommentId === comment._id ? (
                                <div className="flex flex-col gap-2 mt-1">
                                  <input
                                    className="w-full h-8 border-b border-gray-300 focus:border-black outline-none bg-transparent"
                                    value={editingText}
                                    onChange={(event) => setEditingText(event.target.value)}
                                  />
                                </div>
                              ) : (
                                <p className="text-gray-800 break-words">{comment.text}</p>
                              )}
                            </div>
                            
                            {canManageComment && (
                              <div className="flex items-center gap-1 flex-none">
                                {editingCommentId === comment._id ? (
                                  <button className="p-2 hover:bg-gray-100 rounded-full" type="button" onClick={() => handleUpdateComment(comment._id)} aria-label="Save comment">
                                    <Save size={17} />
                                  </button>
                                ) : (
                                  <button className="p-2 hover:bg-gray-100 rounded-full" type="button" onClick={() => handleStartEdit(comment)} aria-label="Edit comment">
                                    <Edit2 size={17} />
                                  </button>
                                )}
                                <button className="p-2 hover:bg-gray-100 rounded-full" type="button" onClick={() => handleDeleteComment(comment._id)} aria-label="Delete comment">
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default VideoPage;
