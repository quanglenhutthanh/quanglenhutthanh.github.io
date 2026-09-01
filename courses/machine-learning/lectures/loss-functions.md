---
title: "Loss Functions"
subject: "machine-learning"
type: lecture
lecture_no: 5
status: done
source: note
tags: [loss, mse, mae, huber, cross-entropy, hinge, maximum-likelihood, regularization]
date: 2026-08-30
---

# Loss Functions

Hàm loss là **cầu nối giữa dữ liệu và tối ưu hoá**: nó biến "model dự đoán sai bao nhiêu" thành một con số duy nhất, khả vi, để [Gradient Descent](gradient-descent.md) có cái mà giảm. Chọn sai loss thì dù optimizer chạy hoàn hảo, model vẫn học sai thứ ta cần.

Trong [note Gradient Descent](gradient-descent.md), loss được coi như "ngọn đồi" trừu tượng `L(x) = x²`. Note này trả lời: **ngọn đồi đó thực chất là hàm gì, và chọn hàm nào cho bài toán nào.**

## 1. Loss ≠ Metric

Hai thứ dễ lẫn:

| | **Loss** | **Metric** |
|---|---|---|
| Dùng để | Tối ưu (optimizer giảm nó) | Báo cáo / ra quyết định nghiệp vụ |
| Ràng buộc | Phải **khả vi** (hoặc gần vậy), trơn | Không cần khả vi |
| Ví dụ | MSE, cross-entropy, hinge | Accuracy, F1, ROC-AUC, MAE-tính-bằng-ngày |
| Ai đọc | Chỉ optimizer | Con người, stakeholder |

Nhiều metric (accuracy, F1) có gradient bằng 0 gần như mọi nơi → không tối ưu trực tiếp được. Ta tối ưu một **surrogate loss** trơn (cross-entropy) rồi đo bằng metric thật. Xem [Classification Metrics](classification-metrics.md).

## 2. Góc nhìn xác suất: loss đến từ đâu

Hầu hết loss "chuẩn" không phải bịa ra — chúng là **−log-likelihood** của một giả định về nhiễu:

- Giả định `y = f(x) + ε` với `ε ~ Gaussian` → maximum likelihood ⇔ **tối thiểu MSE**.
- Giả định `y ~ Bernoulli(p = f(x))` → maximum likelihood ⇔ **tối thiểu binary cross-entropy**.
- Giả định `y ~ Categorical` → **categorical cross-entropy**.
- Giả định nhiễu `Laplace` (đuôi dày hơn Gaussian) → **MAE**.

Thêm một **prior** lên tham số rồi lấy MAP thay vì MLE → sinh ra số hạng regularization (mục 6): prior Gaussian → L2, prior Laplace → L1.

→ "Chọn loss" thực chất là "khai báo bạn tin nhiễu trong dữ liệu trông thế nào".

## 3. Loss cho hồi quy

| Loss | Công thức (1 mẫu) | Tính chất |
|---|---|---|
| **MSE / L2** | `(y − ŷ)²` | Phạt lỗi lớn theo bình phương → **rất nhạy outlier**. Gradient `∝ (ŷ − y)` tuyến tính, trơn khắp nơi. Nghiệm tối ưu = **trung bình** có điều kiện. Mặc định hợp lý khi dữ liệu sạch. |
| **MAE / L1** | `\|y − ŷ\|` | Phạt tuyến tính → **bền với outlier**. Nghiệm tối ưu = **trung vị** có điều kiện. Gradient hằng số `±1`, **không khả vi tại 0** → hội tụ chậm/giật khi gần đáy. |
| **Huber** | `½(y−ŷ)²` nếu `\|y−ŷ\| ≤ δ`, ngược lại `δ\|y−ŷ\| − ½δ²` | **Lai MSE + MAE**: bậc hai ở gần 0 (trơn, hội tụ nhanh), tuyến tính ở xa (bền outlier). `δ` là siêu tham số điều khiển điểm chuyển. Lựa chọn tốt khi có outlier nhưng vẫn muốn gradient trơn. |
| **Log-cosh** | `log(cosh(y − ŷ))` | Xấp xỉ Huber nhưng khả vi **mọi bậc**, không cần chọn `δ`. |
| **Quantile / pinball** | `max(q·e, (q−1)·e)` với `e = y − ŷ` | Dự đoán **phân vị thứ `q`** thay vì trung bình. `q = 0.9` → model đưa ra cận trên; dùng cho dự báo khoảng. |

**Mẹo thực tế:** target lệch phải mạnh (giá, thời gian chờ, doanh thu) → train trên `log1p(y)`, dự đoán rồi `expm1`. Giảm ảnh hưởng đuôi mà không cần đổi loss. (Lab [PharmaDist](../labs/PharmaDist_Reorder_Timing.ipynb) làm đúng vậy cho `days_until_next_order`.)

## 4. Loss cho phân loại

### 4.1. Vì sao không dùng 0–1 loss

0–1 loss (đếm số dự đoán sai) là thứ ta *thật sự* quan tâm, nhưng nó **bậc thang** — gradient 0 gần như mọi nơi, nhảy bậc tại ranh giới. Optimizer gradient không có tín hiệu để đi. Nên ta thay bằng surrogate trơn.

### 4.2. Cross-entropy (log loss) — mặc định

Nhị phân, với `p = σ(z)` là xác suất dự đoán lớp 1:

```
L = −[ y·log(p) + (1−y)·log(1−p) ]
```

