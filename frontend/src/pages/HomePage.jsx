import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import api from "../services/api";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError("");

        const params = {};

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        if (selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        const response = await api.get("/videos", { params });
        setVideos(response.data.videos);
      } catch (fetchError) {
        setError("Unable to load videos. Please make sure the backend server is running.");
      } finally {
        setIsLoading(false);
      }
    };

    const delay = setTimeout(fetchVideos, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Header
        onToggleSidebar={() => setIsSidebarOpen((currentValue) => !currentValue)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="flex-1 min-w-0 px-4 md:px-6 pb-8">
          <FilterBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

          {isLoading && <p className="mt-8 text-gray-600">Loading videos...</p>}
          {error && <p className="mt-8 text-red-600">{error}</p>}

          {!isLoading && !error && videos.length === 0 && (
            <section className="max-w-xl mx-auto mt-14 text-center">
              <h2 className="text-2xl font-bold mb-2">No videos found</h2>
              <p className="text-gray-600">Create a channel and upload videos from the backend to see them here.</p>
            </section>
          )}

          {!isLoading && !error && videos.length > 0 && (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-4 mt-4" aria-label="Video list">
              {videos.map((video) => (
                <VideoCard video={video} key={video._id} />
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;

