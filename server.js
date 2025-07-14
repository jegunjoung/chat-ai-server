const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB 제한

require('dotenv').config();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());

app.post('/ask-gpt', upload.single('image'), async (req, res) => {
  try {
    const question = req.body.question || '';
    const image = req.file;

    const messages = [
      { role: 'system', content: '당신은 사진 전문가입니다.' },
      { role: 'user', content: question }
    ];

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    });

    res.json({ answer: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(10000, () => {
  console.log('서버가 10000번 포트에서 실행 중입니다.');
});
