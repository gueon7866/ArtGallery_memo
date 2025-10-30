// 10. 유저 로직 (회원가입, 로그인)
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

// --- JWT 토큰 생성 함수 ---
// (이 파일 내부에서만 사용)
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, // 토큰에 담을 정보 (유저 ID, 권한)
    process.env.JWT_SECRET, // .env 파일의 비밀키
    { expiresIn: '30d' } // 유효기간 (예: 30일)
  );
};

// @desc    회원가입 (Register a new user)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. 필수 값 확인
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // 2. 이메일 중복 확인
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. (중요) userModel.js의 'pre-save' 미들웨어가 비밀번호를 자동으로 해싱(hashing)함
    const user = await User.create({
      name,
      email,
      password,
      // role은 기본값 'user'로 설정됨
    });

    // 4. 회원가입 성공 시, 바로 토큰 발급 (로그인 처리)
    if (user) {
      const token = generateToken(user._id, user.role);
      
      // (보안 옵션) 토큰을 쿠키에 저장 (httpOnly: true)
      // res.cookie('jwt', token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV !== 'development', // 'https' 일때만
      //   sameSite: 'strict',
      //   maxAge: 30 * 24 * 60 * 60 * 1000 // 30일
      // });
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token, // (클라이언트가 직접 저장)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    로그인 (Auth user & get token)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. 이메일로 유저 찾기
    const user = await User.findOne({ email });

    // 2. 유저가 존재하고, 비밀번호가 일치하는지 확인
    // (userModel.js의 matchPassword 메소드 사용)
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);

      // (보안 옵션) 토큰을 쿠키에 저장
      // res.cookie('jwt', token, { ... });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      // (보안) 로그인 실패 시, "이메일이 틀렸다" 또는 "비밀번호가 틀렸다"고
      //      자세히 알려주지 않는 것이 좋습니다.
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    로그아웃 (Logout user / clear cookie)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  // (보안 옵션) JWT 토큰을 서버측 쿠키에 저장했을 경우,
  // 로그아웃 시 이 쿠키를 만료시켜야 합니다.
  
  // res.cookie('jwt', '', { // 빈 토큰
  //   httpOnly: true,
  //   expires: new Date(0), // 즉시 만료
  // });
  // res.status(200).json({ message: 'Logged out successfully' });

  // (클라이언트 저장 방식)
  // 클라이언트(React)에서 토큰을 로컬 스토리지/Zustand에서 삭제하면 됩니다.
  // 서버는 별도 처리 없이 200 OK만 응답합니다.
  res.status(200).json({ message: 'Logout successful. Please clear token on client-side.' });
};

// @desc    내 프로필 정보 가져오기
// @route   GET /api/auth/profile
// @access  Private (authMiddleware.js의 'protect' 필요)
const getUserProfile = async (req, res) => {
  // 'protect' 미들웨어가 성공하면, req.user에 로그인된 유저 정보가 담겨있음
  try {
    const user = await User.findById(req.user._id).select('-password'); // 비밀번호 제외
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};

