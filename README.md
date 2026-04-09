# 베이비네임

오행을 기반으로 쉽고 전문적인 작명 해설을 제공하는 서비스입니다.

---

## 로컬 실행

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정
cp .env.local.example .env.local
# .env.local 열어서 ANTHROPIC_API_KEY 입력

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

---

## GitHub + Vercel 배포

### 1단계: GitHub 올리기

```bash
git init
git add .
git commit -m "init: 베이비네임 v1"
git branch -M main
git remote add origin https://github.com/본인아이디/babyname.git
git push -u origin main
```

### 2단계: Vercel 배포

1. https://vercel.com 로그인
2. **"Add New Project"** 클릭
3. GitHub 저장소 선택 → **"babyname"** import
4. **"Environment Variables"** 에서 추가:
   - `ANTHROPIC_API_KEY` = `sk-ant-...본인키...`
5. **"Deploy"** 클릭

배포 완료 후 `https://babyname-xxx.vercel.app` 주소 생성됨.

---

## 프로젝트 구조

```
babyname/
├── pages/
│   ├── api/
│   │   └── generate.js   ← Anthropic API 호출 (서버, 키 안전)
│   ├── _app.js
│   └── index.jsx         ← 메인 UI
├── styles/
│   └── globals.css
├── .env.local            ← API 키 (git 제외됨)
├── .env.local.example
├── .gitignore
├── next.config.js
└── package.json
```

---

## API 키 발급

https://console.anthropic.com → API Keys → Create Key
