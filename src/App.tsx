import { useEffect, useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import { SearchContext } from "./contexts/Contexts";
import { SearchDataType } from "./types/search";
import { Route, Routes, useLocation } from "react-router-dom";  // Import useLocation
import Login from "./components/LoginComponent";
import Signup from "./components/SignupComponent";
import AppBody from "./components/AppBody";
import SearchResults from "./components/SearchResults";

function App() {
  const [searchData, setSearchData] = useState<SearchDataType>({
    text: "",
    type: "",
    timestamp: null,
  });

  const location = useLocation(); // Get the current location (route)

  useEffect(() => {
    console.log(searchData);
  }, [searchData]);

  return (
    <SearchContext.Provider value={{ searchData, setSearchData }}>
      <div className="flex flex-col">
        {/* Conditionally render AppHeader */}
        {location.pathname !== "/login" && location.pathname !== "/signup" && <AppHeader />}
        
        <Routes>
          <Route path="/" element={<AppBody />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchResults></SearchResults>} />
        </Routes>
      </div>
    </SearchContext.Provider>
  );
}

export default App;
