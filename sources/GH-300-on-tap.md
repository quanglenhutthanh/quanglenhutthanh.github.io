# GH-300 (GitHub Copilot Certification) — Tài liệu ôn tập nhanh

> Tổng hợp từ 180 câu trong đề (thực chất chỉ có **~128 câu gốc**, phần còn lại là câu lặp lại/đổi vị trí đáp án). Số trong ngoặc `[Q..]` là số thứ tự câu trong PDF gốc để tra lại giải thích đầy đủ khi cần.

---

## 1. Responsible AI / Đạo đức & rủi ro khi dùng AI

**4 nguyên tắc AI có đạo đức của Microsoft hay bị hỏi nhất:**
- **Fairness** – đối xử công bằng, không phân biệt/thiên vị giữa các nhóm người `[Q1]`
- **Transparency** – hệ thống AI phải dễ hiểu, giải thích được cách nó hoạt động `[Q6, 152]`
- **Reliability & Safety** – vận hành ổn định, an toàn, giảm rủi ro/hệ quả ngoài ý muốn
- **Privacy & Security** – bảo vệ dữ liệu cá nhân và an toàn hệ thống
- **Inclusiveness** – AI phải tiếp cận được với nhiều nhóm người, kể cả người khuyết tật

**Giảm bias khi phát triển AI**: dùng dữ liệu đa dạng (diverse data) + fairness metrics + có con người giám sát (human oversight) `[Q2]`. Đảm bảo fairness khi *vận hành* một AI tool: theo dõi hiệu năng thường xuyên (regularly monitoring performance) `[Q9, 162]`.

**Vì sao Gen AI tạo output sai**: do dữ liệu huấn luyện chứa bias/thiếu nhất quán (training data có biases hoặc inconsistencies) `[Q11, 164]`.

**Rủi ro khi dùng AI nói chung**: AI có thể ra quyết định khó giải thích (khó truy vết lý do) — đây là loại rủi ro hay được hỏi dưới dạng "risk associated with AI" `[Q7, 174]`.

**Bảo mật code trong Gen AI tool**: quan trọng vì ngăn truy cập trái phép và các lỗ hổng tiềm ẩn `[Q3]`.

**Rủi ro pháp lý/đạo đức khi dùng Copilot** (câu chọn nhiều đáp án): Copilot có thể vô tình gợi ý secret hard-code, gợi ý code có thể vi phạm license/copyright của mã nguồn mở `[Q180]`.

---

## 2. Prompt Engineering & Context

- **Zero-shot prompting**: chỉ đưa câu hỏi/yêu cầu, KHÔNG kèm ví dụ mẫu `[Q66, 171]`
- **Few-shot prompting**: mô tả cơ chế/đưa ví dụ input-output mẫu để Copilot bắt chước `[Q69, 143]`
- **Role prompting**: mô tả vai trò (role) của bạn trong prompt để có câu trả lời phù hợp hơn `[Q72, 136]`
- Chiến lược cải thiện prompt tốt nhất hay lặp lại trong đề: đưa **ví dụ input/output cụ thể** trong prompt, và đặt **success criteria rõ ràng** `[Q65, 71, 141]`

**Cách tăng context cho Copilot**:
- Dùng biến ngữ cảnh trong prompt, ví dụ `#selection` `[Q64]`
- Mở các tab liên quan trong IDE `[Q157]`
- Gọi chat participant `@workspace` để lấy context toàn bộ project `[Q67]`

**Chat history**: giúp Copilot cá nhân hóa gợi ý dựa trên các prompt/tương tác trước đó (personalize dựa trên phong cách code, thư viện hay dùng...) `[Q60, 70, 137, 144]`.

**Nguồn context mà LLM của Copilot dùng để trả lời**: các file lân cận/liên quan trong project (neighboring/related files), không chỉ file đang mở `[Q57]`. Trong IDE, context prompt được lấy từ: tab đang mở, vị trí con trỏ, đoạn code được chọn (open tabs, cursor location, selected code) `[Q56]`.

