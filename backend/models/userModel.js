// 8. 유저 스키마 (회원가입/로그인)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // 비밀번호 해싱을 위한 라이브러리

const userSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // 이메일은 고유해야 함
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { // 유저 권한 ('user' 또는 'admin')
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' // 기본값은 'user'
  }
}, { 
  timestamps: true // createdAt, updatedAt 자동 생성
});

// --- Mongoose Middleware ---

// (중요) 'save' 이벤트가 발생하기 전 (즉, DB에 저장하기 전)에 실행될 함수
// (예: User.create() 또는 user.save() 호출 시)
userSchema.pre('save', async function (next) {
  // 1. 만약 비밀번호 필드가 수정되지 않았다면 (예: 이름만 수정)
  if (!this.isModified('password')) {
    next(); // 다음 미들웨어로 넘어감
  }
  
  // 2. 비밀번호가 새로 생성되거나 수정되었다면
  // (보안) 암호화 강도 (salt rounds)
  const salt = await bcrypt.genSalt(10); 
  // 현재 유저(this)의 비밀번호를 해시(hash)된 값으로 대체
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Mongoose Model Methods ---

// (중요) 로그인 시 입력된 비밀번호와 DB의 해시된 비밀번호를 비교하는 메소드
userSchema.methods.matchPassword = async function (enteredPassword) {
  // this.password 는 DB에 저장된 *해시된* 비밀번호
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

