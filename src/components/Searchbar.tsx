import React, { useContext, useEffect } from "react";
import { SearchContext } from "../contexts/Contexts";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

let lastQueryString = "";

const SearchBar: React.FC = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("SearchBar must be used within a SearchContext.Provider");
  }
  const { searchData, setSearchData } = context;
  const navigate = useNavigate();

  const handleSearchBarClick = () => {
    navigate("/search");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Debounce effect: wait 500ms after searchData changes before potentially calling the API.
  useEffect(() => {
    const timer = setTimeout(() => {
      // Build a string representation of the current query.
      const currentQuery = JSON.stringify({
        text: searchData.text,
        eventTypes: searchData.eventTypes,
        startTimestamp: searchData.startTimestamp,
        endTimestamp: searchData.endTimestamp,
      });

      // Compare with our module-level variable.
      if (currentQuery === lastQueryString) {
        console.log("Duplicate API call detected, skipping:", currentQuery);
        return;
      }

      // Update our module-level variable.
      lastQueryString = currentQuery;

      // If all search fields are empty, clear results and skip the API call.
      if (
        searchData.text.trim() === "" &&
        (!searchData.eventTypes || searchData.eventTypes.length === 0) &&
        !searchData.startTimestamp &&
        !searchData.endTimestamp
      ) {
        setSearchData((prevData) => ({ ...prevData, results: [] }));
        return;
      }

      // Build URL parameters.
      const params = new URLSearchParams();
      params.append("text", searchData.text);
      if (searchData.eventTypes && searchData.eventTypes.length > 0) {
        params.append("types", searchData.eventTypes.join(","));
      }
      if (searchData.startTimestamp) {
        params.append("start", searchData.startTimestamp);
      }
      if (searchData.endTimestamp) {
        params.append("end", searchData.endTimestamp);
      }

      // Make the API call.
      (async () => {
        try {
          const response = await fetch(`http://localhost:3000/search?${params.toString()}`);
          const data = await response.json();
          setSearchData((prevData) => ({
            ...prevData,
            results: data,
          }));
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      })();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchData.text,
    searchData.eventTypes,
    searchData.startTimestamp,
    searchData.endTimestamp,
    setSearchData,
  ]);

  return (
    <div className="relative flex items-center max-w-4xl mx-auto" onClick={handleSearchBarClick}>
      <textarea
        name="text"
        value={searchData.text}
        onChange={handleChange}
        placeholder="🔍  Search For Event Title or Event Venue..."
        className="p-2 w-lg h-12 border border-gray-300 shadow-sm rounded-full py-[10px] resize-none pl-4 pr-10"
      />
      {searchData.text.length ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSearchData((prevData) => ({ ...prevData, text: "" }));
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-gray-400 cursor-pointer"
        >
          <FaTimes />
        </button>
      ) : null}
    </div>
  );
};

export default SearchBar;
