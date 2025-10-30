// 9. 작품 스키마 (업로드, 검수, 추천)
const mongoose = require('mongoose');

// (옵션) 신고 내역을 위한 서브 스키마
const reportSchema = mongoose.Schema({
  user: { // 신고한 유저
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: { // 신고 사유
    type: String,
    required: true,
  },
  createdAt: { // 신고 일시
    type: Date,
    default: Date.now,
  }
});

const artworkSchema = mongoose.Schema({
  // 1. 기본 정보 (작성자, 작품 내용)
  user: { // 작성자 (User 모델과 연결)
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  imageUrl: { // 예: AWS S3 또는 Cloudinary에 저장된 URL
    type: String, 
    required: true 
  },
  genre: { // 장르 (예: '사진', '디지털 아트', '회화')
    type: String 
  },
  tags: [ // 태그 (배열)
    { type: String }
  ],
  
  // 2. 관리자 영역 필드
  status: { // 관리자 검수 상태
    type: String,
    enum: ['pending', 'approved', 'rejected'], // 3가지 상태
    default: 'pending', // 업로드 시 기본값은 '검수 대기'
  },
  rejectionReason: { // (옵션) 검수 거부 사유
    type: String,
  },
  isRecommended: { // 관리자 추천 여부
    type: Boolean,
    default: false,
  },

  // 3. 사용자 신고 필드
  reports: [reportSchema], // 신고 내역 (배열)
  
}, { 
  timestamps: true // createdAt, updatedAt 자동 생성
});

const Artwork = mongoose.model('Artwork', artworkSchema);
module.exports = Artwork;

