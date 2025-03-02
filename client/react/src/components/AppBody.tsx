import SplashScreen from "./SplashScreen";
import HomeEventListSection from "./HomeEventListSection";

export default function AppBody() {

  return (
    <div className="flex flex-col p-0">
      <SplashScreen />
      <HomeEventListSection  />
    </div>
  );
}
