import { useContext, useEffect } from "react";
import LogOutButton from "./LogoutButton";
import LoginSignupButton from "./LoginSignupButton";
import Cookies from "js-cookie";
import { UserContext } from "../contexts/Contexts";

export default function LoginLogoutButton() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("LoginLogoutButton must be used within a UserContext.Provider");
  }

  const { userData, setUserData } = context;

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      const processedUser = JSON.parse(storedUser)
      setUserData({...processedUser});
    }
  }, []);

  return <>{userData.token ? <LogOutButton setUserData={setUserData} /> : <LoginSignupButton />}</>;
}
