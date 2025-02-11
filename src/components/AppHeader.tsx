import { JSX } from "react";
import SearchBar from "./Searchbar";
import { useNavigate } from "react-router-dom";
import LoginLogoutButton from "./LoginLogoutButton";


export default function AppHeader(): JSX.Element {
  return (
    <div>
      <div className="hidden lg:block">
        <LargeScreenLayout />
      </div>
      <div className="lg:hidden">
        <SmallScreenLayout />
      </div>
    </div>
  );
}

const useHomeNavigation = () => {
  const navigate = useNavigate();
  return () => navigate('/');
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
      <div>
        { localStorage.getItem('user')? <p> {JSON.parse(localStorage.getItem('user') as string).userID}</p> : <p>NO USER</p>}
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
      <div>
        { localStorage.getItem('user')? <p> {localStorage.getItem('user')}</p> : <p>NO USER</p>}
      </div>
    </div>
  );
};
