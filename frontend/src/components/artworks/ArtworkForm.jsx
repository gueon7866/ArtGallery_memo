import React, { useState, useEffect } from 'react';

// UploadPage와 EditPage에서 재사용될 폼 컴포넌트
// initialData: (수정용) 폼을 채울 초기 데이터
// onSubmit: (필수) 폼 제출 시 실행할 함수
// isLoading: (선택) 제출 버튼 로딩 상태
const ArtworkForm = ({ initialData, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    genre: '',
    tags: '', // (입력) 태그는 쉼표로 구분된 문자열로 받음
  });

  // initialData가 (EditPage로부터) 전달되면 폼 상태를 채움
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        genre: initialData.genre || '',
        tags: Array.isArray(initialData.tags) 
              ? initialData.tags.join(', ') // (표시) 배열을 쉼표 문자열로 변환
              : '',
      });
    }
  }, [initialData]);

  // 폼 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // (처리) 쉼표로 구분된 태그 문자열을 배열로 변환
    const processedData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // 빈 태그 제거
    };
    
    // 부모 컴포넌트(UploadPage, EditPage)의 onSubmit 함수 호출
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      {/* 1. 제목 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          작품 제목
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 2. 설명 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          작품 설명
        </label>
        <textarea
          name="description"
          id="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      {/* 3. 이미지 URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          이미지 URL
        </label>
        <input
          type="text"
          name="imageUrl"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
          placeholder="https://... (S3/Cloudinary 업로드 URL)"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          * (참고) 실제 프로덕션에서는 파일 업로드 UI가 필요하지만, 현재는 백엔드와 동일하게 URL을 직접 입력받습니다.
        </p>
      </div>

      {/* 4. 장르 */}
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
          장르 (선택)
        </label>
        <input
          type="text"
          name="genre"
          id="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="예: 사진, 유화, 디지털 아트"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 5. 태그 */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          태그 (선택)
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="쉼표(,)로 태그를 구분하세요 (예: 풍경, 밤하늘)"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 6. 제출 버튼 */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isLoading ? '처리 중...' : (initialData ? '작품 수정하기' : '작품 업로드하기')}
        </button>
      </div>
    </form>
  );
};

export default ArtworkForm;

