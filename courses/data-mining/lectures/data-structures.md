---
title: "Cấu trúc dữ liệu: Cross-sectional, Time Series, Panel"
subject: "data-mining"
type: lecture
lecture_no: 2
status: done
source: note
tags: [cross-sectional, time-series, panel-data, data-types, validation, walk-forward]
date: 2026-10-15
---

# Cấu trúc dữ liệu: Cross-sectional, Time Series, Panel

Trước khi chọn mô hình, phải trả lời câu hỏi: **mỗi dòng dữ liệu là gì, và các dòng có liên hệ với nhau không?** Có ba cấu trúc cơ bản, phân biệt bằng hai chiều: **đối tượng** (*entity*, ký hiệu $i$: người, công ty, cửa hàng, quốc gia…) và **thời gian** ($t$).

| Cấu trúc | Số đối tượng | Số thời điểm | Ký hiệu | Ví dụ |
|---|---|---|---|---|
| Cross-sectional | nhiều ($N$) | **1** | $y_i$ | Thu nhập của 5.000 hộ gia đình năm 2025 |
| Time series | **1** | nhiều ($T$) | $y_t$ | Giá đóng cửa VN-Index mỗi ngày 2015–2025 |
| Panel (longitudinal) | nhiều ($N$) | nhiều ($T$) | $y_{it}$ | Doanh thu của 200 cửa hàng theo từng tháng trong 3 năm |

## 1. Dữ liệu chéo (Cross-sectional data)

Quan sát **nhiều đối tượng tại cùng một thời điểm** (hoặc một khoảng thời gian coi như một thời điểm) — một "lát cắt" của tổng thể.

Ví dụ: khảo sát mức sống hộ gia đình, dữ liệu khách hàng tại ngày chốt sổ, bảng điểm thi của sinh viên một khoá.

Đặc điểm:

- **Thứ tự các dòng không mang thông tin** — xáo trộn dòng không làm mất gì.
- Giả định thường dùng: các quan sát **độc lập, cùng phân phối (i.i.d.)**, thường có được nhờ lấy mẫu ngẫu nhiên.
- Vấn đề hay gặp: **phương sai sai số thay đổi** (*heteroskedasticity* — ví dụ chi tiêu của hộ giàu dao động mạnh hơn hộ nghèo), **sai lệch chọn mẫu** (*selection bias*).
- Hạn chế: chỉ thấy *tương quan giữa các đối tượng*, không thấy *một đối tượng thay đổi thế nào* theo thời gian.

Đây là cấu trúc mặc định của phần lớn bài toán ML "kinh điển" (phân lớp, phân cụm, luật kết hợp trên giỏ hàng).

## 2. Chuỗi thời gian (Time series data)

Quan sát **một đối tượng (một biến) tại nhiều thời điểm liên tiếp**, thường cách đều (ngày, tuần, tháng, quý).

Ví dụ: giá cổ phiếu, nhiệt độ theo giờ, lượng điện tiêu thụ, GDP theo quý, số đơn hàng mỗi ngày của một cửa hàng.

Đặc điểm:

- **Thứ tự là thông tin** — đảo thứ tự là phá hỏng dữ liệu.
- Các quan sát **không độc lập**: giá trị hôm nay phụ thuộc giá trị hôm qua → **tự tương quan** (*autocorrelation*). Giả định i.i.d. bị vi phạm.
- Các thành phần thường gặp (phân rã chuỗi):
  - **Xu hướng** (*trend*) — tăng/giảm dài hạn.
  - **Mùa vụ** (*seasonality*) — lặp lại theo chu kỳ cố định (Tết, cuối tuần, mùa hè).
  - **Chu kỳ** (*cycle*) — dao động không cố định độ dài (chu kỳ kinh tế).
  - **Nhiễu** (*residual / noise*) — phần còn lại.

