---
title: "Tóm tắt ôn thi AI-102 / AI-103"
subject: "frontier-transformation-engineer"
type: lecture
lecture_no: 4
status: reading
source: web
tags: [ai-102, ai-103, azure-ai, certification, exam-review, cheat-sheet]
date: 2026-09-01
---

# Tóm tắt ôn thi AI-102 / AI-103

> Bản tóm tắt trọng tâm để thi thử ~60 câu chứng chỉ **Azure AI Engineer Associate** (mã cũ AI-102, bản Microsoft AI ghi AI-103). Tổ chức theo 6 nhóm kỹ năng chính thức. Các phần Document Intelligence và Agent Service có ghi chú chi tiết riêng ở [Azure AI Document Intelligence](azure-document-intelligence.md) và [Build AI agents với Azure AI Foundry](build-ai-agents-foundry.md).

## Trọng số 6 nhóm kỹ năng (bản 2025)

| # | Domain | Trọng số |
|---|---|---|
| 1 | Plan and manage an Azure AI solution | 20–25% |
| 2 | Implement generative AI solutions | 15–20% |
| 3 | Implement an agentic solution | 5–10% |
| 4 | Implement computer vision solutions | 10–15% |
| 5 | Implement natural language processing solutions | 15–20% |
| 6 | Implement knowledge mining & information extraction | 15–20% |

---

## 1. Plan & manage Azure AI solution (20–25%)

### Chọn dịch vụ

- **Azure AI Foundry** (trước là Azure AI Studio): nền tảng hợp nhất để build app GenAI — hub + project, model catalog, prompt flow, evaluation, deploy.
- **Multi-service resource** (Azure AI Services) vs **single-service** (Vision, Language, Speech…): multi-service dùng **1 key + 1 endpoint** cho nhiều API, gộp hoá đơn; single-service tách biệt, có free tier riêng, dễ giới hạn quyền.
- **Azure OpenAI**: region-limited; deployment theo model + version; endpoint gọi bằng **deployment name** (không phải model name).

### Authentication & security

- **Keys**: 2 key (key1/key2) để xoay vòng không downtime; regenerate định kỳ.
- **Microsoft Entra ID + RBAC**: ưu tiên hơn key. Vai trò hay gặp: `Cognitive Services User`, `Cognitive Services Contributor`, `Cognitive Services OpenAI User` / `OpenAI Contributor`.
- **Managed Identity** (system/user-assigned): app truy cập AI service không cần lưu key.
- **Azure Key Vault**: lưu key/secret; app lấy qua managed identity.
- **Network security**:
  - Firewall giới hạn theo IP / VNet.
  - **Private endpoint** (Azure Private Link): traffic qua backbone Microsoft, không qua public internet.
  - `publicNetworkAccess = Disabled` khi chỉ dùng private endpoint.
- **Customer-managed keys (CMK)**: mã hoá dữ liệu at-rest bằng key của khách trong Key Vault (mặc định đã có Microsoft-managed key).
- SDK: `AzureKeyCredential` (key) vs `DefaultAzureCredential` (Entra ID).

### Chi phí & giám sát

- Ước tính bằng **pricing tier**: F0 (free, giới hạn TPS/số giao dịch) vs S0 (standard).
- **Azure Monitor**: metrics (số call, latency, lỗi 429), **diagnostic settings** → Log Analytics / Storage / Event Hub; **alerts** khi vượt ngưỡng.
- **Quota / rate limit** trả HTTP **429** → retry với **exponential backoff**, hoặc nâng tier / xin tăng quota.

### Responsible AI

- **Content Safety / content filters**: 4 hạng mục — Hate, Sexual, Violence, Self-harm; severity safe/low/medium/high. Kèm **prompt shields** (jailbreak), **protected material** detection, **groundedness detection**.
- 6 nguyên tắc: Fairness, Reliability & safety, Privacy & security, Inclusiveness, Transparency, Accountability.

### Container

- Một số AI service chạy trong **Docker container** (on-prem/edge): cần `ApiKey`, `Billing` (endpoint), `Eula=accept`. Vẫn gửi metering về Azure.

### CI/CD & môi trường

- Provision bằng **Bicep/ARM/Terraform**; tách dev/test/prod; dùng **prompt flow** + evaluation trong pipeline.

