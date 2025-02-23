import { useNavigate } from "react-router-dom";

export default function EventListItem({ event, flag = false }: { event: any; flag?: boolean }) {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden flex items-center hover:shadow-lg transition duration-300 cursor-pointer ${
        !flag ? "hover:scale-105" : "hover:scale-101"
      }`}
      onClick={() => navigate(`/event/${event.eventID}`)}
    >
      {/* Thumbnail Image */}
      <div className="w-32 h-32 flex-shrink-0">
        <img
          src={event.thumbnail}
          alt={event.eventTitle}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Section */}
      <div className="flex flex-col p-4">
        <h3 className="text-xl font-bold mb-2">{event.eventTitle}</h3>
        <p className="text-gray-600 text-sm mb-1">
          📅 {new Date(event.eventDate).toLocaleDateString()}
        </p>
        <p className="text-gray-700 text-sm mb-1">📍 {event.location}</p>
        <p className="text-gray-500 text-sm mt-2 line-clamp-3">{event.description}</p>
      </div>
    </div>
  );
}
