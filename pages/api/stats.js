const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd, ...args) {
  const encoded = args.map(a => encodeURIComponent(a));
  const res = await fetch(`${UPSTASH_URL}/${[cmd, ...encoded].join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(200).json({ total:0, today:0, genders:{}, births:{}, daily:[] });
  }

  const today = new Date().toISOString().slice(0, 10);

  const [total, todayCount, genderRaw, birthRaw] = await Promise.all([
    redis("get", "stats:total"),
    redis("get", `stats:daily:${today}`),
    redis("hgetall", "stats:gender"),
    redis("hgetall", "stats:birthType"),
  ]);

  // 최근 7일 일별 통계
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = await redis("get", `stats:daily:${key}`);
    days.push({ date: key, count: parseInt(count || "0") });
  }

  // hgetall returns flat array [key, value, key, value, ...]
  const toObj = (arr) => {
    if (!arr || !Array.isArray(arr)) return {};
    const obj = {};
    for (let i = 0; i < arr.length; i += 2) {
      obj[arr[i]] = arr[i + 1];
    }
    return obj;
  };

  res.status(200).json({
    total: parseInt(total || "0"),
    today: parseInt(todayCount || "0"),
    genders: toObj(genderRaw),
    births: toObj(birthRaw),
    daily: days,
  });
}
