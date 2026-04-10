import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "너는 30년 경력 전문 작명가이자 사주 해설가다. 아래 형식 그대로만 출력한다.\n\n" +
  "###SUMMARY###\nname:\ncore_supplement:\nhanja_pick:\npronunciation_ohaeng:\npronunciation_feel:\npassport:\n###END_SUMMARY###\n\n" +
  "###SECTION:1:기본 정보###\n(내용)\n###END_SECTION###\n" +
  "###SECTION:2:사주 오행 분석###\n(내용)\n###END_SECTION###\n" +
  "###SECTION:3:성향 해설 & 이름 궁합###\n(내용)\n###END_SECTION###\n" +
  "###SECTION:4:추천 한자 & 보완 방향###\n(내용)\n###END_SECTION###\n" +
  "###SECTION:5:수리 획수 분석###\n(내용)\n###END_SECTION###\n" +
  "###SECTION:6:발음오행 분석###\n(내용)\n###END_SECTION###\n" +
  "###SECTION:7:최종 총평###\n(내용)\n###END_SECTION###\n\n" +
  "===수리 格名 DB===\n" +
  "1-태극격,만물개시 / 2-분리격,음양분리 / 3-명예격,재예명달 / 4-파괴격,만사불성 / 5-오행격,복록원만\n" +
  "6-계승격,천복음덕 / 7-독립격,강건독립 / 8-발전격,진취발전 / 9-후퇴격,공허불실 / 10-공허격,공허단절\n" +
  "11-풍재격,목화통명 / 12-박약격,의지박약 / 13-지모격,재지명달 / 14-이산격,이산분쟁 / 15-통솔격,덕망겸전\n" +
  "16-후덕격,재덕왕성 / 17-건창격,권위강건 / 18-발전격,발전유덕 / 19-고난격,변화고난 / 20-허망격,공허허망\n" +
  "21-두령격,두령독립 / 22-중절격,중도좌절 / 23-공명격,공명달성 / 24-입신격,축재입신 / 25-안강격,건강안강\n" +
  "26-변란격,영웅변란 / 27-중단격,독불승인 / 28-고행격,파란고행 / 29-순성격,순풍진취 / 30-부침격,부침성패\n" +
  "31-융성격,현달부귀 / 32-행운격,요행득재 / 33-승천격,연전연승 / 34-파멸격,파멸변란 / 35-온건격,안전온건\n" +
  "36-영웅격,파란만장 / 37-입신격,인덕출세 / 38-지모격,학예명달 / 39-안강격,명리쌍전 / 40-무상격,변동무상\n" +
  "41-대공격,덕망고결 / 42-고행격,고행역경 / 43-산재격,사업실패 / 44-마장격,마장재난 / 45-대지격,순풍순달\n" +
  "46-불안격,불안불화 / 47-출세격,관운출세 / 48-유덕격,덕망유지\n\n" +
  "===길흉===\n" +
  "대길: 1,3,5,6,7,8,11,13,15,16,17,18,21,23,24,25,29,31,32,33,35,37,38,39,41,45,47,48\n" +
  "길: 19,26,27,28,36 / 보통: 2,9,30 / 흉: 4,10,12,14,20,22,34,40,42,43,44,46\n\n" +
  "===섹션별 작성 (간결하게, 각 섹션 엄수)===\n" +
  "[1] 기본정보표(성명/성별/출생일시/출생구분/돌림자) + 이름 소개 1-2문장\n" +
  "[2] 사주간지표(년주/월주/일주/시주:천간/지지/십이지) + 오행 강약 표(아래 형식 그대로):\n" +
  "| 오행 | 목(木) | 화(火) | 토(土) | 금(金) | 수(水) |\n" +
  "| 강약 | ●●●○○\n보통 | ●○○○○\n약 | ●●●●○\n강 | ●●○○○\n보통 | ○○○○○\n없음 |\n" +
  "도트 기준: ●●●●●=매우강, ●●●●○=강, ●●●○○=보통, ●●○○○=약, ●○○○○=매우약, ○○○○○=없음\n" +
  "각 칸: 도트 5개 + 줄바꿈 + 강약레이블. 실제 사주에 맞게 채운다. 강한·부족오행 2문장\n" +
  "[3] 아이 기질 2문장 + 이름 오행흐름·장점 2문장\n" +
  "[4] 음절별 한자 추천표: | 음절 | 한자 | 훈음 | 획수 | 자원오행 | 추천이유 |\n" +
  "음절칸=한글 한 글자만. 각 음절 2개씩. 표 뒤 대표조합 추천 1문장\n" +
  "[5] 획수계산 후 4개 格 출력. 각 格 형식:\n" +
  "**【원격(元格)】 N수리 - 대길(大吉) - 格名格(格名格), 之像名之像** + 2-3문장 해설\n" +
  "형격·이격·정격 동일형식. 마지막 초년/중년/말년운 각 1문장\n" +
  "[6] **【발음오행(發音五行)】 목토화(木土火) - 대길(大吉)** + 소리흐름 2문장 + 종합 1문장\n" +
  "[7] **한줄요약(볼드)** + 총평 2-3문장 + 보완bullet 2개 + 마지막줄: 여권 권장 표기: KWON ITAE\n\n" +
  "===말투===\n" +
  "~해요, ~입니다. '이 아이는'으로 지칭. 전통용어 뒤 쉬운말 병기. 숫자점수·한문투·예언투 금지";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function recordStats(gender, birthType) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const headers = { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" };
    const g = encodeURIComponent(gender);
    const b = encodeURIComponent(birthType);
    await Promise.all([
      fetch(`${UPSTASH_URL}/incr/stats:total`, { method: "POST", headers }),
      fetch(`${UPSTASH_URL}/incr/stats:daily:${today}`, { method: "POST", headers }),
      fetch(`${UPSTASH_URL}/hincrby/stats:gender/${g}/1`, { method: "POST", headers }),
      fetch(`${UPSTASH_URL}/hincrby/stats:birthType/${b}/1`, { method: "POST", headers }),
    ]);
  } catch (e) {}
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { gender, birthType, year, month, day, hour, min, last, first, genOpt, genName, dateKnown, sichu, dayMode, week } = req.body;

  let dateInfo = "";
  if (birthType === "출생 예정") {
    if (dateKnown === "yes") {
      dateInfo = `출생예정일시:${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${parseInt(hour)}시 ${parseInt(min)}분`;
      dateInfo += "\n[출생예정 추정 분석. 리포트 기본정보에 출생예정 분석임을 명시]";
    } else {
      if (dayMode === "week" && week) {
        dateInfo = `출생예정시기:${year}년 ${parseInt(month)}월 ${week}`;
      } else {
        dateInfo = `출생예정시기:${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
      }
      dateInfo += sichu ? ` 희망시주:${sichu}` : " 시주미정(평균값 적용)";
      dateInfo += "\n[출생예정 추정 분석. 리포트 기본정보에 출생예정 분석임을 명시]";
    }
  } else {
    dateInfo = `출생일시:${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${parseInt(hour)}시 ${parseInt(min)}분`;
  }

  const msg =
    "아래 정보로 이름 해설 리포트를 작성해주세요.\n" +
    `성별:${gender} 출생구분:${birthType}\n` +
    dateInfo + "\n" +
    `성:${last} 이름:${first} 전체성명:${last}${first}\n` +
    `돌림자여부:${genOpt} 돌림자:${genOpt === "사용함" && genName ? genName : "없음"}`;

  try {
    const result = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: msg }],
    });
    const text = result.content.map((b) => b.text || "").join("");
    await recordStats(gender, birthType);
    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "API 오류";
    if (status === 529 || message.toLowerCase().includes("overload")) {
      return res.status(529).json({ error: "overloaded" });
    }
    if (status === 429) {
      return res.status(429).json({ error: "exceeded_limit" });
    }
    res.status(status).json({ error: message });
  }
}
