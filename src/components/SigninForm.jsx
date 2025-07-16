import React, { useContext, useState } from "react";
import image1 from "../assets/2.jpg";
import { Navigate } from "react-router";
import Loader from "./Loader";
import { UserContext } from "../context/UserProvider";

function SigninForm({ togglePage }) {
  const { signin, currentUser } = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [isloading, setIsloading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const validateData = () => {
    if (!form.email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;
    setIsloading(true);
    try {
      await signin(form.email, form.password);
    } catch (err) {
      setFormError(err.message || "Login failed. Please try again.");
    } finally {
      setIsloading(false);
    }
  };

  if (currentUser) return <Navigate to="/" />;

  return (
    <div className="bg-white w-full max-w-7xl h-[600px] rounded-3xl flex overflow-hidden shadow-lg">
      <div className="flex-1 h-full">
        <img
          src={image1}
          alt="login visual"
          className="w-full h-full object-cover rounded-l-3xl"
        />
      </div>

      <div className="flex-1 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-3xl font-bold text-center text-gray-700">
            Login
          </h2>
          <p className="text-sm text-center text-gray-500 mb-4">
            Welcome back! Please enter your credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex justify-center items-center">
              {isloading ? (
                <Loader />
              ) : (
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition duration-200">
                  Login
                </button>
              )}
            </div>
          </form>

          {formError && (
            <p className="text-red-500 text-sm text-center">{formError}</p>
          )}

          <p className="text-sm text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={togglePage}
              className="text-blue-600 font-medium underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SigninForm;
