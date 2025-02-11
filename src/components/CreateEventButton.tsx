import { useContext } from "react";
import { UserContext } from "../contexts/Contexts";


export default function CreateEventButton(){
    
    const userContext = useContext(UserContext);
    
      if (!userContext) {
        throw new Error("LoginLogoutButton must be used within a UserContext.Provider");
      }
    
    const { userData } = userContext;
    
    const handleCreateEvent = async ( ) =>{
        if(userData.token.length){
            alert(`Token Present: ${userData.token}`)
        } else {
            
        }
    }

    return(
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleCreateEvent}>
                Create Event!
            </button>

    )
}