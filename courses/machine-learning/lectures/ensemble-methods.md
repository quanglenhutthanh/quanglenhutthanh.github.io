---
title: "Ensemble Methods"
subject: "machine-learning"
type: lecture
lecture_no: 10
status: done
source: slide
tags: [ensemble, bagging, bootstrap, random-forest, boosting, adaboost, gradient-boosting, xgboost, oob, bias-variance]
date: 2026-08-31
---

# Ensemble Methods

Kết hợp nhiều "weak learner" ([cây quyết định](decision-tree.md)) thành một "strong learner". Có hai chiến lược ngược nhau, ứng với hai vế của [bias–variance](regularization-feature-selection.md):

| | **Bagging** (song song) | **Boosting** (nối tiếp) |
|---|---|---|
| Cách | các model train độc lập, lấy trung bình | model sau sửa lỗi model trước |
| Mục tiêu | **giảm Variance** | **giảm Bias** |
| Base learner | cây **sâu** (low bias, high variance) | cây **nông** / stump (high bias, low variance) |
| Ví dụ | Bagging, Random Forest | AdaBoost, Gradient Boosting, XGBoost |

Điều kiện để ensemble hoạt động: các model phải **đa dạng** và mỗi cái **tốt hơn ngẫu nhiên** ("wisdom of the crowd").

## 1. Bootstrap & Bagging

### Bootstrap sampling

Lấy mẫu **có hoàn lại** từ dataset gốc, cùng kích thước `n`. Một số mẫu xuất hiện nhiều lần, một số không.

```
P(mẫu không được chọn) = (1 − 1/n)ⁿ → e⁻¹ ≈ 0.368
```

→ mỗi bootstrap sample chứa ~**63.2%** mẫu gốc (unique), ~**36.8%** bị bỏ qua → dùng làm **Out-of-Bag (OOB)** test set miễn phí.

### Bagging = Bootstrap Aggregating (Breiman, 1996)

```
For b = 1..B:  tạo bootstrap sample Dᵦ  →  train cây Tᵦ đầy đủ (không pruning)
Dự đoán: classification → majority vote | regression → trung bình
```

**Vì sao giảm variance:** trung bình `B` dự đoán triệt tiêu sai số ngẫu nhiên. Công thức:

```
Var(bag) → ρσ² + (1−ρ)σ²/B      (B → ∞:  Var → ρσ²)
```

`ρ` = tương quan trung bình giữa các cây, `σ²` = variance mỗi cây. Bias **không đổi** (mỗi cây đã low bias).

**Hạn chế:** nếu có một đặc trưng rất mạnh (dominant), *mọi* cây đều chọn nó làm root split → các cây tương quan cao (`ρ` lớn) → trung bình hoá không giúp nhiều. Đây là lý do sinh ra Random Forest.

## 2. Random Forest

**RF = Bagging + Feature Randomness**: tại **mỗi split**, chỉ xét ngẫu nhiên `m` đặc trưng (thay vì tất cả `p`) → đặc trưng dominant không phải lúc nào cũng được xét → cây khác nhau hơn → `ρ` giảm → **variance giảm mạnh hơn**.

Chọn `m` (`max_features`):

- Classification: `m = √p` (mặc định)
- Regression: `m = p/3`
- `m` nhỏ → đa dạng, `ρ` thấp, nhưng mỗi cây yếu hơn (bias tăng chút) → trade-off.

Hai lớp ngẫu nhiên: ① bootstrap (data), ② random feature subset (split).

### OOB Evaluation

Với mỗi mẫu `xᵢ`: dùng các cây **không** chứa `xᵢ` trong bootstrap (~36.8% cây) để dự đoán → so với nhãn thật → OOB score ≈ ước lượng test error **không cần validation set riêng**. Rẻ hơn CV, nhưng CV chính xác hơn và dùng được cho mọi model.

### Feature importance

- **MDI (Gini importance)**: tổng mức giảm impurity mỗi khi đặc trưng được dùng để split. Nhanh, `model.feature_importances_` — nhưng **thiên vị high-cardinality**.
- **Permutation importance**: xáo trộn một cột trên test, đo mức giảm hiệu năng. Không thiên vị, dùng cho mọi model. Nên dùng **cả hai và so sánh**. Xem [L08 §4](regularization-feature-selection.md).

