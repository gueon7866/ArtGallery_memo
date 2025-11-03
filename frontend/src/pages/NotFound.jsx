import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      <h1>404 - 페이지를 찾을 수 없습니다.</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <Link to="/" style={{ color: "#3b82f6", textDecoration: "underline" }}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}
