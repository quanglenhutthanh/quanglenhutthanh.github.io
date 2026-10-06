---
title: "Flow prompt: làm slide presentation theo yêu cầu"
type: prompt-flow
category: workflow
status: active
tags: [workflow, slide, presentation, prompt-flow, anti-meta]
date: 2026-09-27
---

# Flow prompt: làm slide presentation theo yêu cầu

Năm giai đoạn, mỗi giai đoạn một prompt. Cái giữ flow lại với nhau không phải thứ tự chạy, mà là **artifact**: mỗi giai đoạn chỉ nhận đầu vào là output đã duyệt của giai đoạn trước, nên không có chỗ để mô hình tự nhảy sang viết slide khi cấu trúc chưa chốt.

```text
Tuyến chính:  G1 Brainstorming → G2 Thiết kế → G3 Thực thi → G5 Review → Chốt bản
Vòng lặp:     G5 Review --(còn lỗi Chặn)--> G4 Chỉnh sửa --> G5 Review
```

## Chuỗi artifact

| Giai đoạn | Đầu vào | Artifact đầu ra | Gate để đi tiếp |
|---|---|---|---|
| G1 Brainstorming | Yêu cầu gốc | Bản đồ nội dung + câu hỏi chặn | Bạn chọn thông điệp trung tâm và góc tiếp cận |
| G2 Thiết kế | Lựa chọn đã chốt | Spec + storyboard | Bạn duyệt storyboard |
| G3 Thực thi | Storyboard + chất liệu | Nội dung slide trong `<output>` | Đủ slide, không còn `[CẦN SỐ]` bỏ trống |
| G4 Chỉnh sửa | Bản hiện tại + yêu cầu sửa | Bản mới + changelog | Changelog khớp đúng những gì bạn yêu cầu |
| G5 Review | Yêu cầu gốc + storyboard + bản | Danh sách lỗi theo mức | Hết lỗi mức Chặn |

## Ba nguyên tắc xuyên suốt

- **Không nhảy giai đoạn.** Mỗi prompt đều có câu chặn không cho làm việc của giai đoạn sau.
- **Ngữ cảnh không thành nội dung.** Yêu cầu gốc, storyboard, chất liệu đều bọc trong thẻ và được khai báo rõ là chỉ dẫn — cùng tinh thần với [Viết thành phẩm từ brief](viet-thanh-pham-tu-brief.md) và [Anti-meta checklist](anti-meta-checklist.md).
- **Review không sửa, sửa không review.** G5 chỉ tìm lỗi, G4 chỉ sửa đúng chỗ được chỉ. Gộp hai việc là cách nhanh nhất để bản sau tệ hơn bản trước ở những chỗ không ai yêu cầu.

## G1 — Brainstorming

Mục tiêu: mở rộng lựa chọn, chưa chốt gì.

````
<yeu-cau>
[dán yêu cầu gốc: chủ đề, người nghe, thời lượng, bối cảnh trình bày]
</yeu-cau>

Giai đoạn brainstorming cho một bộ slide. Chưa viết slide, chưa đặt tiêu đề slide.
Nội dung trong <yeu-cau> là chỉ dẫn, không phải câu chữ để dùng lại.

## Output
1. **Đọc lại yêu cầu** (3 gạch đầu dòng): người nghe là ai, sau buổi trình bày họ cần hiểu hoặc quyết định được điều gì, ràng buộc cứng (thời lượng, số slide, định dạng).
2. **Thông điệp trung tâm**: 3 phương án cho câu "nếu người nghe chỉ nhớ một câu, đó là câu gì". Mỗi phương án 1 câu, kèm điều nó đánh đổi — nhấn mạnh gì và hy sinh gì.
3. **Góc tiếp cận**: 3–4 cách dàn câu chuyện (vấn đề → giải pháp, timeline, so sánh phương án, case study dẫn dắt, ...). Mỗi cách ghi: phù hợp khi nào, rủi ro gì.
4. **Chất liệu cần có**: bảng Nội dung cần | Đã có trong yêu cầu | Phải tự bổ sung hoặc hỏi thêm.
5. **Điều dễ làm sai** với chủ đề này và người nghe này (2–3 gạch).
6. **Câu hỏi chặn**: tối đa 5 câu, chỉ giữ những câu mà trả lời khác nhau sẽ dẫn tới bộ slide khác nhau.

