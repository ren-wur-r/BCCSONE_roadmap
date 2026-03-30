import { STATUS_CONFIG } from "../data/constants";
import css from "./Legend.module.css";

export function Legend({ data }) {
  return (
    <div className={css.bar}>
      <span className={css.label}>圖例：</span>
      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
        <span
          key={k}
          className={css.statusTag}
          style={{ background: v.bg, color: v.color }}
        >
          {v.label}
        </span>
      ))}
      <span className={css.separator}>|</span>
      {data.connections.map((c) => {
        const from = data.platforms.find((p) => p.id === c.from);
        const to = data.platforms.find((p) => p.id === c.to);
        return (
          <span key={c.id} className={css.connectionLabel}>
            {from?.name} <span className={css.arrow}>&rarr;</span> {to?.name}
          </span>
        );
      })}
      <span className={css.separator}>|</span>
      <span className={css.connectionLabel} style={{ color: "#D63031" }}>
        紅字 = 待規劃重點功能
      </span>
    </div>
  );
}
