import React from "react";
import HomeIcon from "./../icons/HomeIcon";
import PostIcon from "./../icons/PostIcon";
import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";
import { NavLink } from "react-router";
import ProfileIcon from "../icons/ProfileIcon";

export default function Aside() {
  const buttonClasses =
    "flex items-center gap-3 mb-4 p-3 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700 text-white transition-all";

  return (
    <aside className="w-full sm:w-60 p-4 bg-white h-full sm:h-full overflow-y-auto">
      <NavLink to="/" className={buttonClasses}>
        <HomeIcon />
        <div className="text-sm font-medium">Home</div>
      </NavLink>

      <NavLink to="/profile" className={buttonClasses}>
        <ProfileIcon />
        <div className="text-sm font-medium">Profile</div>
      </NavLink>

      <NavLink to="/posts" className={buttonClasses}>
        <PostIcon />
        <div className="text-sm font-medium">Posts</div>
      </NavLink>

      <NavLink to="/likes" className={buttonClasses}>
        <LikeIcon />
        <div className="text-sm font-medium">Likes</div>
      </NavLink>

      <NavLink to="/shares" className={buttonClasses.replace("mb-4", "")}>
        <ShareIcon />
        <div className="text-sm font-medium">Shares</div>
      </NavLink>
    </aside>
  );
}