**Pre-processing input trong Copilot Chat**: làm giàu (enrich) prompt với context bổ sung trước khi gửi cho LLM `[Q51, 150]`.

**Fill-In-the-Middle (FIM)**: cải thiện gợi ý bằng cách xét cả phần trước (prefix) VÀ phần sau (suffix) của vị trí cần điền, không chỉ prefix như model đơn giản `[Q54]`.

---

## 3. GitHub Copilot Chat — khả năng & giới hạn

**Cách Chat tạo câu trả lời**: kết hợp dữ liệu huấn luyện + code trong repo của user + nguồn bên ngoài liên quan `[Q5, 156]`.

**Giới hạn cần lưu ý**:
- Chat gặp khó khi xử lý cấu trúc code phức tạp; training data có giới hạn (limited training data) `[Q53, 154]`
- Copilot **không thực sự "chạy" hay chứng minh** một hàm đúng — nó chỉ gợi ý assertion/test case dựa trên ngữ cảnh & ngữ nghĩa của code, developer vẫn phải tự verify `[Q109, 119]`
- Copilot hoạt động theo pattern thống kê (pattern-based), **không tính toán/verify chính xác về mặt toán học** → cẩn trọng khi dùng cho bài toán tính toán `[Q90, 142]`
- Giải thích code của Chat vẫn cần được review/validate lại độ chính xác & đầy đủ, không nên tin tuyệt đối `[Q108]`

**Vai trò/use case đúng của Copilot Chat**: là công cụ tăng năng suất (productivity tool) đưa ra gợi ý — nhưng **không thay thế việc con người tự đánh giá/review** `[Q83, 169]`.

**Cách gửi feedback về Copilot Chat** (kể cả trên GitHub Mobile): dùng **emoji/thumbs up-down** ngay trong giao diện Chat `[Q17, 28, 123, 140]`.

---

## 4. Gói dịch vụ & giá (Individual / Business / Enterprise / Azure DevOps)

| Gói | Đặc điểm chính |
|---|---|
| **Copilot Individual** | Cho cá nhân/freelancer; **miễn phí cho học sinh, giáo viên, maintainer dự án open-source** `[Q31]`; billed theo tháng hoặc năm (subscription) `[Q42]`; **không có** content exclusion (muốn loại trừ file phải nâng lên Business) `[Q105]`; phù hợp cho contractor làm nhiều khách hàng khác nhau nếu khách không có yêu cầu riêng `[Q159]` |
| **Copilot Business** | Dành cho tổ chức; có content exclusion, audit log, quản lý qua REST API; loại trừ data (usage/prompts/suggestions) khỏi việc train model mặc định `[Q19]`; phù hợp công ty quản lý user qua Identity Provider (Okta...) kể cả khi không dùng GitHub Enterprise `[Q47]` |
| **Copilot Enterprise** | Có thêm: **Knowledge Base** (dùng nguồn nội bộ: docs, repo riêng) `[Q36, 127]`, **custom models** (học theo pattern/repo riêng của tổ chức) `[Q58, 128]`, hỗ trợ tóm tắt PR (prose summary + bulleted changes) trong code review `[Q34]`, cho phép **thu thập prompt & suggestion** để phân tích `[Q125]` |
| **Copilot for Azure DevOps** | Dùng riêng trong Azure DevOps, **không cần license GitHub Enterprise** `[Q14]` |

**Feature có ở mọi IDE được hỗ trợ chính thức (Enterprise)**: Chat + Inline suggestions `[Q21]`. Feature của Individual khi dùng extension (VS/VS Code/JetBrains): Chat + Inline completions `[Q37]`.

**Data retention (Business/Enterprise)**: Prompt & Suggestion lưu tối đa **28 ngày** `[Q33]`.

**Knowledge Base trả lời được về**: code snippets, docs, và nội dung nội bộ khác (Enterprise only) `[Q30]`.

---

## 5. Quản trị tổ chức (Admin, Policy, Audit log, Metrics)

