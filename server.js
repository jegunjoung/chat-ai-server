
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask-gpt', async (req, res) => {
  const { image, question } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '당신은 사진 보정 전문 AI 상담가입니다.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } }
          ]
        }
      ],
      temperature: 0.7,
    });

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error('GPT 응답 오류:', error.message);
    res.status(500).send('GPT 응답 실패');
  }
});

app.post('/send-kakao', async (req, res) => {
  const { name, phone, question, image } = req.body;

  try {
    // 카카오톡 채널 메시지용 예시 텍스트 전송
    const text = `📷 우리마을사진관 상담 접수

👤 이름: ${name}
📱 연락처: ${phone}
💬 질문: ${question}`;

    // 실제 카카오톡 메시지 전송은 비공개 API or Webhook 연동 필요
    console.log('카카오로 보낼 내용:', text);
    // 이미지도 함께 보내려면 webhook 또는 비즈니스 API 필요

    res.send('카카오채널로 전송 완료');
  } catch (err) {
    console.error('카카오 전송 실패:', err.message);
    res.status(500).send('카카오 전송 실패');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ AI 상담 서버 작동 중: http://localhost:${PORT}`);
});
