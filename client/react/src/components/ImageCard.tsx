import React, { useState } from "react";

interface ImageCardProps {
  imageUrl: string;
  altText: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, altText }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* image preview */}
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer hover:scale-102 transition"
        onClick={() => setIsModalOpen(true)}
      />

      {/* modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          onClick={() => setIsModalOpen(false)} // close when clicking outside
        >
          <div
            className="relative p-6 bg-white rounded-lg shadow-lg max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // stop closing when clicking inside
          >
            {/* close Button */}
            <button
              className="absolute top-[4px] right-[8px] text-md font-bold text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            {/* Full Image */}
            <img
              src={imageUrl}
              alt={altText}
              className="max-w-full max-h-[80vh] rounded"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
