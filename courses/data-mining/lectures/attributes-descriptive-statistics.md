---
title: "Thuộc tính, thống kê mô tả & độ đo khoảng cách"
subject: "data-mining"
type: lecture
lecture_no: 3
status: done
source: slide
tags: [attribute-types, levels-of-measurement, descriptive-statistics, boxplot, distance, similarity]
date: 2026-10-15
---

# Thuộc tính, thống kê mô tả & độ đo khoảng cách

> Chương 2 (phần 1) — *Data, Measurements, and Data Preprocessing*. Ba nội dung: **kiểu dữ liệu** (thang đo của thuộc tính), **thống kê mô tả** (trung tâm, độ phân tán, biểu đồ) và **độ đo tương tự / khoảng cách** giữa các đối tượng.

## 1. Đối tượng và thuộc tính

- **Đối tượng dữ liệu** (*data object*): một thực thể riêng biệt cần phân tích — một khách hàng, một giao dịch, một căn nhà. Mỗi đối tượng là **một dòng**.
- **Thuộc tính** (*attribute / feature / variable*): đặc điểm mô tả đối tượng, giúp phân biệt đối tượng này với đối tượng khác. Mỗi thuộc tính là **một cột**.

## 2. Thang đo (Levels of measurement)

Thang đo cho biết **bản chất thông tin** chứa trong giá trị của một biến, từ đó quyết định **được phép dùng phép thống kê nào**. Bốn thang đo **tích luỹ** từ thấp lên cao — thang sau có mọi tính chất của thang trước và thêm một tính chất mới:

| Thang đo | Phân loại | Thứ tự | Khoảng cách đều | Điểm 0 thật | Ví dụ |
|---|:-:|:-:|:-:|:-:|---|
| **Nominal** (định danh) | ✓ | | | | Màu sắc, giới tính, nhóm máu |
| **Ordinal** (thứ bậc) | ✓ | ✓ | | | Trình độ học vấn, mức hài lòng, trình độ ngoại ngữ |
| **Interval** (khoảng) | ✓ | ✓ | ✓ | | Nhiệt độ °C/°F, giờ trong ngày, thang Likert (nếu coi là đều) |
| **Ratio** (tỷ lệ) | ✓ | ✓ | ✓ | ✓ | Cân nặng, chiều cao, tuổi, thu nhập, nhiệt độ Kelvin |

- **Nominal**: chỉ dùng để phân nhóm, không có thứ tự. **Binary** là trường hợp đặc biệt chỉ có 2 trạng thái (0/1, Yes/No) — *symmetric* nếu hai trạng thái quan trọng như nhau (giới tính), *asymmetric* nếu một trạng thái quan trọng hơn (xét nghiệm dương tính).
- **Ordinal**: có thứ tự nhưng **không biết khoảng cách** giữa các bậc — "rất hài lòng" và "hài lòng" chưa chắc cách nhau bằng "hài lòng" và "bình thường".
- **Interval**: khoảng cách đều nhau nhưng **0 không có nghĩa là "không có gì"** → cộng trừ được, nhưng *không nói được "gấp đôi"*: 20°C không nóng gấp đôi 10°C. Giá trị có thể âm.
- **Ratio**: có điểm 0 tuyệt đối → nhân chia có nghĩa: 80 kg nặng gấp đôi 40 kg.

**Vì sao quan trọng**: thang đo giới hạn thống kê mô tả và suy luận được phép dùng; nên chọn thang đo **trước khi thu thập dữ liệu**. Cùng một khái niệm có thể đo ở nhiều thang: thu nhập hỏi theo khoảng (`0–19.999`, `20.000–39.999`… → mã 1, 2, 3) là **ordinal**; hỏi số chính xác là **ratio**. Đo ở thang cao luôn hạ xuống thang thấp được, chiều ngược lại thì không.

| Thang đo | Phép toán | Đo trung tâm | Đo phân tán |
|---|---|---|---|
| Nominal | $=, \neq$ | Mode | — |
| Ordinal | $=, \neq, <, >$ | Mode, median | Range, IQR |
| Interval | $+$ thêm $+, -$ | Mode, median, mean | Range, IQR, độ lệch chuẩn, phương sai |
| Ratio | $+$ thêm $\times, \div$ | Mode, median, mean, trung bình nhân | Như interval + hệ số biến thiên (relative SD) |

