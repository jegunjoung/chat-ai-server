const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

// 메인 테스트용 라우터 (선택)
app.get("/", (req, res) => {
  res.send("AI 서버가 실행 중입니다.");
});

// 실제 메시지 처리 라우터
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "당신은 우리마을사진관의 AI 상담사입니다. 친절하고 정확하게 도와주세요." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ OpenAI 요청 실패:", error);
    res.status(500).json({ error: "AI 응답을 가져오지 못했어요." });
  }
});

app.listen(port, () => {
  console.log(`✅ 서버가 포트 ${port}에서 실행 중입니다.`);
});
