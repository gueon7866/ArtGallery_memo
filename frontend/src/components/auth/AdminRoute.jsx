import React from "react";
import ProtectedRoute from "./ProtectedRoute";

// ✅ 관리자 전용 라우트 (기본 내보내기 포함)
const AdminRoute = ({ children }) => {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
};

export default AdminRoute;
