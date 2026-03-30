import { useState } from "react";
import { BRANCH_RECOMMENDATIONS } from "../../data/recommendations";
import css from "./MindMapView.module.css";

function branchStats(branch) {
  const t = branch.items.length;
  if (t === 0) return { done: 0, total: 0, pct: 0 };
  const d = branch.items.filter((i) => i.status === "done").length;
  const ip = branch.items.filter((i) => i.status === "in-progress").length;
  return { done: d, inProgress: ip, total: t, pct: t > 0 ? Math.round((d / t) * 100) : 0 };
}

function hexToTint(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function BranchPill({ branch, active, onClick, platColor }) {
  const st = branchStats(branch);
  const isHighlight = branch.highlight;

  const textColor = isHighlight ? "#c0392b" : "#4b5563";
  const pillStyle = active
    ? { background: hexToTint(platColor, 0.12), borderColor: hexToTint(platColor, 0.35), color: platColor }
    : { background: hexToTint(platColor, 0.05), borderColor: hexToTint(platColor, 0.15), color: textColor };

  return (
    <button
      className={active ? css.branchPillActive : css.branchPill}
      style={pillStyle}
      onClick={onClick}
    >
      <span className={isHighlight ? css.branchPillHighlight : undefined}>
        {branch.label}
      </span>
      {st.total > 0 && (
        <span className={css.branchCount}>{st.done}/{st.total}</span>
      )}
      {branch.shared && <span className={css.badgeShared}>共用</span>}
      {branch.highlight && <span className={css.badgeKey}>重點</span>}
    </button>
  );
}

function PlatformBlock({ plat, branches, activeBranchId, onSelectBranch }) {
  const left = branches.filter((b) => b.side === "left");
  const right = branches.filter((b) => b.side === "right");

  const feColor = "#4b5563";
  const beColor = plat.backend === 0 ? "#b45050" : "#4b5563";

  const wrapStyle = {
    background: hexToTint(plat.color, 0.03),
    border: `1px solid ${hexToTint(plat.color, 0.1)}`,
    borderRadius: 12,
    padding: "14px 16px",
  };

  return (
    <div className={css.platBlock} style={wrapStyle}>
      <div className={css.platSideLeft}>
        {left.map((b) => (
          <BranchPill
            key={b.id}
            branch={b}
            active={activeBranchId === b.id}
            onClick={() => onSelectBranch(b.id)}
            platColor={plat.color}
          />
        ))}
      </div>

      <div className={css.platNode}>
        <div className={css.platBubble} style={{ borderColor: plat.color, background: hexToTint(plat.color, 0.06) }}>
          <div className={css.platName} style={{ color: plat.color }}>
            {plat.name}
          </div>
        </div>
        <div className={css.platMeta}>
          <span className={css.platOwner}>{plat.owner}</span>
          <span className={css.platFeBe}>
            FE <span className={css.platFeBeVal} style={{ color: feColor }}>{plat.frontend}%</span>
            {" "}BE <span className={plat.backend === 0 ? css.platFeBeWarn : css.platFeBeVal} style={{ color: beColor }}>{plat.backend}%</span>
          </span>
        </div>
      </div>

      <div className={css.platSideRight}>
        {right.map((b) => (
          <BranchPill
            key={b.id}
            branch={b}
            active={activeBranchId === b.id}
            onClick={() => onSelectBranch(b.id)}
            platColor={plat.color}
          />
        ))}
      </div>
    </div>
  );
}

function DetailPanel({ branch, plat, onClose }) {
  const st = branchStats(branch);
  const rec = BRANCH_RECOMMENDATIONS[branch.id];

  return (
    <div className={css.detailPanel} key={branch.id} style={{ borderTop: `3px solid ${plat.color}` }}>
      <div className={css.detailHeader}>
        <div className={css.detailTitle} style={{ color: plat.color }}>
          {branch.label}
        </div>
        <span className={css.detailPlatName}>{plat.name} / {plat.owner}</span>
        {branch.shared && <span className={css.badgeShared}>跨平台共用</span>}
        {branch.highlight && <span className={css.badgeKey}>待規劃重點</span>}
        <button className={css.detailClose} onClick={onClose}>關閉</button>
      </div>

      <div className={css.statsRow}>
        <div className={css.statCard}>
          <div className={css.statLabel}>完成度</div>
          <div className={css.statValue} style={{ color: "#4b5563" }}>
            {st.total > 0 ? `${st.pct}%` : "--"}
          </div>
        </div>
        <div className={css.statCard}>
          <div className={css.statLabel}>已完成</div>
          <div className={css.statValue} style={{ color: "#4b5563" }}>{st.done}</div>
        </div>
        {st.inProgress > 0 && (
          <div className={css.statCard}>
            <div className={css.statLabel}>開發中</div>
            <div className={css.statValue} style={{ color: "#4b5563" }}>{st.inProgress}</div>
          </div>
        )}
        <div className={css.statCard}>
          <div className={css.statLabel}>總項目</div>
          <div className={css.statValue}>{st.total}</div>
        </div>
      </div>

      {st.total > 0 && (
        <div className={css.itemsGrid}>
          {branch.items.map((item) => {
            const cls =
              item.status === "done" ? css.chipDone
              : item.status === "in-progress" ? css.chipInProgress
              : css.chipPlanned;
            return (
              <span key={item.id} className={cls}>
                {item.status === "done" ? "v " : ""}{item.name}
              </span>
            );
          })}
        </div>
      )}

      {rec && (
        <div className={css.recBlock}>
          <span className={css.recLabel}>下一步建議:</span>
          {rec}
        </div>
      )}
    </div>
  );
}

export function MindMapView({ data }) {
  const [activeBranchId, setActiveBranchId] = useState(null);

  const { platforms, branches, connections } = data;
  const topPlats = platforms.filter((p) => p.id !== "bccs");
  const bottomPlat = platforms.find((p) => p.id === "bccs");

  const activeBranch = activeBranchId
    ? branches.find((b) => b.id === activeBranchId)
    : null;
  const activePlat = activeBranch
    ? platforms.find((p) => p.id === activeBranch.platformId)
    : null;

  const handleSelect = (id) => {
    setActiveBranchId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={css.page}>
      <div className={css.mapArea}>
        <div className={css.topRow}>
          {topPlats.map((plat) => (
            <PlatformBlock
              key={plat.id}
              plat={plat}
              branches={branches.filter((b) => b.platformId === plat.id)}
              activeBranchId={activeBranchId}
              onSelectBranch={handleSelect}
            />
          ))}
        </div>

        {connections.length > 0 && (
          <div className={css.connectorRow}>
            <svg width="400" height="48" viewBox="0 0 400 48">
              <defs>
                <marker id="arrowDown" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="#9ca3af" />
                </marker>
              </defs>
              <path d="M100,4 C100,30 200,30 200,44" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowDown)" />
              <path d="M300,4 C300,30 200,30 200,44" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4,3" />
              <text x="90" y="10" fontSize="9" fill="#9ca3af">{topPlats[0]?.name}</text>
              <text x="248" y="10" fontSize="9" fill="#9ca3af">{topPlats[1]?.name}</text>
            </svg>
          </div>
        )}

        {bottomPlat && (
          <PlatformBlock
            plat={bottomPlat}
            branches={branches.filter((b) => b.platformId === bottomPlat.id)}
            activeBranchId={activeBranchId}
            onSelectBranch={handleSelect}
          />
        )}

      </div>

      {activeBranch && activePlat ? (
        <DetailPanel
          branch={activeBranch}
          plat={activePlat}
          onClose={() => setActiveBranchId(null)}
        />
      ) : (
        <div className={css.emptyDetail}>
          點擊任一分支查看完成度、子項目與下一步建議
        </div>
      )}
    </div>
  );
}
