import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { UserContext, UserLoadedContext } from "../contexts/Contexts";
import Cookies from "js-cookie";
import Loading from "./Loading";
import EventCard from "./EventCard";

export default function HomeEventListSection() {
  const userContext = useContext(UserContext);
  const { userLoaded } = useContext(UserLoadedContext)!;

  if (!userContext) throw new Error("Must be used within a UserContext.Provider");

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const limit = 9;

  // fetch Events
  const fetchEvents = useCallback(async () => {
    if (!hasMore) return; // stop if no more data
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/events?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setEvents((prevEvents) => [...prevEvents, ...data.events]); // Append new data
      setHasMore(data.events.length === limit); // Stop fetching if fewer than `limit` items
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore]);

  useEffect(() => {
    fetchEvents();
  }, [offset]); // only fetch when offset updates

  // infinite Scroll Trigger
  const lastEventRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setOffset((prevOffset) => prevOffset + limit);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  if (Cookies.get("user") && !userLoaded.loaded) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-bold mb-10">Upcoming Events</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>

      {/* Invisible Loader for Infinite Scroll */}
      <div ref={lastEventRef} className="h-10" />

      {loading && <Loading />}
    </div>
  );
}
