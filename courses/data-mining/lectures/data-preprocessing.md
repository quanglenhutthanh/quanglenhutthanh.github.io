---
title: "Tiền xử lý dữ liệu"
subject: "data-mining"
type: lecture
lecture_no: 4
status: done
source: slide
tags: [data-cleaning, missing-data, binning, chi-square, correlation, normalization, discretization, sampling, pca, feature-selection, eda]
date: 2026-10-15
---

# Tiền xử lý dữ liệu

> Chương 2 (phần 2) — *Data, Measurements, and Data Preprocessing*. Bốn nội dung: **tiền xử lý** (làm sạch, tích hợp), **biến đổi dữ liệu** (chuẩn hoá, rời rạc hoá, lấy mẫu), **giảm chiều** (PCA, chọn thuộc tính) và **phân tích khám phá (EDA)**.

Đây là các bước Preprocessing + Transformation trong quy trình KDD (xem [Dữ liệu → Thông tin → Tri thức](data-information-knowledge.md)) — phần tốn nhiều công nhất của một dự án.

| Nhóm | Kỹ thuật |
|---|---|
| **Làm sạch** (*cleaning / cleansing*) | Dữ liệu thiếu: bỏ dòng, điền giá trị · Dữ liệu nhiễu: binning, hồi quy, phân cụm |
| **Tích hợp** (*integration*) | Phân tích dư thừa và tương quan |
| **Biến đổi** (*transformation*) | Chuẩn hoá, rời rạc hoá, rút gọn bằng lấy mẫu |
| **Giảm chiều** (*dimensionality reduction*) | PCA, chọn tập con thuộc tính |

## 1. Làm sạch dữ liệu

Làm sạch là quá trình **phát hiện** chỗ sai, thiếu, vô lý trong dữ liệu, **sửa** lỗi và bổ sung chỗ thiếu, để **nâng chất lượng** dữ liệu. Công việc gồm: điền giá trị thiếu, làm trơn nhiễu và nhận diện ngoại lai, sửa chỗ không nhất quán. Kết quả thường là: loại bỏ, ghi chép lại và liên tục kiểm tra các bản ghi đáng ngờ; có thể kiểm định để tuân thủ chuẩn, quy định.

Dữ liệu thực tế có nhiều lỗi (thiết bị hỏng, lỗi người nhập, lỗi máy, lỗi truyền tải):

| Loại lỗi | Mô tả | Ví dụ |
|---|---|---|
| **Incomplete** (thiếu) | Thiếu giá trị, thiếu thuộc tính cần thiết, hoặc chỉ có dữ liệu tổng hợp | `Occupation = ""` |
| **Noisy** (nhiễu) | Chứa nhiễu, lỗi, ngoại lai | `Age = -10` |
| **Inconsistent** (không nhất quán) | Mâu thuẫn về mã, tên, định dạng | Ngày sinh `03/07/2010` lẫn `03-21-2010`; điểm đánh giá trước là `1, 2, 3`, giờ là `A, B, C`; hai bản ghi trùng nhưng khác nội dung |
| **Intentional** (thiếu trá hình) | Giá trị mặc định che giấu việc thiếu | Mọi ngày sinh đều là `Jan 1st, 1900` |

### 1.1. Dữ liệu thiếu

Sáu cách xử lý (bối cảnh: bộ dữ liệu giá nhà, nhiều dòng không có thu nhập khách hàng):

