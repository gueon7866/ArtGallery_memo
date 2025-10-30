import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Axios 인스턴스
import ArtworkCard from '../../components/artworks/ArtworkCard';
import Spinner from '../../components/common/Spinner';

// [사용자] 메인 대시보드 (작품 목록 보기)
const DashboardPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 검색 기능 ---
  // URL 쿼리 파라미터를 사용하여 검색 상태 관리 (예: /dashboard?search=하늘&genre=사진)
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL 쿼리로부터 현재 검색어/장르/태그 상태 초기화
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [genreFilter, setGenreFilter] = useState(searchParams.get('genre') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');

  // 1. 작품 목록 가져오기 (URL 쿼리 파라미터 기반)
  const fetchArtworks = async () => {
    try {
      setLoading(true);

      // 현재 URL의 쿼리 파라미터를 그대로 백엔드 API에 전달
      const params = new URLSearchParams(searchParams);
      
      // (백엔드 artworkController.js의 getArtworks와 연결됨)
      const { data } = await api.get('/api/artworks', { params }); 
      
      setArtworks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch artworks');
    } finally {
      setLoading(false);
    }
  };

  // 2. URL 쿼리 파라미터가 변경될 때마다 API 다시 호출
  useEffect(() => {
    fetchArtworks();
  }, [searchParams]); // searchParams가 바뀔 때마다 리-패치

  // 3. 검색 실행 (폼 제출 시)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // URL 쿼리 파라미터를 업데이트 -> useEffect가 자동으로 실행됨
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('search', searchTerm);
    if (genreFilter) newParams.set('genre', genreFilter);
    if (tagFilter) newParams.set('tag', tagFilter);

    setSearchParams(newParams);
  };

  // 4. 검색 초기화
  const handleResetSearch = () => {
    setSearchTerm('');
    setGenreFilter('');
    setTagFilter('');
    setSearchParams(new URLSearchParams()); // URL 쿼리 초기화
  };

  // --- 렌더링 ---

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* 1. 페이지 헤더 및 업로드 버튼 */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Art Gallery
        </h1>
        <Link
          to="/upload"
          className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          작품 업로드하기
        </Link>
      </div>

      {/* 2. 검색 필터 영역 */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 제목/설명 검색 */}
          <input
            type="text"
            placeholder="제목 또는 설명 검색..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* 장르 검색 (TODO: Select-box로 변경 권장) */}
          <input
            type="text"
            placeholder="장르 (예: 사진, 회화...)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          />
          {/* 태그 검색 */}
          <input
            type="text"
            placeholder="태그 (예: 풍경, 인물...)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
          {/* 검색/초기화 버튼 */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              검색
            </button>
            <button
              type="button"
              onClick={handleResetSearch}
              className="flex-1 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
            >
              초기화
            </button>
          </div>
        </form>
      </div>

      {/* 3. 작품 목록 (그리드) */}
      {loading ? (
        <Spinner fullPage={true} /> // 로딩 중
      ) : error ? (
        <div className="text-center text-red-500 mt-10">{error}</div> // 오류 발생
      ) : artworks.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-2xl font-semibold">표시할 작품이 없습니다.</p>
          <p className="mt-2">검색 조건을 변경하거나 초기화해 보세요.</p>
        </div> // 작품 없음
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((art) => (
            <ArtworkCard key={art._id} art={art} />
          ))}
        </div> // 작품 목록
      )}
    </div>
  );
};

export default DashboardPage;