---

## 2. Generative AI solutions (15–20%)

### Azure OpenAI / model catalog

- **Deployment**: chọn model (gpt-4o, gpt-4o-mini, o1, embeddings `text-embedding-3-large/small`, DALL·E 3, Whisper) + **deployment name**.
- **Provisioned Throughput Units (PTU)** vs **Standard (pay-as-you-go)**: PTU cho latency ổn định + throughput cam kết; Standard tính theo token.
- **Quota** theo **TPM** (tokens-per-minute) mỗi region/subscription.

### Prompt engineering

- **System message** (persona, rules, format, safety), few-shot examples, grounding data trong prompt.
- Tham số: `temperature` (0 = xác định), `top_p` (dùng 1 trong 2, không cả hai), `max_tokens`, `stop`, `frequency_penalty`, `presence_penalty`.
- **Structured outputs / JSON mode**: ép model trả JSON đúng schema.

### RAG — "Azure OpenAI On Your Data"

- Data source: **Azure AI Search**, Blob Storage, URL.
- Search type: keyword, semantic, **vector**, **hybrid**, **hybrid + semantic** (thường tốt nhất).
- Cần **embedding model deployment** cho vector search.
- Trả lời kèm **citations**; có thể ép "limit responses to your data" → giảm hallucination.
- Chunking: chia tài liệu ~ vài trăm–1024 token, có overlap.

### Fine-tuning

- Dùng khi prompt engineering + RAG chưa đủ; dữ liệu **JSONL** dạng chat (`messages`).
- **Không** dùng để thêm kiến thức mới cập nhật thường xuyên — đó là việc của RAG. Fine-tuning để cố định phong cách / định dạng / hành vi.

### Function calling / tools

- Định nghĩa function schema (name, description, parameters JSON Schema); model trả `tool_calls` → app thực thi → gửi kết quả lại.

### Đánh giá & an toàn

- **Evaluation** trong AI Foundry: groundedness, relevance, coherence, fluency, similarity; risk & safety metrics.
- **Content filter** cấu hình theo deployment; xin nới lỏng qua form.
- **Monitoring**: token usage, filtered requests.
- Image generation: **DALL·E 3**; Speech: **Whisper** (transcription) / **TTS HD voices**.

---

## 3. Agentic solution (5–10%)

- **Azure AI Foundry Agent Service**: agent = model + instructions + tools.
- Thành phần: **Agent → Thread (hội thoại) → Run → Run steps**; messages gắn vào thread.
- **Tools**:
  - Knowledge: **File Search** (vector store), **Azure AI Search**, **Grounding with Bing**, Microsoft Fabric.
  - Action: **Code Interpreter** (Python sandbox), **Function calling** (custom, chạy client), **OpenAPI 3.0**, Azure Functions / Logic Apps.
- **Connected agents / multi-agent**: một agent điều phối các agent con.
- **Semantic Kernel / AutoGen**: framework code-first để orchestrate agent, plugins, planners, memory.
- Xác thực: **Entra ID** (`DefaultAzureCredential`), không dùng API key.
- Chi tiết vòng đời SDK: xem [Build AI agents với Azure AI Foundry](build-ai-agents-foundry.md).

---

## 4. Computer vision (10–15%)

### Azure AI Vision (Image Analysis 4.0)

- Tính năng: **caption / dense captions**, **tags**, **objects** (bbox), **people**, **smart crop**, **OCR (Read)**, **background removal**.
- **Model Customization** (thay Custom Vision cũ): classification + object detection, cần ít ảnh hơn nhờ pretrained.
- **Product Recognition**, **Spatial Analysis** (đếm người, khoảng cách — container/video).

### Custom Vision

- 2 project type: **Classification** (multiclass / multilabel) + **Object Detection**.
- Domain: General, Food, Landmarks, Retail, **Compact** (export TFLite/CoreML/ONNX cho edge).
- Ít nhất **~15 ảnh/label**; xem **Precision, Recall, mAP**; **Probability Threshold** & **Overlap Threshold** khi test.
- 2 endpoint/key: **Training** và **Prediction**; publish iteration để predict.

### Face

