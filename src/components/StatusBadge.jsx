import { STATUS_CONFIG } from "../data/constants";
import styles from "./StatusBadge.module.css";

export function StatusBadge({ status }) {
  const st = STATUS_CONFIG[status];
  if (!st) return null;
  return (
    <span
      className={styles.badge}
      style={{ background: st.bg, color: st.color }}
    >
      {st.label}
    </span>
  );
}
