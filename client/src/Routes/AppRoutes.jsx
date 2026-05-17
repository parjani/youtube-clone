import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../Layout/MainLayout";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import VideoPlayer from "../Pages/VideoPlayer";

import CreateChannel from "../Pages/Channel/CreateChannel";
import ChannelPage from "../Pages/Channel/Channel";

function AppRoutes() {
  function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* ROUTES WITH HEADER + SIDEBAR */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/my-channel"
            element={
              <ProtectedRoute>
                <ChannelPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/video/:id"
            element={<VideoPlayer />}
          />
        </Route>

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* CREATE CHANNEL */}
        <Route
          path="/create-channel"
          element={<CreateChannel />}
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
              <div className="text-center">
                <h1 className="text-3xl font-bold">Page Not Found</h1>
                <p className="text-zinc-400 mt-2">
                  The page you are looking for does not exist.
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;