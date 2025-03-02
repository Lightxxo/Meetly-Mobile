import Cookies from "js-cookie";
import { UserDataType } from "../types/types";

const cookieStateSync = (setUserData: (userData: UserDataType) => void, setUserLoaded:any): void => {
  const userCookie = Cookies.get("user");

  if (userCookie) {
    try {
      const parsedUserCookie: UserDataType = JSON.parse(userCookie);
      setUserData(parsedUserCookie);
      setUserLoaded({loaded:true});
      console.log("SET USERDATA VIA SYNC");
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }
  }
};

export default cookieStateSync;