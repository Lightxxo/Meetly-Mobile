import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserContext } from "../contexts/Contexts";


const Login = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("LoginLogoutButton must be used within a UserContext.Provider");
  }

  const { setUserData } = userContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify([{email: email, password: password }]),
  });

  const body = await response.json();

  if(response.status === 201){
      console.log("Logging in with", { email, password });
      console.log("GOT FROM BACKEND body on /LOGIN", body)
      let user = {token:body.token, userID:body.userID, username:body.username, email:body.email}
      setUserData(user);
      Cookies.set('user', JSON.stringify(user), { path: "/", sameSite: "Lax" });
  } else if(response.status === 401){
      alert('Please give valid login information!');
      console.log( "Invalid Login Credentials",body);
      return; 
  }

  navigate("/");





  };

  const handleSignup = () => {
    setEmail("");
    setPassword("");
    navigate("/signup");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {/* Logo Placeholder */}
      <div
        className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold cursor-pointer  mx-auto"
        onClick={handleLogoClick}
      >
        MEETLY
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-400 focus:outline-2 focus:outline-gray-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <span
            className="font-semibold text-gray-700 cursor-pointer"
            onClick={handleSignup}
          >
            {" "}
            Sign Up!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
