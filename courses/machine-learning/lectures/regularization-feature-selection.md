---
title: "Regularization & Feature Selection"
subject: "machine-learning"
type: lecture
lecture_no: 8
status: done
source: slide
tags: [regularization, ridge, lasso, elastic-net, feature-selection, bias-variance, overfitting, preprocessing]
date: 2026-08-31
---

# Regularization & Feature Selection

Khi mô hình khớp tập train gần như hoàn hảo nhưng tổng quát hoá kém — **overfitting** — có hai hướng chữa: (1) **giữ tất cả đặc trưng nhưng thu nhỏ hệ số** (regularization), (2) **giảm số đặc trưng** (feature selection). Cả hai đều nhằm kéo mô hình về phía "đơn giản hơn". Note này cũng điểm qua tiền xử lý dữ liệu — bước bắt buộc trước khi hai hướng trên có nghĩa.

## 1. Tiền xử lý (điều kiện cần)

*"Garbage in, garbage out"* — thường chiếm phần lớn thời gian một dự án ML.

### 1.1. Dữ liệu thiếu

Ba cơ chế: **MCAR** (thiếu ngẫu nhiên hoàn toàn), **MAR** (thiếu phụ thuộc biến *khác* đã quan sát), **MNAR** (thiếu phụ thuộc *chính giá trị bị thiếu* → bản thân việc "bị thiếu" mang thông tin).

- **Xoá**: bỏ cột nếu thiếu > 50–60%; bỏ hàng nếu thiếu ít và ngẫu nhiên.
- **Điền (impute)**: mean/median/mode, KNN, Iterative (MICE). Thống kê điền phải tính **chỉ trên train** — [L04](data-leakage-validation.md).
- **Cờ `is_missing`**: khi MNAR — giữ tín hiệu thay vì xoá.

### 1.2. Chuẩn hoá (feature scaling)

Đặc trưng khác thang đo (Tuổi 0–100 vs Thu nhập hàng triệu) khiến biến lớn lấn át khi tính khoảng cách/gradient. **Bị ảnh hưởng:** kNN, SVM, Gradient Descent, **Regularization**, PCA. **Không cần:** cây quyết định / Random Forest.

| Cách | Kết quả | Bền outlier? | Khi nào |
|---|---|---|---|
| **Standardization** (z-score) | mean 0, std 1 | khá | mặc định (mô hình tuyến tính, SVM, NN) |
| **Min-Max** | ép về [0, 1] | kém | cần biên rõ ràng (ảnh, NN) |
| **Robust** (median/IQR) | theo trung vị & IQR | tốt | dữ liệu nhiều outlier |

### 1.3. Mã hoá biến phân loại

| Cách | Ý tưởng | Phù hợp | Lưu ý |
|---|---|---|---|
| **One-Hot** | mỗi hạng mục → 1 cột nhị phân | biến danh nghĩa (không thứ tự) | tăng số chiều nếu nhiều hạng mục |
| **Label / Ordinal** | gán số nguyên theo thứ tự | biến CÓ thứ tự (Nhỏ<Vừa<Lớn) | đừng dùng cho biến danh nghĩa |
| **Target / Mean** | thay bằng trung bình `y` của hạng mục | high-cardinality | dễ **rò rỉ** → cần cross-validation |

## 2. Overfitting & Bias–Variance

- **Bias** (độ chệch): chênh giữa kỳ vọng học được và sự thật — **giảm** khi mô hình phức tạp hơn.
- **Variance** (phương sai): độ nhạy với tập dữ liệu cụ thể — **tăng** khi mô hình phức tạp hơn.
- Dưới khớp = bias cao; quá khớp = variance cao.
- Tổng lỗi = `bias² + variance + nhiễu` → có dạng **chữ U** theo độ phức tạp → tồn tại độ phức tạp "vừa phải" tối ưu.

## 3. Hướng 1 — Regularization

Thêm số hạng phạt độ lớn hệ số vào hàm chi phí: `J_reg = J_data + λ · R(θ)`. Hệ số nhỏ → đường cong mượt hơn → giả thuyết đơn giản hơn → bớt overfit. `θ₀` (hệ số chặn) **không bị phạt**.

### Ridge (L2)

```
R(θ) = Σ θⱼ²
```

Co nhỏ mọi hệ số (không về đúng 0). Có **nghiệm dạng đóng**. Xử lý tốt đa cộng tuyến. Trong gradient descent, L2 tương đương **weight decay**: mỗi bước nhân hệ số với `(1 − αλ/n) < 1` trước khi cập nhật theo gradient.

### Lasso (L1)

```
R(θ) = Σ |θⱼ|
```

*Least Absolute Shrinkage and Selection Operator.* Hình học L1 (hình thoi, có góc nhọn trên trục) đẩy nhiều hệ số về **đúng 0** → **chọn biến tự động**. Không có nghiệm đóng (giải bằng lặp).

### Elastic Net (L1 + L2)

