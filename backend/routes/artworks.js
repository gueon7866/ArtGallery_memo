// 14. 작품 CRUD API 경로
const express = require('express');
const router = express.Router();
const {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  reportArtwork,
} = require('../controllers/artworkController.js');
const { protect } = require('../middleware/authMiddleware.js');

// --- 작품 목록 및 업로드 ---

// @route   GET /api/artworks
// @desc    모든 작품 목록 가져오기 (공개, 'approved'된 것만) + 검색
router.route('/').get(getArtworks);

// @route   POST /api/artworks
// @desc    새 작품 업로드 (로그인 필요)
router.route('/').post(protect, createArtwork);

// --- 개별 작품 (상세보기, 수정, 삭제) ---

// @route   GET /api/artworks/:id
// @desc    특정 작품 상세보기
router.route('/:id').get(getArtworkById);

// @route   PUT /api/artworks/:id
// @desc    작품 정보 수정 (작성자 본인 + 로그인 필요)
router.route('/:id').put(protect, updateArtwork);

// @route   DELETE /api/artworks/:id
// @desc    작품 삭제 (작성자 본인 + 로그인 필요)
router.route('/:id').delete(protect, deleteArtwork);

// --- 작품 신고 ---

// @route   POST /api/artworks/:id/report
// @desc    작품 신고하기 (로그인 필요)
router.route('/:id/report').post(protect, reportArtwork);

module.exports = router;

