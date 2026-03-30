import { useState } from "react";
const PLATFORM_COLORS = [
  "#2563EB", "#0891B2", "#7C3AED", "#DC2626",
  "#EA580C", "#16A34A", "#DB2777", "#4F46E5",
];
import { Field } from "../Modal";
import styles from "../Modal.module.css";

export function PlatformForm({ init, onSave, onCancel }) {
  const [form, setForm] = useState(
    init || { name: "", owner: "", color: "#2563EB" }
  );

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <>
      <Field label="平台名稱">
        <input
          className={styles.input}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="例如：弱點管理大平台"
        />
      </Field>
      <Field label="負責人">
        <input
          className={styles.input}
          value={form.owner}
          onChange={(e) => set("owner", e.target.value)}
          placeholder="選填"
        />
      </Field>
      <Field label="代表色">
        <div style={{ display: "flex", gap: 6 }}>
          {PLATFORM_COLORS.map((c) => (
            <div
              key={c}
              onClick={() => set("color", c)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 5,
                background: c,
                cursor: "pointer",
                border:
                  form.color === c
                    ? "2.5px solid #111"
                    : "2.5px solid transparent",
              }}
            />
          ))}
        </div>
      </Field>
      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={onCancel}>
          取消
        </button>
        <button
          className={styles.btnPrimary}
          disabled={!form.name}
          onClick={() => form.name && onSave(form)}
        >
          儲存
        </button>
      </div>
    </>
  );
}
