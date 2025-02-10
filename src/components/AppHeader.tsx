import { JSX } from "react";
import SearchBar from "./Searchbar";


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

const LargeScreenLayout = () => {
  return (
    <div className="flex justify-between items-center p-5">
      <div className="flex space-x-3">
        <p className="px-5">LOGO</p>
        <p>MEETLY</p>
      </div>
      <div className="flex-grow flex justify-center">
       <SearchBar></SearchBar>
      </div>
      <div>
        <p>LOGIN/LOGOUT/REG</p>
      </div>
    </div>
  );
};
const SmallScreenLayout = () => {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-3">
          <p className="px-5">LOGO</p>
          <p>MEETLY</p>
        </div>
        <div>
          <p>LOGIN/LOGOUT/REG</p>
        </div>
      </div>
      <div className="flex justify-center">
        <SearchBar></SearchBar>
      </div>
    </div>
  );
};