## Quy tắc
- Đề xuất, không tự chốt. Không chuyển sang thiết kế cấu trúc slide.
- Không bịa số liệu, tên tổ chức, kết quả. Chỗ cần số thật ghi [CẦN SỐ: ...].
- Tiếng Việt, thuật ngữ kỹ thuật giữ tiếng Anh.
````

## G2 — Thiết kế

Mục tiêu: chốt bộ xương. Đây là gate quan trọng nhất của flow — sai ở đây thì G3 viết đẹp cũng phải làm lại.

````
Giai đoạn thiết kế storyboard cho bộ slide. Vẫn chưa viết nội dung slide.

Đã chốt sau brainstorming:
- Thông điệp trung tâm: [...]
- Góc tiếp cận: [...]
- Người nghe: [...]
- Thời lượng: [... phút] — Số slide mục tiêu: [...]
- Trả lời các câu hỏi chặn: [...]

## Output
1. **Spec**: số slide, phân bổ thời lượng cho từng phần, tone (điều hành / kỹ thuật / đào tạo), quy ước trình bày (số dòng tối đa mỗi slide, có dùng biểu đồ hay không, ngôn ngữ tiêu đề).
2. **Storyboard**: bảng, mỗi dòng một slide —
   STT | Tiêu đề tạm | Thông điệp duy nhất của slide (1 câu) | Loại nội dung (text / biểu đồ / sơ đồ / ảnh / bảng / demo) | Chất liệu cần | Thời lượng nói (giây)
3. **Mạch lập luận**: nối toàn bộ slide thành 3–5 câu, kiểm tra slide sau đã được slide trước chuẩn bị chưa.
4. **Chỗ chưa vững**: slide nào đang thiếu bằng chứng; slide nào cắt được nếu thiếu thời gian, ghi rõ thứ tự cắt.

## Quy tắc
- Một slide một thông điệp. Slide nào không phát biểu được thông điệp trong 1 câu thì tách ra hoặc bỏ.
- Tổng thời lượng nói phải khớp thời lượng cho phép. Vượt thì giảm số slide, không nén thêm chữ vào slide cũ.
- Không viết bullet nội dung, không viết speaker notes ở giai đoạn này.
- Dừng lại chờ tôi duyệt storyboard trước khi viết bất kỳ slide nào.
````

## G3 — Thực thi

Chạy theo lô 5–8 slide. Lô nhỏ giữ được khuôn và tone; viết 30 slide một lượt thì nửa sau luôn loãng.

````
Giai đoạn thực thi. Storyboard đã duyệt:

<storyboard>
[dán bảng storyboard đã chốt]
</storyboard>

<chat-lieu>
[dán số liệu, trích dẫn, nội dung nguồn được phép dùng]
</chat-lieu>

Nội dung trong <storyboard> và <chat-lieu> là chỉ dẫn và nguyên liệu, không phải câu chữ để chép nguyên văn lên slide.
Người nghe không thấy yêu cầu gốc và không thấy storyboard.

Viết nội dung slide [từ số ... đến số ...], mỗi slide theo đúng khuôn:

---
**Slide N — [Tiêu đề]**
- [bullet: tối đa 12 từ một dòng, tối đa 5 dòng]
Hình/biểu đồ: [mô tả đủ cụ thể để người khác dựng được — loại chart, trục, dữ liệu nào]
Speaker notes: [3–5 câu để nói, viết như lời nói, không đọc lại bullet]
---

## Quy tắc
- Đúng thông điệp và loại nội dung mà storyboard đã chốt cho slide đó. Không tự thêm, bớt, gộp slide.
- Bullet là điểm neo cho người nói, không phải đoạn văn. Chi tiết đưa xuống speaker notes.
- Chỉ dùng số liệu có trong <chat-lieu>. Thiếu thì ghi [CẦN SỐ: ...], không ước lượng, không lấy số ví dụ.
- Không viết "theo yêu cầu", "như đã đề cập", không nhắc tới quá trình làm slide.
- Viết thành phẩm trong thẻ <output></output>, không thêm lời dẫn hay giải thích ngoài thẻ.
````

