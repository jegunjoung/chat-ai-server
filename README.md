# 우리마을사진관 AI 상담 서버

이 프로젝트는 OpenAI GPT-4o를 활용하여 사진과 질문을 기반으로 실제 AI가 상담 응답을 제공하는 Node.js 서버입니다.

---

## 🛠️ 구성 파일

| 파일명 | 설명 |
|--------|------|
| `server.js` | Node.js 기반 AI 응답 서버 코드 (`.env`에서 API 키를 불러옴) |
| `.env` | **OpenAI API 키를 안전하게 보관**하는 파일 (절대 공개 X) |
| `.gitignore` | `.env` 파일을 GitHub에 업로드하지 않도록 차단 |

---

## ⚙️ 실행 방법

### 1. Node.js 설치
[https://nodejs.org](https://nodejs.org) 에서 설치하세요.

### 2. 프로젝트 폴더로 이동 후 의존성 설치
```bash
npm install express body-parser cors dotenv openai
```

### 3. `.env` 파일에 OpenAI API 키 입력
`.env` 파일을 열고 다음처럼 수정하세요:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 서버 실행
```bash
node server.js
```

---

## 📡 API 사용 방법 (프론트엔드에서 호출 예시)

`POST /ask-gpt`

### 요청 형식 (JSON)
```json
{
  "image": "Base64 인코딩된 이미지 문자열",
  "question": "사진에 대한 고객의 질문"
}
```

### 응답 형식
```json
{
  "answer": "GPT가 생성한 답변 텍스트"
}
```

---

## 🔐 보안 주의사항

- `server.js`에 직접 API 키를 **절대 하드코딩하지 마세요**
- `.env` 파일은 GitHub에 업로드되지 않도록 `.gitignore`에 포함되어야 합니다
- 키가 실수로 노출되었다면 **OpenAI에서 즉시 키를 폐기하고 재발급하세요**

---

## 📬 문의
우리마을사진관 운영자 또는 [OpenAI Docs](https://platform.openai.com/docs) 참조
