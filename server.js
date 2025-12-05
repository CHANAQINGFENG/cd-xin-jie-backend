const express = require('express');
const cors = require('cors');
const path = require('path');
const ai = require('./ai'); // 引入 AI 逻辑
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 允许跨域 (小程序调试必备)
app.use(cors());
app.use(express.json());

// 托管静态网页 (用于 Web 版体验)
app.use(express.static(path.join(__dirname, 'public')));

// 健康检查接口
app.get('/api/health', (req, res) => res.send('Cyber Temple is Running...'));

// 核心解惑接口
app.post('/api/solve', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: '请填写烦恼' });
    
    // 调用 AI 生成卡片
    const card = await ai.generateWisdomCard(text);
    res.json({ card });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: '服务器正在冥想，请稍后再试' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
