import React from 'react'
import {Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Collection from './pages/Collection'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Navbar from "./components/Navbar"
import Cart from "./pages/Cart"
import Navbar_routes from './components/Navbar_routes'

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      
      <Navbar />
      
      <Navbar_routes/>

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collection' element={<Collection/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/cart" element={<Cart/>} />
      </Routes>

    </div>
  )
}

export default App
