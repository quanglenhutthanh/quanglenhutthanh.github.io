---
title: "Tóm tắt hội thoại thành bản ghi quyết định"
type: prompt
category: workflow
status: active
tags: [tom-tat, hoi-thoai, decision-log, context-handoff]
date: 2026-09-21
---

# Tóm tắt hội thoại thành bản ghi quyết định

Nén một cuộc hội thoại dài thành bản ghi quyết định dùng lại được: đã chốt gì, đang nghiêng về đâu, loại gì và vì sao loại. Dùng chung cho nhiều tình huống — định hướng nghiên cứu, chọn kiến trúc kỹ thuật, quyết định sản phẩm, lên kế hoạch học tập.

Điền `[BỐI CẢNH]` bằng một câu mô tả hội thoại; các mục không liên quan sẽ tự ghi "Chưa bàn".

## Prompt

````
Tóm tắt cuộc hội thoại dưới đây thành một bản ghi quyết định. Bối cảnh: [BỐI CẢNH].

Mục tiêu: một bản ghi để lần sau đọc lại là biết đã cân nhắc những gì, chốt được gì, còn phân vân gì — mà không phải đọc lại toàn bộ hội thoại.

## Quy tắc
- Chỉ dùng thông tin có trong hội thoại. Không tự bổ sung phương án, công cụ, nguồn hay dữ kiện không được nhắc tới.
- Tách rõ 3 mức: ĐÃ CHỐT (tôi xác nhận rõ ràng) / ĐANG NGHIÊNG VỀ (tôi có thiên hướng nhưng chưa chốt) / ĐỀ XUẤT (phía kia gợi ý, tôi chưa phản hồi).
- Với mỗi phương án bị loại, ghi lý do loại. Đây là thông tin quan trọng nhất để tránh bàn lại.
- Nếu ý kiến thay đổi giữa chừng, ghi phiên bản cuối và "(trước đó: ...)".
- Phân biệt điều đã làm/đã xảy ra với điều mới chỉ dự định. Không ghi kết quả hay con số nào như thể đã đạt được; số liệu trích từ nguồn ngoài thì ghi rõ nguồn.
- Chỗ mâu thuẫn hoặc chưa rõ đánh dấu [CHƯA RÕ].
- Viết tiếng Việt, giữ thuật ngữ kỹ thuật bằng tiếng Anh.

## Cấu trúc output
1. **Tổng quan** (2–3 câu): vấn đề đang giải, câu hỏi trung tâm hiện tại, mức độ đã rõ ràng tới đâu.
2. **Đã chốt**: từng quyết định kèm lý do ngắn.
3. **Đang cân nhắc**: các phương án còn mở, trạng thái (nghiêng về / đề xuất), điều gì sẽ quyết định lựa chọn.
4. **Đã loại**: bảng Phương án | Lý do loại | Có thể xét lại khi nào.
5. **So sánh phương án**: chỉ khi hội thoại có so sánh từ 2 lựa chọn trở lên — bảng Phương án | Vai trò | Trạng thái | Ưu điểm | Rủi ro.
6. **Ràng buộc và giả định**: thời gian, chi phí, công cụ, người liên quan, yêu cầu bắt buộc; ghi rõ đâu là giả định chưa kiểm chứng.
7. **Câu hỏi còn mở**: sắp theo mức ảnh hưởng tới quyết định.
8. **Bước tiếp theo**: việc cụ thể, theo thứ tự, kèm ai làm nếu có nhắc.
9. **Nguồn được nhắc tới**: paper, link, file, công cụ, người — kèm phần liên quan.

Nếu hội thoại thuộc một loại có nội dung đặc thù, thêm mục riêng cho nó thay vì nhét vào các mục trên. Ví dụ: nghiên cứu → dataset, phương pháp, evaluation; kỹ thuật → kiến trúc, trade-off, rủi ro vận hành; sản phẩm → scope, tiêu chí thành công.

Phần nào hội thoại không đề cập thì ghi "Chưa bàn", không tự điền.
Độ dài: tối đa khoảng 800 từ. Bỏ chào hỏi, lạc đề, giải thích lặp lại.
````
