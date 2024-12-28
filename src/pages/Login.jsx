import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


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

  const [userRole, setUserRole] = useState(null); 
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    // Check if there is a token, meaning the user is logged in
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(response.data.role); // Set the user role from the profile response
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserRole(null); // Handle error if fetching user profile fails
        }
      };
      fetchUserProfile();
    } else {
      setUserRole(null); // Ensure user role is reset when token is absent
    }
  }, [token]);

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
    if ("Sign up successful!" === s) {
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


  const navigateToRolePage = (role) => {
    if (role === "SALES_MANAGER") {
      navigate("/managesales/refund");
    } else if (role === "ProductManager") {
      navigate("/managesales/refund");
    } else {
      navigate("/"); // Default for customers
    }
  };

  
  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const url = activeButton === "login"
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/signup";
  
    const data = activeButton === "login"
      ? { username, password }
      : { username, email, password, taxId, homeAddress, role: "Customer" };
  
    try {
      const response = await axios.post(url, data);
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        login({ token: response.data.token });
  
        const role = response.data.user?.role;
        if (!role) {
          const profileResponse = await axios.get("/api/auth/profile", {
            headers: { Authorization: `Bearer ${response.data.token}` },
          });
          navigateToRolePage(profileResponse.data.role);
        } else {
          navigateToRolePage(role);
        }
      } else if (activeButton === "signup" && response.data === "User registered successfully!") {
        onToast("Sign up successful!");
        setActiveButton("login");
      } else {
        onToast(response.data.error || response.data);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      onToast("Wrong username or password!");
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
                  : "bg-white text-gray-700"
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
            onClick={() => handleClick("signup")}
            className={`px-10 py-2 cursor-pointer
              ${
                activeButton === "signup"
                  ? "bg-white text-black"
                  : "bg-white text-gray-700"
              }`}
          >
            Sign Up
          </button>
          <hr
            className={`w-2/4 border-none h-[1.5px] transition-colors 
              ${activeButton === "signup" ? "bg-gray-700" : "bg-white"}`}
          />
        </div>
      </div>

      <div>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center w-[100%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
          {activeButton === "signup" && (
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
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

          {activeButton === "signup" && (
            <input
              onChange={(e) => setTaxId(e.target.value)}
              value={taxId}
              type="text"
              className="rounded w-full sm:w-[28rem] md:w-[32rem] px-3 py-3 border border-gray-800"
              placeholder="Tax ID"
              required
            />
          )}

          {activeButton === "signup" && (
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
