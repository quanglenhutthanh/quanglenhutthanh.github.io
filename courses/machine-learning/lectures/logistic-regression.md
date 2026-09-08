---
title: "Logistic Regression"
subject: "machine-learning"
type: lecture
lecture_no: 7
status: done
source: slide
tags: [logistic-regression, sigmoid, softmax, cross-entropy, log-odds, decision-threshold, multiclass]
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
- Chọn ngưỡng theo **chi phí sai lầm** của bài toán, không mặc định 0.5. Chi tiết cách chọn (quét trên OOF/validation): [L02](classification-metrics.md), [L04](data-leakage-validation.md).

## 3. Loss — Binary Cross-Entropy, không phải MSE

Nếu dùng MSE với sigmoid: mặt loss **không lồi** → nhiều cực tiểu địa phương, gradient descent dễ kẹt, hội tụ chậm gần 0 và 1.

**Binary Cross-Entropy (log loss)** cho một mẫu:

```
L = −[ y·log(p) + (1−y)·log(1−p) ]
```

- `y = 1`: phạt khi `p → 0` (loss → ∞).
- `y = 0`: phạt khi `p → 1`.
- Mặt loss **lồi** → một cực tiểu toàn cục, luôn hội tụ.
- Tương đương maximum likelihood cho phân phối Bernoulli — xem [L05 §2](loss-functions.md).

### Gradient rút gọn đẹp

Áp chain rule cho log loss qua sigmoid:

```
∂L/∂bⱼ = (1/n) · Σ (σ(zᵢ) − yᵢ) · xᵢⱼ        bⱼ ← bⱼ − α · ∂L/∂bⱼ
```

`σ(z) − y` chính là **sai số** (xác suất dự đoán trừ nhãn thật). Dạng cập nhật **giống hệt linear regression**, chỉ khác `h` là sigmoid thay vì tuyến tính.

## 4. Phân loại đa lớp

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

## 5. Đánh giá

Dùng bộ metric phân loại — xem đầy đủ ở [L02](classification-metrics.md):

- **Confusion matrix** là gốc; **Accuracy** chỉ dùng khi cân bằng lớp.
- **Precision** (báo dương thì tin được bao nhiêu) vs **Recall** (bắt được bao nhiêu ca dương) — căng nhau theo ngưỡng.
- **F1** khi cần cân bằng cả hai; **ROC-AUC** để so mô hình không phụ thuộc ngưỡng; **PR-AUC** khi lớp dương hiếm.

### Mất cân bằng lớp

Logistic bị lớp đa số kéo lệch. Cách xử lý (chi tiết [L03](data-imbalance-shift.md)): `class_weight='balanced'` (phạt nặng lỗi lớp hiếm), resampling/SMOTE, dịch ngưỡng, và **bỏ accuracy** — dùng F1 / PR-AUC / balanced accuracy.

## 6. Regularization

Thêm số hạng phạt `λ/2n · Σbⱼ²` (L2) hoặc `λ·Σ|bⱼ|` (L1) vào log loss → ranh giới quyết định mượt hơn, bớt ngoằn ngoèo, tổng quát hoá tốt hơn. Trong sklearn, `LogisticRegression` **mặc định đã có L2** (`penalty='l2'`, `C = 1/λ`). Chi tiết: [L08](regularization-feature-selection.md).

```python
from sklearn.linear_model import LogisticRegression
clf = LogisticRegression(max_iter=1000, class_weight="balanced")
clf.fit(X_tr, y_tr)
proba = clf.predict_proba(X_te)[:, 1]
y_pred = (proba >= 0.3).astype(int)     # ngưỡng tuỳ chọn
```

## 7. Tóm tắt

- Hai bước: `z = b·x` (tuyến tính) → `p = σ(z)` (sigmoid) → so ngưỡng.
- **Log-odds** `log(p/(1−p)) = z` tuyến tính theo x → hệ số `bⱼ` đọc theo odds (`×e^{bⱼ}`).
- Loss = **binary cross-entropy** (không phải MSE — MSE làm mặt loss không lồi); gradient rút gọn `σ(z) − y`, mặt loss lồi.
- Ngưỡng ≠ 0.5 khi chi phí FP/FN lệch: hạ ngưỡng → recall ↑, nâng → precision ↑.
- Đa lớp: **softmax** + categorical cross-entropy (một mô hình) hoặc **OvR** (K mô hình nhị phân).
- Mất cân bằng: `class_weight='balanced'`, dịch ngưỡng, dùng F1/PR-AUC — không dùng accuracy.
- Logistic Regression = một neuron sigmoid → nền tảng của [mạng nơ-ron](neural-networks.md).
