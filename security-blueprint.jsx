import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const INITIAL_DATA = {
  platforms: [
    { id: "vuln-mgmt", name: "弱點管理大平台", owner: "", color: "#2563EB" },
    { id: "soc", name: "SOC 戰情中心", owner: "", color: "#0891B2" },
    { id: "bccs", name: "資安大師 BCCS One", owner: "", color: "#7C3AED" },
  ],
  categories: [
    { id: "cat-common", label: "通用功能", platformId: "vuln-mgmt" },
    { id: "cat-scan-tools", label: "掃描工具", platformId: "vuln-mgmt" },
    { id: "cat-future", label: "待開發功能", platformId: "vuln-mgmt" },
    { id: "cat-soc-common", label: "通用功能", platformId: "soc" },
    { id: "cat-soc-tools", label: "監控工具", platformId: "soc" },
    { id: "cat-bccs-common", label: "核心功能", platformId: "bccs" },
    { id: "cat-bccs-int", label: "整合串接", platformId: "bccs" },
  ],
  features: [
    { id: "f1", name: "工具清單管理", categoryId: "cat-common", status: "done", note: "列出啟用工具、管理員新增工具" },
    { id: "f2", name: "工具連線", categoryId: "cat-common", status: "done", note: "帳密自動連線" },
    { id: "f3", name: "密碼加密儲存", categoryId: "cat-common", status: "done", note: "" },
    { id: "f4", name: "掃描目標管理", categoryId: "cat-common", status: "done", note: "新增/列表/刪除" },
    { id: "f5", name: "掃描任務管理", categoryId: "cat-common", status: "done", note: "啟動/詳情/中止/恢復/刪除" },
    { id: "f6", name: "報告管理", categoryId: "cat-common", status: "done", note: "模板/產生/下載/刪除" },
    { id: "f7", name: "弱點清單查詢", categoryId: "cat-common", status: "done", note: "" },
    { id: "f8", name: "弱點匯出", categoryId: "cat-common", status: "done", note: "JSON/XML" },
    { id: "f9", name: "弱點同步本地 DB", categoryId: "cat-common", status: "done", note: "供工單與後續流程" },
    { id: "f10", name: "儀表板統計", categoryId: "cat-common", status: "done", note: "目標/掃描/弱點數" },
    { id: "f11", name: "工單/案件管理", categoryId: "cat-common", status: "done", note: "派工＋通知" },
    { id: "f12", name: "使用者驗證", categoryId: "cat-common", status: "done", note: "" },
    { id: "f13", name: "通知管理", categoryId: "cat-common", status: "done", note: "" },
    { id: "f14", name: "使用者列表", categoryId: "cat-common", status: "done", note: "" },
    { id: "f15", name: "Acunetix 串接", categoryId: "cat-scan-tools", status: "done", note: "" },
    { id: "f16", name: "Nessus 串接", categoryId: "cat-scan-tools", status: "planned", note: "待串接" },
    { id: "f17", name: "工具清單擴充", categoryId: "cat-scan-tools", status: "planned", note: "" },
    { id: "f18", name: "雙軌報告引擎", categoryId: "cat-future", status: "planned", note: "" },
    { id: "f19", name: "OWASP 分類驗證", categoryId: "cat-future", status: "planned", note: "" },
    { id: "f20", name: "資產清單與風險評分", categoryId: "cat-future", status: "planned", note: "" },
    { id: "f21", name: "動態報告範本", categoryId: "cat-future", status: "planned", note: "" },
    { id: "f22", name: "通知排程", categoryId: "cat-future", status: "planned", note: "" },
    { id: "f23", name: "多租戶架構", categoryId: "cat-future", status: "planned", note: "" },
    { id: "f24", name: "RBAC 權限", categoryId: "cat-future", status: "planned", note: "" },
    { id: "f25", name: "BLR 基線風險", categoryId: "cat-future", status: "planned", note: "" },
    { id: "f30", name: "事件監控儀表板", categoryId: "cat-soc-common", status: "planned", note: "" },
    { id: "f31", name: "告警規則管理", categoryId: "cat-soc-common", status: "planned", note: "" },
    { id: "f32", name: "事件關聯分析", categoryId: "cat-soc-common", status: "planned", note: "" },
    { id: "f33", name: "日誌收集分析", categoryId: "cat-soc-tools", status: "planned", note: "" },
    { id: "f40", name: "風險評鑑計算", categoryId: "cat-bccs-common", status: "planned", note: "" },
    { id: "f41", name: "資產盤點", categoryId: "cat-bccs-common", status: "planned", note: "" },
    { id: "f42", name: "BCCS One 串接", categoryId: "cat-bccs-int", status: "planned", note: "" },
    { id: "f43", name: "弱點平台匯入", categoryId: "cat-bccs-int", status: "planned", note: "" },
    { id: "f44", name: "SOC 資料匯入", categoryId: "cat-bccs-int", status: "planned", note: "" },
  ],
  connections: [
    { id: "c1", from: "vuln-mgmt", to: "bccs", label: "弱點資料" },
    { id: "c2", from: "soc", to: "bccs", label: "事件資料" },
  ],
};

