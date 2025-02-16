import { JSX } from "react";
import SearchBar from "./Searchbar";
import { useNavigate } from "react-router-dom";
import LoginLogoutButton from "./LoginLogoutButton";


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
        <div className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold cursor-pointer ms-5 mx-auto">
          MEETLY
        </div>
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
        <div className="flex space-x-3 " onClick={handleHomeClick}>
          <div className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold cursor-pointer mx-auto ms-5">
            MEETLY
          </div>
        </div>
        <div>
          <LoginLogoutButton></LoginLogoutButton>
        </div>
      </div>
      <div className="flex justify-center mt-20">
        <SearchBar />
      </div>
    </div>
  );
};
