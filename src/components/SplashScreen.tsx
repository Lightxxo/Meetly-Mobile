import CreateEventButton from "./CreateEventButton";

export default function SplashScreen() {
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center bg-opacity-0 p-0 lg:pl-20 lg:pr-20 m-0">
      
      
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center relative m-0 pt-0">
        <img
          src="src/assets/1.jpg"
          alt="Background"
          className="object-contain w-full h-full"
        />
      </div>

      
      <div className="flex flex-col items-start justify-center pl-10 space-y-5 w-full lg:w-1/2 bg-opacity-0 lg:pl-10 md:pl-30 sm:pl-1">
        <p className="font-bold text-4xl lg:text-[100px] md:text-[70px] text-[40px] text-gray-800">
          Meetly
        </p>
        <p className="text-lg lg:text-xl md:text-lg text-gray-600">
          A place to connect, collaborate, and create amazing events.
        </p>
        <CreateEventButton />
      </div>

    </div>
  );
}
