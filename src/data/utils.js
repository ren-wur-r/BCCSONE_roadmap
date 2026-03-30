export function uid() {
  return "id_" + Math.random().toString(36).slice(2, 10);
}

export function getAllItems(data) {
  const items = [];
  data.branches.forEach((b) => {
    b.items.forEach((item) => {
      items.push({ ...item, branchId: b.id, branchLabel: b.label, platformId: b.platformId });
    });
  });
  return items;
}

export function getItemStats(data) {
  const all = getAllItems(data);
  const total = all.length;
  const done = all.filter((i) => i.status === "done").length;
  const inProgress = all.filter((i) => i.status === "in-progress").length;
  const planned = total - done - inProgress;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return { total, done, inProgress, planned, percent };
}
