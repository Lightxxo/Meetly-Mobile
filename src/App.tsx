import { useEffect, useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import { SearchContext, UserContext } from "./contexts/Contexts";
import { SearchDataType, UserDataType } from "./types/search";
import { Route, Routes, useLocation } from "react-router-dom";  
import Login from "./components/LoginComponent";
import Signup from "./components/SignupComponent";
import AppBody from "./components/AppBody";
import SearchResults from "./components/SearchResults";
import Cookies from "js-cookie";

function App() {
  const [searchData, setSearchData] = useState<SearchDataType>({
    text: "",
    type: "",
    timestamp: null,
  });

  const [userData, setUserData] = useState<UserDataType>(
    {
      token : '',
      userID: '',
      username: '',
      email: '',
    }
  );

  const location = useLocation(); 

  useEffect(() => {
    Cookies.get('user')
  }, []);

  useEffect(() => {
    console.log(searchData);
  }, [searchData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
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
    </UserContext.Provider>
  );
}

export default App;