$$
y_t = T_t + S_t + R_t \quad \text{(cộng)} \qquad\text{hoặc}\qquad y_t = T_t \times S_t \times R_t \quad \text{(nhân)}
$$

- **Tính dừng** (*stationarity*): chuỗi có trung bình, phương sai, tự hiệp phương sai không đổi theo thời gian. Nhiều mô hình (ARIMA…) yêu cầu chuỗi dừng → thường phải lấy sai phân $\Delta y_t = y_t - y_{t-1}$ hoặc log trước. Kiểm định: ADF, KPSS.
- Feature đặc trưng: **lag** ($y_{t-1}, y_{t-7}$), **rolling statistics** (trung bình trượt 7 ngày), biến lịch (thứ, tháng, ngày lễ).
- Bài toán điển hình: **dự báo** (*forecasting*), phát hiện bất thường theo thời gian.

## 3. Dữ liệu bảng (Panel / Longitudinal data)

Quan sát **cùng một tập đối tượng qua nhiều thời điểm** — kết hợp cả hai chiều. Có thể coi là $N$ chuỗi thời gian xếp cạnh nhau, hoặc $T$ lát cắt chéo xếp chồng lên nhau.

Ví dụ: báo cáo tài chính của các công ty niêm yết qua các năm, lịch sử giao dịch hằng tháng của từng khách hàng, chỉ số kinh tế của 63 tỉnh qua 10 năm.

Khái niệm cần nắm:

- **Balanced vs unbalanced panel**: *balanced* — mọi đối tượng có đủ quan sát ở mọi thời điểm ($N \times T$ dòng); *unbalanced* — thiếu một số (công ty mới niêm yết, khách hàng rời đi). Thực tế đa số là unbalanced.
- **Long vs wide format**: *long* — mỗi dòng là một cặp (đối tượng, thời điểm), dạng chuẩn để phân tích; *wide* — mỗi đối tượng một dòng, mỗi thời điểm một cột.

Long:

| store | month | sales |
|---|---|---|
| A | 2025-01 | 120 |
| A | 2025-02 | 135 |
| B | 2025-01 | 80 |
| B | 2025-02 | 95 |

Wide (cùng dữ liệu):

| store | 2025-01 | 2025-02 |
|---|---|---|
| A | 120 | 135 |
| B | 80 | 95 |

- **Hiệu ứng riêng của đối tượng** (*individual / unobserved heterogeneity*): mỗi đối tượng có đặc điểm không quan sát được nhưng ổn định theo thời gian (năng lực quản lý của công ty, vị trí cửa hàng). Panel cho phép **kiểm soát** phần này — điều cross-sectional không làm được.

$$
y_{it} = \beta x_{it} + \alpha_i + \varepsilon_{it}
$$

Ba cách xử lý $\alpha_i$:

| Mô hình | Ý tưởng | Khi nào dùng |
|---|---|---|
| **Pooled OLS** | Bỏ qua cấu trúc panel, gộp hết thành một bảng chéo | Khi $\alpha_i$ không đáng kể (hiếm) |
| **Fixed Effects (FE)** | Mỗi đối tượng một intercept riêng; tương đương trừ đi trung bình của từng đối tượng (*within transformation*) | Khi $\alpha_i$ có thể tương quan với $x_{it}$ |
| **Random Effects (RE)** | Coi $\alpha_i$ là biến ngẫu nhiên, không tương quan với $x_{it}$ | Khi giả định đó hợp lý; hiệu quả hơn FE |

Chọn FE hay RE: **kiểm định Hausman** — bác bỏ $H_0$ → dùng FE.

Ưu điểm của panel: nhiều quan sát hơn, kiểm soát được biến ẩn ổn định theo thời gian, thấy được động lực thay đổi. Nhược điểm: thu thập tốn kém, dễ bị **attrition** (đối tượng rời khỏi mẫu, gây unbalanced và có thể gây bias).

## 4. Hệ quả khi chia train/test

