---
title: "Logistic Regression"
subject: "machine-learning"
type: lecture
lecture_no: 8
status: done
source: slide
tags: [logistic-regression, sigmoid, softmax, cross-entropy, log-odds, decision-boundary, decision-threshold, multiclass, regularization]
date: 2026-08-31
---

# Logistic Regression

Dù tên là "hồi quy", Logistic Regression dùng để **phân loại**. Nó lấy đúng phần tuyến tính của [linear regression](linear-regression.md) rồi bọc thêm một hàm ép về xác suất. Đây là thuật toán nền tảng cho phân loại nhị phân và đa lớp, và là "một neuron" trong [mạng nơ-ron](neural-networks.md).

Lab: [`Logistic_Reg.ipynb`](../labs/Logistic_Reg.ipynb).

## 1. Mô hình — hai bước

1. **Tuyến tính:** `z = b₀ + b₁x₁ + ··· + bₚxₚ` (y hệt linear regression).
2. **Sigmoid:** ép `z ∈ ℝ` về xác suất `p ∈ (0, 1)`:

```
p = σ(z) = 1 / (1 + e⁻ᶻ)
```

Rồi so `p` với một **ngưỡng** để ra nhãn 0/1.

*(Phần diễn giải decision boundary ở §4 và khung "loss vs cost" ở §3 dựa theo Machine Learning Specialization — Andrew Ng, Coursera, C1 W3.)*

### Log-odds — vì sao diễn giải được hệ số

Nghịch đảo của sigmoid:

```
log( p / (1−p) ) = z = b₀ + b₁x₁ + ···
```

Vế trái là **log-odds** (logit). Nó tuyến tính theo `x`, nên: **tăng `x₁` thêm 1 đơn vị → log-odds tăng `b₁`**, tức odds nhân với `e^b₁`. Đây là cách đọc hệ số logistic (khác linear regression, nơi hệ số là thay đổi tuyến tính của chính `y`).

## 2. Ngưỡng quyết định

- Quy tắc: `p ≥ ngưỡng → lớp 1`. Mặc định ngưỡng = 0.5.
- **Hạ ngưỡng** (0.3): bắt nhiều ca dương hơn → **Recall ↑, Precision ↓**.
- **Nâng ngưỡng** (0.7): thận trọng hơn → **Precision ↑, Recall ↓**.
- Chọn ngưỡng theo **chi phí sai lầm** của bài toán, không mặc định 0.5. Chi tiết cách chọn (quét trên OOF/validation): [Classification Metrics](classification-metrics.md), [Data Leakage](data-leakage-validation.md).

## 3. Loss vs Cost — Binary Cross-Entropy, không phải MSE

Phân biệt hai từ (Andrew Ng dùng rất nhất quán):

- **Loss** `L(f(x), y)` — sai số trên **một** mẫu.
- **Cost** `J(w, b) = (1/m) Σ L` — trung bình loss trên **toàn bộ** tập train; đây là thứ gradient descent tối thiểu.

### Vì sao không dùng MSE

Với sigmoid, `J` theo MSE là mặt **lồi lởm chởm** (không convex) → nhiều cực tiểu địa phương, gradient descent dễ kẹt. Ta cần một loss sao cho `J` trở lại **hình cái bát** (convex) — đó là logistic loss.

### Logistic loss

```
L = −y·log(p) − (1−y)·log(1−p)
```

Đọc theo hai nhánh:

- `y = 1`: `L = −log(p)`. Đường `−log(p)` đi từ 0 (khi `p = 1`, đoán đúng) lên **∞** khi `p → 0` (đoán sai mà tự tin).
- `y = 0`: `L = −log(1−p)`. Ngược lại: 0 khi `p = 0`, → ∞ khi `p → 1`.

Kết quả: `J` lồi → một cực tiểu toàn cục, gradient descent luôn hội tụ. Logistic loss cũng tương đương maximum likelihood cho phân phối Bernoulli — xem [Loss Functions §2](loss-functions.md).

### Gradient rút gọn đẹp

Áp chain rule cho log loss qua sigmoid:

```
∂L/∂bⱼ = (1/n) · Σ (σ(zᵢ) − yᵢ) · xᵢⱼ        bⱼ ← bⱼ − α · ∂L/∂bⱼ
```

`σ(z) − y` chính là **sai số** (xác suất dự đoán trừ nhãn thật). Dạng cập nhật **giống hệt linear regression**, chỉ khác `h` là sigmoid thay vì tuyến tính.

## 4. Decision boundary — ranh giới quyết định

Với ngưỡng 0.5: `p ≥ 0.5 ⇔ σ(z) ≥ 0.5 ⇔ z ≥ 0`. Vậy **ranh giới quyết định** chính là tập điểm `z = w·x + b = 0`.

