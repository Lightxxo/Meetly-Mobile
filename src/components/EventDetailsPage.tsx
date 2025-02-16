import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import { UserContext } from "../contexts/Contexts";
import cookieStateSync from "../utils/cookieStateSync";
import Cookies from "js-cookie";

export default function EventDetailsPage() {
  const { eventID } = useParams<{ eventID: string }>();
  const [details, setDetails] = useState<any>(null);
  const [rsvp, setRsvp] = useState(null);
  const [going, setGoing] = useState(0);
  const [interested, setInterested] = useState(0);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  const [userLoaded, setUserLoaded] = useState(false);

  if (!userContext) {
    throw new Error(
      "CreateEventButton must be used within a UserContext.Provider"
    );
  }

  const { userData, setUserData } = userContext;



  useEffect(() => {
    const token = Cookies.get("user");
    console.log(userLoaded, token)
    // Check if the token exists and if user is loaded
    if (userLoaded && token) {
      try {
        const parsedToken = JSON.parse(token); // Safely parse token
        
        const fetchCurrentUserStatus = async () => {
          const response = await fetch(
            `http://localhost:3000/rsvp-status?userID=${userData.userID}&eventID=${eventID}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JSON.stringify({token: parsedToken.token})}`,
              },
            }
          );
  
        //   console.log("#######################################", response.status, userData.userID, eventID, "PARSED TOKIE", parsedToken, token);
  
          if (response.status === 200) {
            const data = await response.json();
            setRsvp(data.status.toLowerCase());
          } else if (response.status === 404) {
            setRsvp(null);
          } else {
            // Invalid token, force logout
            Cookies.remove("user");
            setUserData({
              token: '',
              userID: '',
              username: '',
              email: ''
            });
          }
        };
  
        fetchCurrentUserStatus(); // Call fetch if conditions are met
      } catch (error) {
        console.error("Error parsing token", error);
      }
    }
  }, [userLoaded]); // Dependency on userData.userID to refetch on change
  

  useEffect(() => {
    cookieStateSync(setUserData);
  }, []);


  useEffect(() => {
    if (details) {
      setGoing(details.goingCount);
      setInterested(details.interestedCount);
    }
  }, [details]); 
  
  useEffect(() => {
    const cookie = Cookies.get("user");

    if (cookie) {
      if (userData.token.length) {
        setUserLoaded(true);
      } else {
        setUserLoaded(false);
      }
    }
  }, [userData]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/event/${eventID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Fetched event details:", data);
        setDetails(data);
      } catch (error: any) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventID]);

  if (loading && !userLoaded) return <Loading />;
  if (!details)
    return <div className="text-center p-4">No event details available.</div>;

  const {
    event,
    images,
    attendees,
    comments,
    host,
  } = details;


  interface AttendeeAvatarProps {
    username?: string;
  }

  function handleRSVP(flag:string){
    if(rsvp !== flag){
        //do stuff
        
        const CONTINUEFROMHERE = 10
    }
  }

  const AttendeeAvatar: React.FC<AttendeeAvatarProps> = ({ username }) => {
    const initial = username ? username.charAt(0).toUpperCase() : "?";

    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-800 text-lg font-bold">
        {initial}
      </div>
    );
  };

  return (
    <div>
      <div className="container mx-auto p-6 space-y-10">
        {/* Event Title & Hosted By */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 pb-10 break-all">
            {event.eventTitle}
          </h1>
          <div className="flex items-center space-x-4">
            <AttendeeAvatar username={host.username} />
            <div>
              <p className="text-lg font-semibold">Hosted by</p>
              <p className="text-gray-700">{host.username}</p>
            </div>
          </div>
        </div>

        {/* Main Event Image */}
        <div className="w-full h-[450px] overflow-hidden rounded-lg shadow-md">
          <img
            src={event.thumbnail}
            alt={event.eventTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details & RSVP Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Event Description */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {/* Right: Event Meta Details */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-gray-500">📅</span>
              <p className="text-lg">
                {new Date(event.eventDate).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-500">📍</span>
              <p className="text-lg">{event.location}</p>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <p className="text-lg font-semibold">
                {going} Going | {interested} Interested
              </p>
            </div>

            {/* RSVP Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                RSVP
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  className={`px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition w-full sm:w-auto ${rsvp === 'going' ? 'bg-red-500' :''}`}
                  onClick={() => {
                    handleRSVP("going")
                  }}
                >
                  <p>✅</p>
                  Going
                </button>
                <button
                  className="px-4 py-2 bg-neutral-100 text-black font-semibold rounded-lg shadow-md hover:bg-neutral-300 transition w-full sm:w-auto"
                  onClick={() => {
                    handleRSVP("interested")
                  }}
                >
                  <p>⭐ </p>
                  Interested
                </button>
                <button
                  className="px-4 py-2 bg-neutral-950 text-white font-semibold rounded-lg shadow-md hover:bg-neutral-700 transition w-full sm:w-auto"
                  onClick={() => {
                    handleRSVP("not going")
                  }}
                >
                  <p>❌</p> 
                  Not Going
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendees and RSVP Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Attendees List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Attendees (Going)
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {attendees && attendees.length > 0 ? (
                attendees.map((att: any, index: number) => (
                  <div key={index} className="flex flex-row items-center gap-2">
                    <AttendeeAvatar username={att.User?.username} />
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {att.User?.username || "Unknown"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No attendees found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images && images.length > 0 ? (
            images.map((img: any, index: number) => (
              <img
                key={index}
                src={img.image}
                alt={`${event.eventTitle} ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg shadow-md"
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No images available.
            </p>
          )}
        </div>
      </div>

        {/* Comments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Comments
          </h2>
          <div>
            {comments && comments.length > 0 ? (
              comments.map((comment: any, index: number) => (
                <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">{comment.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
