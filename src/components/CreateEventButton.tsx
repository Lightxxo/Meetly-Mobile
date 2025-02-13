import { useContext } from "react";
import { UserContext } from "../contexts/Contexts";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function CreateEventButton() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext) {
    throw new Error(
      "CreateEventButton must be used within a UserContext.Provider"
    );
  }

  const { userData, setUserData } = userContext;

  const handleCreateEvent = async () => {
    if (userData.token.length) {
        const response = await fetch("http://localhost:3000/user-token-verify", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Token': `Bearer ${userData.token}` 
              },
            body: JSON.stringify({token: userData.token, userID:userData.userID}),
        });

        
        console.log(response.status)
        if(response.status === 201){
            //success
            toast('Verified')
            navigate('/create-event');
        } else if (response.status === 401){
            //unauth/exp
            
            Cookies.remove("user"); 
            setUserData({
              token: '',
              userID: '',
              username: '',
              email: ''
            });
        }

    } else {
        toast('Please Login!');
    }
  };

  return (
    <div>
      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleCreateEvent}
      >
        Create Event!
      </button>

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
        className= "text-center"
      />
    </div>
  );
}
