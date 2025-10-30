// 11. 작품 로직 (CRUD)
const Artwork = require('../models/artworkModel.js');
// const asyncHandler = require('express-async-handler'); // try...catch를 사용하므로 asyncHandler 제거

// --- C : Create (생성) ---
// @desc    새 작품 업로드 (로그인 필요)
// @route   POST /api/artworks
// @access  Private
// [수정 1] 'uploadArtwork' -> 'createArtwork'로 이름 변경 (exports와 일치)
const createArtwork = async (req, res) => {
  try {
    const { title, description, imageUrl, genre, tags } = req.body;

    // (중요) 이미지 업로드 로직
    // 실제 프로덕션에서는 S3, Cloudinary 등에 업로드하는 로직이
    // 이 컨트롤러 이전에 '파일 업로드 미들웨어'에서 처리되어야 합니다.
    // 여기서는 imageUrl이 이미 텍스트로 전달되었다고 가정합니다.

    if (!title || !description || !imageUrl) {
      return res.status(400).json({ message: 'Title, description, image URL are required' });
    }

    const artwork = new Artwork({
      title,
      description,
      imageUrl,
      genre,
      tags,
      user: req.user._id, // (중요) protect 미들웨어가 넣어준 req.user 정보
      status: 'pending', // (중요) 기본 상태는 '검수 대기'
    });

    const createdArtwork = await artwork.save();
    res.status(201).json(createdArtwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- R : Read (읽기) ---
// @desc    모든 작품 목록 가져오기 (검색, 페이지네이션)
// @route   GET /api/artworks
// @access  Public
const getArtworks = async (req, res) => {
  try {
    // 1. (필터) 관리자 승인('approved')된 작품만 표시
    const filter = { status: 'approved' };

    // 2. (검색) 쿼리 파라미터(req.query)로 검색 조건 추가
    // 예: /api/artworks?genre=사진
    if (req.query.genre) {
      filter.genre = req.query.genre;
    }
    
    // 예: /api/artworks?tag=풍경
    if (req.query.tag) {
      // tags 배열에 해당 태그가 포함되어 있는지 (Mongoose $in 연산자)
      filter.tags = { $in: [req.query.tag] };
    }

    // 예: /api/artworks?search=하늘
    // (제목 또는 설명에서 '하늘'이라는 단어 검색 - 대소문자 무시)
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i'); // 'i' = case-insensitive
      filter.$or = [ // (OR 조건)
        { title: regex },
        { description: regex }
      ];
    }
    
    // 3. (정렬) 최신순 (기본값)
    const sort = { createdAt: -1 };

    // 4. (실행) 필터와 정렬 기준으로 작품 조회
    // .populate('user', 'name'): 'user' 필드(ID)를 실제 User 정보(name만)로 대체
    const artworks = await Artwork.find(filter)
                                    .populate('user', 'name') 
                                    .sort(sort);
                                    
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    특정 ID의 작품 상세보기
// @route   GET /api/artworks/:id
// @access  Public
const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate('user', 'name email');

    if (artwork) {
      // (중요) 승인된 작품이거나, 관리자이거나, 본인이 작성한 경우에만
      if (artwork.status === 'approved' || 
          req.user?.role === 'admin' || 
          artwork.user._id.equals(req.user?._id)) 
      {
        res.json(artwork);
      } else {
        // 승인 대기 중인 다른 사람의 작품에 접근 시
        res.status(403).json({ message: 'Not authorized to view this artwork' });
      }
    } else {
      res.status(404).json({ message: 'Artwork not found' });
    }
  } catch (error) {
    // ID 형식이 잘못되었을 때 (Mongoose CastError)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// --- U : Update (수정) ---
// @desc    작품 수정 (본인 또는 관리자)
// @route   PUT /api/artworks/:id
// @access  Private
const updateArtwork = async (req, res) => {
  try {
    const { title, description, genre, tags } = req.body;
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // (권한 확인) 본인이 작성했거나, 관리자인 경우에만 수정 가능
    if (artwork.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    // 데이터 업데이트
    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.genre = genre || artwork.genre;
    artwork.tags = tags || artwork.tags;
    
    // (중요) 수정 시, 다시 '검수 대기' 상태로 변경
    artwork.status = 'pending'; 

    const updatedArtwork = await artwork.save();
    res.json(updatedArtwork);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- D : Delete (삭제) ---
// @desc    작품 삭제 (본인 또는 관리자)
// @route   DELETE /api/artworks/:id
// @access  Private
const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // (권한 확인) 본인이 작성했거나, 관리자인 경우에만 삭제 가능
    if (artwork.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await artwork.deleteOne(); // Mongoose v6+
    res.json({ message: 'Artwork removed' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- (기타) ---
// [수정 2] 'reportArtwork' 함수 누락된 것 추가
// @desc    작품 신고하기 (로그인 필요)
// @route   POST /api/artworks/:id/report
// @access  Private
const reportArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Report reason is required' });
    }

    // 이미 신고했는지 확인 (선택적)
    const alreadyReported = artwork.reports.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({ message: 'You have already reported this artwork' });
    }

    // 신고 내역 추가
    artwork.reports.push({
      user: req.user._id,
      reason: reason,
    });

    // (중요) 신고가 접수되면 '검수 대기' 상태로 변경
    artwork.status = 'pending';

    await artwork.save();
    res.status(201).json({ message: 'Artwork reported successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getArtworks,
  getArtworkById,
  createArtwork, // 'uploadArtwork' -> 'createArtwork' (일치)
  updateArtwork,
  deleteArtwork,
  reportArtwork, // [수정 2] 함수 추가 완료
};

