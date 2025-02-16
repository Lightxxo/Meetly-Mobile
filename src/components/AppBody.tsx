import { JSX } from "react";
import SplashScreen from "./SplashScreen";
import HomeEventListSection from "./HomeEventListSection";

export default function AppBody(): JSX.Element {
  return (
        <div className="flex flex-col p-0">
          
          <SplashScreen></SplashScreen>
          <HomeEventListSection></HomeEventListSection>
        </div>
  );
}
