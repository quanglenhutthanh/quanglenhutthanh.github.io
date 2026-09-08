---
title: "GH-300 — Use case luyện đề thi thử"
subject: "frontier-transformation-engineer"
type: lecture
lecture_no: 10
status: reading
source: web
tags: [gh-300, github-copilot, certification, exam-review, use-cases, practice]
date: 2026-09-08
---

# GH-300 — Use case luyện đề thi thử

> Các tình huống rút ra từ bộ đề thi thử 60 câu (đợt 2026-09-06/08), tổ chức theo **7 domain skills measured** của GH-300. Mỗi mục gồm: **bối cảnh đầy đủ** → **đáp án** → **vì sao / bẫy**. Bản tóm tắt lý thuyết ở [Tóm tắt ôn thi GH-300](gh-300-exam-review.md).

## Trọng số 7 domain (bản study guide hiện hành)

| # | Domain | Trọng số |
|---|---|---|
| 1 | Responsible AI | 7% |
| 2 | GitHub Copilot plans and features | 31% |
| 3 | How GitHub Copilot works and handles data | 15% |
| 4 | Prompt crafting and prompt engineering | 9% |
| 5 | Developer use cases for AI | 14% |
| 6 | Testing with GitHub Copilot | 9% |
| 7 | Privacy fundamentals and context exclusions | 15% |

Domain 2 và domain 7 chiếm gần nửa đề — đúng như quan sát thực tế: **gói dịch vụ, quản trị tổ chức và content exclusion** là ba chủ đề bị hỏi đi hỏi lại nhiều nhất.

---

## Domain 2 — GitHub Copilot plans and features (31%)

### 2.1. Chat features truy cập được từ trong IDE

**Bối cảnh:** Đề hỏi khi dùng một IDE có cài plug-in GitHub Copilot được hỗ trợ, những tính năng Chat nào truy cập được **từ bên trong IDE**. Bốn phương án gồm: generate unit tests, plan coding tasks, find out about releases and commits, explain code and suggest improvements. Chọn hai.

**Đáp án:** **Generate unit tests** + **Explain code and suggest improvements**.

**Vì sao / bẫy:** Chat trong IDE làm việc trên **code đang mở trong editor** — `/tests`, `/explain`, `/fix` đều chỉ cần context file/selection hiện tại. "Find out about releases and commits" là khả năng của Copilot Chat **trên github.com** (nơi Chat có ngữ cảnh metadata repo: commit, release, issue, PR). "Plan coding tasks" không nằm trong bộ feature Chat của IDE. Quy tắc: hỏi "trong IDE" ⇒ nghĩ tới thứ nằm trong **code đang mở**; hỏi "trên github.com" ⇒ nghĩ tới **metadata repo**.

### 2.2. Hai setting cấu hình được của Copilot in the CLI

**Bối cảnh:** Công ty dùng GitHub Copilot in the CLI. Đề hỏi `gh copilot` cho phép cấu hình những setting nào, chọn hai trong: usage analytics, default execution confirmation, default editor, GitHub CLI subcommands.

**Đáp án:** **Usage analytics** + **The default execution confirmation**.

**Vì sao / bẫy:** `gh copilot config` chỉ hiện đúng 2 mục: **Optional Usage Analytics** (có gửi dữ liệu sử dụng về GitHub không) và **Default Execution Confirmation** (có hỏi xác nhận trước khi chạy lệnh gợi ý không). Extension `gh-copilot` cố ý tối giản: chỉ `suggest`, `explain`, `config`. Bẫy là trộn setting của **GitHub CLI (`gh`)** nói chung — default editor đặt bằng `gh config set editor`, còn "subcommands" (`gh pr`, `gh issue`…) là cấu trúc lệnh do code định nghĩa, không phải setting bật/tắt.

### 2.3. Bề mặt nào tương tác được với Copilot

**Bối cảnh:** Đề hỏi phương thức nào dùng được để tương tác với GitHub Copilot, một đáp án. Phương án gồm: watch window trong phiên debug của IDE, chat trong NeoVim, GitHub CLI đã cấu hình đúng, và web browser tại `https://github.copilot.com`.

**Đáp án:** **By using a properly configured GitHub CLI.**

