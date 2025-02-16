import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/Contexts";
import Cookies from "js-cookie";
import cookieStateSync from "../utils/cookieStateSync";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import CreateEventForm from "./CreateEventForm";

export default function CreateEventPage() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error(
      "CreateEventButton must be used within a UserContext.Provider"
    );
  }

  const { userData, setUserData } = userContext;
  const [userLoaded, setUserLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cookieStateSync(setUserData);
  }, [setUserData]);

  useEffect(() => {
    const cookie = Cookies.get("user");

    if (cookie) {
      if (userData.token.length) {
        setUserLoaded(true);
      } else {
        setUserLoaded(false);
      }
    } else {
      navigate("/login");
    }
  }, [userData]);

  useEffect(() => {
    console.log("USERLOADED", userLoaded, userData);
  }, [userLoaded]);

  return <>{userLoaded ? <CreateEvent></CreateEvent> : <Loading></Loading>}</>;

  function CreateEvent() {
    return (
      <div>
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mt-10 ml-10 mb-10" onClick={()=>{navigate(-1)}}>
          Back
        </button>
        <h2 className="font-bold text-4xl mx-auto text-center mb-10">Create a new event! ✨</h2>
        <CreateEventForm></CreateEventForm>
      </div>
    );
  }
}