Đây là chỗ cấu trúc dữ liệu ảnh hưởng trực tiếp đến kết quả (xem thêm [Data Leakage & Kiểm định theo thời gian](../../machine-learning/lectures/data-leakage-validation.md) bên môn ML):

| Cấu trúc | Cách split | Sai lầm hay gặp |
|---|---|---|
| Cross-sectional | Random split / k-fold (stratified nếu lệch lớp) | — |
| Time series | **Theo thời gian**: train quá khứ, test tương lai; `TimeSeriesSplit` / rolling-origin | Random split → dùng tương lai đoán quá khứ, metric ảo |
| Panel | Theo thời gian, **và** cân nhắc theo đối tượng (`GroupKFold`) nếu cần dự đoán cho đối tượng mới | Cùng một khách hàng nằm ở cả train lẫn test → model "nhớ" đối tượng |

### Walk-forward validation

Với chuỗi thời gian (và panel), mô phỏng đúng cách mô hình được dùng thật: train trên quá khứ, validate trên giai đoạn **ngay sau đó**, rồi trượt cửa sổ tới trước và lặp lại. Tập test là giai đoạn cuối cùng, không bao giờ đụng tới khi chọn mô hình. Có hai kiểu cửa sổ:

| Kiểu | Train | Khi nào dùng |
|---|---|---|
| **Expanding window** (mở rộng) | Bắt đầu từ cùng một mốc, **dài thêm** sau mỗi vòng (vòng 1: kỳ 1; vòng 2: kỳ 1–2; …) | Quan hệ trong dữ liệu ổn định, càng nhiều lịch sử càng tốt |
| **Sliding window** (trượt) | **Giữ nguyên độ dài**, trượt tới trước (vòng 1: kỳ 1; vòng 2: kỳ 2; …) | Dữ liệu thay đổi theo thời gian (drift), dữ liệu cũ không còn đúng |

```
Expanding                       Sliding
kỳ:  1  2  3  4  5              kỳ:  1  2  3  4  5
v1: [T][V]          [Test]      v1: [T][V]          [Test]
v2: [T][T][V]       [Test]      v2:    [T][V]       [Test]
v3: [T][T][T][V]    [Test]      v3:       [T][V]    [Test]
v4: [T][T][T][T][V] [Test]      v4:          [T][V] [Test]
```

Trong scikit-learn: `TimeSeriesSplit()` mặc định là expanding; đặt `max_train_size` để thành sliding.

Tương tự với feature: lag và rolling của panel phải tính **trong từng đối tượng** (`groupby`), không được để giá trị của cửa hàng A tràn sang cửa hàng B.

```python
import pandas as pd

df = df.sort_values(["store", "month"])

# lag & rolling tính riêng cho từng đối tượng
df["sales_lag1"]  = df.groupby("store")["sales"].shift(1)
df["sales_roll3"] = (df.groupby("store")["sales"]
                       .transform(lambda s: s.shift(1).rolling(3).mean()))

# long <-> wide
wide = df.pivot(index="store", columns="month", values="sales")
long = wide.reset_index().melt(id_vars="store", var_name="month", value_name="sales")
```

## 5. Tóm tắt

- **Cross-sectional**: nhiều đối tượng, một thời điểm → giả định i.i.d., thứ tự dòng vô nghĩa.
- **Time series**: một đối tượng, nhiều thời điểm → tự tương quan, trend/mùa vụ, tính dừng; split theo thời gian.
- **Panel**: nhiều đối tượng × nhiều thời điểm → kiểm soát hiệu ứng riêng của đối tượng (FE/RE); feature và split phải tôn trọng cả hai chiều $i$ và $t$.
- Hỏi trước khi làm: *đơn vị quan sát là gì? có chiều thời gian không? một đối tượng xuất hiện bao nhiêu lần?* — câu trả lời quyết định cách làm sạch, tạo feature, chia dữ liệu và chọn mô hình.
