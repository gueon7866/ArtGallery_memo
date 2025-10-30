// 15. 관리자 기능 API 경로
const express = require('express');
const router = express.Router();

// (중요) 컨트롤러 함수들 불러오기
const {
  getPendingArtworks,
  approveArtwork,
  rejectArtwork,
  getReportedArtworks,
  resolveReport,
  setRecommendation,
  removeRecommendation,
} = require('../controllers/adminController.js');

// (중요) 미들웨어 함수들 불러오기
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');

// (중요) 모든 관리자 라우트는 'protect'와 'admin' 미들웨어를 통과해야 함
router.use(protect);
router.use(admin);

// --- 1. 불건전 이미지 검수 (Moderation) ---
router
  .route('/moderation/pending')
  .get(getPendingArtworks); // '검수 대기' 목록

router
  .route('/moderation/approve/:id')
  .put(approveArtwork); // 작품 승인

router
  .route('/moderation/reject/:id')
  .put(rejectArtwork); // 작품 거부

// --- 2. 사용자 신고 확인 (Reports) ---
router
  .route('/reports')
  .get(getReportedArtworks); // 신고된 작품 목록

router
  .route('/reports/resolve/:id')
  .put(resolveReport); // 신고 처리 (작품 ID 기준)

// --- 3. 전시 추천 관리 (Recommendations) ---
router
  .route('/recommend/:id')
  .put(setRecommendation); // 작품 추천

router
  .route('/recommend/:id')
  .delete(removeRecommendation); // 작품 추천 해제

module.exports = router;