- **Đặc trưng tuyến tính** → `z = 0` là một **đường thẳng** (mặt phẳng trong nhiều chiều). Ví dụ `z = x₁ + x₂ − 3 = 0` → đường thẳng chia mặt phẳng làm hai nửa.
- **Feature mapping** (thêm `x₁², x₂², x₁x₂, …` làm đặc trưng mới) → `z = 0` trở thành **đường cong** (ellipse, hình phức tạp). Mô hình vẫn tuyến tính theo tham số nhưng ranh giới cong được — cùng ý tưởng polynomial ở [Linear Regression §6](linear-regression.md).

Bậc đa thức càng cao → ranh giới càng uốn éo → càng dễ **overfit** (ôm sát cả nhiễu). Đây là lý do §7 cần regularization.

## 5. Phân loại đa lớp

### Softmax (multinomial logistic)

Nhận véc-tơ `K` logits, chuẩn hoá thành **phân phối xác suất** `K` giá trị:

```
p_k = e^{z_k} / Σⱼ e^{z_j}
```

Tổng = 1; chọn lớp có xác suất cao nhất. Khi `K = 2`, softmax suy biến về sigmoid. Loss: **categorical cross-entropy** với nhãn one-hot. Mỗi lớp có bộ trọng số riêng, huấn luyện đồng thời.

### One-vs-Rest vs Softmax

| | One-vs-Rest (OvR) | Softmax |
|---|---|---|
| Cách làm | huấn luyện `K` bộ nhị phân "lớp i vs phần còn lại" | một mô hình, tối ưu chung `K` lớp |
| Xác suất | không nhất quán (không tổng 1) | nhất quán (tổng 1) |
| Khi nào | dùng được với mọi classifier nhị phân | bài toán các lớp loại trừ lẫn nhau — thường chính xác hơn |

## 6. Đánh giá

Dùng bộ metric phân loại — xem đầy đủ ở [Classification Metrics](classification-metrics.md):

- **Confusion matrix** là gốc; **Accuracy** chỉ dùng khi cân bằng lớp.
- **Precision** (báo dương thì tin được bao nhiêu) vs **Recall** (bắt được bao nhiêu ca dương) — căng nhau theo ngưỡng.
- **F1** khi cần cân bằng cả hai; **ROC-AUC** để so mô hình không phụ thuộc ngưỡng; **PR-AUC** khi lớp dương hiếm.

### Mất cân bằng lớp

Logistic bị lớp đa số kéo lệch. Cách xử lý (chi tiết [Class Imbalance & Distribution Shift](data-imbalance-shift.md)): `class_weight='balanced'` (phạt nặng lỗi lớp hiếm), resampling/SMOTE, dịch ngưỡng, và **bỏ accuracy** — dùng F1 / PR-AUC / balanced accuracy.

## 7. Regularization

Thêm số hạng phạt `λ/2n · Σbⱼ²` (L2) hoặc `λ·Σ|bⱼ|` (L1) vào cost → ranh giới quyết định mượt hơn, bớt ngoằn ngoèo, tổng quát hoá tốt hơn. Đặc biệt cần khi đã **feature mapping** (§4): bậc đa thức cao mà không phạt → ranh giới ôm sát nhiễu. Trong sklearn, `LogisticRegression` **mặc định đã có L2** (`penalty='l2'`, `C = 1/λ`). Chi tiết: [Regularization & Feature Selection](regularization-feature-selection.md).

```python
from sklearn.linear_model import LogisticRegression
clf = LogisticRegression(max_iter=1000, class_weight="balanced")
clf.fit(X_tr, y_tr)
proba = clf.predict_proba(X_te)[:, 1]
y_pred = (proba >= 0.3).astype(int)     # ngưỡng tuỳ chọn
```

## 8. Tóm tắt

- Hai bước: `z = b·x` (tuyến tính) → `p = σ(z)` (sigmoid) → so ngưỡng.
- **Log-odds** `log(p/(1−p)) = z` tuyến tính theo x → hệ số `bⱼ` đọc theo odds (`×e^{bⱼ}`).
- **Loss** = sai số 1 mẫu; **Cost** `J` = trung bình loss (thứ GD tối thiểu).
- Cost = **binary cross-entropy** (không phải MSE — MSE làm `J` không lồi); gradient rút gọn `σ(z) − y`, `J` lồi → luôn hội tụ.
- **Decision boundary** = `z = w·x + b = 0`: thẳng với đặc trưng tuyến tính, cong khi feature mapping (đa thức).
- Ngưỡng ≠ 0.5 khi chi phí FP/FN lệch: hạ ngưỡng → recall ↑, nâng → precision ↑.
- Đa lớp: **softmax** + categorical cross-entropy (một mô hình) hoặc **OvR** (K mô hình nhị phân).
- Mất cân bằng: `class_weight='balanced'`, dịch ngưỡng, dùng F1/PR-AUC — không dùng accuracy.
- Logistic Regression = một neuron sigmoid → nền tảng của [mạng nơ-ron](neural-networks.md).
