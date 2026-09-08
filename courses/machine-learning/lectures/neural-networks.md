---
title: "Neural Networks"
subject: "machine-learning"
type: lecture
lecture_no: 12
status: done
source: slide
tags: [neural-network, mlp, perceptron, activation, forward-pass, backpropagation, chain-rule, vanishing-gradient]
date: 2026-08-31
---

# Neural Networks

Một [logistic regression](logistic-regression.md) chỉ học được **một** ranh giới tuyến tính — nó không giải nổi XOR (4 điểm, không đường thẳng nào tách được). Ý tưởng của mạng nơ-ron rất đơn giản: **dùng nhiều logistic regression cùng lúc**, mỗi cái học một "góc nhìn", rồi cho chúng hợp tác. Mỗi neuron = một logistic regression thu nhỏ.

Note này là cầu nối sang course Deep Learning: **forward pass + backpropagation + gradient descent** là nền tảng của *mọi* kiến trúc sau (CNN, RNN, Transformer). Lab: [`NN.ipynb`](../labs/NN.ipynb).

## 1. Neuron nhân tạo

```
z = w·x + b          (linear combination — như logistic regression)
a = σ(z)             (activation — đưa vào phi tuyến)
```

Với 3 neuron song song trong một lớp, mỗi neuron học một ranh giới `Hᵢ`; kết hợp lại tách được XOR. Dạng ma trận: `a⁽¹⁾ = σ(W⁽¹⁾x + b⁽¹⁾)`.

## 2. Vì sao cần activation function

**Vai trò 1 — tạo phi tuyến.** Không có `σ`: `W⁽²⁾(W⁽¹⁾x + b⁽¹⁾) + b⁽²⁾ = W'x + b'` → 100 lớp cũng chỉ là **một** phép biến đổi tuyến tính. Activation phi tuyến là thứ duy nhất khiến mạng sâu có ý nghĩa.

**Vai trò 2 — kiểm soát miền giá trị (on/off).** `σ` quyết định neuron "lên tiếng" hay "im lặng" (ví dụ ReLU: `z < 0 → 0`, neuron tắt). Mỗi input kích hoạt một tập con neuron khác nhau → mạng học được các "chuyên gia" cho từng vùng dữ liệu.

## 3. Kiến trúc MLP

| Ký hiệu | Ý nghĩa |
|---|---|
| `L` | số lớp |
| `n⁽ˡ⁾` | số neuron lớp `l` |
| `W⁽ˡ⁾` | ma trận weight lớp `l`, kích thước `(n⁽ˡ⁾, n⁽ˡ⁻¹⁾)` |
| `b⁽ˡ⁾` | vector bias `(n⁽ˡ⁾, 1)` |
| `a⁽ˡ⁾` | activation lớp `l`; `a⁽⁰⁾ = x` |

- **1 neuron** = logistic regression → 1 đường thẳng.
- **Shallow NN** (1 hidden layer) → ranh giới cong. **Universal Approximation Theorem** (Cybenko, 1989): 1 hidden layer với đủ neuron xấp xỉ được *bất kỳ hàm liên tục nào*.
- **Deep NN** (nhiều tầng) → biểu diễn **phân cấp** (hierarchical): lớp đầu học đặc trưng thô, lớp sau kết hợp thành khái niệm.

**Dimension check** là kỹ năng debug số 1: `W⁽ˡ⁾ = (n⁽ˡ⁾, n⁽ˡ⁻¹⁾)`; in shape từng tensor trong forward pass trước khi train. Với batch `m` mẫu: `Z⁽ˡ⁾, A⁽ˡ⁾` có shape `(n⁽ˡ⁾, m)`.

## 4. Forward pass

Chỉ là tính toán, chưa học gì:

```
z⁽ˡ⁾ = W⁽ˡ⁾·a⁽ˡ⁻¹⁾ + b⁽ˡ⁾
a⁽ˡ⁾ = σ(z⁽ˡ⁾)          (áp element-wise)
```

Lặp từ `l = 1` đến `L`, ra `ŷ = a⁽ᴸ⁾`. **Lưu cache `(z⁽ˡ⁾, a⁽ˡ⁾)`** để dùng lại trong backprop.

## 5. Activation functions

