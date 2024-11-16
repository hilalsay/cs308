import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Assuming you have this context set up
import bcrypt from "bcryptjs";

const Login = () => {
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate(); // Importing useNavigate hook
  const [activeButton, setActiveButton] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // username for both login and signup
  const [taxId, setTaxId] = useState(""); // taxId for signup
  const [homeAddress, setHomeAddress] = useState(""); // homeAddress for signup

  // Set the activeButton state based on the location state
  useEffect(() => {
    if (location.state && location.state.activeButton) {
      setActiveButton(location.state.activeButton); // Set the initial state based on navigation
    }
  }, [location]);

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

        const salt = bcrypt.genSaltSync(10); // Generate a salt with 10 rounds
        const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password
        console.log(hashedPassword);

    const data =
      activeButton === "login"
        ? { username, password/*: hashedPassword */}
        : { username, email, password/*: hashedPassword*/, taxId, homeAddress };

    try {
      const response = await axios.post(url, data);
      console.log("Response:", response.data);
      if (
        response.data === "Login successful!" ||
        response.data === "User registered successfully!"
      ) {


        // If login is successful, save the token in localStorage or sessionStorage
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token); // Store token in localStorage
        }

        // Update the AuthContext to reflect the user's logged-in state
        login({
          user: response.data.user, // Assuming response includes user info
          token: response.data.token, // Save the token
        });

        // Redirect to the homepage or dashboard after successful login
        navigate("/"); // You can change this to any page like /dashboard
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
