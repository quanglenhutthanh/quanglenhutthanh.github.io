---
title: "AI-102 / 103 — Use case luyện đề thi thử"
subject: "frontier-transformation-engineer"
type: lecture
lecture_no: 5
status: reading
source: web
tags: [ai-102, ai-103, azure-ai, certification, exam-review, use-cases, practice]
date: 2026-09-01
---

# AI-102 / 103 — Use case luyện đề thi thử

> Tổng hợp các tình huống rút ra từ bộ đề thi thử ~60 câu, tổ chức theo 6 nhóm **skills measured**. Mỗi dòng: *tình huống → đáp án → điểm bẫy cần nhớ*. Bản tóm tắt lý thuyết ở [Tóm tắt ôn thi AI-102 / AI-103](ai-103-exam-review.md).

## Domain 1 — Plan & manage an Azure AI solution (20–25%)

| Tình huống | Đáp án | Điểm cần nhớ |
|---|---|---|
| Sinh nội dung từ prompt + bảo vệ dữ liệu bằng key của khách | `--kind OpenAI` + `--encryption` | generate-from-prompt ⇒ Azure OpenAI; CMK ⇒ tham số `--encryption` (khối `keySource` / `keyVaultProperties`) |
| Chạy Language **on-premises**, dữ liệu không rời hạ tầng | cluster **có internet** → pull image từ **MCR** → run với **ApiKey + Endpoint** | container vẫn cần internet để **billing/metering**; `Eula=accept` + `Billing` + `ApiKey` bắt buộc |
| Chỉ **process Azure cụ thể** được truy cập Language, ít công quản trị | **virtual network rules** | cấu hình ngay trên networking của resource + service endpoint |
| Chỉ resource cụ thể truy cập AI account, chặn truy cập ngoài, ít công | **enable service endpoint** trên subnet + **modify virtual network settings** trên resource | IAM = quyền theo danh tính, KHÔNG kiểm soát mạng |
| Team truy cập agent, đạt security / compliance | `DefaultAzureCredential()` | Entra ID + RBAC > API key cho compliance |
| Model deployment cho agent, ràng buộc data residency | **Standard** (regional) + **Opt out of automatic model version upgrades** | Global* định tuyến đa region; opt-out để hành vi ổn định |
| Container endpoints (Yes/No) | `/status` **không** query Azure (No) · logging provider ghi log (Yes) · `/swagger` có tài liệu (Yes) | `/ready` mới là check sẵn sàng nhận request |
| Gọi Content Safety lấy severity self-harm | `AnalyzeTextOptions(text=comment)` + `client.analyze_text(request)` | `text` là chuỗi, không phải list |
| Agent Q&A: 429 + "No relevant info" tăng | metrics **Model Availability Rate + Provisioned Utilization** · log **RequestResponse** | Provisioned Utilization ~100% ⇒ nguồn gốc 429; RequestResponse chứa status code + lỗi |
| So sánh model ứng viên + weights không nằm trong subscription | **model catalog leaderboards / model cards** + **serverless deployment** | managed compute ⇒ weights host trong subscription |
| Least-privilege cho Content Safety đọc blob | **system-assigned MI + Storage Blob Data Reader** | Reader (read-only) < Contributor; MI > access key |
| GitHub Actions CI/CD đánh giá agent, chặn merge nếu không đạt | **Azure Login action dùng OIDC** + job **Fail** | OIDC = không secret dài hạn; Fail + branch protection ⇒ chặn merge |
| Dùng cả Speech + Language qua **1 endpoint + 1 credential** | **Microsoft Foundry service** (multi-service) | single-service ⇒ mỗi cái 1 key / endpoint |
| Chặn lệnh độc nhúng trong text OCR nối vào prompt | **Prompt Shields for documents** | OCR text = grounding data ⇒ indirect injection; `userPrompt` chỉ quét input trực tiếp |

## Domain 2 — Implement generative AI solutions (15–20%)

