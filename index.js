const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // 또는 "gpt-4" (유료 사용자일 경우)
        messages: [
          { role: "system", content: "너는 친절한 상담사야." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    console.log("?? OpenAI 응답:", JSON.stringify(data, null, 2)); // ?? 로그로 출력

    res.send(data);
  } catch (error) {
    console.error("?? OpenAI 요청 중 에러 발생:", error);
    res.status(500).send({ error: "OpenAI 요청 실패" });
  }
});

app.listen(port, () => {
  console.log(`?? 서버 실행 중: http://localhost:${port}`);
});