### Khi nào dùng

RF = **"go-to baseline" cho tabular data**: hiệu suất cao, ít tuning, không cần scaling, robust với outlier, khó overfit khi tăng `B`. Nhược: chậm hơn cây đơn, black-box, tốn memory, thường kém XGBoost một chút.

## 3. Boosting & AdaBoost

**Weak learner** = model chỉ cần accuracy > 50% (ví dụ decision stump — cây `depth=1`). Boosting: mỗi model sau **tập trung vào phần model trước làm sai**.

### AdaBoost (Freund & Schapire, 1996)

Tăng trọng số các mẫu bị phân loại **sai** → model tiếp theo "chú ý" vào mẫu khó.

```
1. Khởi tạo wᵢ = 1/n
2. Train weak learner hₜ với trọng số wᵢ; tính weighted error εₜ = Σ wᵢ·I[yᵢ ≠ hₜ(xᵢ)]
3. Trọng số model:  αₜ = ½ ln((1−εₜ)/εₜ)
4. Cập nhật trọng số mẫu:  sai → wᵢ·e^{+αₜ} (tăng),  đúng → wᵢ·e^{−αₜ} (giảm);  chuẩn hoá lại
Kết quả: H(x) = sign( Σ αₜ·hₜ(x) )
```

- `ε → 0` → `α → ∞` (tin tưởng tuyệt đối); `ε = 0.5` → `α = 0` (bỏ qua).
- Ưu: ít hyperparameter, tự chọn `α` (không cần tune learning rate), lý thuyết vững (Gödel Prize 2003).
- Nhược: **nhạy noise & outlier** (mẫu nhiễu bị đẩy trọng số tăng mãi); chỉ exponential loss.

## 4. Gradient Boosting (Friedman, 2001)

Thay vì reweight mẫu, **fit model mới vào phần dư (residuals)** của model trước → hoạt động với **bất kỳ loss khả vi nào**.

```
F₀ = argmin_c Σ L(yᵢ, c)              (ví dụ MSE: F₀ = mean(y))
For m = 1..M:
    rᵢ = −∂L(yᵢ, F(xᵢ))/∂F(xᵢ)        ← pseudo-residual = negative gradient
    fit cây hₘ vào rᵢ
    Fₘ = Fₘ₋₁ + η · hₘ
```

| Loss | Pseudo-residual | Dùng cho |
|---|---|---|
| MSE `½(y−F)²` | `y − F` (residual thường) | regression |
| MAE `\|y−F\|` | `sign(y − F)` | regression robust |
| Log loss | `y − p` | classification |

**Vì sao gọi "Gradient":** pseudo-residual `−∂L/∂F` chính là negative gradient của loss trong **function space** → mỗi cây = một bước gradient descent, nhưng tối ưu *hàm* `F` thay vì *tham số*.

### Learning rate & regularization

- **Shrinkage `η`** (0.01–0.3): `η` nhỏ → mỗi cây đóng góp ít → cần nhiều cây, nhưng tổng quát hoá tốt hơn. Trade-off tốt nhất: `η` nhỏ + `n_estimators` lớn + **early stopping**.
- **Subsample** (0.5–0.8): stochastic GB, như bagging.
- `max_depth` 3–6 (giới hạn độ sâu tương tác), `min_samples_leaf` ≥ 5–20.

**Overfit risk cao** hơn bagging → cần `η` nhỏ + early stopping.

## 5. XGBoost (Chen & Guestrin, 2016)

GB + 3 cải tiến:

### ① Regularized objective

```
Obj = Σ L(yᵢ, ŷᵢ) + Σ Ω(fₜ)      với  Ω(f) = γ·T + ½λ·Σ wⱼ²
```

`T` = số lá, `w` = giá trị lá, `γ` = phạt thêm lá, `λ` = L2 trên giá trị lá. GB truyền thống **không có** số hạng này.

### ② Newton's method (Taylor bậc 2)

