import ImageCard from "./ImageCard";

function ImageGrid({ images, loading, savedIds, onImageClick, onDownload, onToggleSave }) {
  if (loading) {
    return (
      <div className="loader">
        <div className="loader__spinner"></div>
        <p className="loader__text">Discovering amazing images...</p>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="empty">
        <div className="empty__icon">📷</div>
        <h3 className="empty__title">No images found</h3>
        <p className="empty__text">Try a different search term or browse categories above</p>
      </div>
    );
  }

  return (
    <div className="gallery">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isSaved={savedIds.has(image.id)}
          onClick={() => onImageClick(image)}
          onDownload={(e) => {
            e.stopPropagation();
            onDownload(image);
          }}
          onToggleSave={(e) => {
            e.stopPropagation();
            onToggleSave(image);
          }}
        />
      ))}
    </div>
  );
}

export default ImageGrid;
