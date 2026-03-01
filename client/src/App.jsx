import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import CategoryTags from "./components/CategoryTags";
import ImageGrid from "./components/ImageGrid";
import Lightbox from "./components/Lightbox";
import Toast from "./components/Toast";

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Show toast notification
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch trending images on load
  const fetchTrending = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/images/random");
      setImages(data.images);
      setTotalResults(data.images.length);
      setActiveQuery("");
    } catch (error) {
      console.error("Failed to fetch trending:", error);
      showToast("Failed to load images. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Search images
  const searchImages = useCallback(
    async (query, pageNum = 1, append = false) => {
      if (!query.trim()) return fetchTrending();

      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const { data } = await axios.get("/api/images/search", {
          params: { query, page: pageNum, per_page: 30 },
        });

        if (append) {
          setImages((prev) => [...prev, ...data.images]);
        } else {
          setImages(data.images);
        }

        setTotalPages(data.totalPages);
        setTotalResults(data.total);
        setActiveQuery(query);
        setPage(pageNum);
      } catch (error) {
        console.error("Search failed:", error);
        showToast("Search failed. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchTrending]
  );

  // Initial load
  useEffect(() => {
    fetchTrending();
    // Load saved image IDs
    axios
      .get("/api/saved")
      .then(({ data }) => {
        setSavedIds(new Set(data.images.map((img) => img.unsplashId)));
      })
      .catch(() => {}); // MongoDB might not be running
  }, [fetchTrending]);

  // Handle search submit
  const handleSearch = (query) => {
    setSearchQuery(query);
    searchImages(query, 1, false);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    setSearchQuery(category);
    searchImages(category, 1, false);
  };

  // Load more
  const handleLoadMore = () => {
    if (activeQuery) {
      searchImages(activeQuery, page + 1, true);
    }
  };

  // Download image
  const handleDownload = async (image) => {
    try {
      showToast("Starting download...");
      const response = await axios.get("/api/images/download", {
        params: { url: image.downloadUrl },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `unsplash-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Download complete! ✓");
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(image.fullUrl || image.imageUrl, "_blank");
      showToast("Opening image in new tab...");
    }
  };

  // Save/unsave image
  const handleToggleSave = async (image) => {
    try {
      if (savedIds.has(image.id)) {
        await axios.delete(`/api/saved/${image.id}`);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(image.id);
          return next;
        });
        showToast("Removed from saved ✓");
      } else {
        await axios.post("/api/saved", {
          unsplashId: image.id,
          description: image.description,
          imageUrl: image.imageUrl,
          thumbnailUrl: image.thumbnailUrl,
          downloadUrl: image.downloadUrl,
          photographer: image.photographer,
          photographerProfile: image.photographerProfile,
          width: image.width,
          height: image.height,
        });
        setSavedIds((prev) => new Set(prev).add(image.id));
        showToast("Saved to collection ✓");
      }
    } catch (error) {
      console.error("Save toggle failed:", error);
      showToast("Could not save (MongoDB may be offline)");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">Image Gallery</h1>
        <p className="header__subtitle">
          Discover stunning photos from Unsplash
        </p>
      </header>

      <SearchBar value={searchQuery} onSearch={handleSearch} />

      <CategoryTags
        activeCategory={activeQuery}
        onCategoryClick={handleCategoryClick}
      />

      {!loading && (
        <div className="stats">
          <p className="stats__count">
            {activeQuery ? (
              <>
                <span>{totalResults.toLocaleString()}</span> results for "
                {activeQuery}"
              </>
            ) : (
              <>
                <span>Trending</span> photos
              </>
            )}
          </p>
        </div>
      )}

      <ImageGrid
        images={images}
        loading={loading}
        savedIds={savedIds}
        onImageClick={setSelectedImage}
        onDownload={handleDownload}
        onToggleSave={handleToggleSave}
      />

      {activeQuery && page < totalPages && !loading && (
        <div className="load-more">
          <button
            className="load-more__btn"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

export default App;
