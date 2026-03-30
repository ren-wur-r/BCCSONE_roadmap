import { useState } from "react";
import { STATUS_CONFIG } from "../../data/constants";
import { PlusIcon, PenIcon, TrashIcon, ChevronIcon, CheckIcon } from "../icons/Icons";
import { StatusBadge } from "../StatusBadge";
import css from "./ListView.module.css";

export function ListView({
  data,
  filterPlatform,
  filterStatus,
  search,
  onEditBranch,
  onDeleteBranch,
  onEditItem,
  onDeleteItem,
  onAddItem,
}) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (id) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));

  const filteredPlats =
    filterPlatform === "all"
      ? data.platforms
      : data.platforms.filter((p) => p.id === filterPlatform);

  const getFilteredItems = (branch) => {
    let items = branch.items;
    if (filterStatus !== "all") items = items.filter((i) => i.status === filterStatus);
    if (search)
      items = items.filter((i) => i.name.includes(search));
    return items;
  };

  return (
    <div className={css.container}>
      {filteredPlats.map((plat) => {
        const branches = data.branches.filter((b) => b.platformId === plat.id);
        const sides = ["left", "right"];

        return (
          <div key={plat.id} className={css.platformSection}>
            <div className={css.platformHeader}>
              <div
                className={css.platformDot}
                style={{ background: plat.color }}
              />
              <span className={css.platformName}>{plat.name}</span>
              {plat.owner && (
                <span className={css.statsText} style={{ background: "#F3F4F6", padding: "1px 8px", borderRadius: 8 }}>
                  {plat.owner}
                </span>
              )}
            </div>

            {sides.map((side) => {
              const sideBranches = branches.filter((b) => b.side === side);
              if (sideBranches.length === 0) return null;

              return (
                <div key={side} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9CA3AF",
                      padding: "4px 14px",
                      fontWeight: 600,
                    }}
                  >
                    {side === "left" ? "-- 輸入 / 工具來源 --" : "-- 平台功能 --"}
                  </div>
                  <div className={css.categoriesBox}>
                    {sideBranches.map((branch, bi) => {
                      const items = getFilteredItems(branch);
                      const isCollapsed = collapsed[branch.id];

                      return (
                        <div key={branch.id}>
                          <div
                            className={`${css.categoryRow} ${bi > 0 ? css.categoryRowBorder : ""}`}
                            onClick={() => toggle(branch.id)}
                          >
                            <ChevronIcon collapsed={isCollapsed} />
                            <span
                              className={css.categoryLabel}
                              style={{ color: plat.color }}
                            >
                              {branch.label}
                            </span>
                            {branch.shared && (
                              <span
                                style={{
                                  fontSize: 9,
                                  color: "#0891B2",
                                  fontWeight: 600,
                                  background: "#ECFEFF",
                                  padding: "0 4px",
                                  borderRadius: 4,
                                }}
                              >
                                共用
                              </span>
                            )}
                            {branch.highlight && (
                              <span
                                style={{
                                  fontSize: 9,
                                  color: "#D63031",
                                  fontWeight: 600,
                                }}
                              >
                                重點
                              </span>
                            )}
                            <span className={css.categoryCount}>
                              {items.filter((i) => i.status === "done").length}/
                              {items.length}
                            </span>
                            <button
                              className={css.iconBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddItem(branch.id);
                              }}
                            >
                              <PlusIcon />
                            </button>
                            <button
                              className={css.iconBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditBranch(branch);
                              }}
                            >
                              <PenIcon />
                            </button>
                            <button
                              className={css.iconBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("刪除分支？"))
                                  onDeleteBranch(branch.id);
                              }}
                            >
                              <TrashIcon />
                            </button>
                          </div>

                          {!isCollapsed &&
                            items.map((item) => {
                              const isDone = item.status === "done";
                              const st = STATUS_CONFIG[item.status];
                              return (
                                <div key={item.id} className={css.featureRow}>
                                  <div
                                    className={css.featureCheckbox}
                                    style={{
                                      border: isDone
                                        ? "none"
                                        : `1.5px solid ${st.ring}`,
                                      background: isDone ? "#16A34A" : "#fff",
                                    }}
                                  >
                                    {isDone && <CheckIcon />}
                                  </div>
                                  <span
                                    className={css.featureName}
                                    style={{
                                      color: isDone ? "#374151" : "#6B7280",
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                  <StatusBadge status={item.status} />
                                  <button
                                    className={css.iconBtn}
                                    onClick={() =>
                                      onEditItem(branch.id, item)
                                    }
                                  >
                                    <PenIcon />
                                  </button>
                                  <button
                                    className={css.iconBtn}
                                    onClick={() =>
                                      onDeleteItem(branch.id, item.id)
                                    }
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              );
                            })}

                          {!isCollapsed && items.length === 0 && (
                            <div className={css.emptyRow}>無子項目</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