const ST = {
  done: { l: "已完成", c: "#16A34A", bg: "#DCFCE7", ring: "#16A34A" },
  "in-progress": { l: "開發中", c: "#D97706", bg: "#FEF3C7", ring: "#D97706" },
  planned: { l: "規劃中", c: "#94A3B8", bg: "#F1F5F9", ring: "#CBD5E1" },
  blocked: { l: "阻塞", c: "#DC2626", bg: "#FEE2E2", ring: "#DC2626" },
};

const uid = () => "id_" + Math.random().toString(36).slice(2, 10);
const font = "'Noto Sans TC','SF Pro Text',-apple-system,sans-serif";

const Plus=()=><svg width="13" height="13" fill="none" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
const Pen=()=><svg width="11" height="11" fill="none" viewBox="0 0 13 13"><path d="M9.5 1.5l2 2L4 11H2V9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>;
const Trash=()=><svg width="11" height="11" fill="none" viewBox="0 0 13 13"><path d="M2 3.5h9M4.5 3.5V2a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1.5M5.5 6v3M7.5 6v3M3.5 3.5l.5 7a1 1 0 001 1h3a1 1 0 001-1l.5-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const XIcon=()=><svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;

const inp={width:"100%",boxSizing:"border-box",padding:"7px 10px",background:"#FAFAFA",border:"1px solid #E5E7EB",borderRadius:6,color:"#111",fontSize:13,outline:"none",fontFamily:font};
const selS={...inp,cursor:"pointer"};
const btnP={padding:"7px 16px",background:"#2563EB",color:"#fff",border:"none",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font};
const btnG={padding:"7px 14px",background:"#fff",color:"#374151",border:"1px solid #E5E7EB",borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:font};

function Modal({open,onClose,title,children}){
  if(!open) return null;
  return <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font}} onClick={onClose}>
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.12)"}}/>
    <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#fff",borderRadius:12,width:420,maxWidth:"92vw",maxHeight:"85vh",overflow:"auto",padding:"24px 28px",boxShadow:"0 12px 40px rgba(0,0,0,.08)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{margin:0,fontSize:16,fontWeight:600,color:"#111"}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer"}}><XIcon/></button>
      </div>
      {children}
    </div>
  </div>;
}
function Field({label,children}){
  return <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,color:"#6B7280",marginBottom:4,fontWeight:500}}>{label}</label>{children}</div>;
}

/* ════════════════════════════════════════════════════════
   MIND MAP — HTML/CSS based (not SVG spaghetti)
   Each platform is a positioned card with branch lines
   going to category groups, which contain feature pills.
   ════════════════════════════════════════════════════════ */

// Branch colors for categories
const BRANCH = ["#EF4444","#EC4899","#8B5CF6","#06B6D4","#10B981","#F59E0B","#3B82F6"];

