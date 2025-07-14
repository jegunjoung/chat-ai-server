
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sharp = require('sharp');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const upload = multer({ storage: multer.memoryStorage() });

app.post('/ask-gpt', upload.single('image'), async (req, res) => {
  try {
    const { question } = req.body;
    let imageInfo = '';

    if (req.file) {
      const resizedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();

      const base64Image = resizedBuffer.toString('base64');
      imageInfo = `고객이 업로드한 사진이 포함되어 있습니다. 아래 base64로 전달됩니다:\n\n${base64Image.substring(0, 500)}... (생략)`;
    }

    const fullPrompt = `다음은 고객 질문입니다:\n"${question}"\n\n${imageInfo}\n\n이 질문에 대해 친절하게 답변해주세요.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '너는 사진 보정 전문가야. 사진 분석과 보정 가능성에 대해 설명해줘.' },
        { role: 'user', content: fullPrompt },
      ],
    });

    const gptAnswer = completion.data.choices[0].message.content;
    res.json({ answer: gptAnswer });

  } catch (err) {
    console.error('GPT 처리 중 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

app.listen(port, () => {
  console.log(`✅ 서버가 실행 중입니다: http://localhost:${port}`);
});
