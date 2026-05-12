import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import VideoPage from "../pages/VideoPage";
import ChannelPage from "../pages/ChannelPage";
import PublicChannelPage from "../pages/PublicChannelPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/videos/:videoId" element={<VideoPage />} />
      <Route path="/channel" element={<ChannelPage />} />
      <Route path="/channel/:id" element={<PublicChannelPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
