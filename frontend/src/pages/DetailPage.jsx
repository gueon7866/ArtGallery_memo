import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Axios 인스턴스
import Spinner from '../../components/common/Spinner';
import useAuthStore from '../../store/useAuthStore'; // Zustand 스토어

// [사용자] 작품 상세보기 페이지
const DetailPage = () => {
  const { id } = useParams(); // URL에서 작품 ID (예: /artwork/123)
  const navigate = useNavigate();

  // 1. 상태 관리
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 현재 로그인한 유저 정보 (Zustand에서)
  const { user } = useAuthStore(); 
  
  // (신고 기능)
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // 2. 데이터 가져오기 (useEffect)
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        // (백엔드 artworkController.js의 getArtworkById와 연결됨)
        const { data } = await api.get(`/api/artworks/${id}`);
        setArtwork(data);
      } catch (err) {
        // (중요) 403: 접근 권한 없음 (예: pending 상태)
        // 404: 작품 없음
        setError(err.response?.data?.message || 'Failed to fetch artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]); // id가 변경될 때마다 다시 호출

  // 3. (기능) 작품 삭제
  const handleDeleteArtwork = async () => {
    // Custom modal for confirmation would be better
    if (window.confirm('이 작품을 정말 삭제하시겠습니까? (영구 삭제)')) {
      try {
        // (백엔드 artworkController.js의 deleteArtwork와 연결됨)
        await api.delete(`/api/artworks/${id}`);
        // Custom alert/toast would be better
        alert('작품이 삭제되었습니다.');
        navigate('/dashboard'); // 삭제 후 대시보드로 이동
      } catch (err) {
        alert('삭제에 실패했습니다: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // 4. (기능) 작품 신고
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      alert('신고 사유를 입력해주세요.');
      return;
    }
    
    setReportLoading(true);
    try {
      // (백엔드 artworkController.js의 reportArtwork와 연결됨)
      await api.post(`/api/artworks/${id}/report`, { reason: reportReason });
      alert('작품이 신고되었습니다. 관리자 검토 후 조치됩니다.');
      setShowReportForm(false);
      setReportReason('');
    } catch (err) {
      alert('신고에 실패했습니다: ' + (err.response?.data?.message || err.message));
    } finally {
      setReportLoading(false);
    }
  };

  // 5. 권한 확인 (본인 또는 관리자 여부)
  const isOwnerOrAdmin = user && artwork && (
    user.role === 'admin' || user._id === artwork.user._id
  );

  // --- 렌더링 ---

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        <h2 className="text-2xl font-semibold">오류: {error}</h2>
        <Link to="/dashboard" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          &larr; 대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  if (!artwork) {
    return null; // 데이터가 없는 경우 (보통 로딩 전에 처리됨)
  }

  // 작품 정보가 성공적으로 로드된 경우
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
        
        {/* 1. 이미지 */}
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-auto max-h-[70vh] object-contain bg-gray-100"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'; }}
        />

        <div className="p-8">
          {/* 2. 제목 및 관리 버튼 */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 break-words">
              {artwork.title}
            </h1>
            
            {/* (조건부) 본인 또는 관리자만 수정/삭제 가능 */}
            {isOwnerOrAdmin && (
              <div className="flex-shrink-0 flex gap-2">
                <Link
                  to={`/artwork/edit/${artwork._id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  수정
                </Link>
                <button
                  onClick={handleDeleteArtwork}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 3. 업로더 정보 */}
          <div className="text-gray-600 mb-6">
            <p>
              <strong>업로더:</strong> {artwork.user?.name || '알 수 없음'} ({artwork.user?.email || '...'})
            </p>
            <p className="text-sm">
              <strong>업로드 일시:</strong> {new Date(artwork.createdAt).toLocaleString('ko-KR')}
            </p>
          </div>
          
          {/* 4. 설명 */}
          <p className="text-lg text-gray-800 whitespace-pre-wrap break-words min-h-[100px]">
            {artwork.description}
          </p>

          {/* 5. 장르 및 태그 */}
          <div className="mt-6 flex flex-wrap gap-2 items-center">
            {artwork.genre && (
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {artwork.genre}
              </span>
            )}
            {artwork.tags?.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* 6. 신고하기 버튼 (본인 작품이 아닐 때) */}
          {user && artwork && user._id !== artwork.user._id && (
            <div className="border-t border-gray-200 mt-8 pt-6">
              {!showReportForm ? (
                <button
                  onClick={() => setShowReportForm(true)}
                  className="text-sm text-red-600 hover:underline"
                >
                  이 작품 신고하기
                </button>
              ) : (
                // 신고 폼
                <form onSubmit={handleReportSubmit}>
                  <h3 className="text-lg font-semibold text-red-700 mb-2">작품 신고</h3>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="3"
                    placeholder="신고 사유를 구체적으로 입력해주세요. (예: 저작권 침해, 불쾌한 콘텐츠 등)"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      disabled={reportLoading}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                    >
                      {reportLoading ? '전송 중...' : '신고 제출'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReportForm(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                    >
                      취소
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DetailPage;