- Phạt **rất nặng** khi model tự tin mà sai (`p → 0` trong khi `y = 1` → loss → ∞).
- Gradient theo logit `z` rút gọn đẹp: `∂L/∂z = p − y` — chính là "sai số", tuyến tính, ổn định.
- Đa lớp: `L = −Σ_k y_k log(p_k)` với `p = softmax(z)`.
- Tương đương maximum likelihood cho Bernoulli/Categorical (mục 2).

### 4.3. Hinge loss (SVM)

```
L = max(0, 1 − y·ŷ)   với y ∈ {−1, +1}
```

Chỉ phạt khi mẫu nằm trong "lề" (margin) hoặc sai phía. Mẫu đã phân loại đúng và xa ranh giới → loss 0, không đóng góp gradient. Cho ra classifier tối đa hoá margin. Không cho xác suất calibrated như cross-entropy.

### 4.4. Focal loss — cho imbalance nặng

```
L = −(1 − p_t)^γ · log(p_t)
```

Nhân cross-entropy với `(1 − p_t)^γ`: hạ trọng số các mẫu "dễ" (model đã đoán đúng, tự tin), dồn gradient vào mẫu khó. `γ = 2` phổ biến. Sinh ra cho object detection (nền áp đảo vật thể). Xem thêm cách xử lý mất cân bằng ở [Class Imbalance & Distribution Shift](data-imbalance-shift.md).

### 4.5. Label smoothing

Thay target cứng `1` bằng `1 − ε` (và `0` bằng `ε/(K−1)`). Chặn model đẩy logit ra vô cực, cải thiện calibration và khả năng tổng quát hoá. `ε = 0.1` là mặc định thường dùng.

## 5. Class weighting trong loss

Nhân mỗi số hạng loss với trọng số theo lớp (`w_k ∝ 1/tần_suất_lớp_k`, tức `class_weight="balanced"`):

```
L = −Σ_i w_{y_i} · [ y_i·log(p_i) + (1−y_i)·log(1−p_i) ]
```

Làm lớp thiểu số "nặng cân" ngang lớp đa số trong tổng loss → optimizer không còn bỏ quên nó. Đây là cách xử lý imbalance **ổn định hơn resampling khi có distribution shift** (xem [Class Imbalance & Distribution Shift](data-imbalance-shift.md)).

## 6. Regularization: số hạng cộng thêm vào loss

`L_total = L_data + λ · R(θ)`

| `R(θ)` | Tên | Hiệu ứng | Prior tương ứng |
|---|---|---|---|
| `Σ θ_j²` | **L2 / ridge / weight decay** | Co hệ số về gần 0 (không hẳn 0), ổn định, chống overfit | Gaussian |
| `Σ \|θ_j\|` | **L1 / lasso** | Đẩy một số hệ số về **đúng 0** → chọn feature tự động | Laplace |
| kết hợp | **Elastic Net** | Vừa co vừa chọn | — |

`λ` cân bằng "khớp dữ liệu" vs "model đơn giản". Chọn `λ` bằng cross-validation (xem [Data Leakage & Validation](data-leakage-validation.md)).

## 7. Ổn định số học (đọc kỹ nếu tự code)

- **Đừng feed xác suất vào log** — dùng `p = 0` sẽ ra `log(0) = −∞`. Luôn tính từ **logit**: `binary_cross_entropy_with_logits`, `softmax_cross_entropy_with_logits`. Chúng dùng log-sum-exp ổn định bên trong.
- Clip xác suất về `[ε, 1−ε]` nếu buộc phải tính từ `p`.
- Trung bình loss trên batch (`reduction="mean"`) để độ lớn gradient không phụ thuộc batch size.
- Loss ra `NaN` khi train: thường là learning rate quá lớn (xem [Gradient Descent](gradient-descent.md)), chia cho 0 trong feature, hoặc `log(0)` như trên.

## 8. Chọn loss nào

| Bài toán | Loss mặc định | Đổi khi |
|---|---|---|
| Hồi quy, dữ liệu sạch | MSE | — |
| Hồi quy, có outlier | Huber (hoặc MAE) | outlier nhiều & muốn gradient trơn → Huber |
| Hồi quy, cần khoảng dự báo | Quantile loss | — |
| Phân loại (nhị phân / đa lớp) | Cross-entropy (từ logit) | — |
| Phân loại, lớp hiếm cực nặng | Focal loss / cross-entropy + class weight | — |
| Cần max-margin, không cần xác suất | Hinge | — |
| Overfit | + L2; muốn chọn feature → + L1 | — |

## 9. Tóm tắt

- Loss = hàm khả vi mà optimizer giảm; **khác metric** (thứ con người đọc). Accuracy/F1 không tối ưu trực tiếp được → dùng surrogate.
- Loss chuẩn = **−log-likelihood** của một giả định nhiễu: Gaussian → MSE, Laplace → MAE, Bernoulli/Categorical → cross-entropy.
- Hồi quy: **MSE** (nhạy outlier, → trung bình) vs **MAE** (bền, → trung vị) vs **Huber** (lai, trơn + bền).
- Phân loại: **cross-entropy** là mặc định; gradient theo logit = `p − y`. Focal loss / class weight cho imbalance; hinge cho max-margin.
- **Regularization** = số hạng cộng vào loss: L2 co hệ số, L1 chọn feature.
- Luôn tính cross-entropy **từ logit**, không từ xác suất, để tránh `log(0)` và `NaN`.
