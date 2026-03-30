import { useState } from "react";
import { Field } from "../Modal";
import styles from "../Modal.module.css";

export function ConnectionForm({ data, init, onSave, onCancel }) {
  const [form, setForm] = useState(
    init || {
      from: data.platforms[0]?.id || "",
      to: data.platforms[1]?.id || "",
      label: "",
    }
  );

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <>
      <Field label="來源平台">
        <select
          className={styles.select}
          value={form.from}
          onChange={(e) => set("from", e.target.value)}
        >
          {data.platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="目標平台">
        <select
          className={styles.select}
          value={form.to}
          onChange={(e) => set("to", e.target.value)}
        >
          {data.platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="連線說明">
        <input
          className={styles.input}
          value={form.label}
          onChange={(e) => set("label", e.target.value)}
          placeholder="例如：弱點資料匯入"
        />
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
