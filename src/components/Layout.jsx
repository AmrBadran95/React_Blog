import React, { useState } from "react";
import Navbar from "./Navbar";
import Aside from "./Aside";

export default function Layout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onMenuClick={() => setIsDrawerOpen((prev) => !prev)}
        isDrawerOpen={isDrawerOpen}
      />

      <div className="flex flex-1 pt-[72px] bg-slate-50">
        <div
          className={`fixed sm:static top-[72px] left-0 z-40 h-[calc(100vh-72px)] w-60 bg-white shadow-lg transform transition-transform duration-300 sm:translate-x-0 ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <Aside />
        </div>

        <main className="flex-1 p-4 sm:ml-60 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
