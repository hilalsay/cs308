import React, { useState } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';

const Login = () => {

  const [activeButton, setActiveButton] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [taxId, setTaxId] = useState("");
  const [homeAddress, setHomeAddress] = useState("");

  const handleClick = (button) => {
    if (activeButton !== button) {
      setActiveButton(button);
    }
  };

  const onToast = (s) => {
    if ('Login Successfull!!' === s) {
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
    }else{
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
  }

  const onSubmitHandler = async (event) => {
  
    /*
    console.log("Email:", email);
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Tax ID:", taxId);
    console.log("Home Address:", homeAddress);
    */

    const url = activeButton === "login" ? "http://localhost:5174/api/login" : "/api/signup"; 
    const data = activeButton === "login"
      ? { username, password }
      : { username, email, password, taxId, homeAddress };

    console.log(data);
    
    try {
    event.preventDefault();
      const response = await axios.post(url, data);
      console.log("Response:", response.data);
      // Handle successful response, such as redirecting or saving auth token
    } catch (error) {
      console.error("Error during form submission:", error);
      // Handle error, show message to the user, etc.
    }
  };
  

  /*

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:9090/auth/singin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
      }),
    });
    
    const data = await res.json();
    sessionStorage.setItem("token", data.jwt);
    if(res.status===200){
      onToast('Login Successfull!!');
      window.location.href = "/";
    }else{
      onToast("Invalid Credentials");
    }

  };

  */

  return (

    //sign up/login
    <div className="flex flex-col justify-center items-center  py-20">

      <div className="flex gap-20 font large">
      {/* Button 1 */}
      <div className="flex flex-col items-center gap-0">
        <button
          onClick={() => handleClick("login")}
          className={`px-10 py-2 cursor-pointer 
            ${activeButton === "login" ? "bg-white text-black" : "bg-white  text-gray-700"}`}
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
            ${activeButton === "sign up" ? "bg-white text-black" : "bg-white  text-gray-700"}`}
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
        <form   onSubmit={onSubmitHandler} className="flex flex-col  items-center w-[100%] sm:max-w-96 m-auto  mt-14 gap-4 text-gray-800">
          {activeButton === "login" ? " " : <input onChange={(e)=> setEmail(e.target.value)} value={email} type="text" className="rounded w-full sm:w-[28rem] md:w-[32rem] px-3 py-3 border border-gray-800" placeholder='Email' required/> }
          <input onChange={(e)=> setUsername(e.target.value)} value={username} type="text" className="w-full sm:w-[28rem] md:w-[32rem] rounded px-3 py-3 border border-gray-800" placeholder='Username' required/>
          <input onChange={(e)=> setPassword(e.target.value)} value={password} type="text" className="w-full sm:w-[28rem] md:w-[32rem] rounded px-3 py-3 border border-gray-800" placeholder='Password' required/>
          {activeButton === "login" ? " " : <input onChange={(e)=> setTaxId(e.target.value)} value={taxId} type="text" className="rounded w-full sm:w-[28rem] md:w-[32rem] px-3 py-3 border border-gray-800" placeholder='Tax-ID' required/> }
          {activeButton === "login" ? " " : <input onChange={(e)=> setHomeAddress(e.target.value)} value={homeAddress} type="text" className="rounded w-full sm:w-[28rem] md:w-[32rem] px-3 py-3 border border-gray-800" placeholder='Home Adress' required/> }
          
          <button className="py-6 bg-gray-800 text-white font-bold rounded px-6 mt-3">{activeButton === "login" ? "Sign In" : "Sign Up"}</button>
        </form>
      </div>
     

    </div>
  );
};

export default Login;
