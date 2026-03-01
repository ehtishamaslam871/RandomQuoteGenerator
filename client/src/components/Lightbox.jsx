import { useEffect } from "react";
import { FiX, FiDownload } from "react-icons/fi";

function Lightbox({ image, onClose, onDownload }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="lightbox" onClick={handleBackdrop}>
      <button className="lightbox__close" onClick={onClose}>
        <FiX size={24} />
      </button>

      <div className="lightbox__content">
        <img
          className="lightbox__image"
          src={image.imageUrl}
          alt={image.description}
        />

        <div className="lightbox__info">
          <img
            className="card__avatar"
            src={image.photographerAvatar}
            alt={image.photographer}
            style={{ width: 42, height: 42 }}
          />
          <div>
            <p className="lightbox__photographer">{image.photographer}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
              {image.description}
            </p>
          </div>
          <button className="lightbox__download" onClick={() => onDownload(image)}>
            <FiDownload size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lightbox;
