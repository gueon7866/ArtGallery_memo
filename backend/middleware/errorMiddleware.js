// 7. 중앙 오류 처리기

// 404 Not Found (존재하지 않는 API 경로)
// (가장 하단 라우트들 '다음에' 위치해야 함)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // (중요) 에러를 다음 핸들러(errorHandler)로 넘김
};

// 중앙 오류 처리기 (Central Error Handler)
// (참고) Express는 4개의 인자를 가진 함수를 오류 처리기로 인식함
const errorHandler = (err, req, res, next) => {
  // 404에서 넘어온 경우, 기본 500 상태 코드 사용
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose CastError (예: 잘못된 형식의 ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// (가장 중요) 두 함수를 exports 해야 server.js에서 사용 가능
module.exports = {
  notFound,
  errorHandler,
};

