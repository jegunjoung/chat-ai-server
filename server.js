
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const upload = multer({ storage: multer.memoryStorage() });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask-gpt', upload.single('image'), async (req, res) => {
  const { question } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;
  const base64Image = imageBuffer ? imageBuffer.toString('base64') : null;

  try {
    const messages = [
      {
        role: 'system',
        content: '당신은 사진 보정 전문가입니다. 사용자 질문과 이미지를 보고 자연스러운 답변을 해주세요.',
      },
    ];

    const userContent = [];

    if (question) userContent.push({ type: 'text', text: question });
    if (base64Image) userContent.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } });

    messages.push({
      role: 'user',
      content: userContent,
    });

    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages,
    });

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error('GPT 요청 오류:', err.message);
    res.status(500).json({ answer: 'AI 분석에 실패했습니다. 다시 시도해주세요.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 우리마을사진관 AI 서버 작동 중: http://localhost:${PORT}`);
});
