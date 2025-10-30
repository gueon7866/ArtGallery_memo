import React from 'react';

// API 요청 등 비동기 작업 시 사용되는 로딩 스피너
// Tailwind CSS의 animate-spin 유틸리티를 사용합니다.
const Spinner = ({ fullPage = false }) => {
  const spinnerElement = (
    <div
      className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );

  // fullPage 프롭이 true이면, 화면 전체를 덮는 중앙 스피너를 반환
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-gray-100 bg-opacity-75">
        {spinnerElement}
      </div>
    );
  }

  // 기본값은 인라인 스피너
  return spinnerElement;
};

export default Spinner;