| # | Cách | Ưu / nhược |
|---|---|---|
| 1 | **Bỏ dòng** (*ignore the tuple*) | Đơn giản; mất nhiều dữ liệu khi tỷ lệ thiếu cao hoặc thiếu rải rác ở nhiều cột. Thường dùng khi thiếu nhãn lớp |
| 2 | **Điền tay** | Chính xác nhưng tốn công, không khả thi với dữ liệu lớn |
| 3 | **Hằng số toàn cục** (`"Unknown"`, $-\infty$) | Dễ; nhưng mô hình có thể coi `"Unknown"` là một nhóm có ý nghĩa |
| 4 | **Độ đo trung tâm** của thuộc tính (mean nếu phân phối đối xứng, median nếu lệch) | Nhanh, phổ biến; làm giảm phương sai |
| 5 | **Mean / median theo cùng lớp** (ví dụ thu nhập trung vị của nhóm khách cùng mức rủi ro tín dụng) | Sát thực tế hơn cách 4 |
| 6 | **Giá trị khả dĩ nhất** — dự đoán bằng hồi quy, suy luận Bayes, cây quyết định | Tận dụng quan hệ giữa các thuộc tính; phổ biến nhất trong thực hành nghiêm túc |

Thiếu dữ liệu **không phải lúc nào cũng là lỗi**: trong bộ [House Prices (Kaggle)](https://www.kaggle.com/c/house-prices-advanced-regression-techniques) với 79 biến mô tả nhà ở Ames, Iowa, `PoolQC` trống nghĩa là nhà *không có hồ bơi* — phải điền `"None"`, không phải mean.

Nhớ quy tắc chống rò rỉ: thống kê dùng để điền (mean, median) phải tính **trên tập train**, xem [Data Leakage](../../machine-learning/lectures/data-leakage-validation.md).

### 1.2. Dữ liệu nhiễu

**Nhiễu** là sai số ngẫu nhiên hoặc phương sai trong một biến đo được. Nguyên nhân: thiết bị thu thập lỗi, nhập liệu sai, lỗi truyền tải, giới hạn công nghệ, quy ước đặt tên không thống nhất. Các vấn đề khác cần xử lý: bản ghi trùng, dữ liệu thiếu, dữ liệu không nhất quán.

**Câu hỏi trên lớp** — gọi tên vấn đề trong bộ giá nhà:

| Tình huống | Vấn đề |
|---|---|
| Nhiều căn nhà có tuổi 200 năm | Nhiễu / ngoại lai (giá trị khó tin) |
| Thiếu điểm đánh giá trong một tuần do lỗi hệ thống | Dữ liệu thiếu (thiếu theo khối, có nguyên nhân hệ thống) |
| `Location = "City D"`, không có trong danh mục | Không nhất quán / giá trị không hợp lệ |
| `Number of Bedrooms = "2.5"` hoặc `"3+den"` | Không nhất quán về định dạng, kiểu dữ liệu |
| `Square Footage = 0.00` | Lỗi / thiếu trá hình (0 thay cho giá trị thiếu) |

### 1.3. Kỹ thuật làm trơn nhiễu

**Binning**: sắp xếp dữ liệu tăng dần, chia thành các *bin*, rồi thay mỗi giá trị bằng một giá trị đại diện của bin:

- **theo bin mean** — thay bằng trung bình của bin;
- **theo bin median** — thay bằng trung vị của bin;
- **theo bin boundaries** — thay bằng biên (min hoặc max của bin) gần nhất.

Ví dụ của Han — giá (USD) đã sắp xếp: `4, 8, 15, 21, 21, 24, 25, 28, 34`, chia 3 bin cùng tần suất:

| Bin | Dữ liệu | Theo mean | Theo boundaries |
|---|---|---|---|
| 1 | 4, 8, 15 | 9, 9, 9 | 4, 4, 15 |
| 2 | 21, 21, 24 | 22, 22, 22 | 21, 21, 24 |
| 3 | 25, 28, 34 | 29, 29, 29 | 25, 25, 34 |

**Bài tập**: binning dãy `5, 10, 11, 13, 15, 35, 50, 55, 72, 92, 204, 215` với $N = 3$ bin.

*Cùng tần suất* (mỗi bin 4 giá trị):

| Bin | Dữ liệu | Theo mean | Theo median | Theo boundaries |
|---|---|---|---|---|
| 1 | 5, 10, 11, 13 | 9,75 × 4 | 10,5 × 4 | 5, 13, 13, 13 |
| 2 | 15, 35, 50, 55 | 38,75 × 4 | 42,5 × 4 | 15, 15\*, 55, 55 |
| 3 | 72, 92, 204, 215 | 145,75 × 4 | 148 × 4 | 72, 72, 215, 215 |

\* 35 cách đều 15 và 55 (đều 20) — phải chọn một quy ước khi hoà, ở đây chọn biên dưới.

*Cùng độ rộng*: $W = (215 - 5)/3 = 70$ → các khoảng `[5, 75)`, `[75, 145)`, `[145, 215]` chứa lần lượt **9, 1, 2** giá trị. Hai giá trị lớn 204, 215 làm phân bổ rất lệch — minh hoạ nhược điểm của equal-width với dữ liệu có ngoại lai (xem §3.2).

**Hồi quy**: khớp một hàm toán học (ví dụ $y = x + 1$) với dữ liệu, rồi thay giá trị quan sát bằng giá trị dự đoán trên đường hồi quy — dữ liệu được "kéo" về đường xu hướng.

**Phân cụm**: gom các giá trị tương tự thành cụm; giá trị trong cụm được làm trơn bằng **đại diện của cụm** (ví dụ tâm cụm). Các điểm **nằm ngoài mọi cụm** chính là ứng viên ngoại lai.

## 2. Tích hợp dữ liệu

Gộp dữ liệu từ nhiều nguồn (nhiều database, data cube, file phẳng) vào một kho thống nhất. Các vấn đề:

- **Nhận diện thực thể** (*entity identification*): `Customer_ID` ở database này và `Cust_number` ở database kia có phải cùng một thuộc tính?
- **Dư thừa** (*redundancy*): `Wage_customers` có tính được từ `Wage_month` và `Total_customers` ở database khác không?
- **Trùng bộ** (*tuple duplication*) và **xung đột giá trị** (*data value conflicts*: khác đơn vị, khác thang đo, khác cách mã hoá).

### 2.1. Dư thừa và phân tích tương quan

Dư thừa hay gặp khi tích hợp: cùng một thuộc tính mang tên khác nhau ở các nguồn, hoặc một thuộc tính **suy ra được** từ thuộc tính khác (doanh thu năm = tổng doanh thu tháng). Phát hiện bằng **phân tích tương quan** — đo mức độ một thuộc tính "kéo theo" thuộc tính kia:

- Thuộc tính **nominal** → kiểm định **Chi-square** ($\chi^2$).
- Thuộc tính **số** → **hệ số tương quan** và **hiệp phương sai**.

### 2.2. Kiểm định Chi-square

Thuộc tính $A$ có $c$ giá trị $a_1, \dots, a_c$, thuộc tính $B$ có $r$ giá trị $b_1, \dots, b_r$. Lập **bảng tương liên** (*contingency table*) đếm số lần mỗi cặp $(A = a_i, B = b_j)$ xảy ra.

$$
\chi^2 = \sum_{i=1}^{c}\sum_{j=1}^{r} \frac{(o_{ij} - e_{ij})^2}{e_{ij}} \qquad\qquad e_{ij} = \frac{\text{count}(A = a_i) \times \text{count}(B = b_j)}{n}
$$

- $o_{ij}$: tần suất **quan sát**; $e_{ij}$: tần suất **kỳ vọng** nếu hai biến độc lập.
- Giả thuyết $H_0$: hai biến **độc lập**. Bậc tự do $= (r - 1)(c - 1)$.
- Ô đóng góp nhiều nhất vào $\chi^2$ là ô có số thực tế khác xa số kỳ vọng. $\chi^2$ càng lớn, hai biến càng có khả năng liên quan.
- **Tương quan không phải nhân quả**: số bệnh viện và số vụ trộm xe trong một thành phố tương quan với nhau, vì cả hai cùng phụ thuộc vào biến thứ ba là **dân số**.

**Ví dụ**: 1.500 người, thích manga hay không × chơi game hay không. Số trong ngoặc là tần suất kỳ vọng.

| | Chơi game | Không chơi game | Tổng hàng |
|---|---|---|---|
| Thích manga | 250 (90) | 200 (360) | 450 |
| Không thích manga | 50 (210) | 1000 (840) | 1050 |
| Tổng cột | 300 | 1200 | 1500 |

*Số 90 từ đâu?* $e_{11} = \dfrac{450 \times 300}{1500} = 90$. Tương tự $e_{12} = \dfrac{450 \times 1200}{1500} = 360$, $e_{21} = 210$, $e_{22} = 840$.

$$
\chi^2 = \frac{(250-90)^2}{90} + \frac{(50-210)^2}{210} + \frac{(200-360)^2}{360} + \frac{(1000-840)^2}{840} = 284{,}44 + 121{,}90 + 71{,}11 + 30{,}48 = 507{,}93
$$

Bậc tự do $= (2-1)(2-1) = 1$; giá trị tới hạn ở mức ý nghĩa 0,01 là 6,635 (ở mức 0,001 là 10,828). $507{,}93$ vượt xa → **bác bỏ $H_0$**: *thích manga* và *chơi game* có tương quan trong nhóm này.

### 2.3. Hiệp phương sai và hệ số tương quan

**Hiệp phương sai** (*covariance*) cho biết **chiều** của quan hệ tuyến tính giữa hai biến:

$$
\text{Cov}(X, Y) = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{N} \;\;\text{(tổng thể)} \qquad \text{Cov}(X, Y) = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{N - 1} \;\;\text{(mẫu)}
$$

Cov > 0: hai biến cùng tăng; Cov < 0: biến này tăng thì biến kia giảm; Cov = 0: không có quan hệ tuyến tính (nhưng **chưa chắc độc lập**). Độ lớn của Cov phụ thuộc đơn vị đo, nên không dùng để so sánh mức độ mạnh yếu.

**Hệ số tương quan Pearson** chuẩn hoá Cov về $[-1, +1]$, cho biết cả **chiều** và **độ mạnh**:

$$
r = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}
$$

