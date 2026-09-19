---
title: "Tóm tắt hội thoại định hướng luận văn"
type: prompt
category: research
status: active
tags: [research, luan-van, tom-tat, decision-log]
date: 2026-09-17
---

# Tóm tắt hội thoại định hướng luận văn

Nén một cuộc hội thoại dài ở giai đoạn định hướng đề tài (chưa có thực nghiệm) thành bản ghi quyết định: đã chốt gì, đang nghiêng về đâu, loại gì và vì sao loại.

## Prompt

````
Bạn là trợ lý nghiên cứu, giúp tôi tóm tắt một cuộc hội thoại dài về giai đoạn định hướng luận văn thạc sĩ AI. Chưa có thực nghiệm nào. Mục tiêu: một bản ghi để lần sau đọc lại là biết mình đã cân nhắc những gì, chốt được gì, còn phân vân gì.

## Quy tắc
- Chỉ dùng thông tin có trong hội thoại. Không tự bổ sung phương pháp, dataset hay paper không được nhắc tới.
- Tách rõ 3 mức: ĐÃ CHỐT (tôi xác nhận rõ ràng) / ĐANG NGHIÊNG VỀ (tôi có thiên hướng nhưng chưa chốt) / ĐỀ XUẤT (AI gợi ý, tôi chưa phản hồi).
- Với mỗi lựa chọn bị loại, ghi lý do loại. Đây là thông tin quan trọng nhất để tránh bàn lại.
- Nếu ý kiến thay đổi giữa chừng, ghi phiên bản cuối và "(trước đó: ...)".
- Không ghi bất kỳ kết quả hay con số hiệu năng nào như thể đã đạt được. Số liệu trích từ paper thì ghi rõ nguồn.
- Chỗ mâu thuẫn hoặc chưa rõ đánh dấu [CHƯA RÕ].
- Viết tiếng Việt, giữ thuật ngữ kỹ thuật bằng tiếng Anh.

## Cấu trúc output
1. **Tổng quan** (2–3 câu): bài toán, research question hiện tại (hoặc các ứng viên), mức độ đã rõ ràng tới đâu.
2. **Hướng đi**: các hướng đã cân nhắc, trạng thái (chốt / nghiêng về / đề xuất / loại), lý do.
3. **Phương pháp**: bảng Phương pháp | Vai trò (main / baseline / ablation) | Trạng thái | Ưu điểm | Rủi ro hoặc lý do loại.
4. **Dataset**: bảng Dataset | Quy mô | Có sẵn hay phải tự thu thập | Phù hợp ở điểm nào | Vấn đề (license, label, domain gap...) | Trạng thái.
5. **Evaluation dự kiến**: metric, protocol, cách so sánh với baseline (nếu đã bàn).
6. **Novelty / đóng góp dự kiến**: luận văn khác gì các công trình đã có.
7. **Ràng buộc thực tế**: compute, thời gian, deadline, yêu cầu của trường/GVHD.
8. **Câu hỏi còn mở**: sắp theo mức ảnh hưởng tới quyết định.
9. **Bước tiếp theo để bắt đầu**: việc cụ thể, theo thứ tự.
10. **Paper được nhắc tới**: tên, năm, liên quan tới phần nào.

Phần nào hội thoại không đề cập thì ghi "Chưa bàn", không tự điền.
Độ dài: tối đa khoảng 800 từ. Bỏ chào hỏi, lạc đề, giải thích lặp lại.
````