| Hàm | Công thức | Range | Dùng ở | Vấn đề |
|---|---|---|---|---|
| **Sigmoid** | `1/(1+e⁻ᶻ)` | (0, 1) | output nhị phân | vanishing gradient khi \|z\| lớn |
| **Tanh** | `(eᶻ−e⁻ᶻ)/(eᶻ+e⁻ᶻ)` | (−1, 1) | hidden (mạng cũ) | zero-centered (tốt hơn sigmoid) nhưng vẫn vanishing |
| **ReLU** ★ | `max(0, z)` | [0, ∞) | hidden — **mặc định hiện nay** | dying ReLU khi `z < 0` mãi |
| **Softmax** | `eᶻⁱ / Σeᶻʲ` | (0,1), tổng 1 | output đa lớp | chỉ ở output |

## 6. Loss functions

| Loss | Công thức | Kết hợp với |
|---|---|---|
| **MSE** | `(1/m)·Σ(y−ŷ)²` | output tuyến tính (regression) |
| **BCE** (binary cross-entropy) | `−(1/m)·Σ[y·log ŷ + (1−y)·log(1−ŷ)]` | sigmoid output |
| **CCE** (categorical cross-entropy) | `−(1/m)·Σᵢ Σₖ yₖ·log ŷₖ` | softmax output, nhãn one-hot |

Xem [L05](loss-functions.md) về nguồn gốc maximum likelihood của từng loss.

## 7. Backpropagation

**Bài toán:** để cập nhật `W⁽ˡ⁾` cần `∂L/∂W⁽ˡ⁾`, nhưng `W⁽ˡ⁾` không ảnh hưởng *trực tiếp* đến `L`. Chuỗi phụ thuộc: `W⁽ˡ⁾ → z⁽ˡ⁾ → a⁽ˡ⁾ → … → a⁽ᴸ⁾ → L`.

**Giải pháp: chain rule** — nhân chuỗi đạo hàm dọc theo đường đó. Backprop tính gradient cho **tất cả** lớp chỉ trong **một** backward pass.

### 4 phương trình cốt lõi

Đặt error signal `δ⁽ˡ⁾ = ∂L/∂z⁽ˡ⁾`:

| | Công thức | Ý nghĩa |
|---|---|---|
| **BP1** | `δ⁽ᴸ⁾ = ∇_a L ⊙ σ'(z⁽ᴸ⁾)` | error tại output layer |
| **BP2** | `δ⁽ˡ⁾ = (W⁽ˡ⁺¹⁾)ᵀ·δ⁽ˡ⁺¹⁾ ⊙ σ'(z⁽ˡ⁾)` | truyền ngược error về lớp `l` |
| **BP3** | `∂L/∂W⁽ˡ⁾ = δ⁽ˡ⁾·(a⁽ˡ⁻¹⁾)ᵀ` | gradient của weight |
| **BP4** | `∂L/∂b⁽ˡ⁾ = δ⁽ˡ⁾` | gradient của bias |

(`⊙` = nhân element-wise.) BP1 khởi động từ output; BP2 lặp ngược từ `L−1` về `1`, mỗi bước nhân thêm `(W⁽ˡ⁺¹⁾)ᵀ` và `σ'(z⁽ˡ⁾)`.

### Ví dụ số

`x=2, w=3, b=1 → z=7 → a=σ(7)≈0.999 → L=(a−y)², y=0`. Backward:
`∂L/∂a = 2(a−y) ≈ 2.0` · `∂a/∂z = σ'(z) ≈ 0.001` · `∂z/∂w = x = 2`
→ `∂L/∂w ≈ 2.0 × 0.001 × 2 ≈ 0.004`.

Chú ý `σ'(z) ≈ 0.001` — rất nhỏ. Đây là mầm mống của vanishing gradient (§9).

### Với BCE + Sigmoid, BP1 rút gọn đẹp

`δ⁽ᴸ⁾ = a⁽ᴸ⁾ − y` (giống hệt logistic regression và gradient boosting).

## 8. Gradient Descent & optimizers

```
θ ← θ − η · ∇_θ L
```

Chi tiết `η`, batch/SGD/mini-batch: [L01](gradient-descent.md). Mini-batch (32–256, lũy thừa của 2) là chuẩn thực tế.