$r$ gần $\pm 1$ → tương quan tuyến tính mạnh, một trong hai thuộc tính có thể bị loại vì dư thừa.

**Ví dụ 1**: giá hai cổ phiếu $X_1, X_2$ trong một tuần: $(2, 5), (3, 8), (5, 6), (4, 5), (6, 6)$. Nếu cùng chịu ảnh hưởng xu hướng ngành, chúng có cùng tăng giảm không?

- $\bar{x}_1 = 20/5 = 4$, $\bar{x}_2 = 30/5 = 6$.
- Độ lệch $X_1$: $-2, -1, 1, 0, 2$; độ lệch $X_2$: $-1, 2, 0, -1, 0$.
- $\sum (x_1 - \bar{x}_1)(x_2 - \bar{x}_2) = 2 - 2 + 0 + 0 + 0 = 0$ → $\text{Cov} = 0$, $r = 0$.
- Kết luận: với dữ liệu tuần này, **không có quan hệ tuyến tính** — không thể nói hai cổ phiếu cùng tăng hay cùng giảm. (Giáo trình Han dùng bộ số khác, $(2,5), (3,8), (5,10), (4,11), (6,14)$, cho Cov $= 4 > 0$ → cùng tăng.)

**Ví dụ 2** (thực hành): tính Pearson giữa các biến số trong bộ House Prices, ví dụ `df.corr(numeric_only=True)["SalePrice"].sort_values()`.

