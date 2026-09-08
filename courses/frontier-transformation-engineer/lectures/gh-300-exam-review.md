---
title: "Tóm tắt ôn thi GH-300 – GitHub Copilot Certification"
subject: "frontier-transformation-engineer"
type: lecture
lecture_no: 7
status: reading
source: pdf
tags: [gh-300, github-copilot, certification, exam-review, cheat-sheet]
date: 2026-09-04
---

# Tóm tắt ôn thi GH-300 – GitHub Copilot Certification

> Tổng hợp từ đề thi thử **180 câu** (thực chất chỉ có **~128 câu gốc**, phần còn lại là câu lặp lại/đổi vị trí đáp án). Số trong ngoặc `[Q..]` là số thứ tự câu trong PDF gốc, để tra lại giải thích đầy đủ khi cần. Đây là 1 trong 3 chứng chỉ nền tảng của lộ trình Frontier Transformation Engineer — xem [Program overview](program-overview.md). So với [AI-103](ai-103-exam-review.md) và [AB-100](ab-100-exam-review.md), GH-300 tập trung vào **GitHub Copilot** (cơ chế, gói dịch vụ, quản trị, ứng dụng SDLC), không phải Azure AI hay kiến trúc agent doanh nghiệp. Các tình huống rút từ đề thi thử (bối cảnh → đáp án → bẫy) ở [GH-300 — Use case luyện đề thi thử](gh-300-exam-use-cases.md).

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

**Chat giúp gì cho bảo mật?** `[Q-mock29]` → **annotate các gợi ý bằng pattern lỗ hổng đã biết** (vulnerability prevention system): hardcoded credentials, SQL injection, path injection, thuật toán mã hoá yếu — chặn/cảnh báo **ngay tại đoạn code đang sinh**.
- ⚠️ Copilot **KHÔNG** quét toàn codebase, **KHÔNG** sinh báo cáo/alert bảo mật. Đó là việc của **GitHub Advanced Security**: **CodeQL/code scanning** (phân tích tĩnh toàn repo), **secret scanning** (credential bị commit), **Dependabot** (CVE trong dependency).
- Ranh giới: **Copilot = phòng ngừa lúc viết code (proactive, cục bộ)** vs **Advanced Security = phát hiện sau khi code đã có (reactive, toàn repo)**. Phương án nào gán cho Copilot việc quét toàn repo / sinh report / "đảm bảo code an toàn" đều SAI.

**Chat trong IDE làm được gì** (khi cài plug-in Copilot cho IDE được hỗ trợ): **generate unit tests** và **explain code + suggest improvements** (kèm answer coding questions, propose fix cho bug) `[Q-mock8]`. Ngược lại, hỏi về **releases/commits/issues/PR của repo** là khả năng của Copilot Chat **trên GitHub.com** (chat có ngữ cảnh repo), không phải feature Chat trong IDE.

**Cách gửi feedback về Copilot Chat** (kể cả trên GitHub Mobile): dùng **emoji/thumbs up-down** ngay trong giao diện Chat `[Q17, 28, 123, 140]`.

---

## 4. Gói dịch vụ & giá (Individual / Business / Enterprise / Azure DevOps)

| Gói | Đặc điểm chính |
|---|---|
| **Copilot Individual** | Cho cá nhân/freelancer; **miễn phí cho học sinh, giáo viên, maintainer dự án open-source** `[Q31]`; billed theo tháng hoặc năm (subscription) `[Q42]`; **không có** content exclusion (muốn loại trừ file phải nâng lên Business) `[Q105]`; phù hợp cho contractor làm nhiều khách hàng khác nhau nếu khách không có yêu cầu riêng `[Q159]` |
| **Copilot Business** | Dành cho tổ chức; có content exclusion, audit log, quản lý qua REST API; loại trừ data (usage/prompts/suggestions) khỏi việc train model mặc định `[Q19]`; phù hợp công ty quản lý user qua Identity Provider (Okta...) kể cả khi không dùng GitHub Enterprise `[Q47]` |
| **Copilot Enterprise** | Có thêm: **Knowledge Base** (dùng nguồn nội bộ: docs, repo riêng) `[Q36, 127]`, **custom models** (học theo pattern/repo riêng của tổ chức) `[Q58, 128]`, hỗ trợ tóm tắt PR (prose summary + bulleted changes) trong code review `[Q34]`, cho phép **thu thập prompt & suggestion** để phân tích `[Q125]` |
| **Copilot for Azure DevOps** | Dùng riêng trong Azure DevOps, **không cần license GitHub Enterprise** `[Q14]` |

