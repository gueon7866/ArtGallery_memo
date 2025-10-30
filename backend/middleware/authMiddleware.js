// 5. JWT 토큰 검증 (로그인 확인)
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = async (req, res, next) => {
  let token;

  // 1. 'authorization' 헤더에서 토큰 읽기 (Bearer 토큰)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 'Bearer' 문자열 제거하고 토큰만 분리
      token = req.headers.authorization.split(' ')[1];

      // 2. 토큰 검증 (Verify)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. (중요) 토큰에서 사용자 ID를 기반으로 DB에서 사용자 정보 조회
      //    비밀번호는 제외하고(-password) 가져옴
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        // 토큰은 유효하나, 유저가 DB에 없는 경우 (예: 탈퇴)
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // 다음 미들웨어 또는 컨트롤러로 이동
    } catch (error) {
      console.error(error);
      // 토큰이 만료되었거나, 형식이 잘못된 경우
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    // 토큰이 헤더에 없는 경우
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// (가장 중요) 이 코드가 빠지면 'protect'가 undefined가 됩니다.
module.exports = { protect };

