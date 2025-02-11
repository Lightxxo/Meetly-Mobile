import { JSX } from "react";
import SearchBar from "./Searchbar";
import { useNavigate } from "react-router-dom";
import LoginLogoutButton from "./LoginLogoutButton";
import Cookies from "js-cookie";
import CreateEventButton from "./CreateEventButton";

export default function AppHeader(): JSX.Element {
  return (
    <>
      <div>
        <div className="hidden lg:block">
          <LargeScreenLayout />
        </div>
        <div className="lg:hidden">
          <SmallScreenLayout />
        </div>
        <div className="p-10 text-center">
          {Cookies.get("user") ? <p> {Cookies.get("user")}</p> : <p>NO USER</p>}
        </div>
      </div>

      <div className="mx-auto">
        <CreateEventButton></CreateEventButton>
      </div>
    </>
  );
}

const useHomeNavigation = () => {
  const navigate = useNavigate();
  return () => navigate("/");
};

const LargeScreenLayout = () => {
  const handleHomeClick = useHomeNavigation();
  return (
    <div className="flex justify-between items-center p-5">
      <div className="flex space-x-3" onClick={handleHomeClick}>
        <p className="px-5">LOGO</p>
        <p>MEETLY</p>
      </div>
      <div className="flex-grow flex justify-center">
        <SearchBar />
      </div>
      <div>
        <LoginLogoutButton></LoginLogoutButton>
      </div>
    </div>
  );
};

const SmallScreenLayout = () => {
  const handleHomeClick = useHomeNavigation();
  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-3" onClick={handleHomeClick}>
          <p className="px-5">LOGO</p>
          <p>MEETLY</p>
        </div>
        <div>
          <LoginLogoutButton></LoginLogoutButton>
        </div>
      </div>
      <div className="flex justify-center">
        <SearchBar />
      </div>
    </div>
  );
};
