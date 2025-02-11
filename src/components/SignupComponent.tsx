import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Handle signup logic (e.g., API call)
    const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ username: username, email: email, password: password }]),
    });

    const body = await response.json();

    
    if(response.status === 201){
        console.log("Signing up with", { username, email, password });
        
        let user = {token:'###', userID:body.user.userID}
        localStorage.setItem('user', JSON.stringify(user));
    } else if(response.status === 409){
        console.log( "Credentials Already Exists",body);
        return; 
    }

    navigate("/");
}


  const handleLogin = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    navigate("/login");
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
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-500 sm:text-sm"
              />
            </div>
          </div>

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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?
          <span
            className="font-semibold text-gray-700 cursor-pointer"
            onClick={handleLogin}
          >
            {" "}
            Log In!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
