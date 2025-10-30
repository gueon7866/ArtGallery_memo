// 6. 관리자 권한 확인
const admin = (req, res, next) => {
  // (중요) 이 미들웨어는 'protect' 미들웨어 뒤에서 실행되어야 함
  // 'protect'가 req.user를 미리 넣어주기 때문
  
  if (req.user && req.user.role === 'admin') {
    next(); // 관리자 맞음 -> 통과
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
  }
};

// (가장 중요) 이 코드가 빠지면 'admin'이 undefined가 됩니다.
module.exports = { admin };

