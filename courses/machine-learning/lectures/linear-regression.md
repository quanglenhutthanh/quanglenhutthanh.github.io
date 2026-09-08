---
title: "Linear Regression"
subject: "machine-learning"
type: lecture
lecture_no: 6
status: done
source: slide
tags: [linear-regression, mse, normal-equation, gradient-descent, r-squared, multicollinearity, assumptions]
date: 2026-08-31
---

# Linear Regression

Hồi quy tuyến tính giả định biến mục tiêu `y` phụ thuộc **tuyến tính** vào các đặc trưng `x`. Nó là mô hình đơn giản nhất trong họ có giám sát, nhưng chứa đủ mọi mảnh ghép của một bài toán ML: một [hàm loss](loss-functions.md) (MSE), một cách tối ưu (nghiệm đóng hoặc [gradient descent](gradient-descent.md)), một bộ metric đánh giá riêng cho hồi quy (§5), và một tập giả định phải kiểm tra.

Lab: [`LinearReg.ipynb`](../labs/LinearReg.ipynb) (cài đặt thuần NumPy + scikit-learn).

## 1. Mô hình

**Đơn biến:** `ŷ = β₀ + β₁x`. `β₀` = hệ số chặn (giá trị `y` khi `x = 0`), `β₁` = độ dốc (y đổi bao nhiêu khi x tăng 1 đơn vị).

**Bội (p đặc trưng):** `ŷ = β₀ + β₁x₁ + ··· + βₚxₚ`, dạng ma trận `ŷ = Xβ` với `X` có cột đầu toàn 1 (cho `β₀`).

Ví dụ: `Giá = 50 + 0.8 × Diện_tích` → nhà 100 m² được dự đoán 130 triệu.

## 2. Hàm loss — MSE

Phần dư (residual) của mẫu `i`: `eᵢ = yᵢ − ŷᵢ`. Tổng bình phương phần dư:

```
RSS = Σ (yᵢ − ŷᵢ)²        MSE = RSS / n
```

Vì sao **bình phương** chứ không phải trị tuyệt đối:

- Phạt nặng sai số lớn (bậc hai).
- Khả vi khắp nơi → dễ lấy đạo hàm để tối ưu.
- Có **nghiệm dạng đóng** (xem §3).
- Tương đương maximum likelihood nếu nhiễu là Gaussian — xem [L05 §2](loss-functions.md).

Nghiệm tối thiểu MSE = **trung bình có điều kiện** của `y`. Nếu dữ liệu có nhiều outlier → cân nhắc MAE (→ trung vị) hoặc Huber.

## 3. Hai cách tìm β

### 3.1. Normal Equation (nghiệm đóng)

Cho đạo hàm của RSS theo `β` bằng 0, giải ra trực tiếp:

```
β = (XᵀX)⁻¹ Xᵀy
```

- Một phép tính, không lặp, không cần learning rate, không cần chuẩn hoá.
- **Điều kiện:** `XᵀX` phải khả nghịch — không được có đa cộng tuyến hoàn toàn (một đặc trưng là tổ hợp tuyến tính của các đặc trưng khác).
- **Chi phí:** nghịch đảo ma trận là `O(p³)` → chậm khi `p` lớn (hàng nghìn đặc trưng trở lên).

Đơn biến rút gọn đẹp: `β₁ = Cov(x, y) / Var(x)`, và đường hồi quy luôn đi qua `(x̄, ȳ)`.

### 3.2. Gradient Descent

```
grad = (2/n) · Xᵀ(Xβ − y)      β ← β − η · grad
```

| Tiêu chí | Normal Equation | Gradient Descent |
|---|---|---|
| Cách tìm nghiệm | 1 bước, công thức | lặp đến hội tụ |
| Learning rate | không cần | phải chọn/điều chỉnh |
| Chuẩn hoá đặc trưng | không bắt buộc | nên có (hội tụ nhanh hơn) |
| `p` lớn | chậm — `O(p³)` | tốt — `O(np)` mỗi bước |
| `XᵀX` suy biến | thất bại | vẫn chạy |
| Phù hợp | `p` nhỏ, dữ liệu vừa | `p` lớn, dữ liệu rất lớn |

Với linear regression + MSE, mặt loss **lồi** → chỉ có một cực tiểu toàn cục, GD không bao giờ kẹt local minima. Chi tiết SGD / mini-batch: xem [L01](gradient-descent.md).

## 4. Các giả định (và vì sao quan trọng)

