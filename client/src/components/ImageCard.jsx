import { FiDownload, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function ImageCard({ image, isSaved, onClick, onDownload, onToggleSave }) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card__image-wrapper">
        <img
          className="card__image"
          src={image.thumbnailUrl}
          alt={image.description}
          loading="lazy"
        />

        <div className="card__overlay">
          <div className="card__overlay-actions">
            <button
              className={`card__action-btn ${isSaved ? "card__action-btn--saved" : ""}`}
              onClick={onToggleSave}
              title={isSaved ? "Remove from saved" : "Save image"}
            >
              {isSaved ? <FaHeart size={16} /> : <FiHeart size={16} />}
            </button>
            <button
              className="card__action-btn"
              onClick={onDownload}
              title="Download image"
            >
              <FiDownload size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="card__info">
        <img
          className="card__avatar"
          src={image.photographerAvatar}
          alt={image.photographer}
        />
        <div className="card__meta">
          <p className="card__photographer">{image.photographer}</p>
          <p className="card__description">{image.description}</p>
        </div>
        {image.likes > 0 && (
          <div className="card__likes">
            <FaHeart size={12} />
            {image.likes}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCard;
