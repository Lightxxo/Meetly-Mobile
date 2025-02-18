import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import { UserContext, UserLoadedContext } from "../contexts/Contexts";

import Cookies from "js-cookie";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrashAlt, FaSave } from "react-icons/fa";


export default function EventDetailsPage() {
  const { eventID } = useParams<{ eventID: string }>();
  const [details, setDetails] = useState<any>(null);
  const [rsvp, setRsvp] = useState<string | null>(null);
  const [going, setGoing] = useState(0);
  const [interested, setInterested] = useState(0);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  const {userLoaded, setUserLoaded} = useContext(UserLoadedContext)!;

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
    console.log(token);
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
    
    console.log(userLoaded.loaded, token);
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
          }
        };

        fetchCurrentUserStatus(); // Call fetch if conditions are met
      } catch (error) {
        console.error("Error parsing token", error);
      }
    }
  }, [userLoaded]); // Dependency on userData.userID to refetch on change



  useEffect(() => {
    if (details) {
      setGoing(details.goingCount);
      setInterested(details.interestedCount);
    }
  }, [details]);

  useEffect(() => {
    const cookie = Cookies.get("user");

    if (cookie) {
      if (userData.token.length) {
        setUserLoaded({loaded:true});
      } else {
        setUserLoaded({loaded:false});
      }
    }
  }, [userData]);

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

  if (loading && !userLoaded.loaded) return <Loading />;
  if (!details)
    return <div className="text-center p-4">No event details available.</div>;

  const { event, images, attendees, comments, host } = details;

  interface AttendeeAvatarProps {
    username?: string;
    size?: number;
  }

  function Comment({ comment }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.comment);
  
    async function handleCommentDelete() {
      const token = Cookies.get("user");
      console.log("DELETEEE TOKEN", token);
      const response = await fetch(`http://localhost:3000/delete-comment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(comment),
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
        // If the comment is empty, trigger delete
        await handleCommentDelete();
      } else {
        // Otherwise, update the comment
        const token = Cookies.get("user");
  
        const updatedCommentData = {
          ...comment,
          comment: editedComment,
        };
  
        const response = await fetch(`http://localhost:3000/update-comment`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCommentData),
        });
  
        if (response.ok) {
          console.log("Comment updated successfully");
          setIsEditing(false);
          setDetails((oldDetails: any) => ({
            ...oldDetails,
            comments: oldDetails.comments.map((c: any) =>
              c.commentID === comment.commentID ? { ...c, comment: editedComment } : c
            ),
          }));
        }
      }
    }
  
    return (
      <div className="relative mb-4 p-4 bg-gray-100 rounded-lg flex flex-row items-start">
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
            className="text-gray-600 mt-3 ml-2 border rounded p-2 w-full"
          />
        ) : (
          <p className="text-gray-600 mt-1 ml-2">{comment.comment}</p>
        )}
  
        {/* Edit and Delete Icons */}
        {userData.userID === comment.userID && (
          <div className="absolute top-2 right-2 flex space-x-2">
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
        console.log(data);
        setDetails(data);
      } else if (response.status !== 500) {
        Cookies.remove("user");
        setUserData({
          token: "",
          userID: "",
          username: "",
          email: "",
        });
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

  return (
    <div>
      <div className="container mx-auto p-6 space-y-10">
        {/* Event Title & Hosted By */}
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

            {/* RSVP Section */}
            <div className="bg-white p-6 rounded-lg border-2 border-neutral-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                RSVP
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  className={`px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition w-full sm:w-auto ${
                    rsvp === "going" && userData.token
                      ? "bg-red-500 hover:bg-red-700"
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
                  className={`px-4 py-2 bg-neutral-100 text-black font-semibold rounded-lg shadow-md hover:bg-neutral-300 transition w-full sm:w-auto ${
                    rsvp === "interested" && userData.token
                      ? "bg-red-500 hover:bg-red-700"
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
                  className={`px-4 py-2 bg-neutral-950 text-white font-semibold rounded-lg shadow-md hover:bg-neutral-700 transition w-full sm:w-auto ${
                    rsvp === "not going" && userData.token
                      ? "bg-red-500 hover:bg-red-700"
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
            <div className="flex flex-row max-width-[200px] overflow-y gap-10">
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
                <img
                  key={index}
                  src={img.image}
                  alt={`${event.eventTitle} ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow-md"
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-10 hover:bg-blue-700"
            >
              Submit Comment
            </button>
          </form>
          <MyComment></MyComment>
          <OthersComment></OthersComment>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Bounce}
        className="text-center"
      />
    </div>
  );
}