Kết hợp: L1 cho tính **thưa** (chọn biến) + L2 cho tính **ổn định** (xử lý nhóm biến tương quan). `α` điều phối: `α = 1` → Lasso thuần, `α = 0` → Ridge thuần. Tốt khi có nhiều đặc trưng tương quan theo nhóm — Lasso thuần dễ chọn lệch một biến tuỳ ý trong nhóm.

| Tiêu chí | Ridge (L2) | Lasso (L1) | Elastic Net |
|---|---|---|---|
| Phạt | `Σθⱼ²` | `Σ\|θⱼ\|` | `α·L1 + (1−α)·L2` |
| Đưa hệ số về 0? | không | có (thưa) | có |
| Chọn biến | không | có | có |
| Đa cộng tuyến | tốt | kém (chọn 1 tuỳ ý) | tốt |
| Nghiệm | dạng đóng | lặp | lặp |

### Chọn λ

`λ` quá lớn → mọi `θⱼ ≈ 0` → đường ngang → **dưới khớp**. `λ` quá nhỏ → phạt yếu → vẫn overfit. Chọn bằng **cross-validation** (`RidgeCV`, `LassoCV`, `ElasticNetCV`). Xem [L04](data-leakage-validation.md).

Regularization áp dụng y hệt cho [logistic regression](logistic-regression.md) — thêm phạt vào log loss, ranh giới quyết định mượt hơn.

## 4. Hướng 2 — Feature Selection

| Nhóm | Ý tưởng | Ưu / Nhược | Ví dụ |
|---|---|---|---|
| **Filter** | đánh giá đặc trưng **độc lập** với mô hình, dựa trên thống kê | nhanh, rẻ / bỏ qua tương tác | Variance, Correlation, χ², Mutual Information |
| **Wrapper** | dùng **hiệu năng mô hình** để chọn tập đặc trưng tốt nhất | chính xác / rất tốn thời gian | Forward/Backward, RFE, Boruta, mRMR |
| **Embedded** | chọn đặc trưng **ngay trong lúc huấn luyện** | cân bằng | Lasso (L1), Random Forest importance |

### Filter

- **Missing ratio / Low variance**: đặc trưng thiếu quá nhiều hoặc gần như hằng số → loại. (`VarianceThreshold`; nhớ chuẩn hoá trước vì phương sai phụ thuộc thang đo.)
- **High correlation**: cặp biến tương quan cao → thông tin trùng → giữ một. Kiểm định theo kiểu cặp: Pearson/Spearman (số–số), χ² (phân loại–phân loại), ANOVA F (số–phân loại).
- **Mutual Information**: đo thông tin chia sẻ giữa đặc trưng và `y`. Bắt được quan hệ **phi tuyến** (ví dụ `y = x²`: Pearson ≈ 0 nhưng MI > 0). `MI ≥ 0`; `MI = 0` ⇔ độc lập.

### Wrapper

- **Forward selection**: bắt đầu rỗng, thêm dần biến làm tăng hiệu năng nhiều nhất.
- **Backward elimination**: bắt đầu với toàn bộ biến, bỏ dần biến ít ảnh hưởng.
- **RFE / RFECV**: lặp loại đệ quy các đặc trưng yếu nhất theo trọng số mô hình; RFECV tự chọn *số* đặc trưng tối ưu bằng CV.
- **Boruta**: so importance biến thật với "shadow features" (bản xáo trộn). **mRMR**: Max-Relevance, Min-Redundancy.

Cả forward/backward đều **tốn thời gian** — phải huấn luyện lại nhiều lần.

### Embedded

- **Lasso (L1)**: hệ số = 0 → biến bị loại tự động (`SelectFromModel`; `LassoCV` tự dò `α`).
- **RF `feature_importances_`** (Mean Decrease in Impurity): nhanh, có sẵn — nhưng **thiên vị đặc trưng nhiều giá trị** (high-cardinality). Xem thêm [L10](ensemble-methods.md).
- **Permutation Importance**: xáo trộn một cột, đo mức **giảm hiệu năng** — không thiên vị, dùng cho mọi mô hình, đo trên test. Cặp đề xuất: RF (nhanh, khám phá) + Permutation (đáng tin, kết luận); SHAP để giải thích từng dự đoán.

## 5. Tóm tắt

- **Tiền xử lý bắt buộc**: xử lý thiếu (xoá / điền / cờ), chuẩn hoá (z-score / min-max / robust), mã hoá đúng kiểu (one-hot / ordinal / target).
- **Overfitting** = khớp train tốt, tổng quát kém (variance cao) → cân bằng bias–variance (đường chữ U).
- **Regularization**: **Ridge (L2)** co nhỏ hệ số, ổn định với đa cộng tuyến; **Lasso (L1)** đưa hệ số về đúng 0 → chọn biến; **Elastic Net** kết hợp cả hai. Chọn `λ` bằng CV.
- **Feature selection**: **Filter** (thống kê, nhanh, có MI bắt phi tuyến), **Wrapper** (theo hiệu năng, chậm), **Embedded** (Lasso, RF/Permutation importance).
