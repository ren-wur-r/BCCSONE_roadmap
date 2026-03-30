# 三大平台交叉分析報告

**Date:** 2026-03-30
**Status:** Complete

---

## 1. 各平台負責人與整體完成度

| 平台 | 負責人 | 前端完成度 | 後端完成度 | 整體完成度 | 技術棧 |
|------|--------|-----------|-----------|-----------|--------|
| 弱點管理大平台 | Dylan | 85% | 85% | 55-60% | Vue 3 + FastAPI + MSSQL |
| SOC 戰情中心 | Jsnn | 90% | 90% | 75-80% | React + Node.js/Python + PostgreSQL + SQL Server |
| 資安大師 BCCS One | Weiyao | 85-90% | 0% | 40-45% | React 19 + .NET Core(規劃中) + MSSQL(規劃中) |

---

## 2. 四大共用功能模組完成度比較

| 共用功能模組 | 弱點管理(Dylan) | SOC戰情(Jsnn) | BCCS One(Weiyao) | 備註 |
|-------------|----------------|---------------|------------------|------|
| 儀表板 | 80% (基礎版) | 85% (可拖曳Widget) | 90% (KPI卡片) | SOC有可拖曳Widget，可共用 |
| 工單案件管理 | 85% (派工系統) | 90% (Alert+Incident) | 95% (事件+弱點+派工) | BCCS One最完整，但僅前端 |
| 報告(合規+客製) | 85% (Acunetix報告) | 已完成 (Generative-Report-System) | 0% | SOC的報告系統可共用 |
| 風險評鑑計算 | 0% | 0% | 85% (PDCA+SoA+熱力圖) | BCCS One已完成，可輸出 |

---

## 3. 可共用模組分析 -- 避免重複開發

### 3.1 報告引擎 (Generative-Report-System) -- 最高優先共用

**現況**: Wiwi 已開發完成獨立報告系統 (React 18 + FastAPI + SQL Server)
**功能**: 合規模版管理、拖曳式編輯器、動態資料綁定、PDF匯出、排程產出、AI結論
**建議**: 弱點管理平台與BCCS One直接對接此系統，不需各自開發

| 對接平台 | 需要做的事 | 工作量評估 |
|---------|-----------|-----------|
| 弱點管理(Dylan) | 建立弱點DB到報告系統的資料連線 + 設計弱點報告模版 | 中 |
| BCCS One(Weiyao) | 建立ISMS DB到報告系統的資料連線 + 設計稽核/風險報告模版 | 中 |

### 3.2 風險評鑑計算引擎 -- BCCS One可輸出

**現況**: Weiyao 團隊已完成 ISO 27001 風險評鑑流程
**功能**: PDCA 4步驟、威脅/弱點矩陣、風險公式管理、風險熱力圖、SoA適用性聲明
**建議**: 將風險計算核心抽出為共用服務

| 對接平台 | 需要做的事 | 工作量評估 |
|---------|-----------|-----------|
| 弱點管理(Dylan) | 弱點嚴重度 -> 風險評分對應、技術風險量化 | 中 |
| SOC戰情(Jsnn) | 安全事件 -> 風險評分對應、事件頻率/影響分析 | 中 |

### 3.3 工單案件管理 -- 架構相似可共用引擎

**現況**: 三個平台各自有工單系統，但概念一致
- Dylan: 派工系統 (pending -> in_progress -> pending_verify -> closed)
- Jsnn: Alert + Incident (含IR審核流程)
- Weiyao: 事件+弱點管理 (5步驟批次匯入、派工中心、SLA追蹤)

**建議**: 制定統一工單API規格，後端可共用核心邏輯，前端各自適配

### 3.4 人員組織/RBAC -- 三平台皆已完成

**現況**: 三個平台各自有RBAC系統
- Dylan: admin/user 雙角色
- Jsnn: Portal/Organization 雙層角色、MFA
- Weiyao: 7角色 x 40+權限碼

**建議**: 若三平台要整合，需建立統一的SSO認證服務

### 3.5 儀表板Widget引擎 -- SOC可共用

**現況**: Jsnn團隊的SOC已有可拖曳Widget布局
**建議**: 抽出Widget引擎為共用元件庫，各平台自訂資料來源

---

## 4. 弱點管理 + SOC 連接到 BCCS One 風險評鑑的整合需求

### 4.1 需要先建置的共用資料表/資料庫

要讓三個平台的資料能匯入BCCS One做ISO 27001風險評鑑，需要以下共用資料結構：

#### (A) 統一資產清冊 (Asset Registry)

```
shared_assets
  - asset_id (PK)
  - asset_name
  - asset_type (hardware/software/service/data/personnel)
  - asset_owner
  - department_id
  - cia_confidentiality (1-3)
  - cia_integrity (1-3)
  - cia_availability (1-3)
  - asset_value (calculated)
  - ip_address / hostname / url (關聯掃描目標)
  - organization_id (多租戶)
  - created_at / updated_at
```

**為什麼**: BCCS One的風險評鑑以「資產」為核心，弱點管理的掃描目標、SOC的監控端點都需要對應到統一資產清冊。

#### (B) 統一弱點/威脅對應表 (Vulnerability-Threat Mapping)

