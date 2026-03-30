import { getItemStats } from "../data/utils";
import { LogoIcon } from "./icons/Icons";
import { ProgressBar } from "./ProgressBar";
import css from "./Header.module.css";

export function Header({ data, tab, setTab }) {
  const stats = getItemStats(data);

  const statItems = [
    { label: "已完成", value: stats.done, color: "#16A34A" },
    { label: "開發中", value: stats.inProgress, color: "#D97706" },
    { label: "規劃中", value: stats.planned, color: "#9CA3AF" },
  ];

  return (
    <div className={css.header}>
      <div className={css.topRow}>
        <div className={css.logo}>
          <LogoIcon />
        </div>
        <div className={css.title}>資安平台產品藍圖</div>

        <div className={css.statsGroup}>
          {statItems.map((s) => (
            <div key={s.label} className={css.statItem}>
              <span className={css.statValue} style={{ color: s.color }}>
                {s.value}
              </span>
              <span className={css.statLabel}>{s.label}</span>
            </div>
          ))}
          <ProgressBar value={stats.done} max={stats.total} color="#16A34A" />
          <span className={css.pctText}>{stats.percent}%</span>
        </div>

        <div className={css.tabGroup}>
          <button
            className={`${css.tab} ${tab === "map" ? css.tabActive : css.tabInactive}`}
            onClick={() => setTab("map")}
          >
            心智圖
          </button>
          <button
            className={`${css.tab} ${tab === "blueprint" ? css.tabActive : css.tabInactive}`}
            onClick={() => setTab("blueprint")}
          >
            總覽
          </button>
        </div>
      </div>
    </div>
  );
}