**Vì sao / bẫy:** Cần `gh extension install github/gh-copilot` + `gh auth login` + license hợp lệ, sau đó dùng `gh copilot suggest` / `gh copilot explain`. Ba bẫy: (1) **watch window** là công cụ theo dõi biến của debugger, không phải giao diện Copilot; (2) **NeoVim chỉ có code completion** (`copilot.vim`, inline ghost text), **không có Copilot Chat chính thức** — bảng supported IDEs của GitHub để Neovim ✓ completion, ✗ Chat; plugin cộng đồng `CopilotChat.nvim` là bên thứ ba, đề không tính; (3) URL `github.copilot.com` là bịa, đúng phải là **github.com/copilot**.

### 2.4. Knowledge Base trả lời được về loại nội dung nào

**Bối cảnh:** Tổ chức dùng Copilot Enterprise và đã cấu hình Knowledge Base. Đề hỏi Knowledge Base trả lời câu hỏi về những loại nội dung nào, chọn ba trong: screenshots, code snippets, documentation, compiled binaries, design patterns.

**Đáp án:** **code snippets** + **documentation** + **design patterns**.

**Vì sao / bẫy:** Knowledge Base index **nội dung dạng text** trong các repo/thư mục Markdown mà tổ chức chỉ định, rồi trả lời kèm trích nguồn. Cả ba đáp án đúng đều là văn bản model đọc và embed được. Loại thẳng mọi **artifact nhị phân hoặc media**: screenshot là ảnh, compiled binary không có ngữ nghĩa text. Nhớ kèm: Knowledge Base là feature **Enterprise-only**, cùng nhóm với custom models và PR summary.

### 2.5. Chọn gói cho công ty để code ở Bitbucket, cần tích hợp Okta

**Bối cảnh:** Một công ty đang lưu code trên **Bitbucket** và muốn dùng GitHub Copilot. Yêu cầu bổ sung: phải **tích hợp được với Identity Provider** (ví dụ Okta) để quản lý người dùng. Đề hỏi gói Copilot nào phù hợp nhất.

**Đáp án:** **GitHub Copilot Business for non-GHE customers.**

**Vì sao / bẫy:** Hai manh mối phải khớp cùng lúc — code **không** nằm trên GitHub, và cần **IdP**. GitHub có đường đi riêng cho tình huống này: doanh nghiệp không dùng GitHub để chứa code vẫn mua được Copilot Business, tạo enterprise account chỉ để quản lý license, bật SAML SSO / SCIM với Okta hoặc Entra ID để cấp và thu hồi seat. **Copilot Enterprise yêu cầu GitHub Enterprise Cloud** — công ty Bitbucket không đủ điều kiện, mà mọi feature Enterprise (Knowledge Base cần repo GitHub để index, custom model cần codebase GitHub, PR summary cần pull request GitHub) đều vô dụng với họ. "GitHub Copilot Teams" là **tên bịa** — gói thật: Free, Individual (Pro/Pro+), Business, Enterprise, + Copilot for Azure DevOps.

⚠️ **Bank đề tự mâu thuẫn ở câu này**: có bản key ghi Enterprise. Key đó sai — nhiều khả năng người ra đề lẫn giữa **enterprise account** (vỏ tổ chức để quản lý billing/SSO, dùng được với gói Business) và **gói Copilot Enterprise** (sản phẩm). Gặp kịch bản này trong thi thật ⇒ chọn **Business**.

---

## Domain 3 — How Copilot works and handles data (15%)

### 3.1. Copilot Individual dùng prompt data như thế nào

**Bối cảnh:** Đề hỏi phát biểu nào mô tả đúng cách **GitHub Copilot Individual** sử dụng prompt data, chọn hai. Phương án gồm: dùng nội bộ để cải thiện search engine, lưu không mã hoá cho nhanh, real-time input giúp sinh gợi ý context-aware, và prompt data được dùng để train model.

**Đáp án:** **Real-time user input helps generate context-aware code suggestions** + **Prompt data is used to train machine learning models for better code suggestions**.

**Vì sao / bẫy:** Với gói **Individual**, GitHub **mặc định có thể** dùng prompt/suggestion để cải thiện model — user phải **tự opt-out** trong account settings. Ngược lại **Business/Enterprise mặc định loại trừ** dữ liệu này khỏi training. Hai phương án sai: prompt data không phục vụ search engine của GitHub; và dữ liệu luôn được **mã hoá cả in transit lẫn at rest** — bất kỳ phương án nào nói "unencrypted", "lưu vĩnh viễn" hay "chia sẻ công khai" đều sai. Nếu đề đổi sang **Business/Enterprise** thì chính mệnh đề "dùng để train model" trở thành **sai**.

