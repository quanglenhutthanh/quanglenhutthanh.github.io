---
title: "Class Imbalance & Distribution Shift"
subject: "machine-learning"
type: lecture
lecture_no: 3
status: done
source: note
tags: [eda, data, class-imbalance, distribution-shift, resampling, monitoring, drift, censoring, psi, importance-weighting]
date: 2026-08-30
---

# Class Imbalance & Distribution Shift

Hai vấn đề này đều thuộc nhóm **"dữ liệu không như ta ngầm giả định"**. Model học được gì, đánh giá ra sao, deploy có bền không — tất cả phụ thuộc vào một giả định thầm lặng: *dữ liệu train, dữ liệu test và dữ liệu production đến từ cùng một phân phối, và các lớp xuất hiện với tần suất "hợp lý"*. Khi giả định này vỡ, model vẫn chạy, vẫn cho ra số, nhưng số đó lừa ta.

- **Class imbalance**: phân phối *nhãn* lệch — một lớp áp đảo về số lượng ngay trong tập train.
- **Distribution shift**: phân phối *thay đổi theo thời gian / theo môi trường* — train khác test, hoặc hôm nay khác hôm qua.

---

## Phần A — Class Imbalance

### A.1. Vấn đề là gì

Bài toán nhị phân với 99% lớp âm, 1% lớp dương (gian lận thẻ, bệnh hiếm, lỗi thiết bị, click quảng cáo…). Một model "ngu" đoán **tất cả là âm** đạt ngay:

- Accuracy = 99%
- Recall lớp dương = 0%
- Hoàn toàn vô dụng, nhưng nhìn qua metric thì "đẹp"

Imbalance không phải lúc nào cũng là vấn đề. Nó thành vấn đề khi **lớp hiếm chính là lớp ta quan tâm**, và khi thuật toán / loss / metric bị lớp đa số kéo đi.

### A.2. Vì sao model học kém trên lớp hiếm

1. **Loss bị lớp đa số chi phối.** Cross-entropy tính trung bình trên toàn bộ mẫu. 99% gradient đến từ lớp âm → optimizer dành gần hết "sức" để tối ưu lớp âm, lớp dương gần như bị làm ngơ. Nghiệm tối ưu loss trung bình ≠ nghiệm ta muốn.
2. **Thiếu tín hiệu.** 1% của 10 000 mẫu = 100 mẫu dương. Không đủ để học được ranh giới phức tạp; model dễ overfit vài mẫu dương hoặc bỏ qua chúng như nhiễu.
3. **Ranh giới quyết định bị đẩy lệch.** Với ngưỡng mặc định 0.5, xác suất hậu nghiệm bị "kéo" về phía lớp đa số → gần như không mẫu nào vượt 0.5.

### A.3. Bốn nhóm cách xử lý

#### (1) Đổi metric — bắt buộc, làm trước tiên

Trước khi đụng vào data hay model, **bỏ accuracy**. Xem [ROC-AUC · PR-AUC · F1](L02-classification-metrics.md):

- Lớp dương hiếm, quan tâm chất lượng cảnh báo → **PR-AUC**, precision/recall theo yêu cầu nghiệp vụ.
- Cần một số so sánh model, không phụ thuộc ngưỡng → **ROC-AUC** (nhưng nhớ ROC-AUC lạc quan hơn thực tế khi lớp lệch nặng).
- Báo cáo vận hành → **F1** hoặc **F-beta** (beta > 1 nếu bỏ sót đắt hơn báo nhầm).
- Luôn đọc metric **so với baseline trên cùng tập**, không đọc số tuyệt đối.

#### (2) Resampling — cân lại dữ liệu

