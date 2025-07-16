import { Route, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserProvider";
import { PostProvider } from "./context/PostProvider";

function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/registration";

  return (
    <UserProvider>
      <PostProvider>
        {!hideNavbar && <Navbar />}
        <AppRoutes />
      </PostProvider>
    </UserProvider>
  );
}

export default App;
