---
title: "Tóm tắt ôn thi AB-100 – Agentic AI Business Solutions Architect"
subject: "frontier-transformation-engineer"
type: lecture
lecture_no: 6
status: reading
source: web
tags: [ab-100, agentic-ai, copilot-studio, microsoft-foundry, dynamics-365, power-platform, certification, exam-review, cheat-sheet]
date: 2026-09-03
---

# Tóm tắt ôn thi AB-100 – Agentic AI Business Solutions Architect

> Bản tóm tắt trọng tâm để thi thử chứng chỉ **Microsoft Certified: Agentic AI Business Solutions Architect (Expert)** — mã đề **AB-100**. Đề nghiêng về **kiến trúc giải pháp**: chọn nền tảng, chọn loại agent, orchestration, grounding, ALM, governance, ROI — không phải viết code SDK. So sánh với [Tóm tắt ôn thi AI-102 / AI-103](ai-103-exam-review.md): AI-103 là "engineer" (build), AB-100 là "architect" (design + quyết định + vận hành vòng đời). Chi tiết agent trên Foundry: xem [Build AI agents với Azure AI Foundry](build-ai-agents-foundry.md).

## Thông tin đề thi

- **Cấp độ**: Expert. **Điểm đậu**: 700/1000.
- **Điều kiện tiên quyết**: đang giữ **ít nhất 1 chứng chỉ Associate** trong danh sách 11 cert về "AI business solutions" (ví dụ AI-102/AI-103, PL-200, MB-230, MB-240, MB-280, MB-310, MB-330, MB-820, PL-600…) **và** thi đậu AB-100.
- **Skills measured** cập nhật 22/07/2026. Đa số câu hỏi về tính năng **GA**; tính năng Preview chỉ hỏi nếu phổ biến.
- Nền công nghệ: **Microsoft Foundry** (tên mới của Azure AI Foundry) + **Foundry Tools** + **Foundry Models**, **Microsoft Copilot Studio**, **Microsoft 365 Copilot**, **Dynamics 365**, **Microsoft Power Platform**, chuẩn mở **A2A** và **MCP**.

## Trọng số 3 nhóm kỹ năng

| # | Domain | Trọng số |
|---|---|---|
| 1 | Plan AI-powered business solutions | 25–30% |
| 2 | Design AI-powered business solutions | 25–30% |
| 3 | Deploy AI-powered business solutions | 40–45% |

> Ghi nhớ: **Deploy nặng nhất** (~40–45%) — gồm monitoring/tuning, testing, **ALM**, và **responsible AI / security / governance / risk / compliance**.

---

## Bối cảnh nền tảng (đọc trước khi vào từng domain)

### Các loại agent (phải phân biệt được)

| Loại | Đặc điểm | Khi nào chọn |
|---|---|---|
| **Prompt and response agent** | 1 lượt: nhận input → gọi model → trả kết quả, không giữ trạng thái, không hành động ngoài | Tóm tắt, phân loại, trích xuất, sinh nội dung theo mẫu |
| **Task agent** | Thực hiện chuỗi bước có cấu trúc / quy trình xác định, có thể gọi tool, thường có người kích hoạt | Tự động hoá một quy trình nghiệp vụ rõ ràng (tạo đơn, xử lý ticket) |
| **Autonomous agent** | Tự lập kế hoạch, chạy nền theo trigger (event/lịch), lặp cho tới khi đạt mục tiêu, ít human-in-the-loop | Giám sát tồn kho, xử lý hàng đợi, phản ứng sự kiện 24/7 |

### Chọn nền tảng xây agent

| Nền tảng | Dùng khi |
|---|---|
| **Microsoft 365 Copilot (extend)** | Người dùng đã ở trong Microsoft 365, cần thêm kiến thức/skill vào trải nghiệm Copilot sẵn có; ít tuỳ biến luồng |
| **Copilot Studio (custom agent)** | Cần agent riêng có topic/flow/tool tuỳ biến, kênh riêng (web, Teams, Contact Center), low-code, business maker sở hữu |
| **Microsoft Foundry (Agents service)** | Cần pro-code, orchestration đa agent phức tạp, custom model, kiểm soát hạ tầng/mạng/eval sâu |
| **Prebuilt agents (Dynamics 365 / M365)** | Đã có agent dựng sẵn (Sales, Service, Finance, Supply Chain) đáp ứng nhu cầu → cấu hình thay vì build |

