// 3. Express 서버 진입점 (메인)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 라우트 임포트
const userAuthRoutes = require('./routes/userAuth');
const artworkRoutes = require('./routes/artworks');
const adminRoutes = require('./routes/admin');

// .env 로드 및 DB 연결
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Body parser

// API 라우트
app.use('/api/auth', userAuthRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/admin', adminRoutes);

// 404 및 오류 처리
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));