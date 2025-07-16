import React, { useEffect } from "react";
import SignupForm from "../components/SignupForm";
import SigninForm from "../components/SigninForm";
import { useSearchParams } from "react-router";

export default function Registration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const isLogin = page === "login";

  const togglePage = () => {
    setSearchParams({ page: isLogin ? "signup" : "login" });
  };

  useEffect(() => {
    if (page !== "login" && page !== "signup") {
      setSearchParams({ page: "signup" });
    }
  }, [page, setSearchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-900 px-4">
      {isLogin ? (
        <SigninForm togglePage={togglePage} />
      ) : (
        <SignupForm togglePage={togglePage} />
      )}
    </div>
  );
}
