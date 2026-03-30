import { STATUS_CONFIG } from "../../data/constants";
import { BRANCH_RECOMMENDATIONS, SHARED_MODULES, INTEGRATION_STEPS } from "../../data/recommendations";
import { CheckIcon } from "../icons/Icons";
import css from "./BlueprintView.module.css";

function getBranchStats(branch) {
  const total = branch.items.length;
  const done = branch.items.filter((i) => i.status === "done").length;
  const ip = branch.items.filter((i) => i.status === "in-progress").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, ip, pct };
}

function getPlatformStats(branches) {
  let total = 0;
  let done = 0;
  let ip = 0;
  branches.forEach((b) => {
    b.items.forEach((item) => {
      total++;
      if (item.status === "done") done++;
      if (item.status === "in-progress") ip++;
    });
  });
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, ip, pct };
}

function ItemRow({ item }) {
  const isDone = item.status === "done";
  const isIP = item.status === "in-progress";
  const st = STATUS_CONFIG[item.status];
  return (
    <div className={css.itemRow}>
      <div
        className={css.itemCheckbox}
        style={{
          border: isDone ? "none" : isIP ? `1.5px solid ${st.ring}` : `1.5px solid #d1d5db`,
          background: isDone ? "#4b8b6a" : isIP ? "#f5edd4" : "#fff",
        }}
      >
        {isDone && <CheckIcon />}
        {isIP && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#d97706" }} />}
      </div>
      <span
        className={css.itemName}
        style={{
          color: isDone ? "#374151" : isIP ? "#92400E" : "#9ca3af",
        }}
      >
        {item.name}
      </span>
    </div>
  );
}

function BranchBlock({ branch, platColor }) {
  const stats = getBranchStats(branch);
  const rec = BRANCH_RECOMMENDATIONS[branch.id];
  const dotColor = branch.highlight ? "#c0392b" : platColor;
  const nameColor = branch.highlight ? "#b91c1c" : "#374151";

  return (
    <div className={css.branchBlock}>
      <div className={css.branchHeader}>
        <div className={css.branchDot} style={{ background: dotColor }} />
        <span className={css.branchName} style={{ color: nameColor }}>
          {branch.label}
        </span>
        {branch.shared && <span className={css.tagShared}>共用</span>}
        {branch.highlight && <span className={css.tagHighlight}>重點</span>}
        {stats.total > 0 && (
          <div className={css.branchProgress}>
            <div className={css.branchProgressBarOuter}>
              <div
                className={css.branchProgressBarInner}
                style={{
                  width: `${stats.pct}%`,
                  background: "#94a3b8",
                }}
              />
            </div>
            <span className={css.branchProgressText}>
              {stats.done}/{stats.total}
            </span>
          </div>
        )}
      </div>
      {stats.total > 0 && (
        <div className={css.itemList}>
          {branch.items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
      {stats.total === 0 && !rec && (
        <div className={css.itemList}>
          <span className={css.emptyNote}>尚無子項目</span>
        </div>
      )}
      {rec && (
        <div className={css.recommendBlock}>
          <span className={css.recommendLabel}>下一步建議:</span>
          {rec}
        </div>
      )}
    </div>
  );
}

function PlatformCard({ plat, branches }) {
  const stats = getPlatformStats(branches);
  const leftBranches = branches.filter((b) => b.side === "left");
  const rightBranches = branches.filter((b) => b.side === "right");

  const tint = (opacity) => {
    const r = parseInt(plat.color.slice(1, 3), 16);
    const g = parseInt(plat.color.slice(3, 5), 16);
    const b = parseInt(plat.color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  return (
    <div className={css.platformCard} style={{ background: tint(0.03), borderColor: tint(0.12) }}>
      <div className={css.platformHeader} style={{ borderBottomColor: tint(0.08) }}>
        <div className={css.platformColorBar} style={{ background: plat.color }} />
        <span className={css.platformTitle} style={{ color: plat.color }}>{plat.name}</span>
        {plat.owner && <span className={css.ownerTag}>{plat.owner}</span>}
        <div className={css.progressBlock}>
          <div className={css.progressBarOuter}>
            <div
              className={css.progressBarInner}
              style={{
                width: `${stats.pct}%`,
                background: "#64748b",
              }}
            />
          </div>
          <span
            className={css.progressText}
            style={{
              color: "#64748b",
            }}
          >
            {stats.pct}%
          </span>
          <span className={css.progressDetail}>
            ({stats.done} 完成 / {stats.ip} 開發中 / {stats.total} 總計)
          </span>
          <span className={css.progressDetail} style={{ marginLeft: 8 }}>
            前端 <span style={{ fontWeight: 700, color: "#4b5563" }}>{plat.frontend}%</span>
            {" / "}
            後端 <span style={{ fontWeight: 700, color: plat.backend === 0 ? "#b45050" : "#4b5563" }}>{plat.backend}%</span>
            {plat.backendNote && (
              <span style={{ color: "#b45050", marginLeft: 4 }}>({plat.backendNote})</span>
            )}
          </span>
        </div>
      </div>
      <div className={css.columnsRow}>
        <div className={css.column}>
          <div className={css.columnTitle}>輸入 / 工具來源</div>
          {leftBranches.map((b) => (
            <BranchBlock key={b.id} branch={b} platColor={plat.color} />
          ))}
        </div>
        <div className={css.column}>
          <div className={css.columnTitle}>平台功能</div>
          {rightBranches.map((b) => (
            <BranchBlock key={b.id} branch={b} platColor={plat.color} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SharedModulesSection() {
  return (
    <div className={css.crossSection}>
      <div className={css.crossTitle}>跨平台共用模組 -- 避免重複開發</div>
      <div className={css.crossGrid}>
        {SHARED_MODULES.map((m) => (
          <div key={m.name} className={css.crossCard} style={{ borderLeftColor: m.color, borderLeftWidth: 3 }}>
            <div className={css.crossCardTitle} style={{ color: m.color }}>{m.name}</div>
            <div className={css.crossCardProvider}>提供方: {m.provider}</div>
            <div className={css.crossCardDesc}>{m.desc}</div>
            <div style={{ marginTop: 6, fontSize: 10, color: "#9CA3AF" }}>
              使用方: {m.consumers.join("、")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DATA_FLOW = {
  sources: [
    { name: "弱點管理大平台", owner: "Dylan", color: "#4878C8", db: "MSSQL", tables: ["Vulnerabilities", "Scans", "Projects"], syncLabel: "同步弱點資料" },
    { name: "SOC 戰情中心", owner: "Jsnn", color: "#3A9BAD", db: "PostgreSQL + SQL Server", tables: ["Alerts", "Incidents", "AdvMDR Endpoints"], syncLabel: "同步安全事件" },
  ],
  integration: {
    name: "共用整合資料庫 (Integration DB)",
    tables: [
      { name: "shared_assets", desc: "統一資產清冊" },
      { name: "shared_vuln_threat_mapping", desc: "弱點威脅對應" },
      { name: "shared_security_events", desc: "安全事件摘要" },
      { name: "shared_integration_config", desc: "同步設定" },
    ],
  },
  target: { name: "資安大師 BCCS One", owner: "Weiyao", color: "#7B6CB5", action: "匯入風險評鑑" },
};

function DataFlowDiagram() {
  const boxStyle = (color) => ({
    border: `1.5px solid ${color}30`,
    background: `${color}08`,
    borderRadius: 8,
    padding: "10px 14px",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, margin: "0 0 16px" }}>
      <div style={{ display: "flex", gap: 40, justifyContent: "center", width: "100%" }}>
        {DATA_FLOW.sources.map((s) => (
          <div key={s.name} style={{ ...boxStyle(s.color), flex: "0 1 260px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.name} ({s.owner})</div>
            <div style={{ fontSize: 10, color: "#6b7280", margin: "2px 0 4px" }}>{s.db}</div>
            {s.tables.map((t) => (
              <div key={t} style={{ fontSize: 11, color: "#374151", padding: "1px 0" }}>- {t}</div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 40, justifyContent: "center", padding: "4px 0" }}>
        {DATA_FLOW.sources.map((s) => (
          <div key={s.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 1 260px" }}>
            <div style={{ width: 1.5, height: 16, background: "#d1d5db" }} />
            <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, padding: "2px 0" }}>{s.syncLabel}</div>
            <div style={{ width: 1.5, height: 16, background: "#d1d5db" }} />
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #9ca3af" }} />
          </div>
        ))}
      </div>

      <div style={{ border: "1.5px dashed #9ca3af", borderRadius: 10, padding: "12px 24px", width: "100%", maxWidth: 600 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, textAlign: "center" }}>
          {DATA_FLOW.integration.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {DATA_FLOW.integration.tables.map((t) => (
            <div key={t.name} style={{ fontSize: 12, color: "#4b5563", fontFamily: "monospace", whiteSpace: "nowrap" }}>
              {t.name} <span style={{ color: "#9ca3af", fontFamily: "inherit" }}>({t.desc})</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 1.5, height: 16, background: "#d1d5db" }} />
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, padding: "2px 0" }}>{DATA_FLOW.target.action}</div>
        <div style={{ width: 1.5, height: 16, background: "#d1d5db" }} />
        <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #9ca3af" }} />
      </div>

      <div style={{ ...boxStyle(DATA_FLOW.target.color), textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: DATA_FLOW.target.color }}>
          {DATA_FLOW.target.name} ({DATA_FLOW.target.owner})
        </div>
        <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
          風險評鑑(PDCA) / 威脅弱點矩陣 / SoA適用性聲明 / 風險熱力圖
        </div>
      </div>
    </div>
  );
}

function IntegrationSection() {
  return (
    <div className={css.integrationFlow}>
      <div className={css.flowTitle}>整合資料流架構</div>
      <DataFlowDiagram />

      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "20px 0 12px" }}>建議整合步驟</div>
      <div className={css.flowSteps}>
        {INTEGRATION_STEPS.map((step) => (
          <div key={step.num} className={css.flowStep}>
            <div className={css.flowStepNum}>{step.num}</div>
            <div className={css.flowStepContent}>
              <div className={css.flowStepTitle}>{step.title}</div>
              <div className={css.flowStepDesc}>{step.desc}</div>
            </div>
            <span className={css.flowStepOwner}>{step.owner}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlueprintView({ data }) {
  return (
    <div className={css.container}>
      {data.platforms.map((plat) => {
        const branches = data.branches.filter((b) => b.platformId === plat.id);
        return <PlatformCard key={plat.id} plat={plat} branches={branches} />;
      })}

      <SharedModulesSection />
      <IntegrationSection />
    </div>
  );
}
