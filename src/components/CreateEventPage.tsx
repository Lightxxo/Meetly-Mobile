import { useContext, useEffect } from "react";
import { UserContext, UserLoadedContext } from "../contexts/Contexts";
import Cookies from "js-cookie";

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

  const { userData } = userContext;
  const { userLoaded } = useContext(UserLoadedContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = Cookies.get("user");

    if (!cookie) {
      navigate("/login");
    }
  }, [userData]);

  return (
    <>{userLoaded.loaded ? <CreateEvent></CreateEvent> : <Loading></Loading>}</>
  );

  function CreateEvent() {
    return (
      <div>
        <div className="mb-6 p-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="ml-2 text-lg">Back</span>
          </button>
        </div>
        <h2 className="font-bold text-4xl mx-auto text-center mb-10">
          Create a new event! ✨
        </h2>
        <CreateEventForm></CreateEventForm>
      </div>
    );
  }
}
