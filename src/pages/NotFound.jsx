import React from "react";
import { Link, NavLink } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <p className="text-2xl mb-4">الصفحة غير موجودة</p>
      <p className="text-sm text-gray-600 mb-6">
        الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
      </p>

      <NavLink
        to="/"
        className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition duration-200">
        الرجوع إلى الصفحة الرئيسية
      </NavLink>
    </div>
  );
}