## 3. Biến đổi dữ liệu

Biến đổi là một hàm ánh xạ toàn bộ tập giá trị của một thuộc tính sang tập giá trị mới, sao cho mỗi giá trị cũ tương ứng với đúng một giá trị mới. Ba phương pháp: **chuẩn hoá**, **rời rạc hoá**, **lấy mẫu**.

### 3.1. Chuẩn hoá (Normalization)

Đưa giá trị về một khoảng nhỏ, xác định — để các thuộc tính có đơn vị khác nhau (tuổi vs thu nhập) đóng góp công bằng vào khoảng cách, gradient. Với thuộc tính $A$ có các giá trị $v_1, \dots, v_n$:

| Phương pháp | Công thức | Ghi chú |
|---|---|---|
| **Min-max** | $v_i' = \dfrac{v_i - \min_A}{\max_A - \min_A}(\text{new\_max}_A - \text{new\_min}_A) + \text{new\_min}_A$ | Giữ nguyên quan hệ giữa các giá trị; nhạy ngoại lai; giá trị mới ngoài $[\min_A, \max_A]$ sẽ "vượt khoảng" |
| **Z-score** | $v_i' = \dfrac{v_i - \bar{A}}{\sigma_A}$ | Dùng khi không biết min/max thật hoặc có ngoại lai |
| **Decimal scaling** | $v_i' = \dfrac{v_i}{10^j}$, $j$ nhỏ nhất sao cho $\max(\lvert v_i' \rvert) < 1$ | Dịch dấu thập phân |

