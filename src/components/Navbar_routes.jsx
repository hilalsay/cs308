import React from "react";
import { Link, NavLink } from "react-router-dom";

/*If justify-between left everything aligned to the left with the right side empty, 
it usually indicates there was only one main "group" of items within that flex container. 
Since justify-between needs at least two elements to space apart, it doesn’t add any space if only one group is present. */

const Navbar_routes = () => {
  return (
    <div className="flex flex-col justify-center items-center  py-0 font medium">
      <ul className="hidden justify-center sm:flex gap-8 text-lg text-gray-1000">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>Collections</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <hr className="w-full mt-3 px-10 py-0 border-none h-[1.5px] bg-gray-200" />
    </div>
  );
};

export default Navbar_routes;