| Tình huống | Đáp án | Điểm cần nhớ |
|---|---|---|
| Đánh giá câu trả lời agent khi dùng product info (RAG) | **RAG evaluator** (groundedness + retrieval + relevance) | groundedness chỉ là 1 vế; RAG evaluator bao trùm |
| Agent cần suy luận đa bước, ngữ cảnh dài, trả lời chi tiết | **LLM** | SLM ngữ cảnh ngắn, suy luận yếu |
| Measure: response bám context + trúng query / chứa nội dung nhạy cảm | **Groundedness + Relevance** / **Protected material** | similarity/F1 cần ground_truth; groundedness/relevance thì không |
| Cùng prompt phải trả về nhất quán (automated test) | **Decrease temperature** (→ 0) | tăng = ngẫu nhiên hơn; max_tokens / stop không liên quan |
| 429 rate limit / 400 file size exceeded | **exponential backoff + jitter** / **split thành file nhỏ** | phải "remain within limits" ⇒ không tăng quota |
| ChatCompletion (Yes/No) | không có "high certainty" (No) · thêm ngữ cảnh vào user prompt (Yes) · system message cụ thể hơn (Yes) | temperature mặc định ~1.0 |
| Voice realtime, client app, ~100 ms latency | **WebRTC** | WebSocket khuyến nghị server-to-server |

### Cách evaluate một RAG solution trên Foundry

- **Dataset**: `query` (viết tay / sinh + lọc) + `context` & `response` (chạy chính RAG pipeline để thu) + `ground_truth` (viết tay, chỉ cho golden set nhỏ).
- **Evaluator** = LLM-as-judge đối chiếu **query ↔ context ↔ response**, KHÔNG chạy lại pipeline, KHÔNG tự sinh context/response để so.
  - Groundedness / Relevance / Retrieval: **không cần** ground_truth.
  - F1 / BLEU / ROUGE / GPT-similarity / Response completeness: **cần** ground_truth.
- **Chạy**: Foundry portal → tab *Evaluation*, hoặc SDK `azure-ai-evaluation` (`evaluate(...)`, có thể truyền `target=` để nó tự gọi pipeline).
- **Giới hạn**: groundedness cao chỉ đảm bảo "trung thành với tài liệu", không đảm bảo tài liệu đúng ⇒ vẫn cần ground_truth cho phần đúng-sự-thật.
- **Production**: online / continuous evaluation + tracing (Application Insights); CI/CD gate theo threshold.

## Domain 3 — Implement an agentic solution (5–10%)

| Tình huống | Đáp án | Điểm cần nhớ |
|---|---|---|
| Agent: web mới nhất / tính toán / tài liệu upload trực tiếp | **Grounding with Bing** / **Code Interpreter** / **File Search** | Computer use = điều khiển UI; Fabric = dữ liệu doanh nghiệp |
| Persist state bằng durable ID, tái dùng full history xuyên session | **conversation** | response = 1 lượt; agent = định nghĩa tĩnh |
| Grounding tài liệu trong curated repo + nhớ preferences xuyên session | **retrieval from approved data sources** + **agent memory (persistent storage)** | orchestration session context chỉ trong 1 session |
| Long-term memory cô lập theo user, client không tự sinh ID | `scope="{{$userId}}"` + `tools=[memory_tool]` | `{{$conversationId}}` chỉ cô lập theo hội thoại |
| Cấu hình personalized user interactions | **memory** | guardrails / knowledge / tools không cá nhân hoá |
| Agent dùng product info lưu trong storage1 | **Azure AI Search** (index + knowledge tool) | Bing = web công khai; DI chỉ trích xuất |
| Workflow YAML: dừng chờ người duyệt rồi mới refund | step type **`ask_question`** + condition **`approval == "approved"`** | `output != null` chỉ check đã chạy, không phải đã duyệt |

## Domain 4 — Computer vision (10–15%)