**Câu hỏi trên lớp (Slido)**:

| Biến | Thang đo |
|---|---|
| Trình độ học vấn cao nhất (THPT, cử nhân, thạc sĩ…) | Ordinal |
| Nhóm máu (A, B, AB, O) | Nominal |
| Chiều cao | Ratio |
| Thời điểm trong ngày làm một việc (2:30 PM, 6:45 AM) | Interval — 0h không phải "không có thời gian" |
| Số giờ ngủ mỗi đêm | Ratio — 0 giờ là không ngủ, 8 giờ gấp đôi 4 giờ |

## 3. Thống kê không chỉ là con số

> Quảng cáo mới cho thịt nguội QK ra mắt cuối tháng 9 → doanh số 3 tháng sau tăng 30% → *quảng cáo hiệu quả*?

Sai: tiêu thụ thịt nguội vốn **tăng vào tháng 10–12** bất kể có quảng cáo hay không (**history effect** — biến động do bối cảnh thời gian, ở đây là mùa vụ). Thống kê là một **tập kỹ thuật để phân tích, diễn giải, trình bày và ra quyết định** từ dữ liệu, không phải chỉ là các con số.

**Thống kê mô tả** dùng để mô tả, tóm tắt dữ liệu một cách có ý nghĩa, gồm ba mảng: **đo xu hướng trung tâm**, **đo độ phân tán**, và **biểu đồ**.

## 4. Đo xu hướng trung tâm

Ba cách hiểu "trung tâm" của một phân phối, ứng với ba độ đo:

| Độ đo | Ý nghĩa | Tối thiểu hoá |
|---|---|---|
| **Mean** | Điểm cân bằng của phân phối | Tổng **bình phương** độ lệch $\sum (x_i - c)^2$ |
| **Median** | Điểm giữa: nửa số giá trị nằm trên, nửa nằm dưới | Tổng **trị tuyệt đối** độ lệch $\sum \lvert x_i - c \rvert$ |
| **Mode** | Giá trị xuất hiện nhiều nhất | — |

### Mean

$$
\bar{x} = \frac{1}{N}\sum_{i=1}^{N} x_i \qquad\qquad \text{Weighted mean: } \bar{x} = \frac{\sum_{i=1}^{N} w_i x_i}{\sum_{i=1}^{N} w_i}
$$

Mean dùng mọi giá trị nên **nhạy với ngoại lai**. Ví dụ danh mục 10 cổ phiếu:

| Cổ phiếu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Giá | 15 | 18 | 16 | 14 | 15 | 15 | 12 | 17 | 90 | 95 |

Mean = **30,7**, bị hai cổ phiếu giá lớn kéo lên — không đại diện cho 8 cổ phiếu còn lại.

- **Trimmed mean**: bỏ $p\%$ giá trị nhỏ nhất và lớn nhất rồi mới tính mean. Bỏ 20% (2 giá trị mỗi đầu: 12, 14, 90, 95) → $(15+15+15+16+17+18)/6 = 16$. Không nên cắt quá nhiều (thường ≤ 25% mỗi đầu) để không mất thông tin.
- **Median** = $(15 + 16)/2 = 15{,}5$.

### Median

Sắp xếp tăng dần, lấy giá trị ở giữa; nếu $N$ chẵn thì lấy trung bình hai giá trị giữa. Ví dụ `1 3 30 14 7 10 55 15 6 22` → sắp xếp `1 3 6 7 10 14 15 22 30 55` → median $= (10 + 14)/2 = 12$. Ít bị ảnh hưởng bởi ngoại lai và dữ liệu lệch.

**Median xấp xỉ** cho dữ liệu đã gom nhóm (chỉ biết tần suất từng khoảng):

$$
\text{median} \approx L_1 + \left(\frac{N/2 - (\sum \text{freq})_l}{\text{freq}_{\text{median}}}\right) \times \text{width}
$$

với $L_1$ là cận dưới của khoảng chứa median, $(\sum \text{freq})_l$ là tổng tần suất các khoảng đứng trước, $\text{freq}_{\text{median}}$ là tần suất khoảng chứa median, *width* là độ rộng khoảng.

### Mode