**Chọn gói theo tình huống** `[Q47, Q-mock34]`: đề nêu **code ở Bitbucket/GitLab (không dùng GitHub)** + muốn tích hợp **Identity Provider (Okta)** ⇒ chọn **Copilot Business for non-GHE customers** (standalone, không cần license GitHub Enterprise, quản lý user qua IdP).
- ⚠️ Bẫy "khó thì chọn gói cao nhất": **Enterprise gắn chặt với GitHub Enterprise Cloud** — Knowledge Base cần repo GitHub để index, custom model cần codebase GitHub, PR summary cần pull request GitHub. Code ở Bitbucket ⇒ mọi feature Enterprise vô dụng mà vẫn trả giá cao nhất.
- **"GitHub Copilot Teams" là tên BỊA** — gói thật: Free, Individual (Pro/Pro+), Business, Enterprise, + Copilot for Azure DevOps.
- Thần chú: **Okta / IdP / SSO → Business**; **Bitbucket / GitLab / không dùng GitHub → loại thẳng Enterprise**.
- ⚠️ **Bank đề thi thử tự mâu thuẫn ở câu này**: có bản key ghi Enterprise. Key đó **SAI** — Copilot Enterprise **yêu cầu GitHub Enterprise Cloud**, công ty để code ở Bitbucket không đủ điều kiện mua. Nhiều khả năng người ra đề lẫn giữa **enterprise account** (vỏ tổ chức để quản lý billing/SSO, dùng được với gói Business) và **gói Copilot Enterprise** (sản phẩm). Gặp kịch bản này trong thi thật ⇒ chọn **Business**.

**Feature có ở mọi IDE được hỗ trợ chính thức (Enterprise)**: Chat + Inline suggestions `[Q21]`. Feature của Individual khi dùng extension (VS/VS Code/JetBrains): Chat + Inline completions `[Q37]`.

**Data retention (Business/Enterprise)**: Prompt & Suggestion lưu tối đa **28 ngày** `[Q33]`.

**Prompt data theo gói** `[Q-mock22]`: với **Individual**, prompt/suggestion **mặc định CÓ THỂ được dùng để train model** (user phải tự opt-out trong account settings); với **Business/Enterprise** thì mặc định **bị loại trừ** khỏi training. Dù gói nào, dữ liệu đều được **mã hoá in transit và at rest** — phương án nào nói "stored unencrypted" đều sai. Ngoài ra prompt được lắp từ **ngữ cảnh thời gian thực** trong editor để sinh gợi ý context-aware, không dùng cho việc cải thiện search engine của GitHub.

**Knowledge Base trả lời được về** (Enterprise only): **code snippets**, **documentation**, **design patterns** — tức là nội dung **dạng text** trong repo/Markdown được tổ chức chỉ định `[Q30, Q-mock42]`. Loại thẳng mọi phương án là artifact nhị phân hoặc media: **screenshots**, **compiled binaries**, video...

---

## 5. Quản trị tổ chức (Admin, Policy, Audit log, Metrics)

- **Audit log** trong Business: mục đích chính là **theo dõi hành động của admin** trong tổ chức (không phải theo dõi từng dòng code) `[Q32]`; xem trong **Organization Settings → Audit log** `[Q131]`; có thể track thay đổi cấu hình content exclusion `[Q112]`
  - **Nguyên tắc**: audit log ghi **sự kiện cấu hình/quyền do admin thực hiện**, KHÔNG ghi **sự kiện runtime của từng gợi ý** `[Q-mock36]`. ✅ Có ghi: đổi cấu hình content exclusion, cấp/thu hồi seat, bật/tắt duplication filter (policy), đổi policy Copilot, thêm/xoá member. ❌ Không ghi: **gợi ý bị duplication filter chặn**, từng dòng code Copilot gợi ý hay developer accept, nội dung prompt. Lý do: khối lượng khổng lồ, không có chủ thể hành động, và đụng privacy prompt/suggestion. Câu thần chú: **audit log theo dõi admin, không theo dõi developer** — phương án nào mô tả việc xảy ra lúc dev đang code thì loại. Cụ thể loại hết: *code suggestions made by Copilot*, *suggestions blocked by duplication filtering*, ***accepted chat suggestions*** — cả ba đều là runtime. Chọn phương án có động từ mang chủ thể admin: *changes to…*, *granted/revoked…*, *enabled/disabled…*. Đừng nhầm với **Copilot Metrics / usage report** (số liệu tổng hợp: acceptance rate, active users) — đó là thống kê, không phải audit log.