Nguyên tắc: **Configure prebuilt → Extend M365 Copilot → Build trong Copilot Studio → Build pro-code trong Foundry**, theo thứ tự tăng dần công sức và tuỳ biến.

### Orchestration trong Copilot Studio — 3 lựa chọn

- **Standard / classic (NLU trigger phrases)**: khớp câu người dùng với **trigger phrases** của từng topic. Đơn giản, xác định, dễ kiểm soát; kém linh hoạt.
- **Conversational language understanding (CLU)**: model intent/entity huấn luyện riêng → định tuyến topic. Dùng khi cần hiểu ý định đa dạng nhưng vẫn muốn kiểm soát tập intent.
- **Generative AI orchestration**: model tự chọn & ghép nhiều **topic / action / knowledge / agent** để trả lời một yêu cầu phức tạp. Linh hoạt nhất; dùng khi yêu cầu người dùng mở và cần phối hợp nhiều nguồn.

### Grounding & knowledge

- Nguồn grounding trong Copilot Studio: **SharePoint / OneDrive, Dataverse, public website, Azure AI Search, tài liệu upload, connector (Graph connectors), enterprise data**.
- Kiểm tra dữ liệu grounding: **accuracy, relevance, timeliness, cleanliness, availability** (5 tiêu chí trong outline). Dữ liệu bẩn/cũ → hallucination & sai lệch.
- **Tổ chức dữ liệu business solution để các hệ AI khác dùng lại được** (chuẩn hoá, gắn nhãn, cấp quyền, expose qua Dataverse / search index).

### Chuẩn mở

- **MCP (Model Context Protocol)**: chuẩn để agent kết nối tới **tool/knowledge server** bên ngoài; trong Copilot Studio có thể thêm **MCP server** làm nguồn action/knowledge. Dùng khi cần tái sử dụng một tập tool đã chuẩn hoá cho nhiều agent/nền tảng.
- **A2A (Agent2Agent)**: chuẩn để **các agent giao tiếp với nhau** xuyên nền tảng / xuyên nhà cung cấp. Dùng khi multi-agent mà các agent thuộc hệ khác nhau.
- **Computer Use** (Copilot Studio): agent thao tác trên **UI app/website không có API** (click, gõ, điều hướng). Dùng khi hệ thống cũ không có connector/API.

---

## 1. Plan AI-powered business solutions (25–30%)

### Phân tích yêu cầu

- Đánh giá **agent có phù hợp không** cho: task automation, data analytics, decision-making. Không phải bài toán nào cũng cần agent — quy tắc cứng, khối lượng nhỏ, cần chính xác tuyệt đối thì dùng automation truyền thống / BI.
- Rà soát dữ liệu grounding theo 5 tiêu chí (accuracy, relevance, timeliness, cleanliness, availability).
- Tổ chức dữ liệu để **AI system khác** cũng dùng được (không silo).

### Thiết kế chiến lược AI tổng thể

- Áp dụng **AI adoption process** trong **Cloud Adoption Framework (CAF) for Azure**: Strategy → Plan → Ready → Adopt (Innovate/Migrate) → Govern → Manage; kèm **AI workloads** guidance.
- **Microsoft AI Center of Excellence (CoE)**: nhóm chuẩn hoá — governance, prompt library, reusable components, guardrails, training, đánh giá nhà cung cấp, chia sẻ best practice.
- **Prompt library**: kho prompt chuẩn hoá, versioned, có mô tả use case + tham số; hướng dẫn prompt engineering dùng chung.
- **Custom AI model** — chỉ tạo khi: prebuilt/generative không đạt độ chính xác domain, cần chạy offline/edge, dữ liệu nhạy cảm không rời tổ chức, cần schema đầu ra cố định.
- **Small language model (SLM) tuỳ biến**: dùng khi cần chi phí thấp, latency thấp, on-device/edge, tác vụ hẹp lặp lại nhiều; đánh đổi khả năng suy luận rộng.
- Giải pháp dùng **nhiều app Dynamics 365** cùng lúc → thiết kế luồng dữ liệu & agent xuyên app.
- Quyết định **build custom agent vs extend M365 Copilot** (xem bảng nền tảng ở trên).

### Đánh giá chi phí – lợi ích (ROI)