Giá trị xuất hiện nhiều nhất. **Không duy nhất**: một mode (*unimodal*), hai (*bimodal*), ba (*trimodal*)… Hiếm dùng cho dữ liệu liên tục (mỗi giá trị thường chỉ xuất hiện một lần). Là độ đo trung tâm duy nhất dùng được cho nominal.

**Midrange** $= (\min + \max)/2$ — đơn giản nhưng rất nhạy ngoại lai.

### Đối xứng và lệch

| Dạng phân phối | Quan hệ |
|---|---|
| **Đối xứng** | mean = median = mode |
| **Lệch phải** (*positively skewed*, đuôi dài bên phải) | mode < median < mean |
| **Lệch trái** (*negatively skewed*, đuôi dài bên trái) | mean < median < mode |

Dữ liệu thực tế hầu hết **không đối xứng**. Với dữ liệu số đơn đỉnh lệch vừa phải, có công thức kinh nghiệm:

$$
\text{mean} - \text{mode} \approx 3 \times (\text{mean} - \text{median})
$$

**Câu hỏi trên lớp**:

- *Khi nào mean = median?* — Khi phân phối đối xứng.
- *Phân phối có median 6,5, mean 7, mode 4 cân bằng tại điểm nào?* — Tại **mean = 7** (mean chính là điểm cân bằng). Phân phối này lệch phải vì mode < median < mean.

## 5. Đo độ phân tán

Độ phân tán cho biết các giá trị **khác nhau đến mức nào**. Hai phân phối có thể cùng mean nhưng độ phân tán rất khác nhau.

### Range, phân vị, IQR

- **Range** $= \max - \min$.
- **Quantile**: các điểm chia dữ liệu đã sắp xếp thành những phần bằng nhau. **Quartile** chia 4 phần, **percentile** chia 100 phần.
  - $Q_1$ = percentile thứ 25 (cắt 25% giá trị thấp nhất), $Q_2$ = percentile thứ 50 = **median**, $Q_3$ = percentile thứ 75.
- **IQR** $= Q_3 - Q_1$ — độ rộng của 50% dữ liệu ở giữa, không bị ngoại lai ảnh hưởng.

Ví dụ trên slide (12 giá trị đã sắp xếp):

`30  36  47  50  52  52  56  60  63  70  70  110`

- Median $= (52 + 56)/2 = 54$.
- Theo cách của Han (giáo trình): $Q_1$ là giá trị thứ 3 $= 47$, $Q_3$ là giá trị thứ 9 $= 63$ → **IQR = 16**.
- Theo cách "median của từng nửa": $Q_1 = (47 + 50)/2 = 48{,}5$, $Q_3 = (63 + 70)/2 = 66{,}5$ → IQR $= 18$.
- Có nhiều quy ước tính phân vị (NumPy mặc định nội suy tuyến tính cho ra $Q_1 = 49{,}25$, $Q_3 = 64{,}75$) — khi làm bài nên ghi rõ quy ước dùng. Với IQR = 16, ngưỡng ngoại lai trên là $63 + 1{,}5 \times 16 = 87$ → **110 là ngoại lai**.

### Phương sai và độ lệch chuẩn

$$
\sigma^2 = \frac{1}{N}\sum_{i=1}^{N}(x_i - \bar{x})^2 = \left(\frac{1}{N}\sum_{i=1}^{N} x_i^2\right) - \bar{x}^2 \qquad\qquad \sigma = \sqrt{\sigma^2}
$$

(Công thức mẫu chia cho $N - 1$ thay vì $N$.)

- $\sigma$ đo độ phân tán **quanh mean**, nên chỉ dùng khi mean được chọn làm độ đo trung tâm.
- $\sigma = 0$ khi và chỉ khi mọi giá trị bằng nhau; ngược lại $\sigma > 0$.

### Five-number summary, boxplot và ngoại lai

**Five-number summary**: $\min,\ Q_1,\ \text{median},\ Q_3,\ \max$ — thể hiện bằng **boxplot**:

- Hộp từ $Q_1$ đến $Q_3$, vạch giữa hộp là median.
- Râu (*whiskers*) kéo tới giá trị nhỏ nhất / lớn nhất **nằm trong** $[Q_1 - 1{,}5 \times \text{IQR},\ Q_3 + 1{,}5 \times \text{IQR}]$.
- Điểm nằm ngoài khoảng đó được vẽ riêng là **ngoại lai** (*outlier*).