- **Policy tổ chức** (giới hạn Copilot chỉ dùng ở 1 số repo): cấu hình trong **Organization settings → Copilot → Policies** `[Q15, 22]`
- **Usage metrics API**: cho biết số lượng gợi ý được chấp nhận, so sánh hiệu năng dev khi có/không Copilot → dùng để đánh giá ROI, cải thiện quy trình dev `[Q23, 27]`
  - **Trả về gì** `[Q-mock59]`: tổng gợi ý hiển thị, **số gợi ý được accept**, số dòng accept, active users; **chỉ số riêng cho Copilot Chat** (số lượt chat, gợi ý từ chat được accept/insert/copy); phân rã theo **ngôn ngữ** và **editor/IDE**; dữ liệu giữ ~28 ngày.
  - ❌ **KHÔNG** đánh giá **coding style / standards compliance / chất lượng code** — API chỉ có số liệu tổng hợp, không chứa nội dung code (privacy), và không biết chuẩn riêng của team. Việc đó thuộc **linter/formatter, CodeQL, code review**.
  - Thần chú: Metrics API trả lời **"bao nhiêu"**, không trả lời **"tốt hay xấu"**.
- **REST API** để quản lý subscription Business: có endpoint add teams vào subscription của tổ chức `[Q43]`; API subscription cũng dùng để **liệt kê seat đã gán** `[Q16]`

---

## 6. Content Exclusion (rất hay bị hỏi — học kỹ phần này)

- **Mục đích**: ngăn Copilot dùng nội dung của repo/file/folder cụ thể làm context để gợi ý code `[Q104, 165]` — có thể loại trừ ở cấp **repository, file, folder** (3 cấp)
- **Hiệu lực update**: cần tối đa **~30 phút** để rule mới có tác dụng `[Q113, 167]`
- **Giới hạn quan trọng**: chỉ áp dụng cho **Git repository** — có thể bị "lách" nếu nội dung bị exclude vẫn được **tham chiếu gián tiếp** trong code khác (referenced trong file khác không bị exclude) thì Copilot vẫn có thể "thấy" `[Q103, 139]`
- **Chỉ có ở Business/Enterprise**, Individual không có (muốn dùng phải nâng cấp) `[Q105]`
- **Cách kiểm tra khi không hoạt động**: check xem user có thuộc org đã bật content exclusion không + check cấu hình đúng repo/file chưa `[Q106]`
- **Checklist troubleshoot theo docs GitHub** `[Q-mock52]`: (1) thay đổi rule đã quá **~30 phút** chưa (rule không hiệu lực tức thì; reload IDE để nạp lại); (2) Copilot có **kết nối được tới server chọn trong user settings** không (sai host GitHub.com vs GHES, hoặc proxy/firewall chặn → client không sync được rule về, hành xử như không có exclusion). Cơ chế chung: **rule nằm ở server, client phải sync, có độ trễ**. Không tồn tại khái niệm "content exclusion team" — exclusion cấu hình ở cấp **repo hoặc org**, không theo team. ⚠️ Khi đề có cả 2 mục doc-verbatim này thì chọn chúng; nếu không có, mới xét điều kiện org/repo như `[Q106]`.
- **Giới hạn: khi nào Copilot VẪN dùng được nội dung đã bị loại trừ?** `[Q-mock10]` → **khi nội dung file bị loại trừ được tham chiếu trong code KHÔNG bị loại trừ** (ví dụ lời gọi hàm, import, chữ ký hàm ở file khác). Copilot không đọc được thân file bị exclude, nhưng vẫn thấy tên hàm/tham số/cách dùng ở file còn lại. ⇒ Content exclusion là công cụ **giảm rủi ro**, KHÔNG phải đảm bảo bảo mật.
- **Giới hạn: LÁCH ĐƯỢC vì rule chỉ gắn theo Git repository** `[Q-mock11b]` — client Copilot khớp rule qua **Git remote URL** của workspace. Lách bằng cách: mở file **ngoài Git repo** (không có remote để khớp), clone/đổi remote sang URL khác, hoặc dán nội dung sang file không thuộc phạm vi rule. Không cần quyền admin.
- **4 giới hạn của content exclusion** (đề hỏi xoay vòng): (1) lộ **thụ động** qua code tham chiếu ở file không bị loại trừ; (2) **lách chủ động** được vì rule gắn theo Git repo; (3) độ trễ **~30 phút**; (4) **không có ở Individual** (chỉ Business/Enterprise). ⇒ Là **rào chắn mềm**, không thay thế secret management hay phân quyền repo.
- **Rule exclusion là cộng dồn (additive)**: org/repo chỉ **thêm** rule, **không thể ghi đè hay nới lỏng** rule cấp enterprise; **không có** cơ chế cho user/repo tự override. `@workspace` mở rộng context toàn project nhưng **vẫn tôn trọng** exclusion `[Q-mock10]`.
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
| `/explain` | Giải thích code đang chọn |
| `/doc` | Sinh documentation/comment |
| `/help`, `/clear`, `/new` | Trợ giúp / xoá phiên chat / scaffold project mới |