- **ROI criteria** gồm **TCO (total cost of ownership)**: license, token/PTU, hạ tầng, tích hợp, vận hành, giám sát, đào tạo, quản trị.
- Lập **ROI analysis** cho một quy trình nghiệp vụ: baseline (thời gian/chi phí hiện tại) → giá trị kỳ vọng (giảm giờ công, tăng chuyển đổi, giảm lỗi) → chi phí triển khai → payback period.
- **Build vs Buy vs Extend**: buy/extend (prebuilt, M365 Copilot) khi nhu cầu phổ biến & cần nhanh; build khi là lợi thế cạnh tranh / khác biệt / yêu cầu đặc thù.
- **Model router**: định tuyến request tới **model phù hợp nhất** (rẻ/nhanh cho câu dễ, mạnh cho câu khó) → tối ưu chi phí & chất lượng đồng thời.

---

## 2. Design AI-powered business solutions (25–30%)

### Thiết kế AI & agent cho business solution

- **Copilot trong Dynamics 365** (Customer Experience & Service):
  - **Business terms / glossary**: định nghĩa thuật ngữ doanh nghiệp để Copilot hiểu đúng ngữ cảnh.
  - **Customizations**: prompt tuỳ biến, knowledge sources, hành vi theo vai trò.
  - **Connectors cho Copilot in Dynamics 365 Sales**: kéo dữ liệu ngoài (CRM khác, ERP) vào ngữ cảnh Copilot.
  - **Agent cho Dynamics 365 Contact Center**: gắn vào kênh (voice, chat, email) làm deflection / hỗ trợ agent người.
- Thiết kế **task agent / autonomous agent / prompt-and-response agent** đúng loại theo bài toán.
- **Foundry Tools**: đề xuất tool phù hợp yêu cầu (ví dụ knowledge retrieval, code interpreter, function/OpenAPI, Bing grounding, Fabric).
- **Code-first generative pages** + **agent feed** cho app.
- **Copilot Studio**:
  - Thiết kế **topic**, gồm **fallback topic** (khi không khớp topic nào / generative answer bật hay tắt).
  - Thiết kế **agent + agent flow** (luồng có bước xác định, gọi connector/action, điều kiện, phê duyệt).
  - **Prompt actions**: bước gọi model với prompt có tham số, trả structured output cho flow dùng tiếp.
  - Chọn **standard NLU / CLU / generative orchestration** (xem trên).
- **Power Platform**:
  - Nhúng AI component vào **Power Apps canvas app** trong một quy trình nghiệp vụ.
  - Áp dụng **Power Platform Well-Architected Framework** (Reliability, Security, Operational Excellence, Performance Efficiency, Experience Optimization) cho intelligent workloads.
- Thiết kế **data processing cho model & grounding** (chunk, làm sạch, phân loại, cấp quyền, refresh).

### Thiết kế khả năng mở rộng (extensibility)

- **Custom models trong Microsoft Foundry** cho phần AI đặc thù.
- **Agents trong Microsoft 365 Copilot** (declarative agent / custom engine agent).
- **Agent extensibility trong Copilot Studio**: thêm **actions** (connector, flow, REST, prompt), **knowledge**.
- **Extensibility qua MCP** trong Copilot Studio: gắn MCP server cung cấp tool/knowledge dùng lại.
- **Computer Use trong Copilot Studio**: tự động hoá app/website không có API.
- **Agent behaviors**: cấu hình **reasoning** (deep reasoning cho câu phức tạp) và **voice mode**.
- Tối ưu bằng agent trong **Microsoft 365 (Teams, SharePoint)**.

### Điều phối cấu hình prebuilt agent & app

- **AI features trong Dynamics 365 Finance & Supply Chain Management**: ví dụ agent thu hồi công nợ (collections), điều phối tồn kho, phân tích chênh lệch; thêm **knowledge source** cho **in-app help & guidance**; **interoperability** giữa các finance/operations agent chat.
- **AI features trong Dynamics 365 Customer Experience & Service**: case summarization, reply drafting, knowledge search, agent hỗ trợ.
- **Microsoft 365 agents** cho kịch bản nghiệp vụ; **Microsoft 365 Copilot for Sales / for Service** cấu hình phối hợp.
- **Power Platform AI features** gồm **AI hub** (khám phá & quản trị mô hình/agent), AI Builder.

---

## 3. Deploy AI-powered business solutions (40–45%)

### Phân tích, giám sát, tinh chỉnh