function MindMapView({ data, onEditFeat, onEditPlat, onEditCat }) {
  const containerRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.95);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onWheel = useCallback(e => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(2.5, z * (e.deltaY > 0 ? 0.92 : 1.08))));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener("wheel", onWheel, { passive: false });
    return () => el && el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const onMD = e => {
    if (e.target.closest("[data-click]")) return;
    dragging.current = true; last.current = { x: e.clientX, y: e.clientY };
  };
  const onMM = e => {
    if (!dragging.current) return;
    setPan(p => ({ x: p.x + (e.clientX - last.current.x) / zoom, y: p.y + (e.clientY - last.current.y) / zoom }));
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onMU = () => { dragging.current = false; };

  /* Layout: position platforms, then categories around them */
  const { platforms, categories, features, connections } = data;

  // Fixed layout positions for the 3 known platforms
  const platPos = {
    "vuln-mgmt": { x: 320, y: 280 },
    "soc": { x: 1100, y: 280 },
    "bccs": { x: 710, y: 700 },
  };
  let ei = 0;
  platforms.forEach(p => {
    if (!platPos[p.id]) { platPos[p.id] = { x: 200 + (ei % 3) * 400, y: 950 + Math.floor(ei / 3) * 350 }; ei++; }
  });

  // For each platform, lay out categories in a fan around it
  const getCatLayout = (platId) => {
    const cats = categories.filter(c => c.platformId === platId);
    const pos = platPos[platId];
    if (!pos || cats.length === 0) return [];

    // Distribute angles based on position
    let startAngle, sweep;
    if (platId === "vuln-mgmt") { startAngle = 150; sweep = 200; } // left-biased fan
    else if (platId === "soc") { startAngle = -30; sweep = 200; } // right-biased fan
    else if (platId === "bccs") { startAngle = 190; sweep = 160; } // bottom fan
    else { startAngle = 0; sweep = 300; }

    const radius = 220;
    return cats.map((cat, i) => {
      const angle = (startAngle + (sweep / Math.max(cats.length - 1, 1)) * i) * Math.PI / 180;
      const cx = pos.x + Math.cos(angle) * radius;
      const cy = pos.y + Math.sin(angle) * radius;
      return { cat, cx, cy, angle, branchColor: BRANCH[i % BRANCH.length] };
    });
  };

  const allCatLayouts = {};
  platforms.forEach(p => { allCatLayouts[p.id] = getCatLayout(p.id); });

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflow: "hidden", cursor: dragging.current ? "grabbing" : "grab", position: "relative", background: "#FAFBFC" }}
      onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
    >
      {/* Hint */}
      <div style={{ position: "absolute", bottom: 10, left: 14, fontSize: 10, color: "#CBD5E1", zIndex: 2, pointerEvents: "none" }}>
        拖曳平移 · 滾輪縮放
      </div>

      <div style={{
        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        transformOrigin: "0 0",
        position: "absolute", inset: 0,
        width: 1600, height: 1100,
      }}>

        {/* SVG layer for branch lines and connection arrows */}
        <svg style={{ position: "absolute", inset: 0, width: 1600, height: 1100, pointerEvents: "none" }}>
          {/* Connection arrows between platforms */}
          {connections.map(conn => {
            const fp = platPos[conn.from], tp = platPos[conn.to];
            if (!fp || !tp) return null;
            const mx = (fp.x + tp.x) / 2, my = (fp.y + tp.y) / 2 + 20;
            return (
              <g key={conn.id}>
                <path d={`M${fp.x} ${fp.y + 28} Q${mx} ${my} ${tp.x} ${tp.y - 28}`} fill="none" stroke="#D1D5DB" strokeWidth="1.8" strokeDasharray="6,4" />
                <circle cx={tp.x} cy={tp.y - 30} r="3" fill="#D1D5DB" />
                <text x={mx} y={my - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily={font} fontWeight="500">{conn.label}</text>
              </g>
            );
          })}

          {/* Branch lines from platform to category groups */}
          {platforms.map(p => {
            const pos = platPos[p.id];
            const catLayouts = allCatLayouts[p.id] || [];
            return catLayouts.map(({ cat, cx, cy, branchColor }) => (
              <line key={cat.id} x1={pos.x} y1={pos.y} x2={cx} y2={cy}
                stroke={branchColor} strokeWidth="2" opacity="0.35" />
            ));
          })}
        </svg>

        {/* Platform nodes */}
        {platforms.map(p => {
          const pos = platPos[p.id];
          const cids = categories.filter(c => c.platformId === p.id).map(c => c.id);
          const fs = features.filter(f => cids.includes(f.categoryId));
          const done = fs.filter(f => f.status === "done").length;
          return (
            <div key={p.id} data-click="1" style={{
              position: "absolute", left: pos.x - 80, top: pos.y - 24,
              width: 160, textAlign: "center", cursor: "pointer",
            }} onClick={() => onEditPlat(p)}>
              <div style={{
                background: "#fff", border: `2px solid ${p.color}`, borderRadius: 24,
                padding: "8px 16px", display: "inline-block",
                boxShadow: `0 2px 12px ${p.color}15`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111", whiteSpace: "nowrap" }}>{p.name}</div>
              </div>
              {/* Mini progress bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 6 }}>
                <div style={{ width: 50, height: 3, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${fs.length ? (done / fs.length) * 100 : 0}%`, background: p.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 9, color: "#9CA3AF" }}>{done}/{fs.length}</span>
              </div>
              {p.owner && <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>{p.owner}</div>}
            </div>
          );
        })}

        {/* Category groups with feature pills */}
        {platforms.map(p => {
          const catLayouts = allCatLayouts[p.id] || [];
          return catLayouts.map(({ cat, cx, cy, branchColor }) => {
            const cFeats = features.filter(f => f.categoryId === cat.id);
            const doneCount = cFeats.filter(f => f.status === "done").length;

            // Determine alignment based on position relative to platform
            const pos = platPos[p.id];
            const isLeft = cx < pos.x;
            const isBelow = cy > pos.y + 50;

            return (
              <div key={cat.id} data-click="1" style={{
                position: "absolute",
                left: cx - (isLeft ? 200 : 10),
                top: cy - 14,
                width: 210,
                cursor: "default",
              }}>
                {/* Category label */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 4, marginBottom: 5,
                  justifyContent: isLeft ? "flex-end" : "flex-start",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: branchColor }}>{cat.label}</span>
                  <span style={{ fontSize: 9, color: "#CBD5E1" }}>{doneCount}/{cFeats.length}</span>
                  <button onClick={() => onEditCat(cat)} style={{ background: "none", border: "none", color: "#E5E7EB", cursor: "pointer", padding: 0 }}><Pen /></button>
                </div>

                {/* Feature pills */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 3,
                  justifyContent: isLeft ? "flex-end" : "flex-start",
                }}>
                  {cFeats.map(f => {
                    const isDone = f.status === "done";
                    const isIP = f.status === "in-progress";
                    const st = ST[f.status];
                    return (
                      <div
                        key={f.id}
                        onClick={() => onEditFeat(f)}
                        title={f.note || f.name}
                        style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 10,
                          background: isDone ? "#DCFCE7" : isIP ? "#FEF3C7" : "#F1F5F9",
                          color: isDone ? "#15803D" : isIP ? "#92400E" : "#64748B",
                          fontWeight: isDone ? 600 : 400,
                          cursor: "pointer",
                          border: `1px solid ${isDone ? "#BBF7D0" : isIP ? "#FDE68A" : "#E2E8F0"}`,
                          whiteSpace: "nowrap",
                          transition: "all .1s",
                        }}
                      >
                        {isDone && "✓ "}{f.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        })}

        {/* Connection labels as positioned badges */}
        {connections.map(conn => {
          const fp = platPos[conn.from], tp = platPos[conn.to];
          if (!fp || !tp) return null;
          return null; // already rendered in SVG
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   LIST VIEW
   ════════════════════════════════════════════════════════ */
function ListView({ data, fPlat, fStat, search, onEditFeat, onDelFeat, onEditPlat, onDelPlat, onEditCat, onDelCat, onAddFeat }) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = id => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  const filtPlats = fPlat === "all" ? data.platforms : data.platforms.filter(p => p.id === fPlat);
  const getFeats = cid => {
    let fs = data.features.filter(f => f.categoryId === cid);
    if (fStat !== "all") fs = fs.filter(f => f.status === fStat);
    if (search) fs = fs.filter(f => f.name.includes(search) || (f.note && f.note.includes(search)));
    return fs;
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "16px 24px 40px" }}>
      {filtPlats.map(plat => {
        const cats = data.categories.filter(c => c.platformId === plat.id);
        const allF = data.features.filter(f => cats.some(c => c.id === f.categoryId));
        const done = allF.filter(f => f.status === "done").length;
        return (
          <div key={plat.id} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: plat.color }} />
              <span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>{plat.name}</span>
              {plat.owner && <span style={{ fontSize: 10, color: "#9CA3AF", background: "#F9FAFB", padding: "1px 8px", borderRadius: 8 }}>{plat.owner}</span>}
              <div style={{ width: 50, height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${allF.length ? done / allF.length * 100 : 0}%`, background: plat.color, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: "#9CA3AF" }}>{done}/{allF.length}</span>
              <button onClick={() => onAddFeat(plat.id)} style={{ ...btnG, fontSize: 10, padding: "2px 8px", display: "flex", alignItems: "center", gap: 2 }}><Plus /> 功能</button>
              <button onClick={() => onEditPlat(plat)} style={{ background: "none", border: "none", color: "#D1D5DB", cursor: "pointer" }}><Pen /></button>
              <button onClick={() => { if (confirm("刪除？")) onDelPlat(plat.id); }} style={{ background: "none", border: "none", color: "#D1D5DB", cursor: "pointer" }}><Trash /></button>
            </div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
              {cats.map((cat, ci) => {
                const feats = getFeats(cat.id);
                const isC = collapsed[cat.id];
                return (
                  <div key={cat.id}>
                    <div onClick={() => toggle(cat.id)} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#FAFAFA",
                      cursor: "pointer", borderTop: ci > 0 ? "1px solid #F3F4F6" : "none", userSelect: "none",
                    }}>
                      <svg width="8" height="8" fill="none" viewBox="0 0 8 8" style={{ transform: isC ? "rotate(0)" : "rotate(90deg)", transition: "transform .15s" }}><path d="M2 1l4 3-4 3" fill="#9CA3AF" /></svg>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1 }}>{cat.label}</span>
                      <span style={{ fontSize: 10, color: "#D1D5DB" }}>{feats.filter(f => f.status === "done").length}/{feats.length}</span>
                      <button onClick={e => { e.stopPropagation(); onEditCat(cat); }} style={{ background: "none", border: "none", color: "#E5E7EB", cursor: "pointer", padding: 0 }}><Pen /></button>
                      <button onClick={e => { e.stopPropagation(); if (confirm("刪除分類？")) onDelCat(cat.id); }} style={{ background: "none", border: "none", color: "#E5E7EB", cursor: "pointer", padding: 0 }}><Trash /></button>
                    </div>
                    {!isC && feats.map(f => {
                      const st = ST[f.status]; const isDone = f.status === "done";
                      return (
                        <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 14px 5px 30px", borderTop: "1px solid #F9FAFB" }}>
                          <div style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, border: isDone ? "none" : `1.5px solid ${st.ring}`, background: isDone ? "#16A34A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {isDone && <svg width="9" height="9" fill="none" viewBox="0 0 10 10"><path d="M2 5.2l2.2 2.2L8 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <span style={{ fontSize: 12, flex: 1, color: isDone ? "#374151" : "#6B7280" }}>{f.name}</span>
                          {f.note && <span style={{ fontSize: 10, color: "#D1D5DB", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={f.note}>{f.note}</span>}
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 8, background: st.bg, color: st.c }}>{st.l}</span>
                          <button onClick={() => onEditFeat(f)} style={{ background: "none", border: "none", color: "#E5E7EB", cursor: "pointer", padding: 0 }}><Pen /></button>
                          <button onClick={() => onDelFeat(f.id)} style={{ background: "none", border: "none", color: "#E5E7EB", cursor: "pointer", padding: 0 }}><Trash /></button>
                        </div>
                      );
                    })}
                    {!isC && feats.length === 0 && <div style={{ padding: "5px 30px", fontSize: 11, color: "#E5E7EB" }}>無項目</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════ */
export default function App() {
  const [data, setData] = useState(null);
  const [modal, setModal] = useState(null);
  const [edit, setEdit] = useState(null);
  const [tab, setTab] = useState("map");
  const [fPlat, setFPlat] = useState("all");
  const [fStat, setFStat] = useState("all");
  const [search, setSearch] = useState("");
  const [defPlatId, setDefPlatId] = useState(null);

  useEffect(() => {
    (async () => { try { const r = await window.storage.get("bp-v7"); if (r?.value) setData(JSON.parse(r.value)); else setData(INITIAL_DATA); } catch { setData(INITIAL_DATA); } })();
  }, []);

  const save = useCallback(async d => { setData(d); try { await window.storage.set("bp-v7", JSON.stringify(d)); } catch {} }, []);
  const openM = (t, item) => { setEdit(item || null); setModal(t); };
  const closeM = () => { setModal(null); setEdit(null); setDefPlatId(null); };

  const saveFeature = f => { const d = { ...data }; edit ? d.features = d.features.map(x => x.id === f.id ? f : x) : d.features = [...d.features, { ...f, id: uid() }]; save(d); closeM(); };
  const delFeature = id => save({ ...data, features: data.features.filter(x => x.id !== id) });
  const saveCat = c => { const d = { ...data }; edit ? d.categories = d.categories.map(x => x.id === c.id ? c : x) : d.categories = [...d.categories, { ...c, id: uid() }]; save(d); closeM(); };
  const delCat = id => save({ ...data, categories: data.categories.filter(x => x.id !== id), features: data.features.filter(x => x.categoryId !== id) });
  const savePlat = p => { const d = { ...data }; edit ? d.platforms = d.platforms.map(x => x.id === p.id ? p : x) : d.platforms = [...d.platforms, { ...p, id: uid() }]; save(d); closeM(); };
  const delPlat = id => { const cids = data.categories.filter(c => c.platformId === id).map(c => c.id); save({ ...data, platforms: data.platforms.filter(x => x.id !== id), categories: data.categories.filter(x => x.platformId !== id), features: data.features.filter(x => !cids.includes(x.categoryId)), connections: data.connections.filter(x => x.from !== id && x.to !== id) }); };
  const saveConn = c => { const d = { ...data }; edit ? d.connections = d.connections.map(x => x.id === c.id ? c : x) : d.connections = [...d.connections, { ...c, id: uid() }]; save(d); closeM(); };
  const delConn = id => save({ ...data, connections: data.connections.filter(x => x.id !== id) });

  if (!data) return <div style={{ padding: 40, color: "#999", fontFamily: font }}>載入中…</div>;

  const total = data.features.length, done = data.features.filter(f => f.status === "done").length;
  const ip = data.features.filter(f => f.status === "in-progress").length;
  const pct = total ? Math.round(done / total * 100) : 0;

  const tabBtn = a => ({ padding: "5px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", borderRadius: 5, border: "none", background: a ? "#F3F4F6" : "transparent", color: a ? "#111" : "#9CA3AF", transition: "all .15s", fontFamily: font });

  return (
    <div style={{ fontFamily: font, background: "#fff", color: "#111", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "12px 20px 8px", borderBottom: "1px solid #F3F4F6", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1l5.5 3v6L7 13 1.5 10V4z" stroke="#fff" strokeWidth="1.2" /><circle cx="7" cy="7" r="1.5" fill="#fff" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>資安平台產品藍圖</div>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginRight: 12 }}>
            {[{ l: "已完成", v: done, c: "#16A34A" }, { l: "開發中", v: ip, c: "#D97706" }, { l: "規劃中", v: total - done - ip, c: "#9CA3AF" }].map(s => (
              <div key={s.l} style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</span>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>{s.l}</span>
              </div>
            ))}
            <div style={{ width: 50, height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#16A34A", borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A" }}>{pct}%</span>
          </div>
          <div style={{ display: "flex", background: "#F9FAFB", borderRadius: 6, padding: 2, gap: 1 }}>
            <button onClick={() => setTab("map")} style={tabBtn(tab === "map")}>藍圖</button>
            <button onClick={() => setTab("list")} style={tabBtn(tab === "list")}>清單</button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
          {tab === "list" && <>
            <select value={fPlat} onChange={e => setFPlat(e.target.value)} style={{ ...selS, width: "auto", fontSize: 11, padding: "3px 8px" }}>
              <option value="all">全部平台</option>
              {data.platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={fStat} onChange={e => setFStat(e.target.value)} style={{ ...selS, width: "auto", fontSize: 11, padding: "3px 8px" }}>
              <option value="all">全部狀態</option>
              {Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
            </select>
            <input placeholder="搜尋…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: "auto", flex: "0 1 130px", fontSize: 11, padding: "3px 8px" }} />
          </>}
          {tab === "map" && <div style={{ fontSize: 10, color: "#CBD5E1" }}>點擊平台可編輯 · 點擊功能標籤可編輯 · 拖曳平移 · 滾輪縮放</div>}
          <div style={{ flex: 1 }} />
          <button onClick={() => openM("platform")} style={{ ...btnG, fontSize: 10, padding: "3px 8px", display: "flex", alignItems: "center", gap: 2 }}><Plus /> 平台</button>
          <button onClick={() => openM("category")} style={{ ...btnG, fontSize: 10, padding: "3px 8px", display: "flex", alignItems: "center", gap: 2 }}><Plus /> 分類</button>
          <button onClick={() => openM("connection")} style={{ ...btnG, fontSize: 10, padding: "3px 8px", display: "flex", alignItems: "center", gap: 2 }}><Plus /> 連線</button>
          <button onClick={() => openM("feature")} style={{ ...btnP, fontSize: 10, padding: "3px 10px", display: "flex", alignItems: "center", gap: 2 }}><Plus /> 功能</button>
        </div>
      </div>

      {/* Content */}
      {tab === "map" && (
        <MindMapView
          data={data}
          onEditFeat={f => openM("feature", f)}
          onEditPlat={p => openM("platform", p)}
          onEditCat={c => openM("category", c)}
        />
      )}
      {tab === "list" && (
        <ListView
          data={data} fPlat={fPlat} fStat={fStat} search={search}
          onEditFeat={f => openM("feature", f)} onDelFeat={delFeature}
          onEditPlat={p => openM("platform", p)} onDelPlat={delPlat}
          onEditCat={c => openM("category", c)} onDelCat={delCat}
          onAddFeat={pid => { setDefPlatId(pid); setEdit(null); setModal("feature"); }}
        />
      )}

      {/* Legend bar */}
      {tab === "map" && (
        <div style={{ padding: "6px 20px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 14, alignItems: "center", flexShrink: 0, background: "#FAFAFA", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>圖例：</span>
          {Object.entries(ST).map(([k, v]) => (
            <span key={k} style={{ fontSize: 10, padding: "1px 8px", borderRadius: 8, background: v.bg, color: v.c, fontWeight: 500 }}>
              {k === "done" && "✓ "}{v.l}
            </span>
          ))}
          <span style={{ fontSize: 10, color: "#D1D5DB" }}>──</span>
          {data.connections.map(c => {
            const fp = data.platforms.find(p => p.id === c.from);
            const tp = data.platforms.find(p => p.id === c.to);
            return <span key={c.id} style={{ fontSize: 10, color: "#9CA3AF" }}>
              {fp?.name} <span style={{ color: "#D1D5DB" }}>→</span> {tp?.name}（{c.label}）
            </span>;
          })}
        </div>
      )}

      {/* Modals */}
      <Modal open={modal === "feature"} onClose={closeM} title={edit ? "編輯功能" : "新增功能"}>
        <FForm data={data} init={edit} defPlatId={defPlatId} onSave={saveFeature} onCancel={closeM} />
      </Modal>
      <Modal open={modal === "category"} onClose={closeM} title={edit ? "編輯分類" : "新增分類"}>
        <CForm data={data} init={edit} onSave={saveCat} onCancel={closeM} />
      </Modal>
      <Modal open={modal === "platform"} onClose={closeM} title={edit ? "編輯平台" : "新增平台"}>
        <PForm init={edit} onSave={savePlat} onCancel={closeM} />
      </Modal>
      <Modal open={modal === "connection"} onClose={closeM} title={edit ? "編輯連線" : "新增連線"}>
        <ConnForm data={data} init={edit} onSave={saveConn} onCancel={closeM} />
      </Modal>
    </div>
  );
}

/* ── Forms ── */
function FForm({ data, init, defPlatId, onSave, onCancel }) {
  const defCat = defPlatId ? (data.categories.find(c => c.platformId === defPlatId)?.id || data.categories[0]?.id || "") : (data.categories[0]?.id || "");
  const [f, sF] = useState(init || { name: "", categoryId: defCat, status: "planned", note: "" });
  const s = (k, v) => sF(p => ({ ...p, [k]: v }));
  return <>
    <Field label="功能名稱"><input style={inp} value={f.name} onChange={e => s("name", e.target.value)} placeholder="例如：Nessus 串接" /></Field>
    <Field label="所屬分類"><select style={selS} value={f.categoryId} onChange={e => s("categoryId", e.target.value)}>
      {data.platforms.map(p => data.categories.filter(c => c.platformId === p.id).map(c => <option key={c.id} value={c.id}>{p.name} › {c.label}</option>))}
    </select></Field>
    <Field label="狀態"><select style={selS} value={f.status} onChange={e => s("status", e.target.value)}>
      {Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
    </select></Field>
    <Field label="備註"><input style={inp} value={f.note} onChange={e => s("note", e.target.value)} placeholder="選填" /></Field>
    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 18 }}>
      <button onClick={onCancel} style={btnG}>取消</button>
      <button onClick={() => f.name && onSave(f)} style={{ ...btnP, opacity: f.name ? 1 : .4 }}>儲存</button>
    </div>
  </>;
}
function CForm({ data, init, onSave, onCancel }) {
  const [f, sF] = useState(init || { label: "", platformId: data.platforms[0]?.id || "" });
  const s = (k, v) => sF(p => ({ ...p, [k]: v }));
  return <>
    <Field label="分類名稱"><input style={inp} value={f.label} onChange={e => s("label", e.target.value)} placeholder="例如：掃描工具" /></Field>
    <Field label="所屬平台"><select style={selS} value={f.platformId} onChange={e => s("platformId", e.target.value)}>
      {data.platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select></Field>
    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 18 }}>
      <button onClick={onCancel} style={btnG}>取消</button>
      <button onClick={() => f.label && onSave(f)} style={{ ...btnP, opacity: f.label ? 1 : .4 }}>儲存</button>
    </div>
  </>;
}
function PForm({ init, onSave, onCancel }) {
  const [f, sF] = useState(init || { name: "", owner: "", color: "#2563EB" });
  const s = (k, v) => sF(p => ({ ...p, [k]: v }));
  const colors = ["#2563EB", "#0891B2", "#7C3AED", "#DC2626", "#EA580C", "#16A34A", "#DB2777", "#4F46E5"];
  return <>
    <Field label="平台名稱"><input style={inp} value={f.name} onChange={e => s("name", e.target.value)} placeholder="例如：弱點管理大平台" /></Field>
    <Field label="負責人"><input style={inp} value={f.owner} onChange={e => s("owner", e.target.value)} placeholder="選填" /></Field>
    <Field label="代表色"><div style={{ display: "flex", gap: 6 }}>{colors.map(c => <div key={c} onClick={() => s("color", c)} style={{ width: 24, height: 24, borderRadius: 5, background: c, cursor: "pointer", border: f.color === c ? "2.5px solid #111" : "2.5px solid transparent" }} />)}</div></Field>
    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 18 }}>
      <button onClick={onCancel} style={btnG}>取消</button>
      <button onClick={() => f.name && onSave(f)} style={{ ...btnP, opacity: f.name ? 1 : .4 }}>儲存</button>
    </div>
  </>;
}
function ConnForm({ data, init, onSave, onCancel }) {
  const [f, sF] = useState(init || { from: data.platforms[0]?.id || "", to: data.platforms[1]?.id || "", label: "" });
  const s = (k, v) => sF(p => ({ ...p, [k]: v }));
  return <>
    <Field label="來源平台"><select style={selS} value={f.from} onChange={e => s("from", e.target.value)}>{data.platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
    <Field label="目標平台"><select style={selS} value={f.to} onChange={e => s("to", e.target.value)}>{data.platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
    <Field label="連線說明"><input style={inp} value={f.label} onChange={e => s("label", e.target.value)} placeholder="例如：弱點資料匯入" /></Field>
    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 18 }}>
      <button onClick={onCancel} style={btnG}>取消</button>
      <button onClick={() => f.label && onSave(f)} style={{ ...btnP, opacity: f.label ? 1 : .4 }}>儲存</button>
    </div>
  </>;
}
