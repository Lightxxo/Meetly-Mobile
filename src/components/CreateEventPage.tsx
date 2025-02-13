import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/Contexts";
import Cookies from "js-cookie";
import cookieStateSync from "../utils/cookieStateSync";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function CreateEventPage(){
    
    const userContext = useContext(UserContext);

  
    if (!userContext) {
      throw new Error(
        "CreateEventButton must be used within a UserContext.Provider"
      );
    }
  
    const {  userData, setUserData } = userContext;
    const [userLoaded, setUserLoaded] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
        cookieStateSync(setUserData);
    }, [setUserData]);
    

    useEffect(()=>{
        const cookie = Cookies.get('user');
        
        if(cookie){
            
            if(userData.token.length){
                setUserLoaded(true)
                
            }else{
                setUserLoaded(false)
                
            }

        } else {
            navigate('/login');
        }
        
    }, [userData])

    useEffect(()=>{
        console.log('USERLOADED', userLoaded, userData)
    }, [userLoaded])



    return(
        <>{userLoaded ? <CreateEvent></CreateEvent>:<Loading></Loading>}</>
    )



    function CreateEvent() {
        return <p>USER LOADED</p>;
    }

}