- **Monitoring agents**: công cụ & quy trình — Copilot Studio **analytics** (số phiên, tỉ lệ giải quyết/escalation, CSAT, topic không khớp), **Application Insights**, **Foundry tracing / evaluation**, **Power Platform admin center**, Dataverse activity logs.
- Phân tích **backlog & user feedback** về việc dùng AI/agent → xếp ưu tiên cải tiến.
- **Telemetry**: đọc dữ liệu telemetry để phát hiện topic hỏng, prompt yếu, tool lỗi, latency, chi phí → **tuning** (sửa instruction, thêm ví dụ, đổi model, chỉnh grounding, đổi threshold).
- Theo dõi **agent performance & metrics**: containment/deflection rate, resolution rate, escalation rate, accuracy/groundedness, latency, cost per interaction.

### Quản lý việc test

- **Quy trình & metric test agent**: test conversation, regression suite, đánh giá groundedness/relevance/harm, red-teaming prompt injection.
- **Validation criteria cho custom AI model**: ngưỡng precision/recall/F1/accuracy theo field, tập test giữ riêng, tiêu chí chấp nhận trước khi deploy.
- Xác thực **best practice prompt Copilot**.
- Thiết kế **kịch bản test end-to-end** cho giải pháp dùng **nhiều app Dynamics 365**.
- Dùng **Copilot** để sinh test case.

### Thiết kế quy trình ALM

Thiết kế **ALM (Application Lifecycle Management)** riêng cho từng thành phần:

- **Dữ liệu** dùng cho model & agent (versioning dataset, nguồn, refresh, lineage).
- **Copilot Studio agents, connectors, actions**: **solutions** trong Dataverse, **environment** Dev → Test → Prod, **managed solutions**, **deployment pipelines**, **environment variables** & **connection references** (không hard-code).
- **Microsoft Foundry Agents service**: quản lý cấu hình agent, prompt, model deployment qua IaC / pipeline; tách môi trường.
- **Custom AI models**: đăng ký model, version, quy trình retrain & phê duyệt, rollback.
- **AI trong Dynamics 365 Finance & Supply Chain** và **Customer Experience & Service**: đóng gói cấu hình, phối hợp release theo lịch cập nhật của Dynamics.

### Responsible AI, security, governance, risk, compliance

- **Security cho agent**: xác thực **Microsoft Entra ID**, least-privilege, **DLP policies** (Power Platform), phân tách môi trường, kiểm soát connector cho phép, xác thực người dùng cuối, authentication cho knowledge (chỉ trả nội dung user được phép — **security trimming**).
- **Governance cho agent**: đăng ký agent trong **AI hub / CoE**, quy trình phê duyệt publish, quản lý vòng đời, quản lý ai được tạo/chia sẻ agent, đặt naming & ownership.
- **Model security**: bảo vệ quá trình **fine-tuning/tuning**, kiểm soát ai sửa được model & grounding data, ký & theo dõi phiên bản.
- **Phân tích lỗ hổng & giảm thiểu** — đặc biệt **prompt manipulation / prompt injection / jailbreak**: dùng **prompt shields**, cô lập nội dung không tin cậy, giới hạn quyền tool, kiểm duyệt đầu ra, **groundedness detection**, guardrails.
- **Responsible AI**: rà soát tuân thủ **Microsoft Responsible AI Standard** & 6 nguyên tắc (Fairness, Reliability & safety, Privacy & security, Inclusiveness, Transparency, Accountability); **content filters** (Hate/Sexual/Violence/Self-harm), transparency notes, human oversight.
- **Data residency & movement compliance**: chọn region lưu trữ & xử lý, kiểm soát dữ liệu qua biên giới, xét việc dữ liệu có rời tenant khi gọi model bên thứ ba.
- **Access controls trên grounding data & model tuning**: RBAC, Dataverse security roles, sensitivity labels, chỉ đúng vai trò được sửa nguồn/huấn luyện.
- **Audit trails** cho mọi thay đổi model & data: ai đổi gì, khi nào, giá trị cũ/mới; log không sửa được.

---

## Bảng phân biệt dễ nhầm

