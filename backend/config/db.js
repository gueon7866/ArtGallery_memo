// 4. MongoDB 연결 로직
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // .env 파일의 MONGODB_URI 변수를 사용
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};

module.exports = connectDB;