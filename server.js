
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const OpenAI = require('openai');

require('dotenv').config();

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/ask-gpt', upload.single('image'), async (req, res) => {
  try {
    const question = req.body.question || '';
    let imageBase64 = null;

    if (req.file) {
      const resizedImage = await sharp(req.file.buffer)
        .resize({ width: 1024, height: 1024, fit: 'inside' })
        .toBuffer();
      imageBase64 = resizedImage.toString('base64');
    }

    const messages = [
      { role: 'system', content: '당신은 친절한 사진 보정 상담 전문가입니다.' },
      { role: 'user', content: question }
    ];

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: {
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
        }
      });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: messages,
      max_tokens: 500
    });

    const answer = chatCompletion.choices[0]?.message?.content || 'AI 응답 없음';
    res.json({ answer });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: '서버 에러 발생' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행중: http://localhost:${PORT}`);
});
