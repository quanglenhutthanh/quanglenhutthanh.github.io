---
title: "Azure AI Document Intelligence"
subject: "frontier-transformation-engineer"
type: lecture
lecture_no: 2
status: reading
source: web
tags: [ai-103, azure-ai, document-intelligence, form-recognizer, ocr, information-extraction]
date: 2026-09-01
---

# Azure AI Document Intelligence

> Ghi chú cho phần **Document Intelligence** trong khoá **AI-103 – Develop AI apps and agents on Azure** (Milestone 1). Tập trung vào *dịch vụ là gì, mô hình nào có sẵn, khi nào tự train* — không chép lại các bước lab vì nội dung lab của Microsoft có thể đổi.
>
> **Lab thực hành (làm trực tiếp trên trang Microsoft):** <https://microsoftlearning.github.io/mslearn-ai-information-extraction/Instructions/Exercises/03-document-intelligence.html>

## 1. Document Intelligence là gì

**Azure AI Document Intelligence** (tên cũ: *Azure Form Recognizer*) là dịch vụ trong nhóm **Azure AI services**, dùng để **trích xuất dữ liệu có cấu trúc từ tài liệu** — text, cặp key–value, bảng, checkbox, chữ ký — bằng cách kết hợp **OCR** với các mô hình học máy hiểu bố cục (layout) và ngữ nghĩa.

Điểm khác với OCR thuần (Azure AI Vision – Read):

| | Vision Read (OCR) | Document Intelligence |
|---|---|---|
| Đầu ra | Text + vị trí | Text + **cấu trúc**: field, bảng, key–value, quan hệ |
| Hiểu loại tài liệu | Không | Có (hoá đơn, biên nhận, CMND/hộ chiếu…) |
| Tuỳ biến | Không | Train **custom model** theo mẫu riêng |

Mỗi phần tử trả về đều kèm **confidence score** và **bounding region / polygon** (toạ độ trên trang) để ứng dụng phía sau quyết định có cần người kiểm tra hay không.

## 2. Các nhóm mô hình

### 2.1. Prebuilt – dùng ngay, không cần train

- **Read** – OCR: text, ngôn ngữ, hướng chữ.
- **Layout** – cấu trúc trang: đoạn văn, bảng, tiêu đề, checkbox, selection mark.
- **General Document** *(được gộp dần vào Layout)* – cặp key–value tổng quát.
- **Mô hình theo lĩnh vực**: Invoice (hoá đơn), Receipt (biên nhận), Identity documents (hộ chiếu, bằng lái), Business card, Bank statement, Pay stub, Check, Contract, US Tax (W-2, 1098, 1099), Health insurance card, Mortgage / loan…

### 2.2. Custom – tự train theo mẫu tài liệu của mình

- **Custom extraction**
  - **Template model** – tài liệu có bố cục cố định, cần rất ít mẫu (~5 tài liệu), train nhanh.
  - **Neural model** – tài liệu bố cục thay đổi, chịu được biến thể, cần nhiều dữ liệu hơn, train lâu hơn.
- **Custom classification** – phân loại tài liệu đầu vào (đây là hợp đồng hay đơn xin nghỉ?) trước khi đưa vào mô hình trích xuất phù hợp.
- **Composed model** – gộp nhiều custom model vào một endpoint; dịch vụ tự chọn model con khớp nhất.

Quy trình train tiêu chuẩn: gom tài liệu mẫu vào **Azure Blob Storage** → gán nhãn field trong **Document Intelligence Studio** (sinh ra file `.labels.json` / `.ocr.json`) → train → kiểm thử → lấy **model ID** để gọi từ code.

## 3. Cách dùng

- **Document Intelligence Studio** (`documentintelligence.ai.azure.com`) – giao diện web để thử prebuilt model, gán nhãn và train custom model, xem JSON kết quả.
- **REST API / SDK** (.NET, Python, JavaScript, Java) – thao tác `Analyze` chạy **bất đồng bộ**: gửi tài liệu → nhận operation ID → poll đến khi có kết quả JSON.
- Xác thực bằng **endpoint + key** của resource, hoặc **Microsoft Entra ID** (managed identity) cho môi trường production.

## 4. Tạo resource & giá

- Tạo resource **Document Intelligence** riêng, hoặc dùng **Azure AI services** (multi-service) resource chung.
- Tier: **F0** (free, giới hạn số trang/tháng) và **S0** (trả theo lượng trang, giá khác nhau theo loại mô hình).
- Region phải hỗ trợ dịch vụ; custom model gắn với region nơi train.

## 5. Khi nào dùng gì

- Chỉ cần chữ trên ảnh → **Vision Read**.
- Cần bảng / bố cục / key–value tổng quát, không quan tâm loại tài liệu → **Layout**.
- Tài liệu phổ biến (hoá đơn, biên nhận, giấy tờ tuỳ thân) → **prebuilt theo lĩnh vực**.
- Biểu mẫu nội bộ / mẫu riêng của tổ chức → **custom extraction** (template nếu bố cục cố định, neural nếu đa dạng).
- Nhiều loại tài liệu trộn lẫn trong một luồng → **custom classification** + **composed model**.

## 6. Liên hệ với chương trình

- Thuộc mảng **information extraction** của AI-103 — cùng nhóm với Azure AI Vision, AI Language, Content Understanding.
- Là khối xây dựng hay gặp cho **agent xử lý tài liệu** và tự động hoá quy trình (RPA): agent nhận file → Document Intelligence bóc field → điền vào hệ thống nghiệp vụ.

## 7. Câu hỏi cần trả lời sau khi làm lab

- Kết quả `Analyze` trả về những trường nào, đọc `confidence` và `boundingRegions` ở đâu trong JSON?
- Template model vs. neural model: khác nhau về số mẫu, thời gian train, độ chịu biến thể ra sao?
- Vì sao thao tác analyze là bất đồng bộ, client xử lý polling thế nào?
- Khi nào một field nên bị coi là "cần người duyệt" thay vì tự động chấp nhận?

## 8. Liên kết

- Lab (Microsoft, có thể đổi): <https://microsoftlearning.github.io/mslearn-ai-information-extraction/Instructions/Exercises/03-document-intelligence.html>
- Tài liệu chính thức: <https://learn.microsoft.com/azure/ai-services/document-intelligence/>
- Document Intelligence Studio: <https://documentintelligence.ai.azure.com/>