| Cách | Làm gì | Ưu | Nhược |
|------|--------|-----|-------|
| **Random undersampling** | Bỏ bớt mẫu lớp đa số | Nhanh, train nhẹ | Vứt thông tin; dễ mất mẫu biên quan trọng |
| **Random oversampling** | Nhân bản mẫu lớp thiểu số | Không mất data | Overfit vì lặp y hệt; không tạo thông tin mới |
| **SMOTE** | Nội suy mẫu dương mới giữa các mẫu dương lân cận | Tạo mẫu "mới", giảm overfit so với nhân bản | Có thể tạo mẫu ảo trong vùng lớp âm → nhiễu; kém khi nhiều chiều / dữ liệu phân loại |
| **SMOTE biến thể** (Borderline-SMOTE, ADASYN) | Tập trung sinh mẫu gần ranh giới | Đánh vào vùng khó | Nhạy nhiễu, phức tạp hơn |
| **Undersampling thông minh** (Tomek links, ENN) | Bỏ mẫu đa số nằm sát ranh giới / bị nhiễu | Làm sạch ranh giới | Chỉ giảm nhẹ độ lệch |

**Nguyên tắc sống còn:** chỉ resample trên **tập train**, và làm **bên trong** vòng cross-validation. Resample rồi mới split → mẫu ảo/bản sao rò rỉ sang validation → metric ảo cao.

Tập validation / test phải giữ **tỷ lệ lớp thật của production** để đánh giá trung thực.

#### (3) Cost-sensitive learning — đổi loss thay vì đổi data

- **Class weight**: nhân trọng số lớp thiểu số trong loss (ví dụ `class_weight="balanced"` trong sklearn: trọng số ∝ nghịch đảo tần suất lớp). Về mặt hiệu quả gần tương đương oversampling nhưng không phình dữ liệu.
- **Focal loss**: hạ trọng số các mẫu "dễ" (model đã tự tin đoán đúng), dồn gradient vào mẫu khó — sinh ra cho object detection, hữu ích khi lệch cực nặng.
- Ưu điểm chung: không đụng phân phối dữ liệu, dễ tinh chỉnh, không tạo mẫu ảo.
- **Khi vừa có imbalance vừa có distribution shift**, `class_weight` thường **ổn định hơn SMOTE**: SMOTE nội suy mẫu mới từ phân phối *train*, dễ khuếch đại những vùng đặc trưng vốn đã không khớp với production. Class weight chỉ chỉnh trọng số, không đẻ ra mẫu ảo trong vùng lệch.

#### (4) Threshold moving — chỉnh sau khi train

Model vẫn train bình thường; chỉ **chọn lại ngưỡng** thay vì cứng nhắc 0.5:

- Quét ngưỡng trên tập validation, chọn điểm tối ưu theo tiêu chí nghiệp vụ (đỉnh F1, hoặc recall ≥ 0.9 với precision cao nhất có thể, hoặc điểm tối thiểu hoá cost kỳ vọng `cost = c_FP·FP + c_FN·FN`).
- Rẻ, không cần train lại, không làm méo xác suất. Thường nên thử **trước** khi resample.

### A.4. Thứ tự nên làm

1. Đổi metric (PR-AUC / F1 / recall-tại-precision).
2. Thử **class weight** + **threshold moving** — rẻ, thường đủ.
3. Nếu chưa đủ: thêm **SMOTE / undersampling** trong CV.
4. Thu thập thêm dữ liệu lớp hiếm nếu có thể — luôn tốt hơn mọi thủ thuật.
5. Nếu lớp dương cực hiếm (< 0.1%) và "bất thường" hơn là "một lớp": cân nhắc **anomaly detection** thay vì phân loại có giám sát.

### A.5. Bẫy thường gặp

- Resample cả tập rồi mới split → rò rỉ, metric ảo.
- Đánh giá trên tập đã bị cân bằng nhân tạo → không phản ánh production.
- Báo accuracy trên dữ liệu lệch.
- Oversampling bằng nhân bản rồi ngạc nhiên vì overfit.
- Dùng SMOTE với đặc trưng phân loại / nhiều chiều mà không xử lý khoảng cách cho đúng.

---

## Phần B — Distribution Shift

### B.1. Vấn đề là gì

Giả định nền của học có giám sát: dữ liệu train và dữ liệu tương lai **i.i.d. từ cùng phân phối** `P(X, Y)`. Thực tế phân phối trôi:

