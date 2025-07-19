const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const userMsg = req.body.message;
  const gptRes = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: userMsg}],
  });
  res.json({ reply: gptRes.data.choices[0].message.content });
});

app.post('/send-kakao', upload.single('photo'), (req, res) => {
  const { name, contact } = req.body;
  const photoPath = req.file.path;
  console.log("받은 정보:", name, contact, photoPath);
  res.send("카카오톡 전송 완료 (모의)");
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
