import { useState, useEffect, useCallback } from "react";
import { INITIAL_DATA } from "../data/initialData";
import { STORAGE_KEY } from "../data/constants";
import { uid } from "../data/utils";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.branches) return parsed;
    }
  } catch {
    /* ignore */
  }
  return INITIAL_DATA;
}

export function useRoadmapData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  const save = useCallback((next) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const savePlatform = useCallback(
    (p, isEdit) => {
      if (!data) return;
      const next = { ...data };
      if (isEdit) {
        next.platforms = next.platforms.map((x) => (x.id === p.id ? p : x));
      } else {
        next.platforms = [...next.platforms, { ...p, id: uid() }];
      }
      save(next);
    },
    [data, save]
  );

  const deletePlatform = useCallback(
    (id) => {
      if (!data) return;
      save({
        ...data,
        platforms: data.platforms.filter((x) => x.id !== id),
        branches: data.branches.filter((x) => x.platformId !== id),
        connections: data.connections.filter(
          (x) => x.from !== id && x.to !== id
        ),
      });
    },
    [data, save]
  );

  const saveBranch = useCallback(
    (b, isEdit) => {
      if (!data) return;
      const next = { ...data };
      if (isEdit) {
        next.branches = next.branches.map((x) => (x.id === b.id ? b : x));
      } else {
        next.branches = [...next.branches, { ...b, id: uid(), items: [] }];
      }
      save(next);
    },
    [data, save]
  );

  const deleteBranch = useCallback(
    (id) => {
      if (!data) return;
      save({
        ...data,
        branches: data.branches.filter((x) => x.id !== id),
      });
    },
    [data, save]
  );

  const saveItem = useCallback(
    (branchId, item, isEdit) => {
      if (!data) return;
      const next = { ...data };
      next.branches = next.branches.map((b) => {
        if (b.id !== branchId) return b;
        if (isEdit) {
          return {
            ...b,
            items: b.items.map((x) => (x.id === item.id ? item : x)),
          };
        }
        return {
          ...b,
          items: [...b.items, { ...item, id: uid() }],
        };
      });
      save(next);
    },
    [data, save]
  );

  const deleteItem = useCallback(
    (branchId, itemId) => {
      if (!data) return;
      const next = { ...data };
      next.branches = next.branches.map((b) => {
        if (b.id !== branchId) return b;
        return { ...b, items: b.items.filter((x) => x.id !== itemId) };
      });
      save(next);
    },
    [data, save]
  );

  const saveConnection = useCallback(
    (c, isEdit) => {
      if (!data) return;
      const next = { ...data };
      if (isEdit) {
        next.connections = next.connections.map((x) =>
          x.id === c.id ? c : x
        );
      } else {
        next.connections = [...next.connections, { ...c, id: uid() }];
      }
      save(next);
    },
    [data, save]
  );

  const deleteConnection = useCallback(
    (id) => {
      if (!data) return;
      save({
        ...data,
        connections: data.connections.filter((x) => x.id !== id),
      });
    },
    [data, save]
  );

  return {
    data,
    savePlatform,
    deletePlatform,
    saveBranch,
    deleteBranch,
    saveItem,
    deleteItem,
    saveConnection,
    deleteConnection,
  };
}