```
L(yᵢ, ŷᵢ + fₜ) ≈ L(yᵢ, ŷᵢ) + gᵢ·fₜ + ½·hᵢ·fₜ²
```

`gᵢ = ∂L/∂ŷ` (gradient), `hᵢ = ∂²L/∂ŷ²` (hessian). GB chỉ dùng bậc 1; XGBoost dùng cả **hessian** → thông tin độ cong → ít vòng lặp hơn, mỗi split chính xác hơn.

**Split gain:**

```
Gain = ½ [ G²L/(HL+λ) + G²R/(HR+λ) − (GL+GR)²/(HL+HR+λ) ] − γ
```

`Gain ≤ 0` → **không split** → post-pruning tự động (GB truyền thống chỉ pre-prune bằng `max_depth`).

### ③ Engineering

Column block (cache-friendly), sparsity-aware (tự xử lý missing value — chọn hướng mặc định), column subsampling (`colsample_bytree`), parallel split finding, out-of-core. → nhanh hơn GB truyền thống 10×+.

### Hyperparameter chính

| Tham số | Range | Khuyến nghị |
|---|---|---|
| `learning_rate` (η) | 0.01–0.3 | 0.05–0.1 + early stopping |
| `max_depth` | 3–10 | 3–6 (tabular) |
| `subsample` | 0.5–1.0 | 0.7–0.8 |
| `colsample_bytree` | 0.5–1.0 | 0.7–0.8 |
| `reg_lambda` (λ, L2) | 0–10 | 1.0 |
| `gamma` (γ) | 0–5 | 0, tăng nếu overfit |
| `n_estimators` | 100–1000 | dùng early stopping |

Chiến lược: ① fix `η=0.1`, tune `max_depth` + `subsample` → ② tìm `n_estimators` qua early stopping → ③ tune `reg_lambda`, `colsample` → ④ giảm `η`, tăng `n_estimators`.

## 6. Bảng so sánh

| | Bagging | Random Forest | AdaBoost | Gradient Boost | XGBoost |
|---|---|---|---|---|---|
| Kiểu | song song | song song | nối tiếp | nối tiếp | nối tiếp |
| Giảm | variance | variance | bias | bias | bias |
| Base learner | cây sâu | cây sâu | stump | cây nông | cây nông |
| Regularization | không | feature subset | α weights | η, subsample | η, λ, γ, α |
| Missing values | impute | impute | impute | impute | **tự động** |
| Overfit risk | thấp | thấp | trung bình | cao | trung bình |
| Tốc độ train | nhanh | nhanh | trung bình | chậm | nhanh |
| Accuracy điển hình | trung bình | cao | cao | rất cao | rất cao |

Thứ tự accuracy điển hình trên tabular: **DT < Bagging < RF ≈ AdaBoost < GB < XGBoost**.

## 7. Chọn cái nào

- Baseline nhanh, ít tuning → **Random Forest**.
- Accuracy tối đa trên tabular → **XGBoost / LightGBM** + GridSearchCV.
- Dữ liệu rất lớn (> 1M dòng) → **LightGBM** (GOSS + EFB).
- Cần giải thích → **cây đơn** hoặc RF + feature importance.
- Data ít noise, muốn đơn giản → AdaBoost.

*Luôn bắt đầu đơn giản: thử RF baseline trước, cần hơn thì chuyển XGBoost.*

## 8. Tóm tắt

- **Bagging** = bootstrap + trung bình hoá → giảm **variance** (giới hạn dưới `ρσ²`).
- **Random Forest** = Bagging + random feature subset mỗi split → giảm `ρ` → variance giảm mạnh hơn; **OOB** cho ước lượng test miễn phí; go-to baseline.
- **Boosting** = train nối tiếp, sửa lỗi model trước → giảm **bias**. **AdaBoost** reweight mẫu sai (nhạy noise); **Gradient Boosting** fit vào residual = negative gradient trong function space (mọi loss khả vi).
- **XGBoost** = GB + regularized objective + Newton bậc 2 (hessian) + engineering → nhanh & mạnh, chuẩn vàng tabular.
- Bagging: `η` không có, tăng `B` an toàn. Boosting: cần `η` nhỏ + early stopping vì dễ overfit.
