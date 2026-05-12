import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function PublicChannelPage() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChannel = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await api.get(`/channels/${id}`);
        setChannel(response.data.channel);
      } catch (err) {
        setError("Unable to load this channel.");
      } finally {
        setIsLoading(false);
      }
    };
    loadChannel();
  }, [id]);

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

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-white">
        <Header searchTerm="" onSearchChange={() => {}} onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-1 min-w-0 p-6">
            <section className="max-w-xl mx-auto mt-14 text-center">
              <h2 className="text-2xl font-bold mb-2">Channel unavailable</h2>
              <p className="text-gray-600">{error || "This channel could not be found."}</p>
              <Link className="inline-block mt-4 text-blue-600 font-bold hover:underline" to="/">Back to home</Link>
            </section>
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
        <main className="flex-1 min-w-0 p-6 pb-12">
          <div className="max-w-6xl mx-auto">
            {channel.channelBanner && <img className="w-full h-32 md:h-56 object-cover rounded-xl mb-6" src={channel.channelBanner} alt="" />}
            <div className="flex items-start justify-between gap-5 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{channel.channelName}</h1>
                <p className="text-gray-600">{channel.description}</p>
              </div>
            </div>
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4">
                {(!channel.videos || channel.videos.length === 0) && <p className="text-gray-500 col-span-full">No videos uploaded yet.</p>}
                {channel.videos && channel.videos.map((video) => (
                  <Link to={`/videos/${video._id}`} className="flex flex-col gap-2 group" key={video._id}>
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-200">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" src={video.thumbnailUrl} alt={video.title} />
                    </div>
                    <div className="flex gap-3 pr-6 mt-1">
                      <div className="flex flex-col">
                        <h3 className="text-base font-semibold leading-tight line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{video.views} views • {video.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PublicChannelPage;