- **Face detection**: bounding box, landmarks, attributes (head pose, mask, blur, occlusion, glasses…). *Age/gender/emotion đã bị gỡ.*
- **Verification** (1:1), **identification** (1:N) — cần **Limited Access** approval; PersonGroup / PersonDirectory.
- **Liveness detection** chống giả mạo.

### Video

- **Azure AI Video Indexer**: transcript, OCR, khuôn mặt, nhãn, chủ đề, sentiment, **keyframes**, brand, người nói.

---

## 5. Natural Language Processing (15–20%)

### Azure AI Language — prebuilt

- **Language detection**: `languageCode`, `confidenceScore`; `(Unknown)` khi không xác định.
- **Sentiment analysis**: positive/negative/neutral/mixed ở mức **document + sentence**; **opinion mining** (aspect-based).
- **Key phrase extraction**.
- **NER**: category (Person, Location, Organization, DateTime, Quantity…).
- **Entity linking**: liên kết Wikipedia.
- **PII detection & redaction**: text và **conversation** (từ speech transcript); chọn categories.
- **Text analytics for health**: entity y tế + relations + assertion (negation…).
- **Summarization**: **extractive** (rút câu) vs **abstractive** (viết lại); **conversation summarization** (issue/resolution, chapters, narrative).

### Custom features (cần training data + Language Studio)

- **Custom NER**: entity riêng; data + labels JSON trong Blob.
- **Custom Text Classification**: single-label / multi-label.
- **Conversational Language Understanding (CLU)** — thay LUIS:
  - **Intents** + **Entities** (learned, list, prebuilt, regex).
  - `topIntent`, confidence; **None** intent threshold.
  - Train → deploy (deployment slot) → predict.
- **Custom Question Answering** — thay QnA Maker:
  - KB từ URL/file/chit-chat; **question–answer pairs**, alternate questions, **follow-up prompts** (multi-turn), synonyms, metadata filters.
  - **Confidence threshold**; test → deploy.
- **Orchestration workflow**: một app định tuyến sang CLU / Custom QnA / project khác.

### Speech (Azure AI Speech)

- **Speech to text**: real-time (SDK, mic/stream) + **Batch transcription** (file trong Blob, REST) + **Fast transcription**.
- **Text to speech**: **neural voices**, **SSML** (prosody, `<break>`, `<phoneme>`, pitch/rate/volume, `mstts:express-as` style), **Custom Neural Voice** (Limited Access).
- **Speech translation**: source 1 → nhiều target; event `Recognizing/Recognized`.
- **Custom Speech**: cải thiện nhận dạng theo domain (audio + human-labeled transcript, hoặc plain text, pronunciation).
- **Language identification**: danh sách ngôn ngữ ứng viên (at-start vs continuous).
- **Pronunciation assessment** (accuracy, fluency, completeness), **keyword recognition**.
- **Speaker recognition** (verification/identification — Limited Access).

### Translator (dịch văn bản)

- 100+ ngôn ngữ, **auto-detect**, **profanity filtering**, **custom translator** (dịch theo domain), dictionary lookup.
- **Document translation**: giữ format, batch qua Blob.

---

## 6. Knowledge mining & information extraction (15–20%)

### Azure AI Search

- Pipeline: **data source → skillset → indexer → index**; query qua REST/SDK.
- **Index field attributes**: `key`, `searchable`, `filterable`, `sortable`, `facetable`, `retrievable`. Chỉ `filterable/sortable/facetable` mới lọc/sắp/facet được; full-text cần `searchable`.
- **Analyzers**: language analyzers, custom analyzer (tokenizer + token filters).
- **Skillset (AI enrichment)**: built-in skills — OCR, Text Merge, Language Detection, Entity Recognition, Key Phrase, Sentiment, Image Analysis, **Split**, Shaper, **Azure OpenAI Embedding skill**; **custom skill** (Web API / Azure Function trả JSON đúng schema).
- **Knowledge store**: lưu output enrichment vào Blob/Table cho phân tích (khác index để search).
- **Incremental enrichment + cache**: chỉ chạy lại skill thay đổi.
- Query: **simple** vs **full Lucene** syntax; `$filter` (OData), `$orderby`, `$select`, `$top`.
- **Scoring profiles**: tăng điểm theo field weight, freshness, distance, tag.
- **Facets, suggesters (autocomplete)**, **synonym maps**.
- **Semantic ranker**: re-rank L2, **semantic captions & answers**, spell check.
- **Vector search**: vector fields, **HNSW** / exhaustive KNN, `vectorQueries`, **hybrid search** + **RRF** (Reciprocal Rank Fusion); **integrated vectorization** (chunk + embed tự động trong indexer bằng AOAI embedding skill).
- Security: **API keys** (admin/query), **RBAC**, **managed identity** đọc data source, **security trimming** theo group/user với `search.in()`.
- Tier (Free, Basic, Standard S1–S3, Storage Optimized L1–L2): **Replicas** = throughput + SLA; **Partitions** = dung lượng + tốc độ index. **SU = replicas × partitions**.

