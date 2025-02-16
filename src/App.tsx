import { useEffect, useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import { SearchContext, UserContext } from "./contexts/Contexts";
import { SearchDataType, UserDataType } from "./types/types";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/LoginComponent";
import Signup from "./components/SignupComponent";
import AppBody from "./components/AppBody";
import { ToastContainer, Bounce } from "react-toastify";
import CreateEventPage from "./components/CreateEventPage";
import cookieStateSync from "./utils/cookieStateSync";
import SearchPage from "./components/SearchPage";
import EventDetailsPage from "./components/EventDetailsPage";

function App() {
  const [searchData, setSearchData] = useState<SearchDataType>({
    text: "",
    type: "",
    timestamp: null,
  });

  const [userData, setUserData] = useState<UserDataType>({
    token: "",
    userID: "",
    username: "",
    email: "",
  });

  const location = useLocation();

  useEffect(() => {
    cookieStateSync(setUserData);
  }, []);

  useEffect(() => {
    console.log(searchData);
  }, [searchData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <SearchContext.Provider value={{ searchData, setSearchData }}>
        <div className="flex flex-col">
          {/* Conditionally render AppHeader */}
          {location.pathname === "/" ||
          location.pathname === "/search" ||
          location.pathname.startsWith("/event/") ? (
            <AppHeader />
          ) : (
            <></>
          )}

          <Routes>
            <Route path="/" element={<AppBody />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<SearchPage></SearchPage>} />
            <Route
              path="/create-event"
              element={<CreateEventPage></CreateEventPage>}
            ></Route>
            <Route path="/event/:eventID" element={<EventDetailsPage />} />
          </Routes>
          <div>
            <ToastContainer
              position="top-center"
              autoClose={900}
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
        </div>
      </SearchContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
