import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Axios 인스턴스
import Spinner from '../../components/common/Spinner';
import { Link } from 'react-router-dom';

// [관리자] 불건전 이미지 검수 페이지
const ModerationQueue = () => {
  const [pendingArtworks, setPendingArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. 검수 대기 중인 작품 목록 가져오기
  const fetchPendingArtworks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/admin/moderation/pending');
      setPendingArtworks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending artworks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArtworks();
  }, []); // 마운트 시 1회 실행

  // 2. 작품 승인 처리
  const handleApprove = async (id) => {
    try {
      // API 호출
      await api.put(`/api/admin/moderation/${id}/approve`);
      // 상태 업데이트: 성공한 항목을 목록에서 제거
      setPendingArtworks((prevArtworks) =>
        prevArtworks.filter((art) => art._id !== id)
      );
    } catch (err) {
      alert('승인 처리에 실패했습니다: ' + (err.response?.data?.message || err.message));
    }
  };

  // 3. 작품 거절 처리
  const handleReject = async (id) => {
    if (window.confirm('정말로 이 작품을 거절(삭제)하시겠습니까?')) {
      try {
        // API 호출
        await api.put(`/api/admin/moderation/${id}/reject`);
        // 상태 업데이트: 성공한 항목을 목록에서 제거
        setPendingArtworks((prevArtworks) =>
          prevArtworks.filter((art) => art._id !== id)
        );
      } catch (err) {
        alert('거절 처리에 실패했습니다: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // --- 렌더링 ---

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        이미지 검수 대기열
      </h1>

      {pendingArtworks.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">검수 대기 중인 작품이 없습니다.</p>
          <Link to="/admin/dashboard" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            &larr; 관리자 대시보드로 돌아가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pendingArtworks.map((art) => (
            <div key={art._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img 
                src={art.imageUrl} 
                alt={art.title} 
                className="w-full h-64 object-cover" 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{art.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  <strong>업로더:</strong> {art.user?.name || '알 수 없음'}
                </p>
                <p className="text-gray-700 mb-4">{art.description}</p>
                
                {/* 액션 버튼 */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(art._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    승인 (Approve)
                  </button>
                  <button
                    onClick={() => handleReject(art._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    거절 (Reject)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationQueue;