- Hành vi người dùng đổi, mùa vụ, lạm phát, đối thủ ra sản phẩm mới.
- Cảm biến xuống cấp, đổi nhà cung cấp dữ liệu, đổi pipeline thu thập.
- Model được deploy và **chính nó làm thay đổi hành vi** (ví dụ model gợi ý làm người dùng click khác đi).

Hệ quả: model không "hỏng" đột ngột, nó **thoái hoá âm thầm** — metric offline vẫn đẹp (vì test set cũ), metric online tụt dần.

### B.2. Phân loại shift (rất nên thuộc)

Phân tích `P(X, Y) = P(Y|X) · P(X) = P(X|Y) · P(Y)`:

| Loại | Cái gì đổi | Cái gì giữ nguyên | Ví dụ |
|------|-----------|-------------------|-------|
| **Covariate shift** | `P(X)` — phân phối đầu vào | `P(Y\|X)` — quy luật nhãn theo input | Model tín dụng train ở nhóm khách trẻ, nay áp lên nhóm khách già; quan hệ "thu nhập → khả năng trả nợ" không đổi |
| **Label / prior shift** | `P(Y)` — tỷ lệ lớp | `P(X\|Y)` — đặc trưng của từng lớp | Tỷ lệ gian lận tăng gấp đôi sau kỳ nghỉ lễ; "gian lận trông thế nào" không đổi |
| **Concept drift** | `P(Y\|X)` — chính quy luật ánh xạ | (thường `P(X)` giữ nguyên) | "Email thế nào là spam" thay đổi khi spammer đổi chiến thuật; cùng một email giờ có nhãn khác |

- **Covariate shift**: nguy hiểm ở vùng input model chưa từng thấy; có thể chữa bằng reweight/thu thập thêm mà **không cần nhãn mới**.
- **Label shift**: chữa được bằng **hiệu chỉnh lại prior / ngưỡng** nếu ước lượng được `P(Y)` mới.
- **Concept drift**: nặng nhất — **bắt buộc phải có nhãn mới** và **train lại**; không thủ thuật nào cứu được vì quy luật đã đổi.

Thêm: **train–serving skew** — không phải shift theo thời gian mà là lệch *do lỗi kỹ thuật*: feature tính khác nhau giữa lúc train (batch, có future data) và lúc serve (online). Rất phổ biến, và giống hệt shift khi nhìn từ metric.

### B.3. Phát hiện — không có nhãn (làm liên tục)

Nhãn thật thường đến trễ (có khi hàng tháng). Nên phải giám sát bằng thứ có ngay:

**Giám sát đầu vào (mỗi feature + đầu ra dự đoán):**

- **PSI (Population Stability Index)**: chia feature thành bins theo phân phối train, so tần suất production vs train.
  `PSI = Σ (p_prod − p_train) · ln(p_prod / p_train)`
  Quy ước thô: `< 0.1` ổn · `0.1–0.25` cần chú ý · `> 0.25` shift rõ.
- **KS test** (biến liên tục), **Chi-square** (biến phân loại): so hai phân phối, cho p-value. Nhược: với data lớn, khác biệt nhỏ vô hại cũng "significant" → nên nhìn effect size, không chỉ p-value.
- **KL / JS divergence**, **Wasserstein distance**: khoảng cách phân phối, dùng khi cần một con số theo dõi theo thời gian.
- **Giám sát chính `P(ŷ)`**: phân phối điểm dự đoán của model dịch chuyển là dấu hiệu sớm và rẻ nhất.

**Domain classifier (mẹo hay cho covariate shift):** gán nhãn `0` cho mẫu train, `1` cho mẫu production, train một classifier phân biệt hai nguồn. Nếu nó phân biệt được (AUC ≫ 0.5) → hai phân phối khác nhau; feature importance của nó chỉ ra **feature nào trôi**.

**Giám sát hệ quả gián tiếp:** tỷ lệ lỗi downstream, số lần con người can thiệp/override, khiếu nại người dùng, tỷ lệ rơi vào "vùng không chắc" của model.

### B.4. Phát hiện — có nhãn (khi nhãn về)

