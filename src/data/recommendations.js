export const BRANCH_RECOMMENDATIONS = {
  "b-vuln-left-1": "完成 Webinspect 後，建議 Nessus 與 ZAP(Open) 並行串接。ZAP 有完整 REST API + JSON/XML/HTML 輸出，可快速對接現有流程；Nessus 為網路弱掃必備。兩者皆需新建 API Client + 連線邏輯 (DB 架構為通用設計，ToolType 欄位可存任意工具)。AppScan Std. 視客戶需求排後。",
  "b-vuln-left-2": "需先確認客戶需求再決定優先順序。Fortify 與 Checkmarx 為企業級首選，SonaQube(Open) 可作為入門方案。",
  "b-vuln-left-3": "需定義黑箱/白箱報告的標準匯入格式 (JSON/XML)，建立 Parser 解析引擎。",
  "b-vuln-left-4": "需建立統一資產清冊，作為三平台整合的基礎。建議對接 BCCS One 已完成的資產管理模組。",
  "b-vuln-right-3": "對接 Wiwi 已完成的 Generative-Report-System，不需自建報告引擎。需建立弱點 DB 到報告系統的資料連線。",
  "b-vuln-right-4": "弱點管理目前無風險評分模型。建議對接 BCCS One 的風險評鑑引擎，將弱點嚴重度轉換為風險評分。",
  "b-vuln-right-5": "DB 欄位已就緒，僅需開發前端 UI。是掃描流程的核心下游功能，為最優先項目。",

  "b-soc-left-1": "目前僅透過 Swimlane webhook 間接整合。建議優先直接對接 SPLUNK (市佔最高)，再擴展其他 SIEM。",
  "b-soc-left-2": "TeamT5 Threatsonar 已完成。評估 PA XDR 的 API 可用性，Wazuh EDR(Open) 可作為開源方案。",
  "b-soc-left-3": "CTI 情資匯入可提升威脅偵測深度。建議優先整合 ThreatVision (台灣在地情資)。",
  "b-soc-right-3": "報告系統已完成度最高。補充 Excel/Word 匯出格式，擴大報告適用場景。",
  "b-soc-right-4": "SOC 目前無風險評分模型。建議對接 BCCS One 的風險評鑑引擎，將安全事件頻率/影響轉換為風險評分。",

  "b-bccs-left-1": "已完成。可作為三平台統一資產清冊的基礎，輸出為共用 API 服務。",
  "b-bccs-left-2": "核心已完成。建立弱點管理平台與 SOC 的資料匯入通道，自動填入威脅/弱點矩陣。",
  "b-bccs-right-3": "直接對接 Wiwi 的 Generative-Report-System，設計稽核/風險評估報告模版。",
  "b-bccs-right-4": "風險計算核心已完成。建立整合 DB (統一資產清冊 + 弱點/威脅對應表 + 安全事件摘要表)，接收另兩平台的資料。",
  "b-bccs-right-5": "前端已完成 90%，後端 API + 資料庫為上線最大阻礙。建議先建立 MSSQL Schema，再逐步實作 .NET Core API。",
};

export const SHARED_MODULES = [
  {
    name: "報告引擎",
    provider: "Wiwi - Generative-Report-System (獨立系統)",
    consumers: ["弱點管理大平台 (Dylan)", "資安大師 BCCS One (Weiyao)"],
    desc: "合規模版管理、拖曳式編輯器、動態資料綁定、PDF匯出、排程產出、AI結論。各平台需建立資料連線 + 設計專屬報告模版。",
    color: "#00B894",
  },
  {
    name: "風險評鑑引擎",
    provider: "資安大師 BCCS One (Weiyao) - PDCA + SoA + 熱力圖",
    consumers: ["弱點管理大平台 (Dylan)", "SOC 戰情中心 (Jsnn)"],
    desc: "ISO 27001 風險評鑑流程、威脅/弱點矩陣、風險公式管理。其他平台需將弱點/事件轉換為風險評分格式。",
    color: "#D63031",
  },
  {
    name: "資產清冊",
    provider: "資安大師 BCCS One (Weiyao) - 資產管理 + CIA + 盤點",
    consumers: ["弱點管理大平台 (Dylan)", "SOC 戰情中心 (Jsnn)"],
    desc: "統一資產登記、CIA分級、QR/Barcode盤點。掃描目標與監控端點需對應到統一資產。",
    color: "#7C3AED",
  },
  {
    name: "儀表板 Widget 引擎",
    provider: "SOC 戰情中心 (Jsnn) - 可拖曳 Widget 布局",
    consumers: ["弱點管理大平台 (Dylan)", "資安大師 BCCS One (Weiyao)"],
    desc: "可配置的 Widget 系統、拖曳布局、資料來源抽象。各平台自訂資料來源即可。",
    color: "#E17055",
  },
];

export const INTEGRATION_STEPS = [
  { num: 1, title: "建立共用整合資料庫 Schema", owner: "共同決議", desc: "定義統一資產清冊、弱點/威脅對應表、安全事件摘要表的欄位規格" },
  { num: 2, title: "統一資產清冊 API", owner: "Weiyao", desc: "基於 BCCS One 已完成的資產管理模組，輸出共用 REST API" },
  { num: 3, title: "弱點管理 -> 整合DB 同步服務", owner: "Dylan", desc: "將掃描弱點自動同步至整合 DB，對應 ISO 27005 威脅分類" },
  { num: 4, title: "SOC -> 整合DB 同步服務", owner: "Jsnn", desc: "將 Alert/Incident 彙整為安全事件摘要，同步至整合 DB" },
  { num: 5, title: "BCCS One 匯入整合DB -> 風險評鑑", owner: "Weiyao", desc: "自動將整合 DB 資料填入威脅/弱點矩陣，產出風險熱力圖" },
  { num: 6, title: "報告系統對接 (三平台共用)", owner: "Wiwi", desc: "讓 Generative-Report-System 同時讀取三平台資料，產出彙整報告" },
];
