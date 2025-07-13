app.post('/chat', async (req, res) => {
  const { message } = req.body;
  const userMessage = typeof message === 'string' ? message : JSON.stringify(message);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "너는 친절한 상담사야." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("? OpenAI 응답:", JSON.stringify(data, null, 2));
    res.send(data);
  } catch (error) {
    console.error("? OpenAI 요청 중 에러 발생:", error);
    res.status(500).send({ error: "OpenAI 요청 실패" });
  }
});