| Tình huống | Chọn |
|---|---|
| Người dùng đã sống trong Microsoft 365, chỉ cần thêm kiến thức nội bộ vào Copilot | **Extend Microsoft 365 Copilot** (declarative agent) |
| Business maker cần agent riêng, low-code, kênh Teams/web, topic tuỳ biến | **Copilot Studio custom agent** |
| Orchestration đa agent phức tạp, custom model, kiểm soát hạ tầng | **Microsoft Foundry Agents service** |
| Đã có agent Sales/Service/Finance đáp ứng nhu cầu | **Cấu hình prebuilt agent**, không build mới |
| Agent chạy nền theo sự kiện, tự lập kế hoạch, ít can thiệp | **Autonomous agent** |
| Tự động hoá một quy trình nghiệp vụ có các bước xác định | **Task agent** / **agent flow** |
| Chỉ tóm tắt / phân loại / trích xuất một lượt | **Prompt and response agent** |
| Người dùng hỏi mở, cần ghép nhiều topic + knowledge + action | **Generative AI orchestration** trong Copilot Studio |
| Tập intent hữu hạn, cần kiểm soát chặt định tuyến | **CLU** trong Copilot Studio |
| Cần agent dùng lại một bộ tool chuẩn hoá xuyên nền tảng | **MCP server** |
| Cần các agent của các hệ khác nhau nói chuyện với nhau | **A2A** |
| Hệ thống cũ không có API, phải thao tác trên UI | **Computer Use** (Copilot Studio) |
| Tối ưu chi phí: câu dễ dùng model rẻ, câu khó dùng model mạnh | **Model router** |
| Cần độ chính xác domain cao / chạy offline / dữ liệu không rời tổ chức | **Custom model** (cân nhắc **SLM**) |
| Thêm kiến thức domain hay thay đổi cho agent | **Grounding / knowledge source** (không fine-tune) |
| Quản lý chuyển Dev→Test→Prod cho Copilot Studio | **Solutions + deployment pipelines + environment variables/connection references** |
| Ngăn agent lộ dữ liệu người dùng không được xem | **Security trimming** + authentication cho knowledge |
| Chống người dùng ép agent bỏ qua chỉ dẫn hệ thống | **Prompt shields** + giới hạn quyền tool + kiểm duyệt output |
| Chứng minh giá trị dự án AI cho lãnh đạo | **ROI analysis** dựa trên **TCO** + payback |
| Chuẩn hoá prompt, guardrail, component dùng chung toàn tổ chức | **AI Center of Excellence** + **prompt library** |
| Khởi động chương trình AI ở quy mô doanh nghiệp | **AI adoption trong Cloud Adoption Framework** |
| Ngăn agent bị tạo/chia sẻ tuỳ tiện, rò rỉ qua connector | **DLP policies** + governance trong **AI hub** |

---

## Mẹo làm bài

- Đây là đề **architect**: từ khoá quyết định là **"least effort / lowest cost / fastest time to value / most maintainable / aligns with governance"** — chọn phương án tái sử dụng (prebuilt → extend → build).
- Nghi ngờ giữa build và mua → nếu bài không nói đây là lợi thế cạnh tranh đặc thù thì **extend/configure**.
- Câu về loại agent: bắt từ khoá **"runs on a schedule / reacts to events / without user"** = autonomous; **"follows defined steps / a process"** = task; **"single request/response"** = prompt-response.
- Câu ALM Copilot Studio: đáp án gần như luôn có **solutions + environments + pipelines + environment variables/connection references**, tránh hard-code.
- Câu security: ưu tiên **Entra ID + least privilege + DLP + data residency**, và với knowledge là **security trimming**.
- Câu Deploy chiếm ~45% → nắm chắc **monitoring metrics, testing/eval, ALM, responsible AI & audit trail**.
- "Thêm kiến thức" luôn là **grounding/knowledge source**, không phải fine-tuning; fine-tuning để cố định hành vi/định dạng/giọng.
- Phân biệt **A2A** (agent ↔ agent) với **MCP** (agent ↔ tool/knowledge server).

## Liên kết

- Trang đề: <https://learn.microsoft.com/credentials/certifications/exams/ab-100/>
- Study guide chính thức: <https://learn.microsoft.com/credentials/certifications/resources/study-guides/ab-100>
- Microsoft Foundry (Azure AI Foundry) docs: <https://learn.microsoft.com/azure/ai-foundry/>
- Copilot Studio docs: <https://learn.microsoft.com/microsoft-copilot-studio/>
- Power Platform docs: <https://learn.microsoft.com/power-platform/>
