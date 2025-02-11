import { useNavigate } from "react-router-dom"

export default function LoginSignupButton(){
    const navigate = useNavigate();
    
    const handleLogin = ()=>{
        navigate('/login');
    }
    return(
        <div>
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mr-10" onClick={handleLogin}>Login</button>
        </div>
    )
}