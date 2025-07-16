import React, { useContext, useState } from "react";
import image1 from "../assets/1.jpg";
import { Navigate } from "react-router";
import Loader from "./Loader";
import { UserContext } from "../context/UserProvider";

function SignupForm({ togglePage }) {
  const { signup, currentUser } = useContext(UserContext);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState("");
  const [isloading, setIsloading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const validateData = () => {
    const { username, email, password, confirmPassword } = form;

    if (!username.trim()) {
      setFormError("Username is required.");
      return false;
    }

    if (!email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    setIsloading(true);
    try {
      await signup(form.email, form.password, form.username);
    } catch (err) {
      setFormError(err.message);
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
          alt="signup visual"
          className="w-full h-full object-cover rounded-l-3xl"
        />
      </div>
      <div className="flex-1 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-3xl font-bold text-center text-gray-700">
            Sign Up
          </h2>
          <p className="text-sm text-center text-gray-500 mb-4">
            Create your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                type="text"
                className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
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
                  Sign Up
                </button>
              )}
            </div>
          </form>

          {formError && (
            <p className="text-red-500 text-sm text-center mb-4">{formError}</p>
          )}

          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={togglePage}
              className="text-blue-600 font-medium underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
