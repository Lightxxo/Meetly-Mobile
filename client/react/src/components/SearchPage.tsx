import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaRedo } from "react-icons/fa";
import { SearchContext } from "../contexts/Contexts";
import EventListItem from "./EventListItem";
import EventTypeInput from "./EventTypeInput";
import Loading from "./Loading"; // Your Loading component

export default function SearchPage() {
  const { searchData, setSearchData } = useContext(SearchContext)!;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const debounceDelay = 500; // milliseconds
  let debounceTimer: NodeJS.Timeout;

  // Initialize search data from URL params on mount
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when searchData changes
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

  // Define the search function (e.g., an API call)
  const performSearch = async () => {
    // Simulate a search delay. Replace this with your actual API call.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // When search completes, update your context with results.
    // For example:
    // const results = await fetchSearchResults(searchData);
    // setSearchData((prev) => ({ ...prev, results }));
  };

  // Trigger debounced search whenever search criteria change
  useEffect(() => {
    // Only run search if there's a query to search for
    if (
      !searchData.text &&
      (!searchData.eventTypes || searchData.eventTypes.length === 0) &&
      !searchData.startTimestamp &&
      !searchData.endTimestamp
    ) {
      return;
    }

    setIsSearching(true);

    // Set a debounce timer
    debounceTimer = setTimeout(async () => {
      await performSearch();
      setIsSearching(false);
    }, debounceDelay);

    // Clear timer if criteria change before debounceDelay
    return () => clearTimeout(debounceTimer);
    // Trigger on any change in these search criteria
  }, [
    searchData.text,
    searchData.eventTypes,
    searchData.startTimestamp,
    searchData.endTimestamp,
  ]);

  return (
    <div className="p-6 lg:p-12 xl:p-16 w-full max-w-full mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Filters</h1>

      {/* Filter Section */}
      <div className="border border-gray-300 rounded-lg p-6 mb-8 shadow-lg bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Types Section */}
          <div className="w-full lg:border-r lg:border-gray-300 pr-8">
            <label className="block mb-4 mt-3 font-semibold text-gray-700">
              Event Types
            </label>
            <div className="flex gap-2 mb-8">
              <EventTypeInput
                onAdd={(eventType: string) => {
                  if (!searchData.eventTypes.includes(eventType)) {
                    setSearchData((prev) => ({
                      ...prev,
                      eventTypes: [...prev.eventTypes, eventType],
                    }));
                  }
                }}
                existingEventTypes={searchData.eventTypes}
              />
            </div>
            {searchData.eventTypes.length > 0 && (
              <div className="border-gray-300 border-t-2 pt-6 mt-4">
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
            <label className="block mb-2 font-semibold text-gray-700">
              Timestamp Range
            </label>
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

      {/* Search Results Section */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Search Results
        </h2>
        {isSearching && <Loading />}
        {!isSearching && searchData.results && searchData.results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchData.results.map((event, index) => (
              <EventListItem event={event} key={index} flag={true} />
            ))}
          </div>
        ) : (
          !isSearching && <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}