### 3.2. Tác động của kỹ thuật Fill-In-the-Middle

**Bối cảnh:** Đề hỏi kỹ thuật **Fill-In-the-Middle (FIM)** ảnh hưởng thế nào tới gợi ý code của Copilot.

**Đáp án:** **Cải thiện gợi ý bằng cách xét cả prefix và suffix của code, điền phần giữa chính xác hơn.**

**Vì sao / bẫy:** Model chỉ đọc prefix (left-to-right completion thuần) dễ sinh code lạc hướng khi con trỏ nằm **giữa file đã có sẵn**. FIM cho model thấy cả phần dưới con trỏ, nên biết đoạn cần sinh phải khớp với code phía sau (ví dụ thấy `return total` ở dưới thì biết phải cập nhật biến `total`). Ba phương án sai: "chỉ prefix" là mô hình **trước khi có** FIM; "bỏ qua cả prefix lẫn suffix, chỉ dùng comment" là ngược hoàn toàn; "chỉ dùng external database" là bịa — FIM là kỹ thuật sắp xếp context, không liên quan truy vấn CSDL ngoài.

---

## Domain 5 — Developer use cases for AI (14%)

### 5.1. Lấy gợi ý inline để refactor code

**Bối cảnh:** Đề hỏi cách dùng Copilot để nhận **inline suggestions** phục vụ refactor. Phương án gồm: thêm comment rồi kích hoạt gợi ý, bôi đen code → chuột phải → chọn một gợi ý, và dùng lệnh `/fix` trong inline chat.

**Đáp án:** **Thêm comment vào code rồi kích hoạt gợi ý** + **dùng `/fix` trong GitHub Copilot in-line chat**.

**Vì sao / bẫy:** Hai cách đều cho kết quả **ngay tại chỗ trong editor**: comment mô tả ý định → ghost text; hoặc `Cmd+I` / `Ctrl+I` mở inline chat trên đoạn đang chọn → `/fix` → trả về **diff trong editor** để Accept/Discard. Bẫy là "highlight → right-click → **select a suggestion**": menu chuột phải có mục Copilot nhưng chỉ **khởi động** lệnh (thường mở Chat panel), **không có** thao tác chọn gợi ý trong menu, và không phải đường inline. Từ khoá **"inline"** trong đề ⇒ nghĩ **ghost text** hoặc **inline chat + slash command**.

### 5.2. Copilot giúp gì khi học một ngôn ngữ lập trình mới

**Bối cảnh:** Đề hỏi Copilot hỗ trợ ra sao khi lập trình viên học ngôn ngữ mới. Phương án gồm: Chat hướng dẫn các tác vụ/thử thách thường gặp trong ngôn ngữ đích, lệnh `/understand` giúp Copilot hiểu code viết bằng ngôn ngữ đích, chuyển comment thành code để nắm cú pháp, và trả lời từ documentation của tổ chức.

**Đáp án:** **Chat hướng dẫn các tác vụ/thử thách coding thường gặp trong ngôn ngữ đích** + **chuyển comment thành code để nắm cú pháp và sắc thái ngôn ngữ**.

**Vì sao / bẫy:** `/understand` **không tồn tại** — chức năng đó là của **`/explain`**. Đây là dạng bẫy "slash command bịa" xuất hiện rất nhiều: `/understand`, `/refactor`, `/translate`, `/convert`, `/review`, `/debug` đều không có thật. Lệnh thật: `/explain`, `/fix`, `/tests`, `/doc`, `/optimize`, `/help`, `/clear`, `/new`. Phương án "documentation của tổ chức" mô tả đúng **Knowledge Base** nhưng đó là feature Enterprise phục vụ tra cứu tri thức nội bộ — docs nội bộ công ty không dạy bạn cú pháp Rust.

### 5.3. Use case nào Copilot Chat phát huy hiệu quả nhất

