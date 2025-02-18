import { useContext, useEffect, useState } from "react";
import { UserContext, UserLoadedContext } from "../contexts/Contexts";
import Cookies from "js-cookie";
import cookieStateSync from "../utils/cookieStateSync";
import Loading from "./Loading";
import EventCard from "./EventCard";

export default function HomeEventListSection() {
  const userContext = useContext(UserContext);
  const { setUserLoaded} = useContext(UserLoadedContext)!;
  const [isLoaded, setIsLoaded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [eventData, setEventData] = useState<any>({ events: [], totalEvents: 0, hasMore: false });
  const limit = 9; //events per page

  if (!userContext) {
    throw new Error(
      "HomeEventListSection must be used within a UserContext.Provider"
    );
  }

  const { userData, setUserData } = userContext;

  useEffect(() => {
    cookieStateSync(setUserData, setUserLoaded);
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events?limit=${limit}&offset=${offset}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched events:", data);
        setEventData(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, [offset]);
  
  useEffect(() => {
    const cookie = Cookies.get("user");
    console.log("EVENTDATA", eventData);
    if (cookie) {
      if (userData.token.length && eventData.events.length) {
        setIsLoaded(true);
      } else {
        setIsLoaded(false);
      }
    } else {
      if (eventData.events.length) {
        setIsLoaded(true);
      } else {
        setIsLoaded(false);
      }
    }
  }, [userData, eventData]);
  
  function HomeEventList() {
    const totalPages = Math.ceil(eventData.totalEvents / limit);
    const currentPage = Math.floor(offset / limit) + 1;
  
    return (
      <div className="container mx-auto px-4 py-6">
        {eventData.totalEvents ? (
          <>
            <h2 className="text-4xl font-bold mb-10">Upcoming Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventData.events.map((event: any, index: number) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
  
            {/* Pagination Controls */}
            {eventData.totalEvents > limit && (
              <div className="mt-10 flex justify-center items-center space-x-4">
                {currentPage > 1 && (
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                    onClick={() => setOffset(offset - limit)}
                  >
                    Prev
                  </button>
                )}
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                    onClick={() => setOffset(offset + limit)}
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <h2 className="text-2xl font-bold mb-4">No Events Available</h2>
        )}
      </div>
    );
  }
  
  return <div>{isLoaded ? <HomeEventList /> : <Loading />}</div>;
}