| Giả định | Nội dung | Vi phạm thì sao |
|---|---|---|
| **Tuyến tính** | quan hệ X–Y tuyến tính theo tham số | mô hình chệch hệ thống; residual có dạng cong |
| **Độc lập** | các phần dư không tự tương quan | sai số chuẩn bị ước lượng sai (hay gặp ở dữ liệu chuỗi thời gian) |
| **Phương sai đồng nhất** (homoscedasticity) | var(residual) không đổi theo X | residual có "hình phễu"; suy diễn thống kê không tin được |
| **Phần dư chuẩn** | residual ~ Gaussian | ảnh hưởng các kiểm định/khoảng tin cậy (dự đoán điểm vẫn ok) |
| **Không đa cộng tuyến** | đặc trưng không tương quan mạnh với nhau | hệ số `β` không ổn định, khó diễn giải |

### Đa cộng tuyến (multicollinearity)

Hai hay nhiều đặc trưng tương quan mạnh (ví dụ `Diện_tích` ↔ `Số_phòng`, r ≈ 0.93). Hệ quả: `β` dao động mạnh khi đổi dữ liệu chút ít, sai số chuẩn phình to, dấu của hệ số có thể lật.

- **Phát hiện:** ma trận tương quan; **VIF** (Variance Inflation Factor) — `VIF > 5–10` là đáng lo.
- **Khắc phục:** bỏ bớt / gộp đặc trưng, dùng **Ridge** ([L08](regularization-feature-selection.md)), hoặc PCA.

### Phân tích phần dư

- **Residual vs ŷ**: phân tán ngẫu nhiên quanh 0 → tốt; hình phễu → phương sai không đồng nhất; hình cong → thiếu số hạng phi tuyến.
- **Q–Q plot**: điểm bám đường chéo → residual chuẩn.

## 5. Đánh giá — metric hồi quy

| Metric | Ý nghĩa | Đọc |
|---|---|---|
| **MAE** | trung bình `\|y − ŷ\|`, cùng đơn vị Y | càng nhỏ càng tốt; ít nhạy outlier |
| **MSE** | trung bình bình phương sai số (chính là loss) | phạt nặng sai lớn |
| **RMSE** | `√MSE`, cùng đơn vị Y | dễ diễn giải nhất |
| **R²** | tỷ lệ phương sai của Y được mô hình giải thích | 0 = không giải thích gì, 1 = khớp hoàn hảo; R² = 0.85 → giải thích 85% biến thiên |
| **Adjusted R²** | R² phạt theo số đặc trưng `p` | dùng khi so các mô hình khác số biến — thêm biến vô ích thì Adjusted R² giảm |

R² có thể **âm** trên tập test (mô hình tệ hơn cả việc luôn đoán trung bình). Luôn báo cáo trên **tập test** (dữ liệu mô hình chưa thấy) — xem [L04](data-leakage-validation.md).

## 6. Mở rộng: hồi quy đa thức

Khi quan hệ X–Y cong, "tăng cường" đặc trưng `X → [1, X, X², …]` rồi vẫn dùng `LinearRegression` — vì mô hình **tuyến tính theo tham số** dù phi tuyến theo `X`. `sklearn.preprocessing.PolynomialFeatures` + `Pipeline`.

Cảnh báo: bậc càng cao càng dễ **quá khớp** → chọn bậc bằng cross-validation.

## 7. Quy trình chuẩn

1. Chia train/test (80/20), chuẩn hoá đặc trưng (fit scaler **chỉ trên train** — [L04](data-leakage-validation.md)).
2. Huấn luyện (`fit`).
3. Dự đoán trên test.
4. Đánh giá: MAE, RMSE, R², Adjusted R².
5. Chẩn đoán: residual plot, Q–Q, VIF.

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
reg = LinearRegression().fit(X_tr, y_tr)
pred = reg.predict(X_te)
rmse = mean_squared_error(y_te, pred, squared=False)
r2 = r2_score(y_te, pred)
```

## 8. Tóm tắt

- Mô hình: `ŷ = Xβ`; loss: **MSE** (→ nghiệm = trung bình có điều kiện).
- Tìm `β`: **Normal Equation** `(XᵀX)⁻¹Xᵀy` (p nhỏ) hoặc **Gradient Descent** (p lớn); mặt loss lồi nên không kẹt local minima.
- 5 giả định: tuyến tính, độc lập, phương sai đồng nhất, phần dư chuẩn, không đa cộng tuyến — kiểm bằng residual plot, Q–Q, VIF.
- Đa cộng tuyến làm `β` bất ổn → Ridge / bỏ biến / PCA.
- Đánh giá: MAE/RMSE (cùng đơn vị Y), R² & Adjusted R² (tỷ lệ phương sai giải thích), luôn trên tập test.
- Quan hệ cong → PolynomialFeatures, nhưng cẩn thận overfit.
