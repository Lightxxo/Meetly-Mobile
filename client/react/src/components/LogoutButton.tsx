import Cookies from "js-cookie";
import { UserDataType } from "../types/types";
import { toast } from "react-toastify";


interface LogoutButtonProps {
  setUserData: React.Dispatch<React.SetStateAction<UserDataType>>;
}

export default function LogOutButton({ setUserData }: LogoutButtonProps) {
  const handleLogout = () => {
    Cookies.remove("user"); 
    setUserData({
      token: '',
      userID: '',
      username: '',
      email: ''
    });
    toast("Logged out!") 
  };

  return (
    <div>
      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mr-10"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}
