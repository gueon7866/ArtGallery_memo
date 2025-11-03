import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api"; // Axios 인스턴스
import Spinner from "../../components/common/Spinner";

/**
 * 관리자 대시보드 페이지
 * - 통계 요약 및 주요 관리 메뉴를 표시
 * - /api/admin/stats 엔드포인트로부터 데이터 불러오기
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        // (예시) 백엔드에서 반환되는 데이터 예시:
        // { pendingArtworks: 5, reportedArtworks: 2, recommendedArtworks: 1 }
        const { data } = await api.get("/api/admin/stats");
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <Spinner fullPage={true} />;
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        관리자 대시보드
      </h1>

      {/* 1. 요약 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* 검수 대기 카드 */}
        <Link
          to="/admin/moderation"
          className="bg-white shadow-lg rounded-lg p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-medium text-gray-700">
            검수 대기중인 작품
          </h2>
          <p className="mt-2 text-4xl font-bold text-yellow-600">
            {stats?.pendingArtworks ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">승인 또는 거절 대기</p>
        </Link>

        {/* 신고 접수 카드 */}
        <Link
          to="/admin/reports"
          className="bg-white shadow-lg rounded-lg p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-medium text-gray-700">새로운 신고</h2>
          <p className="mt-2 text-4xl font-bold text-red-600">
            {stats?.reportedArtworks ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">확인 및 조치 필요</p>
        </Link>

        {/* 추천 작품 카드 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-700">추천 작품</h2>
          <p className="mt-2 text-4xl font-bold text-indigo-600">
            {stats?.recommendedArtworks ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">현재 메인에 노출 중</p>
        </div>
      </div>

      {/* 2. 관리자 메뉴 바로가기 */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">관리 메뉴</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/admin/moderation"
            className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            이미지 검수 페이지로 이동
          </Link>
          <Link
            to="/admin/reports"
            className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            신고 목록 확인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
