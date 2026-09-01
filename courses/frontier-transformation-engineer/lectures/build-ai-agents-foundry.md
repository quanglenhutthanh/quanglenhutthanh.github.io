---
title: "Build AI agents với Azure AI Foundry (portal & VS Code)"
subject: "frontier-transformation-engineer"
type: lecture
lecture_no: 3
status: reading
source: web
tags: [ai-102, ai-103, agentic-ai, azure-ai-foundry, agent-service, vscode]
date: 2026-09-01
---

# Build AI agents với Azure AI Foundry (portal & VS Code)

> Ghi chú cho phần **build agent** trong mảng agentic của chương trình (AI-102/AI-103 và *Accelerate Agentic AI*). Tập trung vào *kiến trúc agent trên Foundry, các thành phần và tool, hai cách build* — không chép lại các bước lab vì nội dung Microsoft có thể đổi.
>
> **Lab thực hành (làm trực tiếp trên trang Microsoft):** <https://microsoftlearning.github.io/mslearn-ai-agents/Instructions/Exercises/01-build-agent-portal-and-vscode.html>

## 1. Bối cảnh: agent là gì trên Azure

Một **AI agent** = **model** (LLM) + **instructions** (vai trò, quy tắc) + **tools** (khả năng hành động / tra cứu) + khả năng giữ **hội thoại có trạng thái**. Khác với gọi model một lần, agent tự lặp: đọc yêu cầu → quyết định gọi tool nào → đọc kết quả → trả lời hoặc gọi tiếp.

Trên Azure, dịch vụ quản lý để làm việc này là **Azure AI Foundry Agent Service** (tên cũ: *Azure AI Agent Service*), nằm trong **Azure AI Foundry** — dịch vụ lo phần orchestration, lưu thread, gọi tool, quản lý danh tính, nên không phải tự viết vòng lặp agent.

## 2. Các thành phần chính

| Khái niệm | Vai trò |
|---|---|
| **Foundry project** | Đơn vị chứa tài nguyên: model deployment, connections, agent, file. |
| **Model deployment** | Model đã deploy (vd GPT-4o) để agent dùng. |
| **Agent** | Định nghĩa: model + instructions + danh sách tools. |
| **Thread** | Một phiên hội thoại, lưu lịch sử message. |
| **Message** | Tin nhắn của user / agent trong thread. |
| **Run** | Một lượt agent xử lý thread; trong run agent có thể thực hiện nhiều bước gọi tool. |

## 3. Tools

- **Knowledge (tra cứu ngữ cảnh)**
  - **File Search** — upload tài liệu, agent truy vấn (vector store do Foundry quản lý).
  - **Azure AI Search** — nối tới index doanh nghiệp có sẵn.
  - **Grounding with Bing Search** — trả lời có dẫn nguồn web.
- **Action (thực thi)**
  - **Code Interpreter** — chạy Python trong sandbox (tính toán, xử lý file, vẽ biểu đồ).
  - **Function calling** — gọi hàm do mình định nghĩa (chạy ở phía client).
  - **OpenAPI 3.0** — gọi REST API ngoài theo spec.
  - **Azure Functions / Logic Apps** — nối vào workflow và hệ thống nghiệp vụ.

## 4. Hai cách build (nội dung lab)

### 4.1. Azure AI Foundry portal

1. Tạo **Foundry project**, deploy một model.
2. Vào **Agents**, tạo agent: đặt tên, viết **instructions**, gắn tool nếu cần.
3. Thử ngay trong **Agents playground** — chat, xem agent gọi tool ra sao.

Ưu điểm: nhanh, không cần code, hợp để thử nghiệm instructions và tool.

### 4.2. VS Code — extension **Azure AI Foundry**

1. Cài extension, đăng nhập Azure, chọn subscription + project.
2. Xem / tạo / sửa agent, model deployment ngay trong VS Code.
3. Sinh code mẫu (Python / C#) dùng **`azure-ai-projects` + `azure-ai-agents`** SDK để chạy agent từ ứng dụng.
4. Xác thực bằng **Microsoft Entra ID** (`DefaultAzureCredential`, `az login`), không dùng API key.

Ưu điểm: đưa agent vào source control và pipeline, tích hợp vào app thật.

## 5. Vòng đời một lượt chạy (SDK)

```
tạo agent  →  tạo thread  →  thêm message của user  →  tạo run
          →  poll run đến khi hoàn tất (xử lý tool call nếu là function tool)
          →  đọc message mới nhất của agent  →  (xoá agent/thread khi xong)
```

## 6. Khi nào dùng gì

- Prototype instructions / thử tool → **portal playground**.
- Đưa agent vào ứng dụng, cần versioning và CI → **VS Code + SDK**.
- Nhiều agent phối hợp (connected agents / multi-agent orchestration) → vẫn Foundry Agent Service, hoặc thêm framework (**Semantic Kernel**, **AutoGen**) — phần này ở topic sau.

## 7. Câu hỏi cần trả lời sau khi làm lab

- Instructions vs. tool: khi nào nên nhét luật vào prompt, khi nào phải là tool?
- Thread / run / message ánh xạ thế nào sang code?
- `DefaultAzureCredential` lấy danh tính từ đâu khi chạy local vs. trên Azure?
- Agent tạo bằng SDK có nên xoá sau mỗi lần chạy không, tại sao?
- File Search khác Azure AI Search ở điểm nào về chi phí và khả năng kiểm soát index?

## 8. Liên kết

- Lab (Microsoft, có thể đổi): <https://microsoftlearning.github.io/mslearn-ai-agents/Instructions/Exercises/01-build-agent-portal-and-vscode.html>
- Tài liệu chính thức: <https://learn.microsoft.com/azure/ai-foundry/agents/>
- Azure AI Foundry portal: <https://ai.azure.com/>