Boxplot đặt cạnh nhau rất tiện để so sánh phân phối giữa các nhóm (ví dụ doanh số của nhiều chi nhánh).

**Chọn độ đo phân tán nào**: dữ liệu lệch hoặc có ngoại lai → median + IQR; dữ liệu gần đối xứng → mean + độ lệch chuẩn.

### Bài tập (Han, Ex. 2.2)

Tuổi (đã sắp xếp, $N = 27$): `13, 15, 16, 16, 19, 20, 20, 21, 22, 22, 25, 25, 25, 25, 30, 33, 33, 35, 35, 35, 35, 36, 40, 45, 46, 52, 70`

| Câu | Đáp án |
|---|---|
| (a) Mean, median | Mean $= 809/27 \approx 29{,}96$; median = giá trị thứ 14 $= 25$ |
| (b) Mode | **25 và 35** (mỗi giá trị 4 lần) → **bimodal** |
| (c) Midrange | $(13 + 70)/2 = 41{,}5$ |
| (d) $Q_1$, $Q_3$ | $Q_1 \approx 20$ (giá trị thứ 7; NumPy cho 20,5), $Q_3 = 35$ (giá trị thứ 21) |
| (e) Five-number summary | $13,\ 20,\ 25,\ 35,\ 70$ |
| (f) Boxplot | IQR $= 15$ → ngưỡng trên $35 + 22{,}5 = 57{,}5$ → **70 là ngoại lai**; râu trên dừng ở 52, râu dưới ở 13 |

## 6. Biểu đồ

| Biểu đồ | Dùng để |
|---|---|
| **Histogram** | Hình dạng phân phối của một biến (đối xứng, lệch, mấy đỉnh) |
| **Boxplot** | Five-number summary, phát hiện ngoại lai, so sánh nhiều nhóm |
| **Quantile plot / CDF** | Tỷ lệ dữ liệu nhỏ hơn một giá trị; so sánh với phân phối tham chiếu |
| **Scatter plot** | Quan hệ giữa hai biến số (tuyến tính, phi tuyến, cụm, ngoại lai) |

### Anscombe's Quartet — vì sao phải vẽ

Bốn tập dữ liệu, mỗi tập 11 cặp $(x, y)$, có thống kê **gần như giống hệt nhau**:

| Thuộc tính | Giá trị (cả 4 tập) |
|---|---|
| Mean của $x$ | 9 |
| Phương sai của $x$ | 10 (tổng thể, chia $N$) / 11 (mẫu, chia $N-1$) |
| Mean của $y$ | 7,50 |
| Phương sai của $y$ | 3,75 (tổng thể) / 4,12 (mẫu) |
| Hệ số tương quan | 0,816 |
| Đường hồi quy | $y = 3{,}00 + 0{,}500x$ |

(Slide ghi mean $x$ = 11.0 — tính lại từ dữ liệu thì mean $x$ = 9; phương sai trên slide là phương sai tổng thể.)

Nhưng khi vẽ scatter plot thì **khác hẳn nhau**:

1. #1 — quan hệ tuyến tính bình thường, có nhiễu.
2. #2 — quan hệ **cong** (parabol); hồi quy tuyến tính sai mô hình.
3. #3 — tuyến tính gần hoàn hảo nhưng **một ngoại lai** kéo lệch đường hồi quy.
4. #4 — $x$ gần như hằng số (= 8); **một điểm duy nhất** ($x = 19$) tạo ra toàn bộ tương quan.

Bài học: thống kê mô tả "đơn giản, phức tạp và quan trọng" — **luôn vẽ dữ liệu** trước khi tin vào con số tóm tắt.

## 7. Độ đo tương tự và khoảng cách

Nền tảng của phân cụm, kNN, phát hiện ngoại lai: cần một con số cho biết hai đối tượng **giống nhau / khác nhau** đến mức nào.

### Data matrix và dissimilarity matrix

- **Data matrix** ($n \times p$): $n$ đối tượng, $p$ thuộc tính — cấu trúc *object-by-attribute*.
- **Dissimilarity matrix** ($n \times n$): phần tử $d(i, j)$ là khoảng cách giữa đối tượng $i$ và $j$ — cấu trúc *object-by-object*. Đối xứng, đường chéo bằng 0, nên chỉ cần lưu tam giác dưới.
- Chuyển đổi: $\text{sim}(i, j) = 1 - d(i, j)$ (khi $d$ đã chuẩn hoá về $[0, 1]$).

