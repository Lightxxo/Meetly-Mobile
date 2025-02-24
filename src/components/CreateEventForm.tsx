import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import EventTypeInput from "./EventTypeInput"; // Import the reusable component

type FilePreview = {
  file: File;
  preview: string;
};

const CreateEventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  // Removed the separate eventTypeInput state

  // Handle file input changes (appending files)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: FilePreview[] = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setFilePreviews((prev) => {
        const updatedFiles = [...prev, ...newFiles];

        if (prev.length === 0 && updatedFiles.length > 0) {
          setThumbnailIndex(0);
        }

        return updatedFiles;
      });

      // Clear file input value to prevent re-uploading the same file
      e.target.value = "";
    }
  };

  useEffect(() => {
    return () => {
      filePreviews.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
    };
  }, [filePreviews]);

  // Set a specific image as the thumbnail
  const handleThumbnailSelect = (index: number) => {
    setThumbnailIndex(index);
  };

  // Clear all images, reset thumbnail, and cleanup preview URLs
  const handleClearImages = () => {
    setFilePreviews([]);
    setThumbnailIndex(0);
  };

  const handleRemoveEventType = (typeToRemove: string) => {
    setEventTypes(eventTypes.filter((type) => type !== typeToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (eventTypes.length === 0) {
      toast("Please add at least one event type.");
      return;
    }

    if (filePreviews.length === 0) {
      toast("Please upload at least one picture.");
      return;
    }

    const token = Cookies.get("user");

    const formData = new FormData();
    formData.append("eventTitle", eventTitle);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("eventDate", eventDate);

    filePreviews.forEach((fileObj) => {
      formData.append("images", fileObj.file);
    });

    formData.append("thumbnailIndex", thumbnailIndex.toString());
    formData.append("eventTypes", JSON.stringify(eventTypes));

    try {
      const response = await fetch("http://localhost:3000/create-event", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast("Event created successfully!");
      } else {
        const errorData = await response.json();
        toast(`Error: ${errorData.message || "Failed to create event"} ${response.status}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast("An error occurred while creating the event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
      {/* Event Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Title</label>
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
        <label className="block text-sm font-medium text-gray-700">Description</label>
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
        <label className="block text-sm font-medium text-gray-700">Location</label>
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
        <label className="block text-sm font-medium text-gray-700">Event Date</label>
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
        <label className="block text-sm font-medium text-gray-700">Event Types</label>
        <div className="mt-1">
          <div className="mt-2 flex">
            <EventTypeInput
              onAdd={(eventType: string) => {
                if (!eventTypes.includes(eventType)) {
                  setEventTypes([...eventTypes, eventType]);
                }
              }}
              existingEventTypes={eventTypes}
            />
          </div>
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

      {/* Picture Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Pictures</label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
            className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full text-lg shadow-md hover:bg-gray-600 mt-2 mb-2"
            title="Add Images"
          >
            +
          </button>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {filePreviews.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {filePreviews.map((fileObj, index) => (
              <div key={index} className="relative">
                <img
                  src={fileObj.preview}
                  alt={`Preview ${index + 1}`}
                  className="object-cover h-24 w-full rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleThumbnailSelect(index)}
                  className={`absolute top-1 left-1 bg-white rounded-full p-1 border ${
                    thumbnailIndex === index ? "border-gray-500" : "border-gray-300"
                  }`}
                  title="Select as thumbnail"
                >
                  {thumbnailIndex === index ? "★" : "☆"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Clear Images Button */}
        <button
          type="button"
          onClick={handleClearImages}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full"
        >
          Clear All Images
        </button>
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
