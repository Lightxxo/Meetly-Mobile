import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaRedo } from "react-icons/fa";
import { SearchContext } from "../contexts/Contexts";
import EventListItem from "./EventListItem";

export default function SearchPage() {
  const { searchData, setSearchData } = useContext(SearchContext)!;
  const [searchParams, setSearchParams] = useSearchParams();
  const [newEventType, setNewEventType] = useState("");

  useEffect(() => {
    const text = searchParams.get("text") || "";
    const typesParam = searchParams.get("types") || "";
    const start = searchParams.get("start") || "";
    const end = searchParams.get("end") || "";

    const eventTypes = typesParam ? typesParam.split(",").filter((t) => t) : [];

    setSearchData((prev) => ({
      ...prev,
      text,
      eventTypes,
      startTimestamp: start,
      endTimestamp: end,
    }));
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchData.text) params.text = searchData.text;
    if (searchData.eventTypes && searchData.eventTypes.length > 0) {
      params.types = searchData.eventTypes.join(",");
    }
    if (searchData.startTimestamp) params.start = searchData.startTimestamp;
    if (searchData.endTimestamp) params.end = searchData.endTimestamp;

    setSearchParams(params);
  }, [searchData, setSearchParams]);

  return (
    <div className="p-6 lg:p-12 xl:p-16 w-full max-w-full mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Filters</h1>

      {/* Filter Section */}
      <div className="border border-gray-300 rounded-lg p-6 mb-8 shadow-lg bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Types Section */}
          <div className="w-full lg:border-r lg:border-gray-300 pr-8">
            <label className="block mb-2 font-semibold text-gray-700">Event Types</label>
            <div className="flex gap-2 mb-8">
              <input
                type="text"
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value)}
                placeholder="Add event type"
                className="p-3 w-full border border-gray-300 rounded-lg shadow-sm"
              />
              <button
                onClick={() => {
                  if (newEventType && !searchData.eventTypes.includes(newEventType)) {
                    setSearchData((prev) => ({
                      ...prev,
                      eventTypes: [...prev.eventTypes, newEventType],
                    }));
                    setNewEventType("");
                  }
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg transition hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            {/* Event Type Bubbles */}
            {searchData.eventTypes.length > 0 && (
              <div className=" border-gray-300 border-t-2 pt-6 mt-4">
                <div className="flex flex-wrap gap-2">
                  {searchData.eventTypes.map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-lg"
                    >
                      <span>{type}</span>
                      <button
                        onClick={() =>
                          setSearchData((prev) => ({
                            ...prev,
                            eventTypes: prev.eventTypes.filter((t) => t !== type),
                          }))
                        }
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timestamp Range Section */}
          <div className="w-full">
            <label className="block mb-2 font-semibold text-gray-700">Timestamp Range</label>
            <div className="flex gap-0 items-center">
              <div className="flex-1 mr-4">
                <label className="block text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  value={searchData.startTimestamp}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      startTimestamp: e.target.value,
                    }))
                  }
                  className="p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  value={searchData.endTimestamp}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      endTimestamp: e.target.value,
                    }))
                  }
                  className="p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              {/* Reset Button placed inside the Timestamp Range */}
              <button
                onClick={() =>
                  setSearchData((prev) => ({
                    ...prev,
                    startTimestamp: "",
                    endTimestamp: "",
                  }))
                }
                className="w-6 h-6 mb-9 ml-2 flex items-center justify-center bg-red-300 text-red-700 rounded-full transition hover:bg-red-400"
              >
                <FaRedo />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Display Search Results */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Search Results</h2>
        {searchData.results && searchData.results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchData.results.map((event, index) => (
              <EventListItem event={event} key={index} flag={true}/>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}
