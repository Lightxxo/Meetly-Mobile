import { useEffect, useState } from "react";
import LogOutButton from "./LogoutButton";
import LoginSignupButton from "./LoginSignupButton";

export default function LoginLogoutButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token && parsedUser.userId) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  return <>{user ? <LogOutButton></LogOutButton> : <LoginSignupButton></LoginSignupButton>}</>;
}
