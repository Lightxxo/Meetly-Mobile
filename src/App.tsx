import { useEffect, useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import {
  SearchContext,
  UserContext,
  UserLoadedContext,
} from "./contexts/Contexts";
import { SearchDataType, UserDataType, UserLoadedType } from "./types/types";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/LoginComponent";
import Signup from "./components/SignupComponent";
import AppBody from "./components/AppBody";
import { ToastContainer, Bounce } from "react-toastify";
import CreateEventPage from "./components/CreateEventPage";
import cookieStateSync from "./utils/cookieStateSync";
import SearchPage from "./components/SearchPage";
import EventDetailsPage from "./components/EventDetailsPage";
import UserPage from "./components/UserPage";
import Cookies from "js-cookie";
import Loading from "./components/Loading";
import EditEventPage from "./components/EditEventPage";

function App() {
  const [searchData, setSearchData] = useState<SearchDataType>({
    text: "",
    eventTypes: [],
    startTimestamp: "",
    endTimestamp: "",
  });

  const token = Cookies.get("user");

  const [userData, setUserData] = useState<UserDataType>({
    token: "",
    userID: "",
    username: "",
    email: "",
  });

  const [userLoaded, setUserLoaded] = useState<UserLoadedType>({
    loaded: false,
  });

  const location = useLocation();

  useEffect(() => {
    cookieStateSync(setUserData, setUserLoaded);
  }, []);

  useEffect(() => {
    if (token && userData.token.length) {
      setUserLoaded({ loaded: true });
    }
  }, [userData]);

  useEffect(() => {
    console.log(searchData);
  }, [searchData]);

  // NEW: Clear out the search context if the current route doesn't start with '/search'
  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setSearchData({
        text: "",
        eventTypes: [],
        startTimestamp: "",
        endTimestamp: "",
      });
    }
  }, [location.pathname, setSearchData]);

  if (token && !userLoaded.loaded) return <Loading />;

  return (
    <UserLoadedContext.Provider value={{ userLoaded, setUserLoaded }}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <SearchContext.Provider value={{ searchData, setSearchData }}>
          <div>
            <ToastContainer
              position="top-center"
              autoClose={500}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss
              pauseOnHover
              theme="light"
              transition={Bounce}
              className="text-center"
            />
          </div>
          <div className="flex flex-col">
            {/* Conditionally render AppHeader */}
            {location.pathname === "/" ||
            location.pathname === "/search" ||
            location.pathname.startsWith("/event") ? (
              <AppHeader />
            ) : null}

            <Routes>
              <Route path="/" element={<AppBody />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/event/:eventID" element={<EventDetailsPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/edit-event" element={<EditEventPage />} />
            </Routes>
          </div>
        </SearchContext.Provider>
      </UserContext.Provider>
    </UserLoadedContext.Provider>
  );
}

export default App;
