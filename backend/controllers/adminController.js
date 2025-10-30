// 12. 관리자 로직 (검수, 추천, 신고 처리)
const Artwork = require('../models/artworkModel.js');

// --- 1. 불건전 이미지 검수 ---

// @desc    검수 대기 중인 작품 목록 가져오기
// @route   GET /api/admin/moderation/pending
// @access  Private/Admin
const getPendingArtworks = async (req, res) => {
  try {
    // status가 'pending'인 작품을 찾고, 오래된 순서대로 정렬
    const artworks = await Artwork.find({ status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: 1 }); // 오래된 것부터 처리
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    작품 승인하기
// @route   PUT /api/admin/moderation/approve/:id
// @access  Private/Admin
const approveArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    artwork.status = 'approved';
    await artwork.save();
    res.json({ message: 'Artwork approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    작품 거절하기
// @route   PUT /api/admin/moderation/reject/:id
// @access  Private/Admin
const rejectArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    artwork.status = 'rejected';
    await artwork.save();
    res.json({ message: 'Artwork rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. 사용자 신고 확인 ---

// @desc    신고 접수된 작품 목록 가져오기
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReportedArtworks = async (req, res) => {
  try {
    // 'reports' 배열이 1개 이상($gt: 0)인 작품 목록
    const artworks = await Artwork.find({ 'reports.0': { $exists: true } })
      .populate('user', 'name email')
      .populate('reports.user', 'name'); // 신고한 유저의 이름
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    신고 내역 처리 (신고 기록 삭제)
// @route   PUT /api/admin/reports/resolve/:id
// @access  Private/Admin
const resolveReport = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    // (간편) 모든 신고 내역을 비웁니다.
    artwork.reports = [];
    await artwork.save();
    res.json({ message: 'Reports resolved (cleared)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. 전시 추천 관리 ---

// @desc    작품을 '추천'으로 설정
// @route   PUT /api/admin/recommend/:id
// @access  Private/Admin
const setRecommendation = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    artwork.isRecommended = true;
    await artwork.save();
    res.json({ message: 'Artwork set as recommended' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    작품 '추천' 해제
// @route   PUT /api/admin/recommend/remove/:id
// @access  Private/Admin
const removeRecommendation = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    artwork.isRecommended = false;
    await artwork.save();
    res.json({ message: 'Artwork recommendation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// (중요) 모든 함수를 export 합니다.
module.exports = {
  getPendingArtworks,
  approveArtwork,
  rejectArtwork,
  getReportedArtworks,
  resolveReport,
  setRecommendation,
  removeRecommendation,
};

