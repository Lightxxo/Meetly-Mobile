import { useContext, useEffect, useState } from "react";
import { UserContext, UserLoadedContext } from "../contexts/Contexts";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import validateUser from "../utils/validateUser";


export default function ProfileButton() {
  const userContext = useContext(UserContext);
  const {setUserLoaded} = useContext(UserLoadedContext)!;
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  if (!userContext) {
    throw new Error("ProfileButton must be used within a UserContext.Provider");
  }

  const { userData, setUserData } = userContext;



  useEffect(() => {
    const token = Cookies.get("user");
    if (token && userData.token?.length) {
      setUserExists(true);
      setUserLoaded({loaded:true});
    } else {
      setUserExists(false);
    }
  }, [userData]);

 

  async function handleProfileClick(){
    // validateUser(userData, setUserData, navigate, "/user");
    navigate("/user");
  }

  return userExists ? (
    <button
      className="relative group flex items-center cursor-pointer md:mr-2 
             w-auto md:w-12 md:transition-all md:duration-300 md:hover:w-24 rounded-xl cursor-pointer"
        onClick={handleProfileClick}
    >
      {/* Profile Icon: On desktop, slides left and fades on hover */}
      <div
        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-300 
               text-gray-800 text-lg font-bold transition-all duration-300
               md:group-hover:translate-x-[-10px] md:group-hover:opacity-0"
      >
        { userData.username ? userData.username[0].toUpperCase() : ""}
      </div>

      {/* Full Username: Always visible on mobile; on desktop, hidden initially and appears on hover */}
      <span
        className="ml-0 pl-2 mr-5  rounded-4xl p-4 text-gray-800 font-bold text-lg whitespace-nowrap overflow-hidden opacity-100
               md:absolute md:left-0 md:opacity-0 md:transition-all md:duration-300
               md:group-hover:opacity-100 md:group-hover:left-[-5px]" 
      >
        {userData.username}
      </span>
    </button>
  ) : null;
}
