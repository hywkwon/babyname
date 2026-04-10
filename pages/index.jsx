import { useState, useEffect } from "react";
import Head from "next/head";

const C = {
  bg:"#F5EFE6", card:"#FFFDF8", deep:"#5C2D2D", primary:"#8B3A3A",
  priL:"#FDF0EF", priM:"#E8C4C4", gold:"#C9973A", goldL:"#FEF6E4",
  jade:"#2E7D6A", jadeL:"#EAF5F2",
  ink:"#3D2B1F", text:"#4A3728", muted:"#7A5C4A", hint:"#A68B7A",
  border:"#DDD0C2", borderL:"#EDE4D8",
  green: {bg:"#EAF5F2",border:"#A8D5CC",text:"#1D6B5A"},
  amber: {bg:"#FEF6E4",border:"#F0D9A0",text:"#7A5200"},
  red:   {bg:"#FDF0EF",border:"#E8C4C4",text:"#7A2020"},
  blue:  {bg:"#EEF3FB",border:"#C4D5F0",text:"#2A4A8B"},
  slate: {bg:"#F5EFE6",border:"#DDD0C2",text:"#5C3D28"},
};

const LOAD_MSGS = [
  "사주 오행을 분석하는 중",
  "수리 획수를 계산하는 중",
  "성향을 해석하는 중",
  "추천 한자를 탐색하는 중",
  "이름과 궁합을 확인하는 중",
  "보완 방향을 제안하는 중",
  "리포트를 생성하는 중",
];

const IC = {
  Info:     ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M8 7v4M8 5.5v.5"/></svg>,
  Compass:  ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M10.2 5.8l-1.8 3.6-3.6 1.8 1.8-3.6 3.6-1.8z"/></svg>,
  Leaf:     ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 3C13 3 8 3 5 6c-2 2-2 5-2 7 2 0 5 0 7-2 3-3 3-8 3-8z"/><path d="M3 13l4-4"/></svg>,
  Star:     ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2l1.8 3.6 4 .6-2.9 2.8.7 4L8 11l-3.6 2 .7-4-2.9-2.8 4-.6z"/></svg>,
  Tool:     ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 2a3 3 0 00-3 3.5L2.5 10.5a1.5 1.5 0 002 2L9.5 7.5A3 3 0 0013.5 4"/></svg>,
  Hanja:    ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3h10M8 3v10M3 8h10M3 13h10"/></svg>,
  Grid:     ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1.5" y="9" width="3" height="5.5" rx="1"/><rect x="6.5" y="5.5" width="3" height="9" rx="1"/><rect x="11.5" y="2" width="3" height="12.5" rx="1"/></svg>,
  Sound:    ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 6H5l3-2.5v9L5 9H2.5a.5.5 0 01-.5-.5v-3A.5.5 0 012.5 6z"/><path d="M9.5 4a3.5 3.5 0 010 6"/></svg>,
  Wave:     ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 8c1-2 2-2 3 0s2 2 3 0 2-2 3 0 2 2 3 0"/></svg>,
  Passport: ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2.5" y="1.5" width="11" height="13" rx="1.5"/><circle cx="8" cy="7" r="2"/><path d="M5 11.5h6M5 13h4"/></svg>,
  Trophy:   ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 14.5h5M8 12v2.5M3.5 2h9v5a4.5 4.5 0 01-9 0V2z"/><path d="M3.5 4.5H2a1.5 1.5 0 001.5 1.5M12.5 4.5H14a1.5 1.5 0 01-1.5 1.5"/></svg>,
  Back:     ()=><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>,
  Check:    ()=><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 5l2.5 2.5 4.5-5"/></svg>,
  Sparkle:  ()=><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2v12M2 8h12M4 4l8 8M12 4l-8 8"/></svg>,
};

const SEC_META = [
  {id:1, Ic:IC.Info,    hi:false},
  {id:2, Ic:IC.Compass, hi:false},
  {id:3, Ic:IC.Leaf,    hi:false},
  {id:4, Ic:IC.Hanja,   hi:false},
  {id:5, Ic:IC.Grid,    hi:false},
  {id:6, Ic:IC.Wave,    hi:true },
  {id:7, Ic:IC.Trophy,  hi:false},
];