**Bối cảnh:** Đề đưa bốn tình huống và hỏi Copilot Chat hiệu quả nhất ở đâu, chọn hai: tạo kịch bản performance testing end-to-end cho web app, giải thích code COBOL legacy rồi dịch sang C#, viết technical requirement specification từ tài liệu nghiệp vụ, và tạo kịch bản unit test cho code Python vừa viết.

**Đáp án:** **Giải thích COBOL legacy và dịch sang C#** + **tạo unit test cho code Python mới**.

**Vì sao / bẫy:** Điểm chung của hai đáp án đúng: **đầu vào là code đang mở trong editor**, kết quả kiểm chứng được ngay. Dịch legacy code là use case flagship GitHub luôn nêu — model biết cả hai ngôn ngữ nên bắc cầu được, cực giá trị khi nhóm không còn ai đọc được COBOL. Hai phương án sai: **technical spec từ business requirement doc** — tài liệu nghiệp vụ nằm ở Confluence/SharePoint, không có trong context của Chat, và bài toán cần hiểu bối cảnh tổ chức chứ không phải code; **performance test end-to-end** — cần baseline hiệu năng thật, mô hình tải, topology hạ tầng, SLA, toàn bộ là dữ liệu runtime mà Copilot không quan sát được (nhớ: Copilot **không chạy code**). Câu hỏi sàng lọc: *"đầu vào có phải code đang mở không?"*

### 5.4. Copilot Chat giúp gì cho việc sửa lỗi bảo mật

**Bối cảnh:** Đề hỏi Copilot Chat hỗ trợ khắc phục vấn đề bảo mật trong codebase bằng cách nào. Một phương án nói Chat cung cấp **báo cáo chi tiết về các lỗ hổng có trong codebase**, phương án khác nói Chat **annotate các gợi ý bằng pattern lỗ hổng đã biết**.

**Đáp án:** **By annotating the given suggestions with known vulnerability patterns.**

**Vì sao / bẫy:** Copilot có **vulnerability prevention system** chạy trên chính output nó sinh ra, đối chiếu với tập pattern đã biết (hardcoded credentials, SQL injection, path injection, thuật toán mã hoá yếu) rồi chặn hoặc cảnh báo — phạm vi là **đoạn code đang được gợi ý**, theo thời gian thực. Copilot **không** quét toàn codebase và **không** sinh báo cáo/alert bảo mật: nó chỉ thấy context cục bộ, hoạt động theo pattern thống kê chứ không phân tích dataflow/taint như CodeQL, và không có cơ chế severity hay Security tab. Việc "báo cáo lỗ hổng toàn repo" thuộc về **GitHub Advanced Security**: CodeQL/code scanning, secret scanning, Dependabot. Ranh giới: **Copilot = phòng ngừa lúc viết code (proactive, cục bộ)** vs **Advanced Security = phát hiện sau khi code đã có (reactive, toàn repo)**.

---

## Domain 2/5 — Quản trị tổ chức: Audit log & Metrics

### A.1. Hoạt động nào của Copilot Business được audit log ghi lại

**Bối cảnh:** Tổ chức dùng Copilot Business và muốn biết organization audit log theo dõi được hoạt động nào. Các phương án xoay quanh: code suggestions do Copilot tạo ra, gợi ý bị duplication detection filter chặn, thay đổi cấu hình content exclusion, và chat suggestions được chấp nhận. Đề này **lặp lại ít nhất 2 lần** trong bank với bộ phương án khác nhau.

**Đáp án:** **Changes to content exclusion settings.**

**Vì sao / bẫy:** Audit log ghi **sự kiện cấu hình/quyền do admin thực hiện**, KHÔNG ghi **sự kiện runtime của từng gợi ý**. ✅ Có ghi: đổi cấu hình content exclusion, cấp/thu hồi seat, bật/tắt duplication filter ở cấp policy, đổi policy Copilot, thêm/xoá member. ❌ Không ghi: gợi ý bị filter chặn, từng dòng code Copilot gợi ý hay developer accept, nội dung prompt. Ba lý do: khối lượng log khổng lồ và vô nghĩa cho compliance; **không có chủ thể hành động** (filter tự động khớp pattern, không ai "quyết định" chặn); và ghi lại sẽ đụng cam kết privacy về prompt/suggestion. Câu thần chú: **audit log theo dõi admin, không theo dõi developer** — chọn phương án có động từ mang chủ thể admin (*changes to…*, *granted/revoked…*, *enabled/disabled…*), loại mọi phương án nói về *suggestion* dù là made, blocked hay accepted.

