import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { Navigate, Route, Routes } from "react-router";
import Registration from "./../pages/Registration";
import Home from "../pages/Home";
import { MyProfile } from "./../pages/MyProfile";
import MyPosts from "../pages/MyPosts";
import MyLikes from "../pages/MyLikes";
import { MyShares } from "./../pages/MyShares";
import NotFound from "./../pages/NotFound";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(UserContext);

  if (!isAuthenticated)
    return <Navigate to="/registration?page=login" replace />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/likes"
        element={
          <ProtectedRoute>
            <MyLikes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shares"
        element={
          <ProtectedRoute>
            <MyShares />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