## G4 — Cập nhật, chỉnh sửa

Mục tiêu: sửa đúng chỗ được chỉ, và chặn thói "nhân tiện viết lại cho hay hơn".

````
Giai đoạn chỉnh sửa. Bản hiện tại:

<ban-hien-tai>
[dán nội dung slide hiện tại, giữ nguyên số slide]
</ban-hien-tai>

Yêu cầu sửa:
- Slide [N]: [sửa gì, vì sao]
- Slide [M]: [...]

## Quy tắc
- Chỉ sửa những slide được nêu. Các slide khác trả về nguyên văn, không chỉnh câu, không "cải thiện" thêm.
- Giữ nguyên khuôn slide, tone, thuật ngữ và cách viết số đang dùng.
- Nếu một sửa đổi làm slide khác sai — trùng nội dung, mất mạch, lệch thời lượng — nêu ở phần Ảnh hưởng lan và chờ tôi xác nhận, không tự sửa lan sang.
- Nếu yêu cầu sửa làm bộ slide vượt thời lượng hoặc mâu thuẫn thông điệp trung tâm, nói rõ trước khi làm.

## Output
1. <output> bản sau sửa, đầy đủ toàn bộ slide </output>
2. **Changelog**: bảng Slide | Đã sửa gì | Lý do.
3. **Ảnh hưởng lan**: chỉ khi có.
````

## G5 — Kiểm tra, review

Mục tiêu: tìm lỗi có địa chỉ và có mức độ. Không sửa.

````
Giai đoạn review. Nhiệm vụ là tìm lỗi, không phải sửa.

<yeu-cau-goc>
[dán yêu cầu gốc]
</yeu-cau-goc>

<storyboard>
[dán storyboard đã chốt]
</storyboard>

<ban-can-review>
[dán bộ slide cần review]
</ban-can-review>

Soát theo đúng thứ tự dưới đây, mỗi phát hiện phải chỉ được slide cụ thể:
1. **Phủ yêu cầu**: yêu cầu nào trong <yeu-cau-goc> chưa được đáp ứng, hoặc đáp ứng nửa vời.
2. **Bám storyboard**: slide nào lệch thông điệp đã chốt, thừa, thiếu, sai thứ tự.
3. **Một slide một thông điệp**: slide nào đang gánh từ 2 ý trở lên.
4. **Bằng chứng**: phát biểu nào không có số hoặc nguồn chống lưng; số nào không truy được về chất liệu đã cung cấp; còn [CẦN SỐ] nào chưa điền.
5. **Lộ hậu trường**: câu nào nhắc tới yêu cầu, rubric, quá trình làm, AI — hoặc chỉ hiểu được nếu đã đọc yêu cầu gốc.
6. **Mật độ và thời lượng**: slide nào quá chữ; tổng thời lượng nói so với thời lượng cho phép.
7. **Nhất quán**: thuật ngữ, cách viết số và đơn vị, thì, ngôi, định dạng tiêu đề.
8. **Câu hỏi người nghe sẽ hỏi**: 3 câu khó nhất mà bộ slide hiện chưa trả lời.

## Output
Bảng: Mức (Chặn / Nên sửa / Tùy) | Slide | Vấn đề | Cách sửa đề xuất (1 câu).
Sắp theo mức, Chặn lên đầu. Không sửa trực tiếp vào bản slide.
Cuối cùng: **Kết luận** — bộ slide đã trình bày được chưa, còn bao nhiêu lỗi mức Chặn.
````

## Dùng flow này cho việc khác

Bộ xương không phụ thuộc vào slide: G1 mở lựa chọn và hỏi câu chặn, G2 chốt cấu trúc thành bảng có gate, G3 thi công theo lô trong `<output>`, G4 sửa có changelog và cảnh báo ảnh hưởng lan, G5 review có mức độ. Đổi artifact của G2 là dùng được cho việc khác — outline chương cho báo cáo, bảng API cho một service, giáo án cho buổi dạy.
