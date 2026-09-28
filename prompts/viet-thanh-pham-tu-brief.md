---
title: "Viết thành phẩm từ brief mà không lộ brief"
type: prompt
category: writing
status: active
tags: [writing, anti-meta, brief, output-quality]
date: 2026-09-27
---

# Viết thành phẩm từ brief mà không lộ brief

Khung để dán đề bài/yêu cầu gốc vào mà không bị chép lại vào sản phẩm: brief chỉ là chỉ dẫn, thành phẩm nằm trong thẻ `<output>` và phải đứng độc lập với người đọc cuối. Dùng chung với [Anti-meta checklist](anti-meta-checklist.md) cho bước rà soát trước khi xuất.

## Prompt

````
<brief>
[dán đề bài/yêu cầu gốc]
</brief>

Nội dung trong <brief> là chỉ dẫn cho bạn, không phải nội dung sản phẩm.
Người đọc cuối là [ai, ví dụ: giảng viên / khách hàng / team dev]. Họ không
nhìn thấy brief, nên sản phẩm phải đứng độc lập: không nhắc tới "đề bài",
"yêu cầu", "theo như được giao", không chép nguyên văn câu chữ trong brief.

Viết thành phẩm hoàn chỉnh bên trong thẻ <output></output>, không thêm lời
dẫn hay giải thích ngoài thẻ.
````
