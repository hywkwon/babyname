const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd, ...args) {
  const res = await fetch(`${UPSTASH_URL}/${[cmd, ...args].join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const [total, today, genders, births] = await Promise.all([
      redis("get", "stats:total"),
      redis("get", `stats:daily:${new Date().toISOString().slice(0, 10)}`),
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

    res.status(200).json({
      total: parseInt(total || "0"),
      today: parseInt(today || "0"),
      genders: genders || {},
      births: births || {},
      daily: days,
    });
  } else {
    res.status(405).end();
  }
}