- **Audit log** trong Business: mục đích chính là **theo dõi hành động của admin** trong tổ chức (không phải theo dõi từng dòng code) `[Q32]`; xem trong **Organization Settings → Audit log** `[Q131]`; có thể track thay đổi cấu hình content exclusion `[Q112]`
- **Policy tổ chức** (giới hạn Copilot chỉ dùng ở 1 số repo): cấu hình trong **Organization settings → Copilot → Policies** `[Q15, 22]`
- **Usage metrics API**: cho biết số lượng gợi ý được chấp nhận, so sánh hiệu năng dev khi có/không Copilot → dùng để đánh giá ROI, cải thiện quy trình dev `[Q23, 27]`
- **REST API** để quản lý subscription Business: có endpoint add teams vào subscription của tổ chức `[Q43]`; API subscription cũng dùng để **liệt kê seat đã gán** `[Q16]`

---

## 6. Content Exclusion (rất hay bị hỏi — học kỹ phần này)

- **Mục đích**: ngăn Copilot dùng nội dung của repo/file/folder cụ thể làm context để gợi ý code `[Q104, 165]` — có thể loại trừ ở cấp **repository, file, folder** (3 cấp)
- **Hiệu lực update**: cần tối đa **~30 phút** để rule mới có tác dụng `[Q113, 167]`
- **Giới hạn quan trọng**: chỉ áp dụng cho **Git repository** — có thể bị "lách" nếu nội dung bị exclude vẫn được **tham chiếu gián tiếp** trong code khác (referenced trong file khác không bị exclude) thì Copilot vẫn có thể "thấy" `[Q103, 139]`
- **Chỉ có ở Business/Enterprise**, Individual không có (muốn dùng phải nâng cấp) `[Q105]`
- **Cách kiểm tra khi không hoạt động**: check xem user có thuộc org đã bật content exclusion không + check cấu hình đúng repo/file chưa `[Q106]`
- **Nơi xem lý do suggestion bị chặn do exclusion**: icon Copilot ở **status bar** của editor sẽ hiện thông báo `[Q100]`
- **Hiệu ứng khi bật**: nội dung bị loại không dùng làm context nữa, và **Copilot cũng không đưa ra gợi ý trong chính file bị exclude đó** `[Q116, 151]`

---

## 7. Bộ lọc bảo vệ bản quyền / nội dung độc hại

- **Duplication detection filter** (public code filter): chặn gợi ý trùng khớp với public code trên GitHub nếu đoạn trùng khoảng **~150 ký tự** trở lên `[Q61, 111, 153]`
- **Cách hoạt động**: chạy suggestion qua bộ lọc so khớp với mã nguồn public đã index để tránh xuất verbatim code có bản quyền `[Q59, 110, 176]`
- **Để bảo vệ chống vi phạm IP**: bật cấu hình **"block suggestions matching public code"** — nhưng vẫn cần tự review trước khi accept, filter không tự động bảo đảm 100% `[Q39, 102]`
- **Toxicity filter**: chặn nội dung như hate speech/phân biệt, nội dung khiêu dâm/gợi dục... (chọn 2 đáp án dạng "sexually suggestive", "hate speech") `[Q8, 117]`

---

## 8. Slash Commands & CLI

| Lệnh | Chức năng |
|---|---|
| `/fix` | Đề xuất sửa lỗi cho đoạn code được chọn (proposes fix cho issue phát hiện được) `[Q18, 89]` |
| `/optimize` | Cải thiện hiệu năng đoạn code đã chọn (phân tích rồi tối ưu) `[Q13, 172]` |
| `/tests` | Sinh unit test cho đoạn code được chọn `[Q94, 98, 166]` |

**CLI (`gh copilot`)**: dùng `gh copilot suggest` → nhập câu lệnh cần → chọn gợi ý phù hợp `[Q24, 118, 132]`. CLI dùng để cấu hình được cả **usage analytics** `[Q29]`.

**Nhiều gợi ý cùng lúc**: mở **completions panel** trong editor `[Q35, 126, 133]`.

**Lỗi thường gặp khi suggestion không hoạt động** (chọn 3): mất kết nối internet, ngôn ngữ không được hỗ trợ, chưa có license hợp lệ `[Q26]`.

---

## 9. Cơ chế nội bộ (data flow, life cycle)

