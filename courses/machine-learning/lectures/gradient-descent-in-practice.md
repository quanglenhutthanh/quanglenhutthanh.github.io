---
title: "Gradient Descent in Practice"
subject: "machine-learning"
type: lecture
lecture_no: 2
status: done
source: coursera
tags: [gradient-descent, feature-scaling, learning-rate, convergence, vectorization, feature-engineering, polynomial-regression]
date: 2026-09-08
---

# Gradient Descent in Practice

[Note trước](gradient-descent.md) giải thích gradient descent về mặt ý tưởng (quả bóng lăn xuống đồi). Note này là phần **kỹ thuật vận hành**: làm sao để GD thật sự hội tụ nhanh và đúng trên dữ liệu thật nhiều đặc trưng — feature scaling, chọn learning rate, kiểm tra hội tụ, vectorization, feature engineering.

*Nguồn: Machine Learning Specialization (Andrew Ng, Coursera) — Course 1, Week 1–2.*

## 1. Ký hiệu

Coursera dùng `w, b` thay cho `β`:

```
f_{w,b}(x) = w·x + b              (một đặc trưng)
f_{w,b}(x) = w₁x₁ + ··· + wₙxₙ + b = w·x + b   (n đặc trưng, w·x là dot product)

J(w,b) = (1/2m) Σᵢ (f_{w,b}(xⁱ) − yⁱ)²        ← cost = MSE/2
```

Cập nhật **đồng thời** (simultaneous) — tính hết đạo hàm riêng *trước*, rồi mới gán:

```
tmp_w = w − α · ∂J/∂w
tmp_b = b − α · ∂J/∂b
w, b = tmp_w, tmp_b
```

với `∂J/∂w = (1/m) Σ (f−y)·x` và `∂J/∂b = (1/m) Σ (f−y)`.

## 2. Cost function là một cái bát

Với linear regression + MSE, mặt `J(w,b)` là **lồi** — hình cái bát (soup bowl), chỉ có một đáy toàn cục, không có local minima. Nhìn từ trên xuống là các **đường đồng mức** (contour) hình elip; đáy là tâm elip.

- Gradient tại mỗi điểm vuông góc với đường đồng mức, chỉ hướng **lên dốc** → GD đi ngược lại.
- Đường đi của GD trên contour: những bước đầu dài, càng gần đáy gradient càng nhỏ nên bước càng ngắn — "hạ cánh" tự nhiên.

Contour **tròn** → GD đi thẳng tới đáy. Contour **elip dẹt** → GD zic-zac chậm. §4 xử lý chuyện này.

## 3. Vectorization

`w·x` viết bằng vòng lặp vs `np.dot`:

```python
f = 0
for j in range(n): f += w[j] * x[j]     # chậm
f = np.dot(w, x)                          # nhanh hơn nhiều
```

`np.dot` nhanh vì tận dụng **SIMD** (Single Instruction, Multiple Data) của CPU/GPU — nhiều phép nhân chạy song song trong một lệnh, thay vì `n` vòng lặp tuần tự. Với dataset lớn, khác biệt là hàng chục đến hàng trăm lần.

Quy ước dữ liệu: `X_train` có shape `(m, n)` — `m` mẫu, `n` đặc trưng; mỗi hàng là một mẫu.

## 4. Feature Scaling

**Vấn đề:** đặc trưng khác thang đo (Diện tích 300–2000 vs Số phòng 1–5) → đạo hàm theo `w` của biến lớn rất lớn, của biến nhỏ rất nhỏ → contour thành elip dẹt → GD zic-zac. Với một `α`, biến này đã "bay" trong khi biến kia chưa nhúc nhích.

**Cách chuẩn hoá** (fit thống kê **chỉ trên train** — [rò rỉ dữ liệu](data-leakage-validation.md)):

| Cách | Công thức | Kết quả |
|---|---|---|
| **Chia cho max** | `x / max(x)` | về `[0, 1]` (hoặc `[−1, 1]`) |
| **Mean normalization** | `(x − μ) / (max − min)` | tâm quanh 0, biên `[−1, 1]` |
| **Z-score** | `(x − μ) / σ` | mean 0, std 1 — phổ biến nhất |

