require('dotenv').config(); // dotenv를 사용하여 .env 파일에서 환경 변수 불러오기

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // .env 파일에서 포트 번호 불러오기

const corsOptions = {
  origin: '*', // 모든 출처 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 미들웨어 설정
// app.use(cors());
app.use(cors(corsOptions));

app.use(bodyParser.json());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST, // .env 파일에서 호스트 불러오기
    user: process.env.DB_USER, // .env 파일에서 사용자 이름 불러오기
    password: process.env.DB_PASSWORD, // .env 파일에서 비밀번호 불러오기
    database: process.env.DB_NAME // .env 파일에서 데이터베이스 이름 불러오기
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// 타임어택 결과 저장 API 엔드포인트
app.post('/api/save-time', (req, res) => {
  const { playerName, time } = req.body;

  const query = 'INSERT INTO T_time_attack_results (player_name, time) VALUES (?, ?)';
  db.query(query, [playerName, time], (err, result) => {
    if (err) {
      console.error('Error saving data to database:', err);
      res.status(500).json({ error: 'Failed to save data' });
      return;
    }

    res.json({ message: 'Record saved successfully!', id: result.insertId });
  });
});

// 타임어택 결과 조회 API 엔드포인트
app.get('/api/get-times', (req, res) => {
  const query = 'SELECT player_name, time, timestamp FROM T_time_attack_results ORDER BY time';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }
    console.log(results);
    res.json(results);
  });
});

app.get('/test', (req, res) => {
  console.log("test");

});

// 서버 시작
app.listen(port,'0.0.0.0', () => {
  console.log(`Server running on ${port}`);
});