| Tình huống | Đáp án | Điểm cần nhớ |
|---|---|---|
| Ảnh chứa **1** con mèo hoặc chó | **Classification** + **Multiclass** + domain **General** | multilabel = nhiều nhãn/ảnh; *compact* chỉ khi cần export edge |
| Trích text từ 1 triệu ảnh tạp chí scan, ít công dev | **Read API in Azure Vision** | DI cho tài liệu có cấu trúc; Image Analysis khi cần cả caption / tags |
| Vision brands/logos: code duyệt confidence ≥ 0.75, in x/y/w/h | tên + ngưỡng (Yes) · `x,y` = góc trên-trái (Yes) · `w,h` ≠ góc dưới-phải (No) | góc dưới-phải = `x+w, y+h` |

## Domain 5 — Natural language processing (15–20%)

| Tình huống | Đáp án | Điểm cần nhớ |
|---|---|---|
| Trích text từ PDF + sentiment | **Document Intelligence** + **Azure Language** | Language không đọc được ảnh / PDF |
| Fine-tune custom speech (en-us), lỗi "project ID invalid" | **custom speech project ID** | property là ID (GUID), không phải URL / endpoint |

## Domain 6 — Knowledge mining & information extraction (15–20%)

| Tình huống | Đáp án | Điểm cần nhớ |
|---|---|---|
| RAG, semantic similarity, câu hỏi khác từ ngữ tài liệu | **vector search** | analyzers = lexical; semantic ranking chỉ re-rank kết quả keyword |
| Grounding từ curated repositories | **retrieval from approved data sources** | không upload / nhúng thủ công |
| DI xuất **Markdown** giữ section + bảng | `output_content_format = ContentFormat.MARKDOWN` | REST: `outputContentFormat=markdown` |
| 1 skill multimodal: citation cấp trang + bounding polygon (text & ảnh), bảng đa trang | **Document Layout skill** | Document Extraction không có bounding polygon |
| Xử lý / duyệt hoá đơn | **Document Intelligence** (prebuilt-invoice) | Content Understanding nếu cần trường tuỳ biến / validate |
| Document-level filtering trong AI Search | **field allowed-groups trong index** + **lấy group của user** + **filter `search.in()`** | không tạo index / nhóm; token không tự trim |
| Content Understanding: per-field confidence + source grounding | **enable `estimateFieldSourceAndConfidence`** | generative extraction làm mất grounding |

## Bảng phân biệt "chọn service nào"

| Cần | Dùng |
|---|---|
| Semantic retrieval / khác từ ngữ | **vector search** trong AI Search |
| Text từ **ảnh** | **Vision Read API** |
| Text + cấu trúc từ **tài liệu / PDF**, key-value, hoá đơn | **Document Intelligence** |
| Citation cấp trang + bounding polygon + bảng đa trang (1 skill) | **Document Layout skill** |
| Per-field confidence + source, đa phương thức | **Content Understanding** + `estimateFieldSourceAndConfidence` |
| Agent lấy web mới | **Grounding with Bing** |
| Agent tính toán / chạy code | **Code Interpreter** |
| Agent đọc tài liệu upload | **File Search** |
| Agent nhớ user xuyên session | **agent memory + persistent storage**, `scope="{{$userId}}"` |
| Nhất quán output | **temperature → 0** |
| Voice realtime client | **WebRTC** |
| Nhiều service, 1 key / endpoint | **multi-service (Foundry service)** resource |
| Chặn injection trong grounding data | **Prompt Shields for documents** |
| Chống 429 | **retry + exponential backoff + jitter** |
| Auth production / CI-CD vào Azure | **Entra ID / managed identity / OIDC**, không key |

## Prompt injection — phân biệt nhanh

| Loại | Nguồn lệnh độc | Bộ lọc |
|---|---|---|
| Direct (jailbreak) | user gõ thẳng vào chat | **Prompt Shields for user prompts** |
| Indirect / cross-domain | nằm trong dữ liệu app tự nạp: web, email, PDF, **text OCR**, kết quả search | **Prompt Shields for documents** |
