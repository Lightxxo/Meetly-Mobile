import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import { UserContext, UserLoadedContext } from "../contexts/Contexts";

import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaEdit, FaTrashAlt, FaSave } from "react-icons/fa";
import validateUser from "../utils/validateUser";
import ImageCard from "./ImageCard";

export default function EventDetailsPage() {
  const { eventID } = useParams<{ eventID: string }>();
  const [details, setDetails] = useState<any>(null);
  const [rsvp, setRsvp] = useState<string | null>(null);
  const [going, setGoing] = useState(0);
  const [interested, setInterested] = useState(0);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  const { userLoaded } = useContext(UserLoadedContext)!;
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState<string>("");
  const token = Cookies.get("user");
  // Function to handle the comment input change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  // Function to handle form submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    const token = Cookies.get("user");

    if (token) {
      e.preventDefault();

      if (newComment.trim() === "") return;

      // Send the new comment to the server
      const newCommentData = {
        comment: newComment,
        userID: userData.userID,
        eventID: eventID,
        username: userData.username,
        rating: 5.0, // IMPLEMENT IF NEED
      };

      await submitCommentToServer(newCommentData);

      // After submission, reset the comment input
      setNewComment("");
    } else {
      toast("Login to comment");
    }
  };

  const submitCommentToServer = async (newCommentData: any) => {
    const token = Cookies.get("user");
    try {
      const response = await fetch("http://localhost:3000/event-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCommentData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Comment added:", result);

        setDetails((oldDetails: any) => {
          let newComment = Array.from(oldDetails.comments);
          newComment.unshift(result);
          return { ...oldDetails, comments: newComment };
        });
      } else {
        console.error("Failed to submit comment.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!userContext) {
    throw new Error(
      "CreateEventButton must be used within a UserContext.Provider"
    );
  }

  const { userData, setUserData } = userContext;

  useEffect(() => {
    // Check if the token exists and if user is loaded
    if (userLoaded.loaded && token) {
      try {
        const parsedToken = JSON.parse(token);

        const fetchCurrentUserStatus = async () => {
          const response = await fetch(
            `http://localhost:3000/rsvp-status?userID=${userData.userID}&eventID=${eventID}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JSON.stringify({
                  token: parsedToken.token,
                })}`,
              },
            }
          );

          //   console.log("#######################################", response.status, userData.userID, eventID, "PARSED TOKIE", parsedToken, token);

          if (response.status === 200) {
            const data = await response.json();
            setRsvp(data.status.toLowerCase());
          } else if (response.status === 404) {
            setRsvp(null);
          } else {
            // Invalid token, force logout
            Cookies.remove("user");
            setUserData({
              token: "",
              userID: "",
              username: "",
              email: "",
            });
            toast("Token invalid: Please Login!");
          }
        };

        fetchCurrentUserStatus(); // Call fetch if conditions are met
      } catch (error) {
        console.error("Error parsing token", error);
      }
    }
  }, [userLoaded.loaded, userData.userID]); // Dependency on userData.userID to refetch on change

  useEffect(() => {
    if (details) {
      setGoing(details.goingCount);
      setInterested(details.interestedCount);
    }
  }, [details]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`http://localhost:3000/event/${eventID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched event details:", data);
      setDetails(data);
    } catch (error: any) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventID]);

  // Wait for both user and event details to finish loading.
  if (token && !userLoaded.loaded) {
    return <Loading />;
  }

  if (loading) {
    return <Loading />;
  }

  // Once loading is finished, check if event details are available.
  // You might also want to check for an empty object if your API returns {}.
  if (!details || Object.keys(details).length === 0) {
    return <div className="text-center p-4">No event details available.</div>;
  }

  const { event, images, attendees, comments, host } = details;

  interface AttendeeAvatarProps {
    username?: string;
    size?: number;
  }

  function Comment({ comment }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.comment);
    const [updatedTime, setUpdatedTime] = useState(timeAgo(comment.createdAt));
  
    
    const shouldUpdateTime = true;
  
    useEffect(() => {
      if (!shouldUpdateTime) return;
  
      const interval = setInterval(() => {
        setUpdatedTime(timeAgo(comment.createdAt));
      }, 1000);
  
      return () => clearInterval(interval);
    }, [comment.createdAt, shouldUpdateTime]);
  
    async function handleCommentDelete() {
      const token = Cookies.get("user");
      const response = await fetch(`http://localhost:3000/delete-comment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userID: userData.userID,
          eventID: eventID,
          commentID: comment.commentID,
        }),
      });
  
      if (response.ok) {
        console.log("comment deleted successfully");
        setDetails((oldDetails: any) => ({
          ...oldDetails,
          comments: oldDetails.comments.filter(
            (c: any) => c.commentID !== comment.commentID
          ),
        }));
      }
    }
  
    async function handleCommentEdit() {
      setIsEditing(true);
    }
  
    async function handleUpdateComment() {
      if (editedComment.trim() === "") {
        await handleCommentDelete();
      } else {
        const token = Cookies.get("user");
  
        const response = await fetch(`http://localhost:3000/update-comment`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userID: userData.userID,
            eventID: eventID,
            commentID: comment.commentID,
            comment: editedComment,
          }),
        });
  
        if (response.ok) {
          console.log("Comment updated successfully");
          setIsEditing(false);
          setDetails((oldDetails: any) => ({
            ...oldDetails,
            comments: oldDetails.comments.map((c: any) =>
              c.commentID === comment.commentID
                ? { ...c, comment: editedComment }
                : c
            ),
          }));
        }
      }
    }
  
    function timeAgo(timestamp: string) {
      const diff = Date.now() - new Date(timestamp).getTime();
      const units = [
        { label: "year", value: 365 * 24 * 60 * 60 * 1000 },
        { label: "month", value: 30 * 24 * 60 * 60 * 1000 },
        { label: "week", value: 7 * 24 * 60 * 60 * 1000 },
        { label: "day", value: 24 * 60 * 60 * 1000 },
        { label: "hour", value: 60 * 60 * 1000 },
        { label: "minute", value: 60 * 1000 },
        { label: "second", value: 1000 },
      ];
  
      for (let { label, value } of units) {
        const time = Math.floor(diff / value);
        if (time > 0) {
          return `${time} ${label}${time > 1 ? "s" : ""} ago`;
        }
      }
      return "Just now";
    }
  
    return (
      <div className="relative mb-4 p-4 bg-gray-100 rounded-lg flex flex-row items-start">
        <div className="flex flex-row items-start mt-2 mb-10">
          {/* Avatar and Username Section */}
          <div className="flex items-center space-x-2">
            <AttendeeAvatar username={comment.username} size={8} />
            <span className="font-semibold text-gray-800">
              @{comment.username.toLowerCase()}:
            </span>
          </div>
  
          {/* Comment Text Section */}
          {isEditing ? (
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="text-gray-600 mt-3 ml-2 border rounded p-3 w-full"
            />
          ) : (
            <p className="text-gray-600 mt-1 ml-2">{comment.comment}</p>
          )}
        </div>
  
        {/* Edit and Delete Icons */}
        {userData.userID === comment.userID && (
          <div className="absolute top-3 right-3 flex space-x-2">
            {isEditing ? (
              <button
                aria-label="Save Comment"
                className="text-green-500 hover:text-green-700"
                onClick={handleUpdateComment}
              >
                <FaSave />
              </button>
            ) : (
              <button
                aria-label="Edit Comment"
                className="text-blue-500 hover:text-blue-700"
                onClick={handleCommentEdit}
              >
                <FaEdit />
              </button>
            )}
            <button
              aria-label="Delete Comment"
              className="text-red-500 hover:text-red-700"
              onClick={handleCommentDelete}
            >
              <FaTrashAlt />
            </button>
          </div>
        )}
  
        <div className="absolute bottom-3 right-3 flex space-x-2 text-xs">
          {updatedTime}
        </div>
      </div>
    );
  }

  function MyComment() {
    const myComments =
      comments?.filter((comment: any) => comment.userID === userData.userID) ||
      [];

    return myComments.length > 0 ? (
      myComments.map((comment: any) => (
        <Comment comment={comment} key={comment.commentID} />
      ))
    ) : (
      <></>
    );
  }

  function OthersComment() {
    const otherComments =
      comments?.filter((comment: any) => comment.userID !== userData.userID) ||
      [];

    return comments.length > 0 ? (
      otherComments.map((comment: any) => (
        <Comment comment={comment} key={comment.commentID} />
      ))
    ) : (
      <p className="text-gray-500">No comments yet...</p>
    );
  }

  async function handleRSVP(flag: string) {
    if (rsvp !== flag) {
      //do stuff

      const token = Cookies.get("user");
      const parsedToken = JSON.parse(token!);
      const response = await fetch(`http://localhost:3000/rsvp-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify({
            token: parsedToken.token,
          })}`,
        },
        body: JSON.stringify({
          userID: userData.userID,
          eventID: eventID,
          status: flag,
        }),
      });

      if (response.status === 200) {
        if (rsvp === "going")
          setGoing((oldGoing) => {
            return oldGoing - 1;
          });
        if (rsvp === "interested")
          setInterested((oldInterested) => {
            return oldInterested - 1;
          });
        setRsvp(flag);
        if (flag === "going")
          setGoing((oldGoing) => {
            return oldGoing + 1;
          });
        if (flag === "interested")
          setInterested((oldInterested) => {
            return oldInterested + 1;
          });

        const data = await response.json();

        setDetails(data);
      } else if (response.status !== 500) {
        Cookies.remove("user");
        setUserData({
          token: "",
          userID: "",
          username: "",
          email: "",
        });
        toast("Token invalid: Please Login!");
      }
    }
  }

  const AttendeeAvatar: React.FC<AttendeeAvatarProps> = ({
    username,
    size = 12,
  }) => {
    const initial = username ? username.charAt(0).toUpperCase() : "?";

    return (
      <div
        className={`flex items-center justify-center w-${size} h-${size} rounded-full bg-gray-300 text-gray-800 text-lg font-bold`}
      >
        {initial}
      </div>
    );
  };

  function handleEditOnClick() {
    const doesThisApiNeedCalling = 0;
    // validateUser(userData, setUserData, navigate, `/edit-event?eventID=${eventID}`, '')
    navigate(`/edit-event?eventID=${eventID}`, { state: details });
  }

  return (
    <div>
      <div className="container mx-auto p-6 space-y-10">
        {/* Event Title & Hosted By */}
        <div className="flex flex-row justify-between">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900 pb-10 break-all">
              {event.eventTitle}
            </h1>
            <div className="flex items-center space-x-4">
              <AttendeeAvatar username={host.username} />
              <div>
                <p className="text-lg font-semibold">Hosted by</p>
                <p className="text-gray-700">{host.username}</p>
              </div>
            </div>
          </div>

          {userData.userID === details.host.userID ? (
            <div>
              <button
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                onClick={handleEditOnClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 3.487a3.375 3.375 0 1 1 4.775 4.775L6.75 23.25l-4.5 1 1-4.5L16.862 3.487z"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* Main Event Image */}
        <div className="w-full h-[450px] overflow-hidden rounded-lg shadow-md">
          <img
            src={event.thumbnail}
            alt={event.eventTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details & RSVP Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Event Description */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {/* Right: Event Meta Details */}

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-gray-500">📅</span>
              <p className="text-lg">
                {new Date(event.eventDate).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-500">📍</span>
              <p className="text-lg">{event.location}</p>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <p className="text-lg font-semibold">
                {going} Going | {interested} Interested
              </p>
            </div>

            {/* Event Types Section */}
            {details.eventTypes && details.eventTypes.length ? (
              <p className="border-t border-gray-300 pt-4">{`Category ( ${details.eventTypes.length} )`}</p>
            ) : (
              <></>
            )}
            <div className="flex flex-wrap gap-2 mb-6">
              {details.eventTypes && details.eventTypes.length ? (
                details.eventTypes.map((type: string, index: number) => (
                  <span
                    key={`${type}${index}`}
                    className="bg-gray-100 hover:bg-gray-200 text-white-600 text-sm font-medium px-3 py-1 rounded-full shadow-sm"
                  >
                    {type}
                  </span>
                ))
              ) : (
                <></>
              )}
            </div>

            {/* RSVP Section */}
            <div className="bg-white p-6 rounded-lg border-2 border-neutral-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                RSVP
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  className={`px-4 py-2 bg-stone-200 text-black font-semibold rounded-lg shadow-md hover:bg-stone-400 transition w-full sm:w-auto ${
                    rsvp === "going" && userData.token
                      ? "bg-zinc-900 hover:bg-zinc-700 text-white"
                      : ""
                  }`}
                  onClick={() => {
                    const token = Cookies.get("user");
                    if (token) {
                      handleRSVP("going");
                    } else {
                      toast("Please login!");
                    }
                  }}
                >
                  <p>✅</p>
                  Going
                </button>
                <button
                  className={`px-4 py-2 bg-stone-200 text-black font-semibold rounded-lg shadow-md hover:bg-stone-400 transition w-full sm:w-auto ${
                    rsvp === "interested" && userData.token
                      ? "bg-zinc-900 hover:bg-zinc-700 text-white"
                      : ""
                  }`}
                  onClick={() => {
                    const token = Cookies.get("user");
                    if (token) {
                      handleRSVP("interested");
                    } else {
                      toast("Please login!");
                    }
                  }}
                >
                  <p>⭐ </p>
                  Interested
                </button>
                <button
                  className={`px-4 py-2 bg-stone-200 text-black font-semibold rounded-lg shadow-md hover:bg-stone-200 transition w-full sm:w-auto ${
                    rsvp === "not going" && userData.token
                      ? "bg-zinc-900 hover:bg-zinc-700 text-white"
                      : ""
                  }`}
                  onClick={() => {
                    const token = Cookies.get("user");
                    if (token) {
                      handleRSVP("not going");
                    } else {
                      toast("Please login!");
                    }
                  }}
                >
                  <p>❌</p>
                  Not Going
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendees and RSVP Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Attendees List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Attendees (Going)
            </h2>
            <div className="flex flex-row gap-10 overflow-x-auto max-w-full p-2">
              {attendees && attendees.length > 0 ? (
                attendees.map((att: any, index: number) => (
                  <div key={index} className="flex flex-row items-center gap-2">
                    <AttendeeAvatar username={att.User?.username} />
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {att.User?.username || "Unknown"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No attendees found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images && images.length > 0 ? (
              images.map((img: any, index: number) => (
                <ImageCard
                  key={index}
                  imageUrl={img.image}
                  altText={`${event.eventTitle} ${index + 1}`}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No images available.
              </p>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white p-6 rounded-md border-2 border-neutral-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Comments
          </h2>

          {/* Comment input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const token = Cookies.get("user");
              if (token) {
                handleCommentSubmit(e);
              } else {
                toast("Login to comment!");
              }
            }}
          >
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
              className="w-full p-4 mb-4 border-2 border-neutral-300 rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg mb-10 hover:bg-gray-700"
            >
              Submit Comment
            </button>
          </form>
          <MyComment></MyComment>
          <OthersComment></OthersComment>
        </div>
      </div>
    </div>
  );
}