Ví dụ (thu nhập, min 12.000, max 98.000, mean 54.000, $\sigma$ = 16.000), giá trị 73.600:

- Min-max về $[0, 1]$: $\dfrac{73.600 - 12.000}{98.000 - 12.000} = 0{,}716$.
- Z-score: $\dfrac{73.600 - 54.000}{16.000} = 1{,}225$.
- Decimal scaling cho miền $[-986, 917]$: $j = 3$ → $-986 \to -0{,}986$, $917 \to 0{,}917$.

### 3.2. Rời rạc hoá (Discretization)

Chia miền giá trị của thuộc tính liên tục thành các **khoảng**, rồi thay giá trị thật bằng nhãn khoảng (ví dụ tuổi → `trẻ / trung niên / cao tuổi`). Lợi ích: giảm kích thước dữ liệu, chuẩn bị cho các thuật toán cần dữ liệu rời rạc (một số thuật toán phân lớp, luật kết hợp). Phương pháp: **binning**, **histogram**, **phân cụm**.

**Histogram** — chia thành các bucket và lưu trung bình (hoặc tổng) của mỗi bucket:

| | Equal-width (cùng độ rộng) | Equal-depth (cùng tần suất) |
|---|---|---|
| Cách chia | $N$ khoảng bằng nhau, $W = (B - A)/N$ với $A$, $B$ là min, max | $N$ khoảng, mỗi khoảng chứa xấp xỉ cùng số mẫu |
| Ưu | Đơn giản nhất | Co giãn tốt theo phân phối dữ liệu |
| Nhược | Ngoại lai chi phối; dữ liệu lệch xử lý kém (nhiều bucket rỗng) | Khó áp dụng cho thuộc tính phân loại |

**Binning vs phân cụm** (minh hoạ của Han): với dữ liệu có ba nhóm tự nhiên, equal-width và equal-depth đặt ranh giới cắt ngang các nhóm; **k-means** đặt ranh giới vào chỗ trống giữa các nhóm → cho kết quả rời rạc hoá tốt hơn.

### 3.3. Rút gọn dữ liệu và lấy mẫu

**Rút gọn dữ liệu** (*data reduction / numerosity reduction*): tạo một biểu diễn **nhỏ hơn nhiều** nhưng cho **gần như cùng kết quả phân tích** — cần thiết vì kho dữ liệu có thể lên tới terabyte và phân tích phức tạp trên toàn bộ dữ liệu mất rất lâu. Phương pháp: mô hình hồi quy và log-linear, **lấy mẫu**, gộp data cube, nén dữ liệu.

