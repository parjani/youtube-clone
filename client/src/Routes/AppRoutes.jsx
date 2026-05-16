import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Channel from "../Pages/Channel";
import VideoPlayer from "../Pages/VideoPlayer";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* CHANNEL */}
        <Route
          path="/channel"
          element={<Channel />}
        />

        {/* VIDEO PLAYER */}
        <Route
          path="/video/:id"
          element={<VideoPlayer />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;