- Theo dõi **metric theo cửa sổ thời gian** (rolling weekly PR-AUC / accuracy), đặt cảnh báo khi tụt quá ngưỡng.
- **Backtest** định kỳ trên dữ liệu gần nhất có nhãn.
- So sánh **calibration** (reliability diagram): model từng calibrated nay lệch → dấu hiệu label/concept shift.

### B.5. Xử lý

| Tình huống | Cách xử lý |
|-----------|-----------|
| Covariate shift nhẹ, biết vùng nào lệch | **Importance weighting**: cân lại mẫu train theo `w(x) = p_prod(x) / p_train(x)` (ước lượng từ domain classifier) rồi train lại |
| Covariate shift do thiếu vùng dữ liệu | Thu thập / gán nhãn thêm ở vùng đó; augment |
| Label shift, ước lượng được `P(Y)` mới | Hiệu chỉnh lại xác suất hậu nghiệm / dịch ngưỡng theo prior mới (không cần train lại) |
| Concept drift | **Train lại với dữ liệu mới có nhãn**; không có đường tắt |
| Shift liên tục, chậm | **Retrain định kỳ** (theo lịch) hoặc **online / incremental learning**; dùng cửa sổ trượt, hạ trọng số dữ liệu cũ |
| Shift đột ngột (điểm gãy) | **Trigger-based retrain**: pipeline tự train lại khi PSI / drift metric / performance vượt ngưỡng |
| Train–serving skew | Sửa **feature pipeline**, không phải model: dùng chung một đường tính feature cho train và serve (feature store); test parity |

**Phòng hơn chống:**

- Model đơn giản, ít feature "mong manh" → bền hơn với shift.
- Feature bền (ít phụ thuộc thời điểm) thay vì feature dễ trôi.
- Có sẵn **pipeline retrain tự động** + **CI cho data** ngay từ đầu.
- Ghi log đầy đủ input/output ở production để sau này backtest và gán nhãn được.

### B.6. Bộ công cụ xử lý shift trong thực tế

Đây là quy trình cụ thể, minh hoạ bằng bài lab **CNC** (train = dây chuyền A, test = dây chuyền B nóng hơn, tải khác — covariate shift thuần).

**1. Định lượng shift từng feature — PSI + KS.**
Tính PSI cho *mọi* feature số (kể cả feature tự tạo), phân loại `< 0.1 / 0.1–0.25 / > 0.25`. Với `n` lớn, KS p-value gần như luôn ≈ 0 → **PSI là thước đo độ lớn đáng tin hơn p-value**. Kết quả CNC: nhóm nhiệt độ PSI 0.3–1.1 (shift mạnh), độ mòn dao và các feature cơ học PSI < 0.05 (ổn định).

**2. Drift classifier — tìm "thủ phạm".**
Gán `0` cho mẫu train, `1` cho mẫu test, train classifier phân biệt hai nguồn, **đánh giá bằng CV out-of-fold** (tránh AUC lạc quan giả).

- AUC ≈ 0.5 → hai phân phối trùng nhau, không shift.
- AUC ≫ 0.5 (CNC: ≈ 0.83) → shift thật, không phải nhiễu.
- **Feature importance của drift classifier** = xếp hạng feature trôi nhiều nhất; nên **nhất quán với PSI**. SHAP bổ sung *chiều* trôi (nhiệt độ cao → đẩy về phía "là test").
- Bọc `CalibratedClassifierCV` để xác suất drift dùng lại được ở bước 3.

**3. Importance reweighting (density-ratio).**
Cân lại mẫu train theo `w(x) = p_test(x) / p_train(x)`, suy trực tiếp từ xác suất drift classifier:
`w = s/(1−s) · (n_train/n_test)` với `s = P(là test | x)`. Rồi train lại model với `sample_weight=w`.

