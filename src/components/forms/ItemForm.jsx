import { useState } from "react";
import { STATUS_CONFIG } from "../../data/constants";
import { Field } from "../Modal";
import styles from "../Modal.module.css";

export function ItemForm({ data, init, defBranchId, onSave, onCancel }) {
  const [branchId, setBranchId] = useState(
    defBranchId || data.branches[0]?.id || ""
  );
  const [form, setForm] = useState(
    init || { name: "", status: "planned" }
  );

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const branchOptions = data.platforms.flatMap((p) =>
    data.branches
      .filter((b) => b.platformId === p.id)
      .map((b) => ({
        id: b.id,
        label: `${p.name} > ${b.side === "left" ? "輸入" : "功能"} > ${b.label}`,
      }))
  );

  return (
    <>
      <Field label="項目名稱">
        <input
          className={styles.input}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="例如：Nessus"
        />
      </Field>
      {!init && (
        <Field label="所屬分支">
          <select
            className={styles.select}
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            {branchOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="狀態">
        <select
          className={styles.select}
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
        >
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </Field>
      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={onCancel}>
          取消
        </button>
        <button
          className={styles.btnPrimary}
          disabled={!form.name}
          onClick={() => form.name && onSave(branchId, form)}
        >
          儲存
        </button>
      </div>
    </>
  );
}
