import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  // 아직 AuthContext가 초기화 중이거나 token이 없는 경우
  if (!token) {
    // 로그인 안 된 사용자는 로그인 페이지로 이동
    // 원래 가려던 경로(location.state) 정보를 함께 넘겨줌
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 토큰이 존재하면 children 컴포넌트 그대로 렌더링
  return children;
};

export default ProtectedRoute;
