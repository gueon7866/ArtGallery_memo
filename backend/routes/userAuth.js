// 13. 유저 인증 API 경로
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js'); // 로그인 검증 미들웨어

// @route   POST /api/auth/register
// @desc    회원가입
router.route('/register').post(registerUser);

// @route   POST /api/auth/login
// @desc    로그인 (JWT 토큰 발급)
router.route('/login').post(loginUser);

// @route   GET /api/auth/profile
// @desc    내 프로필 정보 가져오기 (로그인 필요)
// @access  Private
router.route('/profile').get(protect, getUserProfile);

module.exports = router;

