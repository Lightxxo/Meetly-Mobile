import { useContext, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext, UserLoadedContext } from "../contexts/Contexts";
import Loading from "./Loading";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import EventTypeInput from "./EventTypeInput"; // Import the reusable component
import useConfirmDelete from "./useConfirmDelete";

type ImageItem = {
  id: string;
  isExisting: boolean;
  file?: File;
  url: string;
};

export default function EditEventPage() {
  const { userLoaded } = useContext(UserLoadedContext)!;
  const { userData, setUserData } = useContext(UserContext)!;
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirmDelete, modal } = useConfirmDelete();

  // Form fields
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationField, setLocationField] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  // Removed the separate eventTypeInput state since we're using EventTypeInput
  // const [eventTypeInput, setEventTypeInput] = useState("");

  // Unified images array state & thumbnail selection index
  const [images, setImages] = useState<ImageItem[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);

  const locationObj = useLocation();
  const eventObj = locationObj.state;
  console.log("########### event obj ", eventObj);
  const queryParams = new URLSearchParams(locationObj.search);
  const eventID = queryParams.get("eventID")!;
  const token = Cookies.get("user");
  const navigate = useNavigate();

  if (eventObj === null) {
    toast("Unauthorized");
    Cookies.remove("user");
    setUserData({
      token: "",
      userID: "",
      username: "",
      email: "",
    });
    navigate("/");
    return;
  }

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/event-edit/${eventID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setEventData(data);
      } catch (error: any) {
        console.error("Error fetching event details:", error);
        toast("Unauthorized");
        Cookies.remove("user");
        setUserData({
          token: "",
          userID: "",
          username: "",
          email: "",
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (!token || eventObj.event.hostID !== userData.userID) {
      toast("Unauthorized");
      Cookies.remove("user");
      setUserData({
        token: "",
        userID: "",
        username: "",
        email: "",
      });
      navigate("/");
    } else {
      // fetchEventDetails();
      console.log(eventObj);
      setEventData(eventObj);
      setLoading(false);
    }
  }, [eventID, token, navigate, setUserData, userData]);

  useEffect(() => {
    console.log("$$$$$", eventData);
  }, [eventData]);

  useEffect(() => {
    if (!loading && userLoaded && eventData) {
      if (userData.userID !== eventData.event.hostID) {
        toast("Unauthorized");
        Cookies.remove("user");
        setUserData({
          token: "",
          userID: "",
          username: "",
          email: "",
        });
        navigate(-1);
      }
    }
  }, [loading, userLoaded, eventData, userData, navigate, setUserData]);

  // Prefill form fields and images after eventData is loaded
  useEffect(() => {
    if (eventData !== null) {
      setLoading(false);
    }

    if (eventData && eventData.event) {
      const { event } = eventData;
      setEventTitle(event.eventTitle || "");
      setDescription(event.description || "");
      setLocationField(event.location || "");

      // Convert eventDate for datetime-local input
      const dateObj = new Date(event.eventDate);
      const localDateTime = new Date(
        dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setEventDate(localDateTime);

      // Prefill event types
      if (eventData.eventTypes.length) {
        setEventTypes(eventData.eventTypes);
      }

      // Process existing images
      if (eventData.images && Array.isArray(eventData.images)) {
        const existingImages: ImageItem[] = eventData.images.map((img: any) => ({
          id: img.image, // using the image URL as the unique id
          isExisting: true,
          url: img.image,
        }));
        setImages(existingImages);

        // Set the thumbnailIndex to match the thumbnail URL from the event
        const thumbIdx = existingImages.findIndex((img) => img.url === event.thumbnail);
        setThumbnailIndex(thumbIdx >= 0 ? thumbIdx : 0);
      }
    }
  }, [eventData]);

  // Clean up object URLs for new images when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (!img.isExisting && img.file) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  // Handle file input change for new images
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: ImageItem[] = Array.from(e.target.files).map((file) => ({
        id: Date.now().toString() + Math.random().toString(), // generate temporary unique id
        isExisting: false,
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prev) => {
        const updated = [...prev, ...newFiles];
        // If there were no images before, set thumbnail to the first one.
        if (prev.length === 0 && updated.length > 0) {
          setThumbnailIndex(0);
        }
        return updated;
      });
      e.target.value = "";
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      const updated = prev.filter((img) => img.id !== id);
      // Reset thumbnailIndex to 0 if the one deleting is the thumbnail
      if (index === thumbnailIndex) {
        setThumbnailIndex(0);
      } else if (index < thumbnailIndex) {
        // Adjust the thumbnail index if an earlier image was removed.
        setThumbnailIndex((prevIdx) => Math.max(prevIdx - 1, 0));
      }
      return updated;
    });
  };

  // Handlers for event types are now managed by EventTypeInput
  const handleRemoveEventType = (type: string) => {
    setEventTypes((prev) => prev.filter((t) => t !== type));
  };

  // Handle thumbnail selection when clicking an image preview
  const handleThumbnailSelect = (index: number) => {
    setThumbnailIndex(index);
  };

  // Submit updated event
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast("Please upload at least one image.");
      return;
    }

    if (eventTypes.length === 0) {
      toast("Please add at least one event type.");
      return;
    }

    const formData = new FormData();
    formData.append("eventID", eventID);
    formData.append("eventTitle", eventTitle);
    formData.append("description", description);
    formData.append("location", locationField);
    formData.append("eventDate", eventDate);
    formData.append("eventTypes", JSON.stringify(eventTypes));
    formData.append("thumbnailIndex", thumbnailIndex.toString());

    // Separate existing images (by URL) and new images (File)
    const existingImages = images.filter((img) => img.isExisting).map((img) => img.url);
    formData.append("existingImages", JSON.stringify(existingImages));
    images
      .filter((img) => !img.isExisting && img.file)
      .forEach((img) => {
        formData.append("newImages", img.file!);
      });
    console.log("BEFORE SUBMIT:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await fetch(`http://localhost:3000/edit-event/${eventID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast("Event updated successfully!");
        // Optionally redirect or update the UI here
      } else {
        const errorData = await res.json();


        toast(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast("An error occurred while updating the event.");
    }
  };

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/delete-event/${eventID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        toast("Failed to delete event");
      } else {
        await response.json();
        toast("Event deleted successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast("Something went wrong");
    }
  }

  if (!userLoaded || loading) return <Loading />;

  return (
    <div>
      {/* Back Arrow Button */}
      <div className="mb-2 mt-6 ml-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:text-blue-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-2 text-lg">Back</span>
        </button>
      </div>

      <div className="text-4xl text-center mb-6 flex flex-row justify-center items-center">
        ✎ |<p className="font-bold">&nbsp;Edit Event</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4 mt-6">
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
            value={locationField}
            onChange={(e) => setLocationField(e.target.value)}
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
              {Array.isArray(eventTypes) && eventTypes.length > 0 ? (
                eventTypes.map((type, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-full hover:bg-gray-300 cursor-pointer"
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
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No event types added</p>
              )}
            </div>
          </div>
        </div>

        {/* Picture Upload & Thumbnail Selection */}
        <div className="border-2 border-zinc-300 rounded-xl">
          <label className="block p-2 text-md mb-2 mt-1 font-medium text-gray-700 ">
            Upload Pictures
          </label>
          <hr />
          <div className="flex items-center space-x-2 p-2">
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
          {images.length > 0 && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    alt="Preview"
                    className="object-cover w-full max-w-full h-auto max-h-24 rounded-md m-2"
                    style={{ maxWidth: "calc(100% - 1rem)" }}
                  />
                  {/* Thumbnail selection button */}
                  <button
                    type="button"
                    onClick={() => handleThumbnailSelect(idx)}
                    className={`absolute top-4 left-4 bg-white rounded-full p-1 border hover:bg-zinc-100 ${
                      idx === thumbnailIndex ? "border-gray-500" : "border-gray-300"
                    }`}
                    title="Select as thumbnail"
                  >
                    {idx === thumbnailIndex ? "★" : "☆"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
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
            Update Event
          </button>
        </div>
      </form>

      <div className="flex flex-row justify-center items-center">
        <button
          onClick={()=>{
            confirmDelete(handleDelete);
          }}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 w-[480px]"
        >
          Delete Event
        </button>
      </div>
      {modal}
    </div>
  );
}
