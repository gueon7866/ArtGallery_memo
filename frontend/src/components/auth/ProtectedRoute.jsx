import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

/**
 * ProtectedRoute
 * - 로그인된 사용자만 접근 가능
 * - requireAdmin=true인 경우 관리자만 접근 가능
 * - 로그인되지 않으면 /login 으로 리다이렉트
 *
 * 사용 예:
 *   <ProtectedRoute><DashboardPage /></ProtectedRoute>
 *   <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, token } = useAuthStore();
  const location = useLocation();

  // 1️⃣ 로그인하지 않은 경우 → /login으로 리다이렉트
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2️⃣ 관리자 전용인데 일반 사용자면 → /403 또는 홈으로 리다이렉트
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  // 3️⃣ 접근 허용
  return children;
}