### A.2. Usage metrics API cung cấp insight gì

**Bối cảnh:** Tổ chức muốn đánh giá hiệu quả triển khai Copilot và định dùng **usage metrics API**. Đề hỏi API cung cấp loại insight nào, chọn hai — trong đó có "số lượng code suggestion được chấp nhận và sử dụng trong tổ chức", "chỉ số acceptance riêng cho Copilot Chat", và "feedback về coding style và mức tuân thủ chuẩn".

**Đáp án:** **Số code suggestion được accept** + **chỉ số acceptance riêng cho Copilot Chat**.

**Vì sao / bẫy:** Metrics API trả về **số liệu định lượng tổng hợp theo tổ chức**: tổng gợi ý hiển thị, số được accept, số dòng accept, active users; **nhóm chỉ số riêng cho Chat** (số lượt chat, gợi ý từ chat được accept/insert/copy); phân rã theo **ngôn ngữ** và **editor/IDE**; giữ khoảng 28 ngày. Việc **đánh giá coding style / standards compliance** nằm ngoài khả năng: API không chứa nội dung code (privacy), không có định nghĩa "chuẩn" của từng team để đối chiếu, và đó là việc của **linter/formatter, CodeQL, code review**. Câu thần chú: Metrics API trả lời **"bao nhiêu"**, không trả lời **"tốt hay xấu"**.

---

## Domain 7 — Privacy fundamentals & context exclusions (15%)

### 7.1. Kiểm tra gì khi content exclusion không hoạt động

**Bối cảnh:** Admin đã cấu hình content exclusion nhưng developer báo Copilot vẫn gợi ý dựa trên file lẽ ra bị loại trừ. Đề hỏi cần kiểm tra những gì, chọn hai. Phương án gồm: thay đổi cấu hình đã quá 30 phút chưa, Copilot có kết nối được tới server chọn trong user settings không, user có thuộc org đã cấu hình exclusion không, và user có thuộc "content exclusion team" không.

**Đáp án:** **Thay đổi cấu hình trong vòng 30 phút gần đây hay trước đó** + **Copilot có kết nối được tới server chọn trong user settings không**.

**Vì sao / bẫy:** Cả hai phản ánh cùng một cơ chế: **rule nằm ở server, client phải sync về, và việc sync có độ trễ**. Rule cần **~30 phút** mới có hiệu lực (hoặc reload IDE để nạp lại). Nếu IDE trỏ nhầm host (GitHub.com vs GHES) hoặc bị proxy/firewall chặn, client không tải được rule → hành xử như thể không có exclusion nào. Hai phương án sai: "user thuộc org đã cấu hình exclusion" là **điều kiện tiên quyết** chứ không phải bước chẩn đoán; **"content exclusion team" là khái niệm bịa** — exclusion cấu hình ở cấp **repository hoặc organization**, không gán theo team.

⚠️ Một câu khác trong bank (`[Q106]`) lại lấy đáp án "check user có thuộc org đã bật exclusion + đã cấu hình đúng repo/file chưa". Khác biệt nằm ở **bộ phương án**: khi đề có hai mục doc-verbatim (30 phút + server connectivity) thì chọn chúng; khi không có, mới xét tới điều kiện org/repo.

### 7.2. Khi nào Copilot vẫn dùng được nội dung đã bị loại trừ

**Bối cảnh:** Một file đã được đưa vào content exclusion. Đề hỏi trong trường hợp nào Copilot **vẫn sử dụng được** nội dung đó. Phương án gồm: exclusion cấu hình ở cấp enterprise bị ghi đè ở cấp org, khi user prompt với `@workspace`, khi repo settings cho phép user override, và khi nội dung file bị loại trừ được **tham chiếu trong code không bị loại trừ** (ví dụ lời gọi hàm).

**Đáp án:** **Khi nội dung của file bị loại trừ được tham chiếu trong code không bị loại trừ, ví dụ các lời gọi hàm.**