**Vòng đời một suggestion**: (1) thu thập context của user (capture context) → (2) generate suggestion `[Q50]`.

**Check bổ sung trước khi trả suggestion cho user**: kiểm tra tương thích với setting của user/tổ chức + kiểm tra trùng public code (nếu bật) `[Q52]`.

**Proxy service** (thành phần trung gian xử lý request) được host trên **Microsoft Azure** `[Q62, 170]`.

**Deprecated code**: nếu training data chứa nhiều pattern cũ, Copilot vẫn có thể gợi ý syntax/feature đã deprecated `[Q49]` — do model học theo pattern phổ biến trong data (kể cả pattern lỗi thời) `[Q48, 160]`.

---

## 10. Ứng dụng trong SDLC (Requirement → Design → Code → Test → Maintain)

- **Requirements analysis**: gợi ý template/snippet giúp document requirement `[Q63]`
- **Design phase**: gợi ý design pattern & best practice `[Q75, 149]`
- **Refactoring**: cải thiện readability, gợi ý cấu trúc tốt hơn — nhưng **không đảm bảo luôn tối ưu/best-practice**, vẫn cần review `[Q73, 76, 86, 120, 130]`
- **Giảm boilerplate**: gợi ý đoạn code tái sử dụng được giữa các phần dự án `[Q80, 147]`
- **Documentation**: gợi ý mô tả/summary dựa theo code có sẵn `[Q79]`
- **Giảm context switching**: cho phép dev ở lại trong IDE thay vì tra cứu ngoài `[Q77]`
- **Maintain codebase cũ**: giới hạn là đôi khi không hiểu hết context/dependency phức tạp `[Q78]`
- **Học ngôn ngữ mới / modernize app**: Chat hỗ trợ giải thích, hướng dẫn theo pattern hiện đại — nhưng KHÔNG tự động refactor toàn bộ app `[Q85, 87, 161, 178]`
- **Sinh dữ liệu mẫu (sample/test data)**: dựa trên gợi ý pattern có sẵn `[Q88]`

**Về testing (nhóm câu hỏi rất nhiều)**:
- Yếu tố quan trọng nhất để Copilot phát hiện thiếu test: phải cấp đủ **context** (project structure, test suite hiện có...) `[Q92]`
- Vẫn cần code review sau khi Copilot viết test, vì test sinh ra **không đảm bảo bao phủ hết edge case** `[Q97, 129]`
- Copilot thường chỉ sinh **unit test cơ bản** cho core functionality, cần dev bổ sung thêm để coverage đầy đủ `[Q99, 158]`
- Copilot giúp **nhất quán style test** bằng cách học pattern viết test hiện có của bạn `[Q93, 148]`
- Muốn Copilot tuân theo chuẩn testing riêng của công ty: đưa ví dụ cụ thể (specific prompt examples) vào chat `[Q91]`

**Team benefit**: dùng Copilot trong team giúp tăng **tính nhất quán code** (consistency) vì gợi ý dựa trên pattern chung của repo `[Q177]`.

---

## Mẹo làm bài / bẫy hay gặp

1. Nhiều câu hỏi lặp lại 2–3 lần với **thứ tự đáp án bị đảo** (A↔B↔C↔D) — học theo **nội dung đáp án**, đừng học theo chữ cái.
2. Phân biệt kỹ: **Content Exclusion** (loại file khỏi context, Business+) vs **Duplication/Public code filter** (chặn code trùng public repo, mọi gói có bật được ở cấp org).
3. Copilot **Individual** = cá nhân, không có admin feature (exclusion, audit log...). Cần feature quản trị → luôn nghĩ tới **Business/Enterprise**.
4. Câu hỏi dạng "cần thận trọng điều gì" gần như luôn quy về: **Copilot dựa trên pattern thống kê, không verify tính đúng đắn (toán học, logic, bảo mật) — con người vẫn phải review**.
5. Retention: **28 ngày** cho prompt/suggestion (Business/Enterprise). Content exclusion update: **~30 phút**. Duplication filter ngưỡng: **~150 ký tự**.
