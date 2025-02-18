import Cookies from "js-cookie";

export default async function validateUser(userData:any, setUserData:any, navigate:any, naviageTo:string, onFailNavigate:string = "", ifSuccessNavigateFlag:boolean = true ) {
    const token = Cookies.get("user")
    if ( token && userData.token.length) {
        const response = await fetch("http://localhost:3000/user-token-verify", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Token': `Bearer ${userData.token}` 
              },
        });

        
        
        if(response.status === 201){
            //success
            if(ifSuccessNavigateFlag) navigate(naviageTo);
            
        } else if (response.status === 401 || response.status === 402 || response.status === 403){
            //unauth/exp
            
            Cookies.remove("user"); 
            setUserData({
              token: '',
              userID: '',
              username: '',
              email: ''
            });

            if(onFailNavigate.length){
                navigate(onFailNavigate)
            }
        }

    } 
    
  }