**Vì sao / bẫy:** Exclusion loại **file khỏi context**, không xoá dấu vết của nó khỏi phần còn lại của codebase. Copilot không đọc được **thân hàm** trong file bị exclude, nhưng vẫn thấy **tên hàm, chữ ký, cách gọi** vì chúng nằm trong file khác không bị loại trừ. Ba phương án sai: rule exclusion mang tính **cộng dồn (additive)** — org/repo chỉ **thêm** rule, không thể nới lỏng hay huỷ rule cấp trên (nếu ghi đè được thì tính năng bảo mật này vô nghĩa); `@workspace` mở rộng context toàn project nhưng **vẫn tôn trọng** exclusion; và **không có** cơ chế cho developer tự override rule.

### 7.3. Giới hạn của content exclusion

**Bối cảnh:** Đề hỏi đâu là một **giới hạn** của content exclusion. Đáp án key: "content exclusions có thể bị lách vì chỉ áp dụng cho **Git repositories**".

**Đáp án:** **Có thể lách được vì exclusion chỉ áp dụng cho Git repository.**

**Vì sao / bẫy:** Client Copilot khớp rule qua **Git remote URL** của workspace. Từ đó có ba cách lách, không cần quyền admin: mở file **ngoài Git repo** (không có remote để khớp), clone/đổi remote sang URL khác với URL đã cấu hình rule, hoặc dán nội dung sang file không thuộc phạm vi rule. Phương án sai điển hình: "chỉ có ở gói Individual" — **ngược hoàn toàn**, Individual **không hề có** content exclusion, đây là feature của **Business/Enterprise**.

**Bốn giới hạn cần thuộc** (đề hỏi xoay vòng giữa chúng):

| # | Giới hạn | Bản chất |
|---|---|---|
| 1 | Lộ qua **code tham chiếu** ở file không bị loại trừ | Lộ **thụ động**, ngoài ý muốn |
| 2 | **Lách được** vì rule gắn theo Git repository | Lách **chủ động**, user cố ý |
| 3 | Cần **~30 phút** để rule có hiệu lực | Độ trễ propagation |
| 4 | **Không có ở Individual** | Giới hạn theo gói |

⇒ Content exclusion là **rào chắn mềm** giúp giảm rủi ro, **không phải cơ chế bảo mật cưỡng chế**. Nó không thay thế secret management hay phân quyền repo.

---

## Tổng hợp bẫy hay gặp trong bộ đề này

### Tên/lệnh bịa — thấy là loại ngay

| Loại | Tên bịa | Tên thật |
|---|---|---|
| Slash command | `/understand`, `/refactor`, `/translate`, `/convert`, `/review`, `/debug` | `/explain`, `/fix`, `/tests`, `/doc`, `/optimize`, `/help`, `/clear`, `/new` |
| Gói dịch vụ | "GitHub Copilot Teams" | Free, Individual (Pro/Pro+), Business, Enterprise, Copilot for Azure DevOps |
| Khái niệm quản trị | "content exclusion team" | Exclusion cấu hình ở cấp **repo** hoặc **org** |
| URL | `github.copilot.com` | **github.com/copilot** |

### Cặp khái niệm hay bị đánh tráo

| Vế A | Vế B | Ranh giới |
|---|---|---|
| Chat trong **IDE** | Chat trên **github.com** | Code đang mở ↔ metadata repo (commit, release, PR) |
| `gh copilot config` | `gh config` | 2 setting của extension ↔ setting của GitHub CLI nói chung |
| **Audit log** | **Metrics API** | Ai đổi cấu hình gì ↔ số liệu tổng hợp usage |
| **Copilot** | **Advanced Security** | Phòng ngừa lúc viết code ↔ quét toàn repo, sinh alert |
| **Business** | **Enterprise** | Quản trị + IdP, code ở đâu cũng được ↔ bắt buộc code trên GitHub |
| **enterprise account** | **gói Copilot Enterprise** | Vỏ tổ chức quản lý billing/SSO ↔ sản phẩm |
| **Neovim** | VS Code / VS / JetBrains / Xcode / Eclipse | Chỉ completion ↔ có Chat chính thức |

### Bốn câu thần chú

1. **Audit log theo dõi admin, không theo dõi developer.**
2. **Metrics API trả lời "bao nhiêu", không trả lời "tốt hay xấu".**
3. **Đầu vào có phải code đang mở không?** — sàng lọc use case của Chat.
4. **Okta / IdP / SSO → Business; Bitbucket / GitLab / không dùng GitHub → loại Enterprise.**