| Optimizer | Ý tưởng |
|---|---|
| **Momentum** | tích luỹ "quán tính" theo hướng gradient → vượt saddle point nhanh hơn |
| **RMSprop** | learning rate thích nghi theo từng tham số |
| **Adam** ★ | Momentum + RMSprop — mặc định cho hầu hết bài toán |
| **LR schedule** | giảm `η` theo epoch (step decay, cosine); warm-up + decay |

## 9. Vanishing & Exploding Gradient

| | Vanishing | Exploding |
|---|---|---|
| Cơ chế | `σ'(z) ≤ 0.25` (sigmoid); nhân qua `L` lớp → `(0.25)ᴸ → 0` | gradient tăng cấp số nhân → weights → ∞, loss = NaN |
| Hệ quả | lớp đầu không học được gì | training sụp đổ |
| Khắc phục | **ReLU** thay sigmoid/tanh; **Batch Norm**; **residual connections** (ResNet); khởi tạo **He/Xavier** | **gradient clipping**; khởi tạo weights nhỏ; Batch Norm; giảm `η` |

**ResNet** (He et al., 2016): skip connection `y = F(x) + x` cho gradient đi thẳng qua → train được mạng 100+ lớp.

## 10. Thực tế

### Overfitting

| Kỹ thuật | Cơ chế |
|---|---|
| **L2 regularization** | phạt `‖W‖²` → weights nhỏ hơn |
| **Dropout** | tắt ngẫu nhiên `p%` neuron mỗi bước train |
| **Early stopping** | dừng khi val loss tăng |
| **Data augmentation** | tăng dữ liệu giả (CV, NLP) |

*Quy trình:* (1) overfit trước — chứng minh mạng đủ capacity; (2) rồi mới thêm regularization. Đừng regularize quá sớm.

### Khởi tạo weights

- **Zero init** → mọi neuron giống nhau (không phá được đối xứng) → hỏng.
- **Xavier/Glorot** (`W ~ N(0, 2/(nᵢₙ+nₒᵤₜ))`) cho sigmoid/tanh.
- **He** (`W ~ N(0, 2/nᵢₙ)`) cho ReLU.

### Batch Normalization

Chuẩn hoá `z⁽ˡ⁾` theo mini-batch (`z_norm = (z−μ)/√(σ²+ε)`, rồi `γ·z_norm + β`). Giảm internal covariate shift, cho phép `η` lớn hơn, có tác dụng regularization nhẹ.

## 11. Pipeline huấn luyện

```
Khởi tạo W,b (He/Xavier) → [Forward pass → tính Loss → Backward pass (BP1-4) → GD update] lặp
→ kiểm tra: không NaN, loss giảm sau epoch 1, hai đường train/val hội tụ
```

```python
# NumPy scratch — mỗi dòng khớp một phương trình
def backward(X, y, params, cache):
    Z1, A1, Z2, A2 = cache; m = X.shape[1]
    dZ2 = A2 - y                                   # BP1 (BCE + sigmoid)
    dW2 = dZ2 @ A1.T / m                           # BP3
    db2 = dZ2.mean(axis=1, keepdims=True)          # BP4
    dZ1 = params['W2'].T @ dZ2 * (1 - A1**2)       # BP2 (đạo hàm tanh)
    dW1 = dZ1 @ X.T / m                            # BP3
    db1 = dZ1.mean(axis=1, keepdims=True)          # BP4
    return dW1, db1, dW2, db2
```

## 12. Tóm tắt

- Mỗi neuron = logistic regression; xếp nhiều neuron + **activation phi tuyến** → xấp xỉ được mọi hàm liên tục (Universal Approximation).
- Không có activation phi tuyến → mạng sâu sụp về một phép biến đổi tuyến tính.
- **Forward pass**: `z = Wa + b`, `a = σ(z)`, lưu cache.
- **Backpropagation** = chain rule qua 4 phương trình (BP1–BP4); tính mọi gradient trong một backward pass; với BCE+sigmoid thì `δ⁽ᴸ⁾ = a − y`.
- Hidden layer dùng **ReLU**; output dùng sigmoid (nhị phân) / softmax (đa lớp) / tuyến tính (regression).
- **Vanishing gradient**: sigmoid `σ' ≤ 0.25` nhân qua nhiều lớp → 0 → dùng ReLU, BatchNorm, residual, He init.
- Overfit: L2 + Dropout + Early stopping; khởi tạo He/Xavier; Adam là optimizer mặc định.
- Backprop + GD là nền tảng chung của CNN, RNN, Transformer.
