import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [activeButton, setActiveButton] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // username for both login and signup
  const [taxId, setTaxId] = useState(""); // taxId for signup
  const [homeAddress, setHomeAddress] = useState(""); // homeAddress for signup

  const handleClick = (button) => {
    setActiveButton(button);
  };

  const onToast = (s) => {
    if ("Login successful!" === s) {
      toast.success(s, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(s, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const url =
      activeButton === "login"
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/auth/signup";

    const data =
      activeButton === "login"
        ? { username, password }
        : { username, email, password, taxId, homeAddress };

    try {
      const response = await axios.post(url, data);
      console.log("Response:", response.data);
      if (
        response.data === "Login successful!" ||
        response.data === "User registered successfully!"
      ) {
        onToast(response.data);
      } else {
        onToast(response.data);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      onToast("An error occurred!");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="flex gap-20 font large">
        {/* Button 1 */}
        <div className="flex flex-col items-center gap-0">
          <button
            onClick={() => handleClick("login")}
            className={`px-10 py-2 cursor-pointer 
              ${
                activeButton === "login"
                  ? "bg-white text-black"
                  : "bg-white  text-gray-700"
              }`}
          >
            Login
          </button>
          <hr
            className={`w-2/4 border-none h-[1.5px] transition-colors 
              ${activeButton === "login" ? "bg-gray-700" : "bg-white"}`}
          />
        </div>

        {/* Button 2 */}
        <div className="flex flex-col items-center gap-0">
          <button
            onClick={() => handleClick("sign up")}
            className={`px-10 py-2 cursor-pointer 
              ${
                activeButton === "sign up"
                  ? "bg-white text-black"
                  : "bg-white  text-gray-700"
              }`}
          >
            Sign Up
          </button>
          <hr
            className={`w-2/4 border-none h-[1.5px] transition-colors 
              ${activeButton === "sign up" ? "bg-gray-700" : "bg-white"}`}
          />
        </div>
      </div>

      <div>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center w-[100%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
          {activeButton === "sign up" && (
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              className="rounded w-full sm:w-[28rem] md:w-[32rem] px-3 py-3 border border-gray-800"
              placeholder="Email"
              required
            />
          )}

          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            className="w-full sm:w-[28rem] md:w-[32rem] rounded px-3 py-3 border border-gray-800"
            placeholder="Username"
            required
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full sm:w-[28rem] md:w-[32rem] rounded px-3 py-3 border border-gray-800"
            placeholder="Password"
            required
          />

          {activeButton === "sign up" && (
            <input
              onChange={(e) => setTaxId(e.target.value)}
              value={taxId}
              type="text"
              className="rounded w-full sm:w-[28rem] md:w-[32rem] px-3 py-3 border border-gray-800"
              placeholder="Tax-ID"
              required
            />
          )}

          {activeButton === "sign up" && (
            <input
              onChange={(e) => setHomeAddress(e.target.value)}
              value={homeAddress}
              type="text"
              className="rounded w-full sm:w-[28rem] md:w-[32rem] px-3 py-3 border border-gray-800"
              placeholder="Home Address"
              required
            />
          )}

          <button className="py-6 bg-gray-800 text-white font-bold rounded px-6 mt-3">
            {activeButton === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