**Lấy mẫu**: nguyên tắc cốt lõi là chọn **tập con đại diện**. Ví dụ: chạy rời rạc hoá trên một mẫu thay vì toàn bộ dữ liệu lớn.

| Kiểu | Cách làm |
|---|---|
| **Simple random sampling** | Mỗi phần tử có xác suất được chọn như nhau |
| **Không hoàn lại** (SRSWOR) | Phần tử đã chọn bị loại khỏi tổng thể |
| **Có hoàn lại** (SRSWR) | Phần tử đã chọn vẫn ở lại, có thể được chọn lần nữa (nền tảng của bootstrap / bagging) |
| **Stratified sampling** | Chia dữ liệu thành các tầng (*strata*), lấy mẫu từ mỗi tầng **theo tỷ lệ** |

Lấy mẫu ngẫu nhiên đơn giản hoạt động **kém khi dữ liệu lệch** — nhóm hiếm có thể không xuất hiện trong mẫu. Khi đó dùng lấy mẫu thích nghi như **stratified sampling** (ví dụ `train_test_split(..., stratify=y)` khi lớp mất cân bằng).

## 4. Giảm chiều

### 4.1. Lời nguyền số chiều

Khi số chiều tăng:

- dữ liệu ngày càng **thưa**;
- mật độ và khoảng cách giữa các điểm — thứ quan trọng nhất với phân cụm và phát hiện ngoại lai — **mất ý nghĩa** (mọi điểm đều xa nhau gần như ngang nhau);
- số tổ hợp không gian con **tăng theo cấp số mũ**.

**Giảm chiều** là giảm số biến đang xét, bằng cách thu được một tập biến chính. Lợi ích: tránh lời nguyền số chiều, loại thuộc tính không liên quan và giảm nhiễu, giảm thời gian và bộ nhớ, dễ trực quan hoá.

Hai hướng:

- **Feature selection** — chọn một **tập con** các thuộc tính gốc (giữ nguyên ý nghĩa, dễ diễn giải).
- **Feature extraction** — **biến đổi** dữ liệu sang không gian ít chiều hơn (thuộc tính mới là tổ hợp của thuộc tính gốc, ví dụ PCA).

### 4.2. Phân tích thành phần chính (PCA)

Dùng phép biến đổi **trực giao** để chuyển các biến có thể tương quan với nhau thành các biến **không tương quan tuyến tính**, gọi là **thành phần chính** (*principal components*). Dữ liệu gốc được chiếu xuống một không gian nhỏ hơn nhiều.

Cho $N$ vector dữ liệu $n$ chiều, tìm $k \leq n$ vector trực giao biểu diễn dữ liệu tốt nhất:

1. **Chuẩn hoá** dữ liệu (để thuộc tính có miền giá trị lớn không áp đảo).
2. Tính **ma trận hiệp phương sai**.
3. Tính **vector riêng** và **giá trị riêng** của ma trận hiệp phương sai.
4. Sắp xếp theo giá trị riêng giảm dần, giữ $k$ vector riêng đầu tiên → **feature vector**. Giá trị riêng càng lớn, thành phần đó giữ càng nhiều phương sai.
5. **Chiếu** dữ liệu lên các trục thành phần chính.

Chỉ dùng được cho **dữ liệu số**. Chọn $k$ thường dựa vào tỷ lệ phương sai giải thích tích luỹ (ví dụ giữ đủ 95%).

```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

X_scaled = StandardScaler().fit_transform(X)       # bước 1
pca = PCA(n_components=0.95).fit(X_scaled)         # bước 2–4: giữ 95% phương sai
X_pca = pca.transform(X_scaled)                    # bước 5
print(pca.explained_variance_ratio_)
```

### 4.3. Chọn tập con thuộc tính (Attribute subset selection)

Loại hai loại thuộc tính:

- **Dư thừa** (*redundant*) — lặp lại phần lớn thông tin của thuộc tính khác. Ví dụ: giá mua sản phẩm và số thuế VAT đã trả.
- **Không liên quan** (*irrelevant*) — không có ích cho tác vụ đang làm. Ví dụ: mã số sinh viên khi dự đoán GPA.