- **Clip đuôi** (ví dụ về phân vị 1–99%) và **chuẩn hoá** `w` về trung bình 1, nếu không vài mẫu chiếm hết trọng số.
- Theo dõi **Effective Sample Size** `ESS = (Σw)² / Σw²`. ESS tụt sâu (CNC: còn ~20%) nghĩa là reweighting đang vứt phần lớn dữ liệu hiệu dụng → phương sai tăng.
- **Chỉ giúp khi covariate shift + train KHÔNG phủ đủ vùng của test.** Với covariate shift thuần mà train đã phủ đủ (như CNC), `P(Y|X)` không đổi nên reweighting **không sửa được thiên lệch nào, chỉ thêm phương sai** — AUC-PR còn tụt nhẹ. Luôn so trước/sau, đừng mặc định áp dụng.

**4. Threshold calibration.**
Chọn lại ngưỡng quyết định trên **OOF của tập train** (không đụng test), lấy điểm tối đa F1 hoặc điểm tối thiểu hoá cost. `argmax` trên một lần chia CV dao động mạnh → **trung bình ngưỡng qua nhiều seed** để giảm phương sai. Rẻ, an toàn, không cần train lại — CNC: F1 0.757 → 0.771. **Gần như luôn nên làm.**

**5. Feature engineering kháng shift.**
Feature phái sinh mã hoá **cơ chế / quy luật vật lý** (tỉ số, hiệu, tích của biến gốc) thường **ổn định giữa các domain** hơn biến thô: ở CNC, `công_suất = mômen × tốc_độ_góc` và `Δnhiệt = nhiệt_quy_trình − nhiệt_môi_trường` có PSI < 0.05 dù các biến thành phần shift mạnh. Ưu tiên loại feature này → model tổng quát hoá sang domain mới tốt hơn. Nguyên tắc nhận feature: **vừa cải thiện CV, vừa không phá tính kháng shift** (loại feature cải thiện CV nhưng PSI cao).

**6. Kết luận chiến lược.** Với covariate shift thuần: **feature kháng shift + threshold calibration** là đủ và hiệu quả nhất; reweighting nên *thử và đo* nhưng thường không áp dụng. Giá trị lâu dài của pipeline shift là **giám sát khi deploy** — tính PSI định kỳ trên dữ liệu mới; nếu shift tiến hoá thành concept drift thì cảnh báo, gán nhãn, train lại.

### B.7. Bẫy thường gặp

- Chỉ đánh giá offline trên test set cũ, không giám sát online → phát hiện shift qua… khiếu nại khách hàng.
- Nhìn p-value của test thống kê trên data lớn rồi báo động giả liên tục.
- Nhầm train–serving skew (lỗi kỹ thuật, sửa được ngay) với concept drift (phải retrain).
- Retrain mù khi nhãn chưa thực sự về đủ → học nhiễu.
- Giám sát accuracy tổng thể mà bỏ qua shift *trong một phân khúc* (một nhóm user, một vùng địa lý) đủ sức làm hỏng trải nghiệm nhóm đó.

---

## Phần C — Censoring & thiết kế nhãn (label design)

Một dạng "dữ liệu không như giả định" ít được nhắc nhưng rất hay gặp ở bài toán **dự đoán một sự kiện trong tương lai** (khách hàng có quay lại mua trong 45 ngày không? thiết bị có hỏng trong ca tới không?). Minh hoạ bằng lab **PharmaDist** (dự đoán nhà thuốc đặt hàng lại trong 45 ngày).

### C.1. Right-censoring là gì

Dữ liệu kết thúc tại một mốc cố định `SNAP = max(ngày)`. Sau `SNAP` ta không biết gì.

Với một đơn hàng đặt **11 ngày trước `SNAP`** và **chưa** thấy đơn tiếp theo: gán nhãn `0` ("sẽ không đặt lại trong 45 ngày") là **đoán mò** — cửa sổ 45 ngày còn chưa trôi hết, nhà thuốc hoàn toàn có thể đặt lại vào tuần sau. Những đơn "bị quan sát thiếu" này đều là các đơn **gần đây nhất**.

### C.2. Vì sao nó phá đánh giá

Split theo thời gian đẩy 20% **mới nhất** vào test. Nếu gán `0` cho mọi đơn chưa thấy tái đặt, ta **gán sai `0` một cách hệ thống cho chính tập test** → tỷ lệ dương của test bị bóp méo, metric test không còn tin được. Đây là một **bias do censoring**, không phải xu hướng thật.

