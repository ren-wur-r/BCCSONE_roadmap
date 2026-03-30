import { useState } from "react";
import { BRANCH_COLORS } from "../../data/constants";
import { Field } from "../Modal";
import styles from "../Modal.module.css";

export function BranchForm({ data, init, onSave, onCancel }) {
  const [form, setForm] = useState(
    init || {
      label: "",
      platformId: data.platforms[0]?.id || "",
      side: "right",
      color: BRANCH_COLORS[0],
      highlight: false,
    }
  );

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <>
      <Field label="分支名稱">
        <input
          className={styles.input}
          value={form.label}
          onChange={(e) => set("label", e.target.value)}
          placeholder="例如：弱掃工具"
        />
      </Field>
      <Field label="所屬平台">
        <select
          className={styles.select}
          value={form.platformId}
          onChange={(e) => set("platformId", e.target.value)}
        >
          {data.platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="位置">
        <select
          className={styles.select}
          value={form.side}
          onChange={(e) => set("side", e.target.value)}
        >
          <option value="left">左側 (輸入/工具來源)</option>
          <option value="right">右側 (平台功能)</option>
        </select>
      </Field>
      <Field label="顏色">
        <div style={{ display: "flex", gap: 6 }}>
          {BRANCH_COLORS.map((c) => (
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
      <Field label="重點標記">
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.highlight || false}
            onChange={(e) => set("highlight", e.target.checked)}
          />
          以紅色標示為重點項目
        </label>
      </Field>
      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={onCancel}>
          取消
        </button>
        <button
          className={styles.btnPrimary}
          disabled={!form.label}
          onClick={() => form.label && onSave(form)}
        >
          儲存
        </button>
      </div>
    </>
  );
}
