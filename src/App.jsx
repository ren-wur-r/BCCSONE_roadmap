import { useState } from "react";
import { useRoadmapData } from "./hooks/useRoadmapData";
import { Header } from "./components/Header";
import { MindMapView } from "./components/views/MindMapView";
import { BlueprintView } from "./components/views/BlueprintView";
import { Modal } from "./components/Modal";
import { PlatformForm } from "./components/forms/PlatformForm";
import { BranchForm } from "./components/forms/BranchForm";
import { ItemForm } from "./components/forms/ItemForm";
import { ConnectionForm } from "./components/forms/ConnectionForm";
import css from "./App.module.css";

export default function App() {
  const {
    data,
    savePlatform,
    saveBranch,
    saveItem,
    saveConnection,
  } = useRoadmapData();

  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editBranchId, setEditBranchId] = useState(null);
  const [tab, setTab] = useState("map");

  const openModal = (type, item, branchId) => {
    setEditItem(item || null);
    setEditBranchId(branchId || null);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setEditItem(null);
    setEditBranchId(null);
  };

  if (!data) return <div className={css.loading}>載入中...</div>;

  return (
    <div className={css.app}>
      <Header data={data} tab={tab} setTab={setTab} />

      {tab === "map" && <MindMapView data={data} />}
      {tab === "blueprint" && <BlueprintView data={data} />}

      <Modal
        open={modal === "platform"}
        onClose={closeModal}
        title={editItem ? "編輯平台" : "新增平台"}
      >
        <PlatformForm
          init={editItem}
          onSave={(p) => { savePlatform(p, !!editItem); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        open={modal === "branch"}
        onClose={closeModal}
        title={editItem ? "編輯分支" : "新增分支"}
      >
        <BranchForm
          data={data}
          init={editItem}
          onSave={(b) => { saveBranch(b, !!editItem); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        open={modal === "item"}
        onClose={closeModal}
        title={editItem ? "編輯項目" : "新增項目"}
      >
        <ItemForm
          data={data}
          init={editItem}
          defBranchId={editBranchId}
          onSave={(branchId, item) => { saveItem(branchId, item, !!editItem); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        open={modal === "connection"}
        onClose={closeModal}
        title={editItem ? "編輯連線" : "新增連線"}
      >
        <ConnectionForm
          data={data}
          init={editItem}
          onSave={(c) => { saveConnection(c, !!editItem); closeModal(); }}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