Duyệt hết $2^n$ tập con là không khả thi, nên dùng các phương pháp **tham lam** (*heuristic*):

| Phương pháp | Cách làm |
|---|---|
| **Stepwise forward selection** | Bắt đầu từ tập rỗng; mỗi bước **thêm** thuộc tính tốt nhất trong số còn lại |
| **Stepwise backward elimination** | Bắt đầu từ toàn bộ thuộc tính; mỗi bước **bỏ** thuộc tính tệ nhất |
| **Kết hợp forward + backward** | Mỗi bước vừa thêm thuộc tính tốt nhất vừa bỏ thuộc tính tệ nhất |
| **Decision tree induction** | Dựng cây (ID3, C4.5, CART) theo information gain; thuộc tính **không xuất hiện** trong cây coi như không liên quan |

## 5. Phân tích khám phá dữ liệu (EDA)

EDA là bước nhìn vào dữ liệu trước khi mô hình hoá: hiểu phân phối, phát hiện lỗi, ngoại lai, quan hệ giữa các biến. Phân loại theo **số biến** và **dạng trình bày**:

| | Đơn biến (*univariate*) | Đa biến (*multivariate*) |
|---|---|---|
| **Đồ hoạ** | Biến số: histogram, boxplot, normal Q-Q plot · Biến phân loại: bar chart · Dữ liệu thời gian: line plot | 1 phân loại + 1 số: boxplot cạnh nhau · ≥ 2 phân loại: grouped bar chart · ≥ 2 số: scatter plot, correlation heatmap, pairplot |
| **Phi đồ hoạ** | Biến phân loại: bảng tần suất (tuyệt đối / tương đối) · Biến số: vị trí (mean, median), độ phân tán (IQR, độ lệch chuẩn, range), mode, hình dạng (skewness, kurtosis) | 1 phân loại + 1 số: thống kê mô tả của biến số **theo từng nhóm** (mean, median, range, độ phân tán) · ≥ 2 số: tương quan, hiệp phương sai, bảng thống kê mô tả |

Các độ đo dùng trong EDA: xem [Thuộc tính, thống kê mô tả & độ đo khoảng cách](attributes-descriptive-statistics.md).

```python
df.info(); df.describe(include="all")               # kiểu dữ liệu, thiếu, thống kê mô tả
df.isna().mean().sort_values(ascending=False)       # tỷ lệ thiếu theo cột
df["SalePrice"].skew()                              # độ lệch
df.groupby("Neighborhood")["SalePrice"].median()    # 1 phân loại + 1 số
sns.heatmap(df.corr(numeric_only=True))             # ≥ 2 biến số
```

## 6. Tóm tắt

- **Làm sạch**: dữ liệu thực tế thường thiếu, nhiễu, không nhất quán, hoặc thiếu trá hình. Điền giá trị thiếu theo 6 cách, từ bỏ dòng tới dự đoán giá trị khả dĩ nhất; làm trơn nhiễu bằng binning, hồi quy, phân cụm.
- **Tích hợp**: chú ý nhận diện thực thể, dư thừa, trùng lặp, xung đột giá trị; phát hiện dư thừa bằng $\chi^2$ (nominal) hoặc hiệp phương sai / Pearson (số). Tương quan không phải nhân quả.
- **Biến đổi**: chuẩn hoá (min-max, z-score, decimal scaling), rời rạc hoá (equal-width, equal-depth, phân cụm), lấy mẫu (ngẫu nhiên có/không hoàn lại, phân tầng).
- **Giảm chiều**: chống lời nguyền số chiều bằng feature extraction (PCA) hoặc feature selection (forward, backward, decision tree).
- **EDA**: chia theo đơn biến/đa biến × đồ hoạ/phi đồ hoạ.
