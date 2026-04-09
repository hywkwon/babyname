import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const C = {
  bg:      "#F5EFE6",
  card:    "#FFFDF8",
  deep:    "#5C2D2D",
  primary: "#8B3A3A",
  priL:    "#FDF0EF",
  gold:    "#C9973A",
  goldL:   "#FEF6E4",
  text:    "#4A3728",
  muted:   "#7A5C4A",
  hint:    "#A68B7A",
  border:  "#DDD0C2",
  borderL: "#EDE4D8",
};

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: C.card, borderRadius: 12, padding: "1.25rem", border: `1px solid ${C.border}`, textAlign: "center" }}>
      <div style={{ fontSize: 11, color: C.hint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 900, color: color || C.deep, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "0 4px" }}>
      {data.map((d, i) => {
        const h = Math.max((d.count / max) * 100, d.count > 0 ? 4 : 0);
        const isToday = i === data.length - 1;
        return (
          <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, color: C.hint, fontWeight: 600 }}>{d.count || ""}</div>
            <div style={{ width: "100%", height: h + "%", minHeight: d.count > 0 ? 4 : 0, background: isToday ? C.primary : C.goldL, borderRadius: "3px 3px 0 0", border: isToday ? "none" : `1px solid ${C.goldM || "#F0D9A0"}`, transition: "height .3s" }} />
            <div style={{ fontSize: 9, color: isToday ? C.primary : C.hint, fontWeight: isToday ? 700 : 400 }}>
              {d.date.slice(5).replace("-", "/")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => { setError("통계를 불러오지 못했습니다."); setLoading(false); });
  }, []);

  const genderTotal = stats ? Object.values(stats.genders || {}).reduce((a, b) => a + parseInt(b || 0), 0) : 0;
  const maleCount = parseInt(stats?.genders?.["남아"] || 0);
  const femaleCount = parseInt(stats?.genders?.["여아"] || 0);
  const actualCount = parseInt(stats?.births?.["실제 출생"] || 0);
  const expectedCount = parseInt(stats?.births?.["출생 예정"] || 0);

  return (
    <>
      <Head>
        <title>베이비네임 — 통계</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Apple SD Gothic Neo', -apple-system, 'Malgun Gothic', sans-serif; background: ${C.bg}; color: ${C.text}; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "13px 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.deep }}>베이비네임 통계</div>
        <Link href="/" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}>← 서비스로</Link>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

        {loading && (
          <div style={{ textAlign: "center", padding: "4rem", color: C.hint }}>불러오는 중...</div>
        )}

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "1rem", color: "#991B1B", fontSize: 14 }}>
            {error}<br/>
            <span style={{ fontSize: 12, marginTop: 4, display: "block" }}>UPSTASH_REDIS 환경변수가 설정되어 있는지 확인해주세요.</span>
          </div>
        )}

        {stats && (
          <>
            {/* 핵심 지표 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <StatCard label="누적 리포트" value={stats.total.toLocaleString()} sub="총 생성 수" color={C.deep} />
              <StatCard label="오늘" value={stats.today.toLocaleString()} sub={new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric" })} color={C.primary} />
            </div>

            {/* 7일 그래프 */}
            <div style={{ background: C.card, borderRadius: 12, padding: "1.25rem", border: `1px solid ${C.border}`, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.hint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>최근 7일 리포트 생성</div>
              <BarChart data={stats.daily} />
            </div>

            {/* 성별 분포 */}
            <div style={{ background: C.card, borderRadius: 12, padding: "1.25rem", border: `1px solid ${C.border}`, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.hint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>성별 분포</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "남아", count: maleCount, color: "#4A7AB5" },
                  { label: "여아", count: femaleCount, color: "#C9607A" },
                ].map(item => {
                  const pct = genderTotal > 0 ? Math.round((item.count / genderTotal) * 100) : 0;
                  return (
                    <div key={item.label} style={{ flex: 1, background: C.bg, borderRadius: 8, padding: "0.875rem", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.count}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: item.color, marginTop: 2, fontWeight: 600 }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
              {genderTotal > 0 && (
                <div style={{ marginTop: 12, height: 6, borderRadius: 999, background: C.borderL, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${genderTotal > 0 ? Math.round((maleCount / genderTotal) * 100) : 50}%`, background: "#4A7AB5", borderRadius: 999 }} />
                </div>
              )}
            </div>

            {/* 출생 구분 */}
            <div style={{ background: C.card, borderRadius: 12, padding: "1.25rem", border: `1px solid ${C.border}`, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.hint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>출생 구분</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "실제 출생", count: actualCount, color: C.deep },
                  { label: "출생 예정", count: expectedCount, color: C.gold },
                ].map(item => (
                  <div key={item.label} style={{ flex: 1, background: C.bg, borderRadius: 8, padding: "0.875rem", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.count}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 업데이트 시간 */}
            <div style={{ textAlign: "center", fontSize: 11, color: C.hint, marginTop: 8 }}>
              {new Date().toLocaleString("ko-KR")} 기준
            </div>
          </>
        )}
      </div>
    </>
  );
}
