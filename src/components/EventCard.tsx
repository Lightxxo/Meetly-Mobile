import { useNavigate } from "react-router-dom";

export default function EventCard({ event }: { event: any }) {
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-white shadow-md rounded-lg p-0 pb-4 hover:shadow-lg transition duration-300 cursor-pointer transition transform hover:scale-105"
      onClick={() => navigate(`/event/${event.eventID}`)}
    >
      {/* Thumbnail Image */}
      <img
        src={event.thumbnail}
        alt={event.eventTitle}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      {/* Event Title */}
      <h3 className="text-xl pl-4 pr-4 font-bold mb-2">{event.eventTitle}</h3>

      {/* Event Date */}
      <p className="text-gray-600 pl-4 pr-4 text-sm">
        📅 {new Date(event.eventDate).toLocaleDateString()}
      </p>

      {/* Location */}
      <p className="text-gray-700 pl-4 pr-4 text-sm mt-1">📍 {event.location}</p>

      {/* Description */}
      <p className="text-gray-500 pl-4 pr-4 text-sm mt-2 line-clamp-3">{event.description}</p>
    </div>
  );
}
