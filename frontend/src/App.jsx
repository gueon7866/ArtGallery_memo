import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UploadPage from "./pages/UploadPage";
import EditPage from "./pages/EditPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* ✅ 로그인 없이 바로 들어갈 수 있도록 모든 보호 해제 */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/edit/:id" element={<EditPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}