### C.3. Observation-horizon rule — ba trường hợp

Đặt `H` = độ dài cửa sổ dự đoán (ví dụ 45 ngày):

1. **Đã thấy sự kiện trong `≤ H` → nhãn 1.** Chắc chắn, bất kể gần `SNAP` cỡ nào.
2. **Chưa thấy sự kiện VÀ cửa sổ đã trôi hết** (`ngày ≤ SNAP − H`) **→ nhãn 0.** Chắc chắn "không".
3. **Chưa thấy sự kiện VÀ cửa sổ chưa trôi hết** (`ngày > SNAP − H`) **→ NaN, loại khỏi cả train lẫn test.** Không biết thì không đoán.

Quy tắc này giữ **định nghĩa nhãn giống hệt nhau ở mọi thời điểm** → phân phối nhãn ổn định giữa train và test, model được đánh giá công bằng. Ở PharmaDist, sau khi áp rule, tỷ lệ dương train/test còn lệch nhẹ (28% vs 49%) nhưng đó là **xu hướng thật** (đơn gần đây được tái đặt nhanh hơn), không phải artefact.

### C.4. Nguyên tắc chung

- **Định nghĩa nhãn TRƯỚC khi làm feature**, để ranh giới quá khứ–tương lai rõ ràng.
- Đơn vị quan sát cuối cùng của mỗi thực thể (đơn cuối của mỗi nhà thuốc) không có "sự kiện tiếp theo" → **censored**, loại khỏi bài toán hồi quy "bao lâu nữa".
- Muốn tận dụng cả mẫu bị censor thay vì vứt đi → **survival analysis** (Cox proportional hazards, Kaplan–Meier).

---

## Tóm tắt

**Class imbalance** — phân phối nhãn lệch trong train:

- Bỏ accuracy trước tiên; dùng PR-AUC / F1 / recall-tại-precision, đọc so với baseline.
- Rẻ trước: class weight + threshold moving. Nặng hơn: SMOTE / undersampling **trong** CV, chỉ trên train.
- Test / validation giữ tỷ lệ lớp thật của production.
- Nhiều dữ liệu lớp hiếm > mọi thủ thuật resample.

**Distribution shift** — phân phối đổi giữa train / test / thời gian:

- Ba loại: **covariate** (`P(X)` đổi), **label** (`P(Y)` đổi), **concept** (`P(Y|X)` đổi — nặng nhất, phải retrain).
- Phát hiện không cần nhãn: PSI, KS / Chi-square, divergence, giám sát `P(ŷ)`, domain/drift classifier.
- Phát hiện có nhãn: metric theo cửa sổ, backtest, calibration.
- Xử lý (chi tiết ở B.6): threshold calibration (rẻ, gần như luôn làm) + feature engineering kháng shift; importance reweighting chỉ khi covariate shift + train không phủ đủ test (theo dõi ESS); hiệu chỉnh prior (label shift); retrain (concept drift).

**Censoring & label design** — bài toán dự đoán sự kiện tương lai:

- Gán `0` cho mẫu mà cửa sổ dự đoán chưa trôi hết = đoán mò → bias hệ thống lên tập test mới nhất.
- **Observation-horizon rule**: nhãn 1 nếu đã thấy sự kiện; nhãn 0 chỉ khi cửa sổ đã trôi hết; còn lại NaN, loại bỏ.
- Định nghĩa nhãn trước khi làm feature; muốn giữ mẫu censored → survival analysis.

## Bài lab liên quan

- [`PharmaDist_Reorder_Timing.ipynb`](../labs/PharmaDist_Reorder_Timing.ipynb) — dữ liệu bẩn 7 bảng, observation-horizon rule (Phần C), feature *as-of* chống rò rỉ, split theo thời gian.
- [`CNC_Failure_Distribution_Shift.ipynb`](../labs/CNC_Failure_Distribution_Shift.ipynb) — toàn bộ bộ công cụ ở Phần B.6: PSI/KS, drift classifier, importance reweighting + ESS, threshold calibration, feature cơ học kháng shift.
