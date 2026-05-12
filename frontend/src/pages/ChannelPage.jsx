import { Edit2, Save, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { categories } from "../data/categories";
import { isLoggedIn } from "../utils/auth";

const initialChannelForm = {
  channelName: "",
  description: "",
  channelBanner: "",
};

const initialVideoForm = {
  title: "",
  thumbnailUrl: "",
  videoUrl: "",
  description: "",
  category: "Coding",
};

function ChannelPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [channel, setChannel] = useState(null);
  const [channelForm, setChannelForm] = useState(initialChannelForm);
  const [videoForm, setVideoForm] = useState(initialVideoForm);
  const [editingVideoId, setEditingVideoId] = useState("");
  const [editingVideoForm, setEditingVideoForm] = useState(initialVideoForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadChannel = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const profileResponse = await api.get("/auth/profile");
      const firstChannelId = profileResponse.data.user.channels?.[0];

      if (!firstChannelId) {
        setChannel(null);
        return;
      }

      const channelResponse = await api.get(`/channels/${firstChannelId}`);
      setChannel(channelResponse.data.channel);
    } catch (loadError) {
      setError("Unable to load your channel.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChannel();
  }, []);

  const handleChannelChange = (event) => {
    setChannelForm({
      ...channelForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleVideoChange = (event) => {
    setVideoForm({
      ...videoForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditVideoChange = (event) => {
    setEditingVideoForm({
      ...editingVideoForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateChannel = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/channels", channelForm);
      setChannelForm(initialChannelForm);
      await loadChannel();
    } catch (createError) {
      setError(createError.response?.data?.message || "Unable to create channel.");
    }
  };

  const handleCreateVideo = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/videos", {
        ...videoForm,
        channelId: channel._id,
      });
      setVideoForm(initialVideoForm);
      await loadChannel();
    } catch (createError) {
      setError(createError.response?.data?.message || "Unable to create video.");
    }
  };

  const startEditingVideo = (video) => {
    setEditingVideoId(video._id);
    setEditingVideoForm({
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      description: video.description,
      category: video.category,
    });
  };

  const handleUpdateVideo = async (videoId) => {
    await api.put(`/videos/${videoId}`, editingVideoForm);
    setEditingVideoId("");
    await loadChannel();
  };

  const handleDeleteVideo = async (videoId) => {
    await api.delete(`/videos/${videoId}`);
    await loadChannel();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header searchTerm="" onSearchChange={() => {}} onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-1 min-w-0 p-6">
            <p className="mt-8 text-gray-600">Loading channel...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header searchTerm="" onSearchChange={() => {}} onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="flex-1 min-w-0 p-4 md:p-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start justify-between gap-5 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{channel ? channel.channelName : "Create your channel"}</h1>
                <p className="text-gray-600">{channel ? channel.description : "You need a channel before uploading videos."}</p>
              </div>
              <Link className="text-blue-600 font-bold hover:underline" to="/">
                Back to home
              </Link>
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            {!channel && (
              <form className="grid gap-4 max-w-2xl" onSubmit={handleCreateChannel}>
                <label className="grid gap-2 font-bold">
                  Channel name
                  <input className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal" name="channelName" value={channelForm.channelName} onChange={handleChannelChange} />
                </label>
                <label className="grid gap-2 font-bold">
                  Description
                  <textarea className="w-full min-h-[88px] border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal" name="description" value={channelForm.description} onChange={handleChannelChange} />
                </label>
                <label className="grid gap-2 font-bold">
                  Banner URL
                  <input className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal" name="channelBanner" value={channelForm.channelBanner} onChange={handleChannelChange} />
                </label>
                <button className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md justify-self-start" type="submit">
                  Create channel
                </button>
              </form>
            )}

            {channel && (
              <>
                {channel.channelBanner && <img className="w-full h-32 md:h-56 object-cover rounded-xl mb-8" src={channel.channelBanner} alt="" />}

                <section className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Upload video</h2>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl" onSubmit={handleCreateVideo}>
                    <label className="grid gap-2 font-bold">
                      Title
                      <input className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal" name="title" value={videoForm.title} onChange={handleVideoChange} />
                    </label>
                    <label className="grid gap-2 font-bold">
                      Thumbnail URL
                      <input className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal" name="thumbnailUrl" value={videoForm.thumbnailUrl} onChange={handleVideoChange} />
                    </label>
                    <label className="grid gap-2 font-bold">
                      Video URL
                      <input className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal" name="videoUrl" value={videoForm.videoUrl} onChange={handleVideoChange} />
                    </label>
                    <label className="grid gap-2 font-bold">
                      Category
                      <select className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal" name="category" value={videoForm.category} onChange={handleVideoChange}>
                        {categories
                          .filter((category) => category !== "All")
                          .map((category) => (
                            <option value={category} key={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </label>
                    <label className="grid gap-2 font-bold md:col-span-2">
                      Description
                      <textarea className="w-full min-h-[88px] border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal" name="description" value={videoForm.description} onChange={handleVideoChange} />
                    </label>
                    <div className="md:col-span-2">
                      <button className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md" type="submit">
                        Add video
                      </button>
                    </div>
                  </form>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-bold mb-4">Your videos</h2>
                  <div className="grid gap-4">
                    {channel.videos.length === 0 && <p className="text-gray-500">No videos uploaded yet.</p>}

                    {channel.videos.map((video) => (
                      <article className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl" key={video._id}>
                        <img className="w-full sm:w-48 aspect-video object-cover rounded-lg bg-gray-100 flex-none" src={video.thumbnailUrl} alt={video.title} />
                        <div className="flex-1 min-w-0">
                          {editingVideoId === video._id ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <input className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none" name="title" value={editingVideoForm.title} onChange={handleEditVideoChange} />
                              <input className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none" name="thumbnailUrl" value={editingVideoForm.thumbnailUrl} onChange={handleEditVideoChange} />
                              <input className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none" name="videoUrl" value={editingVideoForm.videoUrl} onChange={handleEditVideoChange} />
                              <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none" name="category" value={editingVideoForm.category} onChange={handleEditVideoChange}>
                                {categories
                                  .filter((category) => category !== "All")
                                  .map((category) => (
                                    <option value={category} key={category}>
                                      {category}
                                    </option>
                                  ))}
                              </select>
                              <textarea className="w-full min-h-[60px] border border-gray-300 rounded-md p-2 text-sm outline-none md:col-span-2" name="description" value={editingVideoForm.description} onChange={handleEditVideoChange} />
                            </div>
                          ) : (
                            <>
                              <h3 className="font-bold text-lg leading-tight mb-1">{video.title}</h3>
                              <p className="text-gray-600 text-sm mb-1">{video.category}</p>
                              <span className="text-gray-600 text-sm">{video.views} views</span>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2 flex-none sm:self-start">
                          {editingVideoId === video._id ? (
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200" type="button" onClick={() => handleUpdateVideo(video._id)} aria-label="Save video">
                              <Save size={18} />
                            </button>
                          ) : (
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200" type="button" onClick={() => startEditingVideo(video)} aria-label="Edit video">
                              <Edit2 size={18} />
                            </button>
                          )}
                          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-red-600" type="button" onClick={() => handleDeleteVideo(video._id)} aria-label="Delete video">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChannelPage;
