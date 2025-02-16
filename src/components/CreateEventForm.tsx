import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  KeyboardEvent,
} from "react";

import Cookies from "js-cookie";

type FilePreview = {
  file: File;
  preview: string;
};

const CreateEventForm: React.FC = () => {
  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");

  // Picture upload & thumbnail selection state
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  // Event types state (for tags)
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [eventTypeInput, setEventTypeInput] = useState("");

  // Handle file input changes (now appending files instead of replacing)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: FilePreview[] = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFilePreviews((prev) => {
        const updatedFiles = [...prev, ...newFiles];
        if (prev.length === 0 && updatedFiles.length > 0) {
          setThumbnailIndex(0); // Set thumbnail to the first file if none exist yet
        }
        return updatedFiles;
      });
    }
  };

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      filePreviews.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
    };
  }, [filePreviews]);

  // Set a specific image as the thumbnail
  const handleThumbnailSelect = (index: number) => {
    setThumbnailIndex(index);
  };

  // Remove an image from the filePreviews array
  const handleRemoveImage = (index: number) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    setThumbnailIndex((prevThumbnailIndex) => {
      if (index === prevThumbnailIndex) {
        // If the current thumbnail is removed, set thumbnail to the first image if available
        return 0;
      } else if (index < prevThumbnailIndex) {
        // Adjust the thumbnail index if a preceding image is removed
        return prevThumbnailIndex - 1;
      }
      return prevThumbnailIndex;
    });
  };

  // Add an event type (as a tag)
  const handleAddEventType = () => {
    const trimmedType = eventTypeInput.trim();
    if (trimmedType !== "" && !eventTypes.includes(trimmedType)) {
      setEventTypes([...eventTypes, trimmedType]);
      setEventTypeInput("");
    }
  };

  // Allow adding event types on Enter key press
  const handleEventTypeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEventType();
    }
  };

  // Remove an event type from the list
  const handleRemoveEventType = (typeToRemove: string) => {
    setEventTypes(eventTypes.filter((type) => type !== typeToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (eventTypes.length === 0) {
      alert("Please add at least one event type.");
      return;
    }

    if (filePreviews.length === 0) {
      alert("Please upload at least one picture.");
      return;
    }

    // Get JWT token from cookies
    const token = Cookies.get("user"); // Assuming the JWT is stored under 'user'

    // Build a FormData object for text and files
    const formData = new FormData();
    formData.append("eventTitle", eventTitle);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("eventDate", eventDate);

    // Append each image file
    filePreviews.forEach((fileObj) => {
      formData.append("images", fileObj.file);
    });

    // Append the thumbnail index
    formData.append("thumbnailIndex", thumbnailIndex.toString());

    // Append event types
    formData.append("eventTypes", JSON.stringify(eventTypes));

    try {
      const response = await fetch("http://localhost:3000/create-event", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add JWT token to Authorization header
        },
        body: formData,
      });

      if (response.ok) {
        alert("Event created successfully!");
      } else {
        const errorData = await response.json();
        alert(
          `Error: ${errorData.message || "Failed to create event"} ${response.status}`
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while creating the event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
      {/* Event Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter event title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter event description"
        ></textarea>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter event location"
        />
      </div>

      {/* Event Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Date
        </label>
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Event Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Types
        </label>
        <div className="mt-1">
          {/* Input to add a new event type */}
          <div className="mt-2 flex">
            <input
              type="text"
              value={eventTypeInput}
              onChange={(e) => setEventTypeInput(e.target.value)}
              onKeyDown={handleEventTypeKeyDown}
              className="flex-grow border border-gray-300 rounded-l-md p-2"
              placeholder="Enter event type and press Enter"
            />
            <button
              type="button"
              onClick={handleAddEventType}
              className="bg-gray-600 text-white px-4 hover:bg-gray-800 rounded-r-md"
            >
              Add
            </button>
          </div>
          {/* Display added event types as bubbles */}
          <div className="flex flex-wrap gap-2 mt-5 mb-5">
            {eventTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
              >
                <span>{type}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEventType(type)}
                  className="ml-1 text-red-500"
                  title="Remove type"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Picture Upload - Convert to + Button */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Pictures
        </label>
        <div className="flex items-center space-x-2">
          {/* "+" Button for uploading pictures */}
          <button
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
            className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full text-lg shadow-md hover:bg-gray-600 mt-2 mb-2"
            title="Add Images"
          >
            +
          </button>
          {/* Hidden File Input */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Display picture previews with thumbnail selection and remove functionality */}
        {filePreviews.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {filePreviews.map((fileObj, index) => (
              <div key={index} className="relative">
                <img
                  src={fileObj.preview}
                  alt={`Preview ${index + 1}`}
                  className="object-cover h-24 w-full rounded-md"
                />
                {/* Thumbnail Selection Button (moved to top left) */}
                <button
                  type="button"
                  onClick={() => handleThumbnailSelect(index)}
                  className={`absolute top-1 left-1 bg-white rounded-full p-1 border ${
                    thumbnailIndex === index
                      ? "border-gray-500"
                      : "border-gray-300"
                  }`}
                  title="Select as thumbnail"
                >
                  {thumbnailIndex === index ? "★" : "☆"}
                </button>
                {/* Remove Image Button (placed at top right) */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 border text-red-500"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
