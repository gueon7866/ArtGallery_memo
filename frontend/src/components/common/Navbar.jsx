import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

// 모든 페이지 상단에 표시되는 공통 네비게이션 바
const Navbar = () => {
  // Zustand 스토어에서 user 정보와 logout 함수를 가져옴
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  
  const navigate = useNavigate();

  // 로그아웃 버튼 클릭 시
  const handleLogout = () => {
    logout(); // 스토어의 유저 정보 및 토큰 삭제
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. 왼쪽: 로고 및 메인 링크 */}
          <div className="flex items-center space-x-8">
            {/* 로고 */}
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Art Gallery
            </Link>
            
            {/* 메인 링크 */}
            <div className="hidden sm:flex sm:space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                대시보드
              </Link>
              {user && ( // 로그인한 경우에만 '업로드' 표시
                <Link
                  to="/upload"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  작품 업로드
                </Link>
              )}
            </div>
          </div>

          {/* 2. 오른쪽: 인증 관련 링크 */}
          <div className="flex items-center space-x-4">
            {user ? (
              // --- 로그인한 경우 ---
              <>
                {user.role === 'admin' && ( // 관리자인 경우
                  <Link
                    to="/admin/dashboard"
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    관리자
                  </Link>
                )}
                <span className="text-sm text-gray-700 hidden sm:block">
                  {user.name}님
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  로그아웃
                </button>
              </>
            ) : (
              // --- 로그아웃한 경우 ---
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