### Khoảng cách cho dữ liệu số

Với $i = (x_{i1}, \dots, x_{ip})$ và $j = (x_{j1}, \dots, x_{jp})$:

| Khoảng cách | Công thức |
|---|---|
| **Euclidean** ($L_2$) | $d(i, j) = \sqrt{\sum_{f=1}^{p} (x_{if} - x_{jf})^2}$ |
| **Manhattan** ($L_1$, city block) | $d(i, j) = \sum_{f=1}^{p} \lvert x_{if} - x_{jf} \rvert$ |
| **Minkowski** ($L_h$) | $d(i, j) = \left(\sum_{f=1}^{p} \lvert x_{if} - x_{jf} \rvert^h\right)^{1/h}$ |
| **Supremum** ($L_\infty$, Chebyshev) | $d(i, j) = \lim_{h \to \infty} \left(\sum_{f} \lvert x_{if} - x_{jf} \rvert^h\right)^{1/h} = \max_f \lvert x_{if} - x_{jf} \rvert$ |

Minkowski tổng quát hoá cả ba: $h = 1$ → Manhattan, $h = 2$ → Euclidean, $h \to \infty$ → supremum.

Ví dụ $x_1 = (1, 2)$, $x_2 = (3, 5)$: Euclidean $= \sqrt{2^2 + 3^2} \approx 3{,}61$; Manhattan $= 2 + 3 = 5$; supremum $= \max(2, 3) = 3$.

Lưu ý: các khoảng cách này **nhạy với đơn vị đo** — thuộc tính có miền giá trị lớn sẽ áp đảo. Nên chuẩn hoá trước (xem [Tiền xử lý dữ liệu](data-preprocessing.md)).

### Jaccard coefficient — cho tập hợp / binary bất đối xứng

$$
J(A, B) = \frac{\lvert A \cap B \rvert}{\lvert A \cup B \rvert}
$$

Với hai vector binary bất đối xứng: $q$ = số thuộc tính cả hai đều 1, $r$ = $i$ là 1 còn $j$ là 0, $s$ = $i$ là 0 còn $j$ là 1. Khi đó $J = \dfrac{q}{q + r + s}$ — **bỏ qua các cặp 0–0**, vì hai khách hàng cùng *không* mua một món hàng chẳng nói lên điều gì về độ giống nhau.

Ví dụ: hai giỏ hàng chung 1 món trên tổng 4 món khác nhau → $J = 1/4$.

### Cosine similarity — cho vector (văn bản, embedding)

$$
\text{sim}(\mathbf{x}, \mathbf{y}) = \frac{\mathbf{x} \cdot \mathbf{y}}{\lVert \mathbf{x} \rVert \, \lVert \mathbf{y} \rVert} = \cos\theta
$$

Đo **góc** giữa hai vector, không quan tâm độ dài: hai văn bản cùng chủ đề nhưng dài ngắn khác nhau vẫn có cosine cao. Thường dùng cho vector tần suất từ (thưa, nhiều chiều) và embedding.

### Kullback–Leibler divergence — cho phân phối xác suất

$$
D_{KL}(P \parallel Q) = \sum_{x} P(x) \log \frac{P(x)}{Q(x)}
$$

- Đo lượng thông tin **bị mất** khi dùng phân phối $Q$ để xấp xỉ phân phối thật $P$ trên cùng biến $x$.
- $D_{KL} \geq 0$, bằng 0 khi và chỉ khi $P = Q$.
- **Không đối xứng**: $D_{KL}(P \parallel Q) \neq D_{KL}(Q \parallel P)$ → không phải khoảng cách theo nghĩa toán học.
- Ứng dụng: so sánh phân phối train và production (phát hiện drift), loss function của VAE, t-SNE.

### Chọn độ đo theo kiểu dữ liệu

| Dữ liệu | Độ đo phù hợp |
|---|---|
| Số liên tục (đã chuẩn hoá) | Euclidean, Manhattan, Minkowski |
| Binary bất đối xứng, tập hợp (giỏ hàng) | Jaccard |
| Văn bản, vector thưa nhiều chiều, embedding | Cosine |
| Phân phối xác suất | KL divergence |