function parseReport(text) {
  const summary = {};
  const m = text.match(/###SUMMARY###([\s\S]*?)###END_SUMMARY###/);
  if (m) {
    m[1].trim().split("\n").forEach(line => {
      const i = line.indexOf(": ");
      if (i > -1) summary[line.slice(0, i).trim()] = line.slice(i + 2).trim();
    });
  }
  const sections = [];
  const re = /###SECTION:(\d+):([^#]+)###([\s\S]*?)###END_SECTION###/g;
  let mt;
  while ((mt = re.exec(text)) !== null) {
    sections.push({ id: parseInt(mt[1]), title: mt[2].trim(), content: mt[3].trim() });
  }
  return { summary, sections };
}

function ri(t) {
  return t
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#3D2B1F;font-weight:700">$1</strong>')
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code style="background:#FEF6E4;color:#C9973A;padding:1px 6px;border-radius:4px;font-size:12px;font-weight:600">$1</code>')
    .replace(/●/g, '<span style="color:#8B3A3A;font-size:14px">●</span>')
    .replace(/○/g, '<span style="color:#DDD0C2;font-size:14px">○</span>');
}

function MdContent({ md }) {
  if (!md) return null;
  const lines = md.split("\n");
  const nodes = [];
  let i = 0, listItems = [], tblH = [], tblR = [], inTbl = false, pCount = 0;

  function flushList() {
    if (!listItems.length) return;
    nodes.push(
      <ul key={"ul" + i} style={{ paddingLeft:0, margin:"10px 0 14px", listStyle:"none" }}>
        {listItems.map((li, j) => (
          <li key={j} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:15, color:C.text, lineHeight:1.8, marginBottom:6 }}>
            <span style={{ flexShrink:0, width:6, height:6, borderRadius:"50%", background:C.primary, marginTop:8 }} />
            <span dangerouslySetInnerHTML={{ __html: ri(li) }} />
          </li>
        ))}
      </ul>
    );
    listItems = [];
  }

  function flushTbl() {
    if (!tblH.length) return;
    nodes.push(
      <div key={"tbl" + i} style={{ overflowX:"auto", WebkitOverflowScrolling:"touch", margin:"12px 0 16px", borderRadius:8, border:"1px solid " + C.border }}>
        <table style={{ width:"100%", minWidth:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr>{tblH.map((h, j) => <th key={j} style={{ background:C.deep, color:"white", padding:"7px 6px", textAlign:"center", fontWeight:600, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {tblR.map((row, ri2) => (
              <tr key={ri2}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding:"9px 12px", borderBottom:"1px solid " + C.borderL, color:C.text, lineHeight:1.5, background:ri2%2===1?C.bg:C.card, fontSize:12, verticalAlign:"middle", textAlign:"center", padding:"7px 5px", wordBreak:"keep-all" }}
                    dangerouslySetInnerHTML={{ __html: ri(cell) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tblH = []; tblR = []; inTbl = false;
  }

  while (i < lines.length) {
    const ln = lines[i], tr = ln.trim();
    if (!tr) { flushList(); flushTbl(); i++; continue; }

    if (tr.startsWith("### ")) {
      flushList(); flushTbl();
      nodes.push(<div key={i} style={{ fontSize:11, fontWeight:700, color:C.primary, textTransform:"uppercase", letterSpacing:"0.1em", margin:"18px 0 8px" }}>{tr.slice(4)}</div>);
      i++; continue;
    }
    if (tr.startsWith("|") && i+1 < lines.length && /^\|[\s\-:|]+\|?$/.test(lines[i+1].trim())) {
      flushList(); flushTbl();
      tblH = tr.split("|").filter(c=>c.trim()).map(c=>c.trim());
      inTbl = true; i += 2; continue;
    }
    if (inTbl && tr.startsWith("|")) { tblR.push(tr.split("|").filter(c=>c.trim()).map(c=>c.trim())); i++; continue; }
    if (inTbl) flushTbl();
    if (tr.startsWith("- ") || tr.startsWith("* ")) { listItems.push(tr.slice(2)); i++; continue; }
    flushList();
    if (tr === "---" || tr === "—" || tr === "***" || tr === "___") { i++; continue; }

    // Detect 格 header: **【원격(元格)】 N수리 - 대길(大吉) ...** pattern
    const kakkoMatch = tr.match(/^\*\*【(.+?)】\s*(\d+)수리\s*[-–]\s*(대길|길|보통|흉)[\s\S]*?\*\*/);
    if (kakkoMatch) {
      flushList(); flushTbl();
      const geomName = kakkoMatch[1];
      const suriNum  = kakkoMatch[2];
      const judgment = kakkoMatch[3];
      const judgColor = judgment==="대길"?{bg:"#EAF5F2",border:"#6BCB8B",text:"#0F5E2D",dot:"#22c55e"}
                       :judgment==="길"  ?{bg:"#EEF3FB",border:"#93B8EE",text:"#1A3F82",dot:"#3b82f6"}
                       :judgment==="보통"?{bg:"#FEF9EE",border:"#E8D27A",text:"#7A5A00",dot:"#f59e0b"}
                                         :{bg:"#FEF2F2",border:"#F0A0A0",text:"#7A1010",dot:"#ef4444"};
      const restOfLine = tr.replace(/^\*\*【(.+?)】\s*\d+수리\s*[-–]\s*(대길|길|보통|흉)/, '').replace(/^\s*[-–]\s*/, '').replace(/\*\*$/, '').trim();
      nodes.push(
        <div key={i} style={{ background:judgColor.bg, border:"1.5px solid "+judgColor.border, borderRadius:10, padding:"12px 14px", margin:"16px 0 8px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
            <span style={{ fontSize:13, fontWeight:800, color:judgColor.text }}>【{geomName}】</span>
            <span style={{ fontSize:12, color:judgColor.text, opacity:0.75 }}>{suriNum}수리</span>
            <span style={{ fontSize:13, color:judgColor.text, opacity:0.85 }}>{restOfLine}</span>
          </div>
          <span style={{ flexShrink:0, padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:800, background:judgColor.dot, color:"white", letterSpacing:"0.05em" }}>{judgment}</span>
        </div>
      );
      pCount++;
      i++; continue;
    }

    const isLead = pCount === 0;
    pCount++;
    nodes.push(
      <p key={i} style={{ fontSize:isLead?16:15, color:isLead?C.ink:C.text, lineHeight:isLead?1.9:1.85, marginBottom:10, fontWeight:isLead?500:400, borderLeft:isLead?"3px solid "+C.primary:"none", paddingLeft:isLead?14:0 }}
        dangerouslySetInnerHTML={{ __html: ri(tr) }} />
    );
    i++;
  }
  flushList(); flushTbl();
  return <>{nodes}</>;
}

function Orb({ size, interactive }) {
  const s = size || 120;
  const [pos, setPos] = useState({x:35,y:35});
  const ref = useState(null);

  const handleMove = interactive ? (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPos({x,y});
  } : null;

  return (
    <div
      onMouseMove={interactive ? handleMove : undefined}
      style={{ width:s, height:s, borderRadius:"50%", margin:"0 auto", cursor:interactive?"crosshair":undefined,
        background:"radial-gradient(circle at "+pos.x+"% "+pos.y+"%, #e8a87c, #c9603a 40%, #8b3a3a 70%, #5c2d2d)",
        filter:"blur(28px)", opacity:0.65, transition:interactive?"background 0.1s":"none" }} />
  );
}

function Card({ children, style, className }) {
  return <div className={className||""} style={{ background:C.card, borderRadius:12, padding:"1rem 0.875rem", border:"1px solid "+C.border, marginBottom:10, ...(style||{}) }}>{children}</div>;
}

function SectionHeader({ Ic, title, hi }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, paddingBottom:12, borderBottom:"1.5px solid "+(hi?C.priM:C.borderL) }}>
      <div style={{ color:hi?C.primary:C.muted }}><Ic /></div>
      <span style={{ fontSize:15, fontWeight:700, color:hi?C.primary:C.ink, flex:1 }}>{title}</span>
      {hi && <span style={{ fontSize:10, fontWeight:700, background:C.primary, color:"white", padding:"3px 8px", borderRadius:4 }}>핵심</span>}
    </div>
  );
}

function GenderBtn({ type, selected, onClick }) {
  return (
    <button onClick={onClick} style={{ flex:1, padding:"14px 8px", borderRadius:10, border:"1.5px solid "+(selected?C.primary:C.border), background:selected?C.priL:C.card, color:selected?C.primary:C.muted, fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer", transition:"all .2s", position:"relative" }}>
      {type}
      {selected && <div style={{ position:"absolute", top:5, right:7, width:15, height:15, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}><IC.Check /></div>}
    </button>
  );
}

function TextToggle({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{ flex:1, padding:"13px 8px", borderRadius:10, border:"1.5px solid "+(selected?C.primary:C.border), background:selected?C.priL:C.card, color:selected?C.primary:C.muted, fontSize:14, fontWeight:600, fontFamily:"inherit", cursor:"pointer", transition:"all .2s", position:"relative" }}>
      {label}
      {selected && <div style={{ position:"absolute", top:5, right:7, width:15, height:15, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}><IC.Check /></div>}
    </button>
  );
}



function FieldInput({ label, value, onChange, placeholder, maxLength }) {
  const [focused, setFocused] = useState(false);
  const filled = value.trim().length > 0;
  return (
    <div>
      <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</div>
      <div style={{ position:"relative" }}>
        <input value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{ width:"100%", padding:"12px 36px 12px 13px", border:"1.5px solid "+(focused?C.primary:filled?C.priM:C.border), borderRadius:10, fontSize:17, color:C.ink, background:filled?"#FFFAF8":C.card, outline:"none", fontFamily:"inherit", letterSpacing:1, boxShadow:focused?"0 0 0 3px rgba(139,58,58,.1)":"none", transition:"all .15s" }} />
        {filled && <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:20, height:20, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}><IC.Check /></div>}
      </div>
    </div>
  );
}

function SelectField({ value, onChange, options }) {
  return (
    <div style={{ position:"relative" }}>
      <select value={value} onChange={onChange} style={{ width:"100%", padding:"11px 32px 11px 12px", border:"1.5px solid "+C.border, borderRadius:10, fontSize:14, color:C.text, background:C.card, fontFamily:"inherit", outline:"none", appearance:"none", cursor:"pointer" }}>
        {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%) rotate(0deg)", pointerEvents:"none", display:"flex", alignItems:"center" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5L7 9L11 5" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  const isLimit = msg.includes("exceeded_limit") || msg.includes("rate") || msg.includes("limit");
  const isOverloaded = msg.includes("overloaded");
  const color = isLimit ? C.amber : C.red;
  return (
    <div style={{ background:color.bg, border:"1px solid "+color.border, borderRadius:10, padding:"12px 14px", fontSize:14, color:color.text, marginBottom:12, lineHeight:1.6 }}>
      {isLimit && (<><div style={{ fontWeight:700, marginBottom:3 }}>API 사용 한도 초과</div><div>현재 시간대 요청 한도에 도달했습니다. 약 5시간 후 다시 시도해주세요.</div></>)}
      {isOverloaded && (<><div style={{ fontWeight:700, marginBottom:3 }}>서버가 잠시 혼잡합니다</div><div>요청이 일시적으로 몰리고 있습니다. 잠시 후 다시 시도해주세요. (보통 1-2분 이내)</div></>)}
      {!isLimit && !isOverloaded && <div>{msg}</div>}
    </div>
  );
}

function HBtn({ children, onClick, bg, hbg }) {
  const [h, setH] = useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ flex:1, padding:"14px", borderRadius:10, border:"none", background:h?hbg:bg, color:"white", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"background .15s" }}>{children}</button>;
}
function SecBtn({ children, onClick }) {
  const [h, setH] = useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ padding:"14px 18px", borderRadius:10, border:"1.5px solid "+C.border, background:h?"#F0E8E0":C.card, color:C.muted, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"background .15s" }}>{children}</button>;
}
function NavRow({ children }) { return <div style={{ display:"flex", gap:8, marginTop:6 }}>{children}</div>; }

function HighlightRow({ label, value, color }) {
  const co = color || C.amber;
  return (
    <div style={{ background:co.bg, border:"1px solid "+co.border, borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
      <div style={{ fontSize:10, fontWeight:700, color:co.text, opacity:0.65, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:14, fontWeight:700, color:co.text, lineHeight:1.5 }}>{value}</div>
    </div>
  );
}

function SummaryCard({ s }) {
  if (!s || !s.name) return null;
  return (
    <Card style={{ border:"1.5px solid "+C.priM, background:"#FEF8F5", padding:"1.25rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:16 }}>
        <div style={{ color:C.primary }}><IC.Sparkle /></div>
        <span style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:"0.1em", textTransform:"uppercase" }}>요약 카드</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <HighlightRow label="핵심 보완 요소" value={s.core_supplement}      color={C.red}   />
        <HighlightRow label="추천 한자"      value={s.hanja_pick}           color={C.blue}  />
        <HighlightRow label="발음오행"       value={s.pronunciation_ohaeng} color={C.green} />
        <HighlightRow label="발음 인상"      value={s.pronunciation_feel}   color={C.slate} />
        <div style={{ gridColumn:"1 / span 2" }}>
          <HighlightRow label="권장 영문 표기" value={s.passport} color={C.amber} />
        </div>
      </div>
    </Card>
  );
}

const CSS_STYLES = [
    "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
    "body { font-family: 'Apple SD Gothic Neo', -apple-system, 'Malgun Gothic', sans-serif; background: " + C.bg + "; color: " + C.text + "; -webkit-text-size-adjust: 100%; }",
    "table { border-collapse: collapse; }",
    "* { min-width: 0; }",
    "select, button, input { font-family: inherit; }",
    "@keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }",
    "@keyframes orbFloat { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }",
    "@keyframes pulse { 0%,100% { opacity:.45 } 50% { opacity:1 } }",
    ".fu0{animation:fadeUp .35s ease both}.fu1{animation:fadeUp .35s .07s ease both}",
    "@media print {",
    "  .no-print { display: none !important; }",
    "  .print-only { display: block !important; }",
    "  body { background: white !important; }",
    "  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }",
    "  @page { margin: 15mm 12mm; size: A4; }",
    "}",
    ".fu2{animation:fadeUp .35s .14s ease both}.fu3{animation:fadeUp .35s .21s ease both}.fu4{animation:fadeUp .35s .28s ease both}",
  ].join("\n");

export default function App() {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({ gender:"남아", birthType:"실제 출생", year:"2025", month:"01", day:"01", hour:"09", min:"00", last:"", first:"", genOpt:"미사용", genName:"", dateKnown:"yes", sichu:"", dayMode:"day", week:"" });
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const [valErr, setValErr]   = useState("");
  const [loadIdx, setLoadIdx] = useState(0);

  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS_STYLES;
    document.head.appendChild(el);
    return () => { if (document.head.contains(el)) document.head.removeChild(el); };
  }, []);

  useEffect(()=>{
    if (step !== "loading") return;
    const iv = setInterval(()=>setLoadIdx(i=>(i+1)%LOAD_MSGS.length), 2000);
    return ()=>clearInterval(iv);
  }, [step]);

  const goStep2 = () => {
    if (!form.gender||!form.birthType) { setValErr("성별과 출생 구분을 선택해주세요."); return; }
    setValErr(""); setStep(2);
  };
  const goStep3 = () => {
    if (!form.last.trim())  { setValErr("성을 입력해주세요."); return; }
    if (!form.first.trim()) { setValErr("이름을 입력해주세요."); return; }
    setValErr(""); setStep(3);
  };

  const generate = async () => {
    setStep("loading"); setError(""); setLoadIdx(0);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: form.gender, birthType: form.birthType,
          year: form.year, month: form.month, day: form.day,
          hour: form.hour, min: form.min,
          last: form.last, first: form.first,
          genOpt: form.genOpt, genName: form.genName,
          dateKnown: form.dateKnown, sichu: form.sichu,
          dayMode: form.dayMode, week: form.week,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 529 || String(data.error || "").includes("overload")) { setError("overloaded"); setStep(3); return; }
        throw new Error(data.error || "API 오류");
      }
      const parsed = parseReport(data.text || "");
      if (!parsed.sections.length) throw new Error("리포트 파싱 실패. 다시 시도해주세요.");
      setResult(parsed); setStep("result");
    } catch(e) {
      setError(e.message || "오류가 발생했습니다."); setStep(3);
    }
  };
  const restart = () => {
    setStep(1); setResult(null); setError(""); setValErr("");
    setForm({ gender:"남아", birthType:"실제 출생", year:"2025", month:"01", day:"01", hour:"09", min:"00", last:"", first:"", genOpt:"미사용", genName:"", dateKnown:"yes", sichu:"", dayMode:"day", week:"" });
  };

  const yrs = Array.from({length:11},(_,i)=>({v:String(2020+i),l:(2020+i)+"년"}));
  const mos = Array.from({length:12},(_,i)=>({v:String(i+1).padStart(2,"0"),l:(i+1)+"월"}));
  const dys = Array.from({length:31},(_,i)=>({v:String(i+1).padStart(2,"0"),l:(i+1)+"일"}));
  const hrs = Array.from({length:24},(_,i)=>({v:String(i).padStart(2,"0"),l:i+"시"}));
  const mns = Array.from({length:60},(_,i)=>({v:String(i).padStart(2,"0"),l:i+"분"}));

  const css = CSS_STYLES;

  return (
    <>
      <Head><title>베이비네임</title><meta name="viewport" content="width=device-width,initial-scale=1"/></Head>
      
      {(step===1||step===2||step===3) && (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1.25rem", background:C.bg }}>

          {step===1 && (
            <div className="fu0" style={{ textAlign:"center", width:"100%", maxWidth:420 }}>
              <div id="orb-wrap" onMouseMove={(e)=>{const w=e.currentTarget;const r=w.getBoundingClientRect();const x=Math.round(((e.clientX-r.left)/r.width)*100);const y=Math.round(((e.clientY-r.top)/r.height)*100);const o=w.querySelector(".orb-inner");if(o){o.style.background="radial-gradient(circle at "+x+"% "+y+"%, #e8a87c, #c9603a 40%, #8b3a3a 70%, #5c2d2d)";}}} style={{ animation:"orbFloat 5s ease-in-out infinite", marginBottom:"1.75rem", display:"inline-block" }}><div className="orb-inner" style={{ width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle at 35% 35%, #e8a87c, #c9603a 40%, #8b3a3a 70%, #5c2d2d)", filter:"blur(28px)", opacity:0.7, transition:"background 0.08s" }} /></div>
              <h1 style={{ fontSize:38, fontWeight:800, color:C.deep, marginBottom:10, letterSpacing:"-0.03em", lineHeight:1.1 }}>베이비네임</h1>
              <p style={{ fontSize:15, color:C.muted, marginBottom:36 }}>오행을 기반으로 쉽고 전문적인 작명 해설</p>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>성별</div>
                <div style={{ display:"flex", gap:10 }}>
                  <GenderBtn type="남아" selected={form.gender==="남아"} onClick={()=>upd("gender","남아")} />
                  <GenderBtn type="여아" selected={form.gender==="여아"} onClick={()=>upd("gender","여아")} />
                </div>
              </div>
              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>출생</div>
                <div style={{ display:"flex", gap:10 }}>
                  <TextToggle label="실제 출생" selected={form.birthType==="실제 출생"} onClick={()=>upd("birthType","실제 출생")} />
                  <TextToggle label="출생 예정" selected={form.birthType==="출생 예정"} onClick={()=>upd("birthType","출생 예정")} />
                </div>
              </div>
              <ErrBox msg={valErr} />
              <button onClick={goStep2} style={{ width:"100%", padding:"16px", borderRadius:12, border:"none", background:C.deep, color:"white", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                시작하기
              </button>
            </div>
          )}

          {step===2 && (
            <div className="fu0" style={{ textAlign:"center", width:"100%", maxWidth:420 }}>
              <div style={{ animation:"orbFloat 4s ease-in-out infinite", marginBottom:"1.5rem" }}><Orb size={70} /></div>
              <h2 style={{ fontSize:20, fontWeight:800, color:C.deep, marginBottom:24, letterSpacing:"-0.02em" }}>
                {form.birthType === "출생 예정" ? "출생 예정 정보를 입력해주세요" : "출생일시와 성명을 입력해주세요"}
              </h2>

              {/* 실제 출생 */}
              {form.birthType === "실제 출생" && (
                <div style={{ marginBottom:16, textAlign:"left" }}>
                  <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>출생일시</div>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:8, marginBottom:8 }}>
                    <SelectField value={form.year}  onChange={e=>upd("year", e.target.value)}  options={yrs} />
                    <SelectField value={form.month} onChange={e=>upd("month",e.target.value)} options={mos} />
                    <SelectField value={form.day}   onChange={e=>upd("day",  e.target.value)}   options={dys} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <SelectField value={form.hour} onChange={e=>upd("hour",e.target.value)} options={hrs} />
                    <SelectField value={form.min}  onChange={e=>upd("min", e.target.value)}  options={mns} />
                  </div>
                </div>
              )}

              {/* 출생 예정 */}
              {form.birthType === "출생 예정" && (
                <div style={{ textAlign:"left" }}>
                  {/* 예정일 알고 있는지 */}
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>예정일을 알고 계신가요?</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <TextToggle label="알고 있어요" selected={form.dateKnown==="yes"} onClick={()=>upd("dateKnown","yes")} />
                      <TextToggle label="모르거나 미정이에요" selected={form.dateKnown==="no"} onClick={()=>upd("dateKnown","no")} />
                    </div>
                  </div>

                  {/* 알고 있을 때 - 기존 실제출생과 동일한 년월일+시분 */}
                  {form.dateKnown === "yes" && (
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>출생 예정일시</div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:8, marginBottom:8 }}>
                        <SelectField value={form.year}  onChange={e=>upd("year", e.target.value)}  options={yrs} />
                        <SelectField value={form.month} onChange={e=>upd("month",e.target.value)} options={mos} />
                        <SelectField value={form.day}   onChange={e=>upd("day",  e.target.value)}   options={dys} />
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        <SelectField value={form.hour} onChange={e=>upd("hour",e.target.value)} options={hrs} />
                        <SelectField value={form.min}  onChange={e=>upd("min", e.target.value)}  options={mns} />
                      </div>
                    </div>
                  )}

                  {/* 모를 때 - 년월일 + 시주 선택 */}
                  {form.dateKnown === "no" && (
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>출생 예정 시기</div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:8, marginBottom:10 }}>
                        <SelectField value={form.year}  onChange={e=>upd("year", e.target.value)}  options={yrs} />
                        <SelectField value={form.month} onChange={e=>upd("month",e.target.value)} options={mos} />
                      </div>
                      <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                        <button onClick={()=>upd("dayMode","day")} style={{ flex:1, padding:"8px", borderRadius:8, border:"1.5px solid "+(form.dayMode==="day"?C.primary:C.border), background:form.dayMode==="day"?C.priL:C.card, fontSize:12, fontWeight:600, color:form.dayMode==="day"?C.primary:C.muted, cursor:"pointer", fontFamily:"inherit" }}>날짜 선택</button>
                        <button onClick={()=>upd("dayMode","week")} style={{ flex:1, padding:"8px", borderRadius:8, border:"1.5px solid "+(form.dayMode==="week"?C.primary:C.border), background:form.dayMode==="week"?C.priL:C.card, fontSize:12, fontWeight:600, color:form.dayMode==="week"?C.primary:C.muted, cursor:"pointer", fontFamily:"inherit" }}>주차 선택</button>
                      </div>
                      {form.dayMode === "day" && (
                        <div style={{ marginBottom:16 }}>
                          <SelectField value={form.day} onChange={e=>upd("day",e.target.value)} options={dys} />
                        </div>
                      )}
                      {form.dayMode === "week" && (
                        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
                          {["1주차","2주차","3주차","4주차","5주차"].map(w=>(
                            <button key={w} onClick={()=>upd("week",form.week===w?"":w)}
                              style={{ flex:1, padding:"9px 4px", borderRadius:8, border:"1.5px solid "+(form.week===w?C.primary:C.border), background:form.week===w?C.priL:C.card, fontSize:12, fontWeight:600, color:form.week===w?C.primary:C.muted, cursor:"pointer", fontFamily:"inherit" }}>
                              {w}
                            </button>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>출산 희망 시간대 (선택)</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                        {[
                          {label:"자시(子)", time:"23~01시", v:"자시"},
                          {label:"축시(丑)", time:"01~03시", v:"축시"},
                          {label:"인시(寅)", time:"03~05시", v:"인시"},
                          {label:"묘시(卯)", time:"05~07시", v:"묘시"},
                          {label:"진시(辰)", time:"07~09시", v:"진시"},
                          {label:"사시(巳)", time:"09~11시", v:"사시"},
                          {label:"오시(午)", time:"11~13시", v:"오시"},
                          {label:"미시(未)", time:"13~15시", v:"미시"},
                          {label:"신시(申)", time:"15~17시", v:"신시"},
                          {label:"유시(酉)", time:"17~19시", v:"유시"},
                          {label:"술시(戌)", time:"19~21시", v:"술시"},
                          {label:"해시(亥)", time:"21~23시", v:"해시"},
                        ].map(s => (
                          <button key={s.v} onClick={()=>upd("sichu", form.sichu===s.v ? "" : s.v)}
                            style={{ padding:"8px 6px", borderRadius:8, border:"1.5px solid "+(form.sichu===s.v?C.primary:C.border), background:form.sichu===s.v?C.priL:C.card, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                            <div style={{ fontSize:13, fontWeight:700, color:form.sichu===s.v?C.primary:C.ink }}>{s.label}</div>
                            <div style={{ fontSize:10, color:C.hint, marginTop:2 }}>{s.time}</div>
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>upd("sichu","")} style={{ width:"100%", marginTop:6, padding:"8px", borderRadius:8, border:"1.5px solid "+(form.sichu===""?C.primary:C.border), background:form.sichu===""?C.priL:C.card, fontSize:12, color:form.sichu===""?C.primary:C.muted, cursor:"pointer", fontFamily:"inherit" }}>
                        시간을 아직 모르거나 고려중이에요
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 성명 (공통) */}
              <div style={{ marginBottom:24, textAlign:"left" }}>
                <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.07em" }}>성명</div>
                <div style={{ display:"grid", gridTemplateColumns:"90px 1fr", gap:10 }}>
                  <FieldInput label="성"   value={form.last}  onChange={e=>upd("last", e.target.value.slice(0,2))}  placeholder="홍"   maxLength={2} />
                  <FieldInput label="이름" value={form.first} onChange={e=>upd("first",e.target.value.slice(0,3))} placeholder="길동" maxLength={3} />
                </div>
              </div>

              <ErrBox msg={valErr} />
              <NavRow>
                <SecBtn onClick={()=>{setValErr("");setStep(1);}}>← 이전</SecBtn>
                <HBtn onClick={goStep3} bg={C.deep} hbg="#4A2020">다음 →</HBtn>
              </NavRow>
            </div>
          )}

          {step===3 && (
            <div className="fu0" style={{ textAlign:"center", width:"100%", maxWidth:420 }}>
              <div style={{ animation:"orbFloat 4s ease-in-out infinite", marginBottom:"1.5rem" }}><Orb size={70} /></div>
              <h2 style={{ fontSize:22, fontWeight:800, color:C.deep, marginBottom:28, letterSpacing:"-0.02em" }}>돌림자 유무 및 분석할 이름을 확인해주세요</h2>
              <div style={{ marginBottom:16, textAlign:"left" }}>
                <div style={{ fontSize:11, color:C.hint, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>돌림자 사용 여부</div>
                <div style={{ display:"flex", gap:8 }}>
                  {["미사용","사용함","미정"].map(o=><TextToggle key={o} label={o} selected={form.genOpt===o} onClick={()=>upd("genOpt",o)} />)}
                </div>
                {form.genOpt==="사용함" && (
                  <div style={{ marginTop:10, maxWidth:110 }}>
                    <FieldInput label="돌림자" value={form.genName} onChange={e=>upd("genName",e.target.value.slice(0,1))} placeholder="준" maxLength={1} />
                  </div>
                )}
              </div>
              <div style={{ background:C.deep, borderRadius:12, padding:"1.25rem 1.5rem", marginBottom:20, position:"relative", overflow:"hidden", textAlign:"left" }}>
                <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(201,151,58,.15)" }} />
                <div style={{ position:"relative" }}>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:8 }}>분석할 이름</div>
                  <div style={{ fontSize:30, fontWeight:900, color:"white", letterSpacing:5, marginBottom:10 }}>{form.last}{form.first}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {[form.gender,form.birthType,form.year+"년 "+parseInt(form.month)+"월 "+parseInt(form.day)+"일",parseInt(form.hour)+"시 "+parseInt(form.min)+"분"].map((t,idx)=>(
                      <span key={idx} style={{ padding:"3px 9px", borderRadius:20, fontSize:11, background:"rgba(255,255,255,.12)", color:"rgba(255,255,255,.75)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <ErrBox msg={error} />
              <NavRow>
                <SecBtn onClick={()=>{setError("");setStep(2);}}>← 이전</SecBtn>
                <HBtn onClick={generate} bg={C.primary} hbg="#7A2A2A">리포트 생성하기</HBtn>
              </NavRow>
            </div>
          )}
        </div>
      )}

      {step==="loading" && (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem", textAlign:"center", background:C.bg }}>
          <div style={{ animation:"orbFloat 2.5s ease-in-out infinite", marginBottom:"1.5rem" }}><Orb size={100} /></div>
          <div style={{ fontSize:24, fontWeight:800, color:C.deep, marginBottom:8, letterSpacing:4 }}>{form.last}{form.first}</div>
          <div style={{ fontSize:15, color:C.muted, animation:"pulse 2s ease-in-out infinite", marginBottom:20 }}>{LOAD_MSGS[loadIdx]}</div>
          <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
            {LOAD_MSGS.map((_,i)=><div key={i} style={{ width:i===loadIdx?20:5, height:5, borderRadius:999, background:i===loadIdx?C.primary:C.border, transition:"all .3s" }} />)}
          </div>
        </div>
      )}

      {step==="result" && result && (
        <div style={{ background:C.bg, minHeight:"100vh" }}>
          <div className="no-print" style={{ background:C.card, borderBottom:"1px solid "+C.border, padding:"13px 1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <button onClick={restart} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:C.muted, display:"flex", alignItems:"center", gap:6, padding:0, fontFamily:"inherit" }}>
              <IC.Back /> 새로운 이름 분석하기
            </button>
            <button onClick={()=>window.print()} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:8, border:"1.5px solid "+C.border, background:C.card, color:C.text, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6V2h8v4M4 12H3a1 1 0 01-1-1V7a1 1 0 011-1h10a1 1 0 011 1v4a1 1 0 01-1 1h-1M4 9h8v5H4z"/>
              </svg>
              PDF 저장
            </button>
          </div>
          <div style={{ maxWidth:600, margin:"0 auto", padding:"1rem 0.75rem 5rem" }}>
            <div className="fu0" style={{ background:C.deep, color:"white", borderRadius:16, padding:"2rem 1.75rem", marginBottom:14, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:"rgba(201,151,58,.12)" }} />
              <div style={{ position:"absolute", bottom:-30, left:-30, width:100, height:100, borderRadius:"50%", background:"rgba(139,58,58,.2)" }} />
              <div style={{ position:"absolute", top:0, left:0, width:"100%", height:3, background:"linear-gradient(90deg,#C9973A,transparent)" }} />
              <div style={{ position:"relative" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10 }}>이름 해설 리포트 · {form.gender}</div>
                <div style={{ fontSize:40, fontWeight:900, letterSpacing:6, marginBottom:16, lineHeight:1.1 }}>{form.last}{form.first}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {[form.birthType, form.year+"년 "+parseInt(form.month)+"월 "+parseInt(form.day)+"일", parseInt(form.hour)+"시 "+parseInt(form.min)+"분"].map((t,i)=>(
                    <span key={i} style={{ padding:"4px 11px", borderRadius:999, fontSize:12, fontWeight:500, background:"rgba(255,255,255,.1)", color:"rgba(255,255,255,.75)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="fu1"><SummaryCard s={result.summary} /></div>
            {(result.sections||[]).map((sec,idx)=>{
              const meta = SEC_META.find(m=>m.id===sec.id)||SEC_META[idx%SEC_META.length];
              return (
                <Card key={sec.id} className={"fu"+(Math.min(idx,4))} style={meta.hi?{border:"1.5px solid "+C.priM, background:C.priL}:{}}>
                  <SectionHeader Ic={meta.Ic} title={sec.title} hi={meta.hi} />
                  <MdContent md={sec.content} />
                </Card>
              );
            })}
            <button onClick={restart} style={{ width:"100%", padding:14, borderRadius:10, border:"1.5px solid "+C.border, background:C.card, color:C.muted, fontSize:15, fontWeight:600, cursor:"pointer", marginTop:4, fontFamily:"inherit" }}>
              ← 새로운 이름 분석하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
