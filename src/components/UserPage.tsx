import { useContext, useEffect, useState } from "react";
import { UserContext, UserLoadedContext } from "../contexts/Contexts";
import Cookies from "js-cookie";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import validateUser from "../utils/validateUser";
import cookieStateSync from "../utils/cookieStateSync";

function EventSection({
  title,
  events,
  totalCount,
  currentPage,
  limit,
  onPageChange,
  userEventDataLoaded,
}: any) {

  const navigate = useNavigate();
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    console.log("total", totalCount);
  }, [totalCount]);
  

  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-4 border-b pb-2">{title}</h3>
      <div className="bg-white border rounded-lg shadow-lg p-6 min-h-[300px] overflow-y-auto">
        {events && events.length > 0 ? (
          events.map((event: any) => (
            <div
              key={event.eventID}
              className="flex items-center p-4 mb-4 border rounded hover:bg-gray-50 cursor-pointer transition transform hover:scale-105"
              onClick={() => navigate(`/event/${event.eventID}`)}
            >
              <img
                src={event.thumbnail}
                alt={event.eventTitle}
                className="w-16 h-16 rounded-lg mr-6 object-cover"
              />
              <div>
                <p className="text-xl font-semibold">{event.eventTitle}</p>
                <p className="text-gray-600">
                  📍 {event.location} &nbsp; 🕒{" "}
                  {new Date(event.eventDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : userEventDataLoaded ? (
          <p className="text-gray-500 text-center">No events found.</p>
        ) : (
          <Loading />
        )}
      </div>
      {/* Pagination Controls */}
      {totalCount > limit ? (
        <div className="flex justify-center items-center mt-4 space-x-4">
          {currentPage > 1 && (
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}
          <span className="text-lg">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      ): <></>}
    </div>
  );
}

export default function UserPage() {
  const { userData, setUserData } = useContext(UserContext)!;
  const { userLoaded, setUserLoaded } = useContext(UserLoadedContext)!;
  const [userEventDataLoaded, setUserEventDataLoaded] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("user");

  // States for the 3 events sections
  const [myEvents, setMyEvents] = useState({
    events: "",
    totalCount: 0,
    currentPage: 1,
    limit: 5,
  });
  const [attendingEvents, setAttendingEvents] = useState({
    events: "",
    totalCount: 0,
    currentPage: 1,
    limit: 5,
  });
  const [interestedEvents, setInterestedEvents] = useState({
    events: "",
    totalCount: 0,
    currentPage: 1,
    limit: 5,
  });

  useEffect(() => {
    if (
      myEvents.events !== "" &&
      attendingEvents.events !== "" &&
      interestedEvents.events !== ""
    ) {
      setUserEventDataLoaded(true);
    }
  }, [myEvents, attendingEvents, interestedEvents]);

  useEffect(()=>{
    console.log(myEvents.currentPage, attendingEvents.currentPage, interestedEvents.currentPage)
  }, [myEvents, attendingEvents, interestedEvents])

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      cookieStateSync(setUserData, setUserLoaded);
    }
  }, [token, navigate, setUserData, setUserLoaded]);

  useEffect(() => {
    console.log(userData, userLoaded);
  }, [userData, userLoaded]);

  useEffect(() => {
    if (userLoaded.loaded) {
      validateUser(userData, setUserData, navigate, "", "/login", false);
      fetch(`http://localhost:3000/user?limit=5&offset=0`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMyEvents(data.myEvents);
          setAttendingEvents(data.attendingEvents);
          setInterestedEvents(data.interestedEvents);
        })
        .catch((err) => console.error("Failed to fetch events data", err));
    }
  }, [userLoaded, userData, setUserData, navigate, token]);

  // Pagination handlers for each section
  const handleMyEventsPageChange = (page: number) => {
    const offset = (page - 1) * myEvents.limit;
    fetch(
      `http://localhost:3000/user/my?limit=${myEvents.limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Update events and currentPage directly in the state
        setMyEvents((prevState) => ({
        ...prevState,
          ...data,
          currentPage: page, // Make sure to update currentPage
        }));
      })
      .catch((err) => console.error("Failed to fetch my events", err));
  };
  
  const handleAttendingEventsPageChange = (page: number) => {
    const offset = (page - 1) * attendingEvents.limit;
    fetch(
      `http://localhost:3000/user/attending?limit=${attendingEvents.limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Update events and currentPage directly in the state
        setAttendingEvents((prevState) => ({
            ...prevState,
          ...data,
          currentPage: page, // Make sure to update currentPage
        }));
      })
      .catch((err) => console.error("Failed to fetch attending events", err));
  };
  
  const handleInterestedEventsPageChange = (page: number) => {
    const offset = (page - 1) * interestedEvents.limit;
    fetch(
      `http://localhost:3000/user/interested?limit=${interestedEvents.limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Update events and currentPage directly in the state
        setInterestedEvents((prevState) => ({
            ...prevState,
          ...data,
          currentPage: page, // Make sure to update currentPage
        }));
      })
      .catch((err) => console.error("Failed to fetch interested events", err));
  };
  

  if (!userLoaded.loaded && !userEventDataLoaded) return <Loading />;

  return (
    <div className="container mx-auto p-6">
      {/* Back Arrow Button */}
      <div className="mb-6">
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="ml-2 text-lg">Back</span>
        </button>
      </div>

      {/* User Details */}
      <div className="flex flex-col items-center border-b pb-6 mb-4">
        <div className="flex items-center space-x-6">
          <div
            className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-300 
                       text-gray-800 text-4xl font-bold transition-all duration-300"
          >
            {userData.username ? userData.username[0].toUpperCase() : ""}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold">{userData.username}</h2>
            <p className="text-xl text-gray-500">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* Additional User Info Section */}
      <div className="border-b pb-8 pt-2 mb-8">
        <p className="text-2xl font-semibold text-gray-700 text-center">
          Welcome back, {userData.username}!
        </p>
        <p className="text-lg text-gray-600 text-center">
          You have <span className="font-bold">{myEvents.totalCount}</span>{" "}
          events created,{" "}
          <span className="font-bold">{attendingEvents.totalCount}</span> events
          you're attending, and{" "}
          <span className="font-bold">{interestedEvents.totalCount}</span>{" "}
          events you're interested in.
        </p>
      </div>

      {/* Events Sections */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <EventSection
          title="My Events"
          events={myEvents.events}
          totalCount={myEvents.totalCount}
          currentPage={myEvents.currentPage}
          limit={myEvents.limit}
          onPageChange={(page: number) => handleMyEventsPageChange(page)}
          userEventDataLoaded={userEventDataLoaded}
        />
        <EventSection
          title="Attending Events"
          events={attendingEvents.events}
          totalCount={attendingEvents.totalCount}
          currentPage={attendingEvents.currentPage}
          limit={attendingEvents.limit}
          onPageChange={(page: number) => handleAttendingEventsPageChange(page)}
          userEventDataLoaded={userEventDataLoaded}
        />
        <EventSection
          title="Interested Events"
          events={interestedEvents.events}
          totalCount={interestedEvents.totalCount}
          currentPage={interestedEvents.currentPage}
          limit={interestedEvents.limit}
          onPageChange={(page: number) =>
            handleInterestedEventsPageChange(page)
          }
          userEventDataLoaded={userEventDataLoaded}
        />
      </div>
    </div>
  );
}