### Azure AI Document Intelligence (Form Recognizer)

Ghi chú đầy đủ: [Azure AI Document Intelligence](azure-document-intelligence.md). Điểm cần nhớ cho thi:

- **Prebuilt**: Read (OCR), **Layout** (tables, selection marks), General Document (key-value), **Invoice, Receipt, ID document, Business card, W-2, Health insurance card, Contract, Pay stub, Bank statement**…
- **Custom**: **template** (layout cố định, ≥5 mẫu), **neural** (biến thể layout), **classification model** (tách/phân loại document), **composed model** (gộp nhiều custom model).
- Training data + `fields.json` / `.labels.json` trong Blob (SAS URL); dùng **Document Intelligence Studio**.
- Output: `confidence` mỗi field, `boundingRegions`, `pages`, `tables`, `keyValuePairs`, `documents`.

---

## Bảng phân biệt dễ nhầm

| Tình huống | Chọn |
|---|---|
| Trích key-value từ hoá đơn/biên lai | **Document Intelligence** (prebuilt invoice/receipt) |
| Đọc chữ tự do trong ảnh | **AI Vision Read (OCR)** |
| Chatbot hỏi–đáp từ tài liệu FAQ | **Custom Question Answering** |
| Chatbot hiểu intent + entity để gọi API | **CLU** |
| Định tuyến giữa nhiều chatbot/skill | **Orchestration workflow** |
| Trả lời từ kho tài liệu lớn, có trích dẫn | **RAG: Azure OpenAI On Your Data + AI Search** |
| Cần latency ổn định cho OpenAI production | **Provisioned Throughput (PTU)** |
| Thêm kiến thức domain cho LLM, cập nhật thường xuyên | **RAG** (không phải fine-tuning) |
| Đổi phong cách/định dạng đầu ra LLM cố định | **Fine-tuning** hoặc system message |
| Phân loại ảnh chạy offline trên thiết bị | **Custom Vision – Compact domain**, export ONNX/TFLite |
| Nhận diện khuôn mặt 1:N | **Face – identification** (Limited Access) |
| Lọc kết quả search theo phòng ban của user | **Security trimming filter** (`search.in()`) |
| Field cần lọc và sắp xếp trong index | đặt `filterable` + `sortable` |
| Tăng throughput + SLA cho AI Search | thêm **replicas** |
| Tăng dung lượng index cho AI Search | thêm **partitions** |
| Chạy AI service on-premises | **Container** (`ApiKey` + `Billing` + `Eula=accept`) |
| App truy cập AI service không lưu key | **Managed identity + RBAC** |
| HTTP 429 khi gọi API | vượt quota → **retry + exponential backoff** / nâng tier |
| Chunk + embed tài liệu tự động khi index | **Integrated vectorization** |

---

## Mẹo làm bài

- Câu **case study / drag-and-drop**: đọc yêu cầu bảo mật & region trước.
- Nghi ngờ giữa 2 service → chọn **prebuilt** nếu bài không nói có training data.
- Từ khoá quyết định: "least administrative effort", "minimize cost", "minimize development".
- Endpoint OpenAI dùng **deployment name**, không phải model name.
- Xác thực production: ưu tiên **Entra ID / managed identity** hơn key.
- Search: muốn hạ tầng lo chunk + embed → **integrated vectorization**.

## Liên kết

- Skills outline chính thức: <https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-102>
- Azure AI Foundry: <https://ai.azure.com/>
- Tài liệu: <https://learn.microsoft.com/azure/ai-services/>