```
shared_vuln_threat_mapping
  - mapping_id (PK)
  - asset_id (FK -> shared_assets)
  - source_platform (vulnscan/soc/manual)
  - source_record_id (各平台的原始記錄ID)
  - threat_category (ISO 27005 威脅分類)
  - vulnerability_category (技術弱點/管理弱點/實體弱點)
  - severity (critical/high/medium/low/info)
  - cvss_score
  - likelihood (1-5, 可能性)
  - impact (1-5, 影響)
  - risk_score (calculated: likelihood x impact)
  - annex_a_control_id (對應ISO 27001 Annex A控制措施)
  - status (open/mitigating/resolved/accepted)
  - organization_id
  - synced_at
```

**為什麼**: 弱點管理發現的技術弱點 + SOC偵測到的安全事件，都需要轉換為BCCS One能理解的「威脅/弱點」格式，才能進入風險評鑑矩陣。

#### (C) 安全事件摘要表 (Security Event Summary)

```
shared_security_events
  - event_id (PK)
  - asset_id (FK -> shared_assets)
  - source_platform (soc)
  - source_alert_id / source_incident_id
  - event_type (malware/intrusion/data_leak/dos/unauthorized_access)
  - severity (critical/high/medium/low)
  - detected_at
  - resolved_at
  - threat_category (ISO 27005)
  - annex_a_control_id (對應控制措施)
  - organization_id
  - synced_at
```

**為什麼**: SOC的Alert/Incident需要彙整為BCCS One能匯入的安全事件格式。

#### (D) 整合同步設定表 (Integration Config)

```
shared_integration_config
  - config_id (PK)
  - source_platform (vulnscan/soc)
  - target_platform (bccs_one)
  - sync_type (manual/scheduled/realtime)
  - sync_interval_minutes
  - last_sync_at
  - field_mapping_json (欄位對應設定)
  - organization_id
  - is_active
```

### 4.2 整合資料流架構

```
弱點管理大平台 (Dylan)                    SOC 戰情中心 (Jsnn)
  MSSQL                                    PostgreSQL + SQL Server
  - Vulnerabilities                        - Alerts
  - Scans                                  - Incidents
  - Projects                               - AdvMDR Endpoints
       |                                        |
       | 同步弱點資料                            | 同步安全事件
       v                                        v
  ┌─────────────────────────────────────────────────┐
  │           共用整合資料庫 (Integration DB)         │
  │                                                  │
  │  shared_assets          (統一資產清冊)            │
  │  shared_vuln_threat_mapping (弱點威脅對應)        │
  │  shared_security_events (安全事件摘要)            │
  │  shared_integration_config (同步設定)             │
  │                                                  │
  └──────────────────────┬──────────────────────────┘
                         |
                         | 匯入風險評鑑
                         v
              資安大師 BCCS One (Weiyao)
              .NET Core + MSSQL
              - 風險評鑑 (PDCA)
              - 威脅/弱點矩陣 (自動填入)
              - SoA 適用性聲明 (自動建議)
              - 風險熱力圖 (彙整三平台資料)
```

### 4.3 整合步驟建議 (優先順序)

| 順序 | 步驟 | 負責人 | 前置條件 | 工作量 |
|------|------|--------|---------|--------|
| 1 | 建立共用整合資料庫 Schema | 共同決議 | 無 | 小 |
| 2 | 統一資產清冊 API | Weiyao (BCCS One已有資產管理) | Step 1 | 中 |
| 3 | 弱點管理 -> 整合DB 同步服務 | Dylan | Step 1, 2 | 中 |
| 4 | SOC -> 整合DB 同步服務 | Jsnn | Step 1, 2 | 中 |
| 5 | BCCS One 匯入整合DB -> 風險評鑑 | Weiyao | Step 3, 4 | 大 |
| 6 | 報告系統對接 (三平台共用) | Wiwi (已有報告系統) | Step 5 | 中 |

---

## 5. 各平台最迫切的開發項目

### 弱點管理大平台 (Dylan)
1. 技服作業系統 (OWASP分類/弱點驗證/修復建議) -- DB已就緒，需前端UI
2. 使用者管理介面
3. Nessus/WebInspect 串接 (DB架構為通用設計，但需新建各工具的 API Client + 連線邏輯)
4. 測試循環 (初測/複測)

### SOC 戰情中心 (Jsnn)
1. 風險評鑑計算 (目前0%)
2. CTI情資匯入 (ThreatVision/Open CTI)
3. mSIEM直接對接 (脫離Swimlane依賴)
4. 報告Excel/Word匯出

### 資安大師 BCCS One (Weiyao)
1. 後端API + 資料庫建置 (最大瓶頸，前端已完成90%)
2. 報告模組對接 Generative-Report-System
3. 弱點管理平台整合 (資產清冊 + 風險評鑑)
4. 通知系統完善

---

## 6. 共用模組建議總結

| 共用模組 | 目前最完整的平台 | 建議提供方 | 使用方 |
|---------|---------------|-----------|--------|
| 報告引擎 | Generative-Report-System | Wiwi | Dylan, Jsnn, Weiyao |
| 風險評鑑引擎 | BCCS One (PDCA+SoA+熱力圖) | Weiyao | Dylan, Jsnn |
| 工單核心引擎 | BCCS One (最完整前端) / SOC (最完整後端) | 共同制定規格 | 三方 |
| 儀表板Widget | SOC (可拖曳Widget) | Jsnn | Dylan, Weiyao |
| 認證/SSO | SOC (含MFA) | Jsnn | 三方(未來) |
| 資產清冊 | BCCS One (資產管理+CIA+盤點) | Weiyao | Dylan, Jsnn |
