import { JSX } from "react";
import SplashScreen from "./SplashScreen";

export default function AppBody():JSX.Element{


    return (
        <div className="flex flex-col">
            <SplashScreen></SplashScreen>
        </div>
    );
       
}