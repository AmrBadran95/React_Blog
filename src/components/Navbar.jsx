import React, { useContext } from "react";
import { NavLink } from "react-router";
import { UserContext } from "../context/UserProvider";

export default function Navbar() {
  const { isAuthenticated, currentUser } = useContext(UserContext);
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-700 shadow-lg">
      <NavLink
        to="/"
        className="text-2xl font-extrabold text-white tracking-wide hover:text-blue-200 transition duration-200">
        Blog
      </NavLink>
      {isAuthenticated ? (
        <NavLink to="/profile">
          <img
            src={
              currentUser?.photoURL ||
              "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
            }
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border"
          />
        </NavLink>
      ) : (
        <NavLink
          to="/registration"
          className="text-base font-semibold text-white bg-blue-500 px-4 py-2 rounded-xl hover:bg-blue-600 transition duration-200">
          Login / Register
        </NavLink>
      )}
    </nav>
  );
}