Mục tiêu: mọi đặc trưng về cùng khoảng cỡ `[−1, 1]` (đại khái `−3..3` hoặc `−0.3..0.3` là ổn; `−100..100` hoặc `0.001` là cần scale). Sau khi scale, contour tròn hơn → GD đi thẳng, hội tụ nhanh hơn nhiều.

Xem thêm bảng Standardization / Min-Max / Robust ở [Regularization & Feature Selection](regularization-feature-selection.md).

## 5. Chọn Learning Rate

Nếu `α` **quá nhỏ**: hội tụ đúng hướng nhưng rất chậm.

Nếu `α` **quá lớn**: `J` không giảm mà **dao động hoặc tăng vọt** — `w` và `b` nảy qua nảy lại giữa dương và âm, biên độ tăng dần, đạo hàm đổi dấu mỗi bước. Đây là dấu hiệu kinh điển của `α` quá lớn (hoặc có bug trong code gradient).

**Cách dò:** thử theo thang **×3**: `… 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1 …`

- Chạy vài chục vòng với mỗi `α`, vẽ `J` theo iteration.
- Chọn `α` lớn nhất mà `J` vẫn **giảm đều và nhanh** ở mọi bước.
- Mẹo debug: đặt `α` cực nhỏ (ví dụ `1e-7`) — nếu `J` *vẫn* không giảm mỗi bước thì gần như chắc chắn code gradient sai dấu.

## 6. Kiểm tra hội tụ

**Learning curve** = đồ thị `J` theo số iteration:

- `J` phải **giảm sau mỗi iteration**. Nếu có bước nào `J` tăng → `α` quá lớn hoặc bug.
- Đường phẳng dần → đang hội tụ. Số iteration cần rất khác nhau tuỳ bài (30 hay 300 000) → phải nhìn đồ thị, đừng đoán.
- **Automatic convergence test**: coi như hội tụ nếu `J` giảm `< ε` (ví dụ `ε = 0.001`) trong một iteration. Chọn `ε` khó → nhìn đồ thị vẫn đáng tin hơn.

## 7. Feature Engineering & Polynomial Regression

Đặc trưng tốt nhất thường là đặc trưng **ta tạo ra** từ hiểu biết bài toán:

- Có `chiều_dài` và `chiều_rộng` → tạo `diện_tích = dài × rộng` có thể là biến dự báo mạnh hơn cả hai biến gốc.
- Quan hệ cong → thêm `x²`, `x³`, hoặc `√x` làm đặc trưng mới → mô hình **tuyến tính theo tham số** nhưng khớp được đường cong. Xem [Linear Regression §6](linear-regression.md).

**Lưu ý:** khi thêm `x², x³`, các đặc trưng này có thang đo chênh nhau cực lớn (`x ∈ [1,1000]` thì `x³ ∈ [1, 10⁹]`) → **feature scaling càng bắt buộc**.

## 8. Quy trình

1. Vectorize mọi phép tính (`np.dot`, không vòng lặp Python).
2. Feature scaling (z-score, fit trên train).
3. Feature engineering / polynomial nếu quan hệ phi tuyến.
4. Chọn `α` bằng thang ×3, nhìn learning curve.
5. Chạy GD, kiểm tra `J` giảm mỗi iteration đến khi phẳng.
6. Đánh giá trên test — [metric hồi quy](linear-regression.md) / [phân loại](classification-metrics.md).

## 9. Tóm tắt

- Cập nhật **đồng thời** `w, b`; `J(w,b)` của MSE là mặt **lồi** hình bát → không kẹt local minima.
- **Vectorization** (`np.dot`, SIMD) nhanh hơn vòng lặp hàng chục–trăm lần; `X` có shape `(m, n)`.
- **Feature scaling** (z-score) làm contour tròn lại → GD hết zic-zac; mục tiêu mọi đặc trưng ~`[−1, 1]`.
- **Learning rate**: dò theo thang ×3; `α` quá lớn → `J` dao động/tăng, `w` nảy dấu.
- **Kiểm tra hội tụ**: vẽ `J` theo iteration — phải giảm mỗi bước, phẳng dần.
- **Feature engineering** (tích/tỉ số biến, `x², √x`) thường mạnh hơn tinh chỉnh mô hình; nhớ scale các đặc trưng mới.
