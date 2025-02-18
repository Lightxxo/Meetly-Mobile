import CreateEventButton from "./CreateEventButton";
import backgroundImage from "../../public/1.jpg"; 


export default function SplashScreen() {
  return (
    <>
      <div className="w-full h-full lg:h-full flex flex-col lg:flex-row items-center justify-center bg-opacity-0 p-0 lg:pl-10 lg:pr-10 m-0 md:p-0 md:m-0 mb-10">
        
        <div className="w-full lg:w-1/2 h-full lg:h-full flex items-center justify-center relative m-0 pt-5 pb-5 sm:pt-0 sm:pb-0">
          <img
            src={backgroundImage}
            alt="Background"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col items-start justify-center pl-5 sm:pl-10 lg:pl-10 space-y-5 w-full lg:w-1/2 bg-opacity-0 lg:pt-0 lg:pb-0 pt-5 pb-5 sm:pt-5 sm:pb-5 md:p-0 md:pl-20">
          <p className="font-bold text-4xl lg:text-[100px] md:text-[70px] text-[40px] text-gray-800">
            Meetly
          </p>
          <p className="text-lg lg:text-xl md:text-lg text-[14px] sm:text-[16px] text-gray-600">
            A place to connect, collaborate, and create amazing events.
          </p>
          <CreateEventButton />
        </div>
      </div>
    </>
  );
}
