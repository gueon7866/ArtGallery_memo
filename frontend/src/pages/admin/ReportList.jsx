import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Axios 인스턴스
import Spinner from '../../components/common/Spinner';
import { Link } from 'react-router-dom';

// [관리자] 사용자 신고 확인 페이지
const ReportList = () => {
  const [reportedArtworks, setReportedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. 신고된 작품 목록 가져오기
  const fetchReportedArtworks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/admin/reports');
      setReportedArtworks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reported artworks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedArtworks();
  }, []); // 마운트 시 1회 실행

  // 2. 신고 조치 완료 (신고 내역만 삭제)
  const handleResolveReport = async (id) => {
    // Custom modal for confirmation would be better than window.confirm
    if (window.confirm('이 작품의 신고 내역을 모두 처리 완료(삭제)하시겠습니까? (작품은 유지됩니다)')) {
      try {
        await api.put(`/api/admin/reports/${id}/resolve`);
        // 상태 업데이트: 성공한 항목을 목록에서 제거
        setReportedArtworks((prevArtworks) =>
          prevArtworks.filter((art) => art._id !== id)
        );
      } catch (err) {
        // Custom alert/toast would be better
        alert('신고 처리에 실패했습니다: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // 3. 작품 삭제 (관리자 권한으로 삭제)
  const handleDeleteArtwork = async (id) => {
    if (window.confirm('신고된 이 작품을 즉시 삭제하시겠습니까? (영구 삭제)')) {
      try {
        // artworkController의 deleteArtwork 라우트 재사용
        await api.delete(`/api/artworks/${id}`); 
        // 상태 업데이트: 성공한 항목을 목록에서 제거
        setReportedArtworks((prevArtworks) =>
          prevArtworks.filter((art) => art._id !== id)
        );
      } catch (err) {
        alert('작품 삭제에 실패했습니다: ' + (err.response?.data?.message || err.message));
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
        사용자 신고 목록
      </h1>

      {reportedArtworks.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">현재 신고 접수된 작품이 없습니다.</p>
          <Link to="/admin/dashboard" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            &larr; 관리자 대시보드로 돌아가기
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {reportedArtworks.map((art) => (
              <li key={art._id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* 이미지 및 기본 정보 */}
                  <div className="md:w-1/3 lg:w-1/4">
                    <img 
                      src={art.imageUrl} 
                      alt={art.title} 
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
                    />
                    <h2 className="text-xl font-semibold mt-4 mb-2">{art.title}</h2>
                    <p className="text-gray-600 text-sm">
                      <strong>업로더:</strong> {art.user?.name || '알 수 없음'}
                    </p>
                    <Link 
                      to={`/artwork/${art._id}`} // 상세보기 페이지로 이동
                      target="_blank" // 새 탭에서 열기
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
                    >
                      작품 상세보기 &rarr;
                    </Link>
                  </div>
                  
                  {/* 신고 내역 */}
                  <div className="md:w-2/3 lg:w-3/4">
                    <h3 className="text-lg font-semibold text-red-600 mb-3">
                      신고 내역 ({art.reports.length} 건)
                    </h3>
                    <div className="max-h-48 overflow-y-auto bg-gray-50 p-4 rounded-lg border">
                      <ul className="divide-y divide-gray-200">
                        {art.reports.map((report, index) => (
                          <li key={index} className="py-2">
                            <p className="text-sm text-gray-800">
                              <strong>사유:</strong> {report.reason}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              <strong>신고자:</strong> {report.reportedBy?.name || '익명'} | 
                              <strong> 일시:</strong> {new Date(report.createdAt).toLocaleString('ko-KR')}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* 조치 버튼 */}
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => handleResolveReport(art._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        신고 처리 (작품 유지)
                      </button>
                      <button
                        onClick={() => handleDeleteArtwork(art._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        작품 삭제 (영구)
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportList;