⚠️ **Bẫy slash command bịa** `[Q-mock8b]`: `/understand`, `/refactor`, `/translate`, `/convert`, `/review`, `/debug` — **KHÔNG tồn tại**. Thấy tên lệnh lạ trong phương án thì loại ngay. Chức năng "hiểu code viết bằng ngôn ngữ X" là của **`/explain`**.

**CLI (`gh copilot`)**: dùng `gh copilot suggest` → nhập câu lệnh cần → chọn gợi ý phù hợp `[Q24, 118, 132]`. `gh copilot config` chỉ cho cấu hình đúng **2 setting**: **Optional Usage Analytics** (gửi dữ liệu sử dụng cho GitHub) và **Default Execution Confirmation** (mặc định có hỏi xác nhận trước khi chạy lệnh gợi ý hay không) `[Q29, Q-mock11]`. Đừng nhầm với setting của **GitHub CLI (`gh`)** nói chung như default editor (`gh config set editor`) hay subcommands — những thứ đó không nằm trong `gh copilot config`.

**Các bề mặt tương tác hợp lệ với Copilot** `[Q-mock25]`: IDE extension (inline suggestion + Chat), **GitHub CLI đã cấu hình đúng** (`gh extension install github/gh-copilot` + `gh auth login` → `gh copilot suggest` / `explain`), **github.com/copilot**, và GitHub Mobile. Lưu ý bẫy: **Neovim chỉ có code completion (`copilot.vim`, inline ghost text), KHÔNG có Copilot Chat chính thức** — trong bảng supported IDEs của GitHub, Neovim có ✓ ở cột completion nhưng ✗ ở cột Chat; Chat chính thức chỉ ở **VS Code, Visual Studio, JetBrains, Xcode, Eclipse** + github.com / Mobile / CLI. (Có plugin cộng đồng `CopilotChat.nvim` nhưng là bên thứ ba, đề không tính.) Ghi nhớ: **Neovim + Chat = sai, Neovim + completion = đúng**. Ngoài ra **watch window** của debugger không phải giao diện Copilot; URL `github.copilot.com` là bịa.

**Lấy gợi ý INLINE để refactor** `[Q-mock30]`: hai cách đúng là (1) **viết comment mô tả ý định** ngay trên code rồi kích hoạt gợi ý (ghost text), (2) mở **inline chat** (`Cmd+I` / `Ctrl+I`) trên đoạn code đã chọn rồi dùng **`/fix`** → trả về diff ngay trong editor để Accept/Discard. ⚠️ Bẫy: "highlight → right-click → **select a suggestion**" là **SAI** — menu chuột phải chỉ *khởi động* lệnh Copilot (thường mở Chat panel), không có thao tác chọn gợi ý trong menu, và không phải đường inline. Từ khoá **"inline"** trong đề ⇒ nghĩ tới **ghost text** hoặc **inline chat + slash command**, không phải context menu / Chat panel.

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
- **Use case Chat mạnh nhất** `[Q-mock-usecase]`: (1) **giải thích code legacy (COBOL...) rồi dịch sang ngôn ngữ khác (C#)** — use case flagship GitHub hay nêu; (2) **sinh unit test** cho code vừa viết. Điểm chung: **đầu vào là code đang mở trong editor**.
  - Loại: **viết technical spec từ business requirement doc** (tài liệu nghiệp vụ nằm ngoài repo, Chat không có context); **thiết kế kịch bản performance test end-to-end** (cần baseline hiệu năng, mô hình tải, hạ tầng, SLA — dữ liệu runtime Copilot không quan sát được).
  - **Câu hỏi sàng lọc**: "đầu vào có phải code đang mở không?" → Có thì chọn, Không thì loại.
- **Học ngôn ngữ mới / modernize app**: Chat hỗ trợ giải thích, hướng dẫn theo pattern hiện đại — nhưng KHÔNG tự động refactor toàn bộ app `[Q85, 87, 161, 178]`
  - Hai cách Copilot giúp **học ngôn ngữ mới** `[Q-mock8b]`: (1) **Chat hướng dẫn** các tác vụ/thử thách thường gặp trong ngôn ngữ đích; (2) **comment → code** để nắm cú pháp và cách viết idiomatic. Loại: lệnh bịa `/understand`, và **Knowledge Base** (docs nội bộ tổ chức, Enterprise-only — không dạy cú pháp ngôn ngữ).
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
