import React, { useState } from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, property }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !property) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? property.image_url.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === property.image_url.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-carousel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <button className="modal-arrow left" onClick={handlePrev}>‹</button>
        <img
          src={property.image_url[currentIndex]}
          alt={`Property ${currentIndex + 1}`}
          className="modal-main-image"
        />
        <button className="modal-arrow right" onClick={handleNext}>›</button>
      </div>
    </div>
  );
};

export default Modal;
