---
title: "Gradient Descent"
subject: "machine-learning"
type: lecture
lecture_no: 1
status: done
source: note
tags: [gradient-descent, optimization, backpropagation]
date: 2026-07-26
---

# Gradient Descent

## 1. Ý tưởng cốt lõi: quả bóng lăn xuống đồi

Tưởng tượng bạn đang đứng trên một ngọn đồi, mắt bịt kín, và nhiệm vụ là đi xuống điểm thấp nhất. Bạn không thấy toàn cảnh ngọn đồi, chỉ cảm nhận được mặt đất dưới chân đang dốc theo hướng nào. Chiến lược hợp lý nhất: ở mỗi bước, cảm nhận hướng dốc xuống nhiều nhất, bước một bước theo hướng đó, rồi lặp lại.

Đó chính xác là Gradient Descent. Trong Machine Learning / Deep Learning:

- "Ngọn đồi" là hàm loss (hàm mất mát) — đo model đang dự đoán sai bao nhiêu.
- "Vị trí đang đứng" là bộ tham số hiện tại của model (weights, bias).
- "Cảm nhận độ dốc" là tính gradient (đạo hàm) của loss theo từng tham số.
- "Bước xuống dốc" là cập nhật tham số theo hướng ngược với gradient.

Mục tiêu: tìm bộ tham số làm loss nhỏ nhất, tức model dự đoán càng gần đúng càng tốt.

Minh họa dạng ASCII của một hàm loss đơn giản (hình chữ U, giống cái bát):

```
loss
 25 |*                                 *
    | *                               *
 16 |   *                           *
    |     *                       *
  9 |        *                 *
    |           *           *
  4 |               *   *
    |                 *
  0 +------------------+------------------ x (tham số)
   -5        -2.5       0       2.5       5
```

Đáy bát (x = 0) là nơi loss thấp nhất — đích cần tới. Nếu bạn đứng ở x = 4.3 (bên phải), quả bóng cần lăn sang trái. Nếu bạn ở x = -4.3, bóng cần lăn sang phải. Gradient Descent chính là quy tắc toán học cho bóng biết nên lăn về hướng nào, và bao xa mỗi bước.

## 2. Vì sao Machine Learning cần cái này

Khi train một model, mục tiêu luôn là: tìm bộ tham số làm hàm loss nhỏ nhất. Với model đơn giản (vài tham số) đôi khi có thể giải trực tiếp bằng đại số. Nhưng deep learning có thể có hàng triệu đến hàng tỷ tham số — không cách nào giải trực tiếp được. Gradient Descent là phương pháp lặp: đoán một điểm bắt đầu, rồi liên tục điều chỉnh dần dần để loss giảm xuống, cho tới khi gần như không giảm thêm được nữa (hội tụ).

## 3. Gradient là gì

Gradient (đạo hàm) tại một điểm cho biết hai thứ:

1. Hướng: nếu đi tiếp theo hướng dương của tham số, loss sẽ tăng hay giảm.
2. Độ lớn: dốc bao nhiêu — dốc càng đứng, gradient càng lớn (giá trị tuyệt đối lớn); gần đáy, mặt đất gần như phẳng, gradient tiến về 0.

Ví dụ với hàm loss đơn giản L(x) = x², đạo hàm là L'(x) = 2x.

- Tại x = 4.3: gradient = 2 × 4.3 = 8.6 (dương lớn) → đang ở chỗ dốc, bên phải đáy.
- Tại x = 0.5: gradient = 1.0 (dương nhỏ) → gần đáy hơn, dốc thoải hơn.
- Tại x = 0: gradient = 0 → đáy, hết dốc, đây là điểm dừng lý tưởng.

## 4. Vì sao phải "lấy dấu ngược lại"

Đây là điểm rất hay gây nhầm lẫn. Gradient chỉ hướng làm loss **tăng** nhanh nhất (hướng đi lên dốc), không phải hướng xuống. Muốn loss giảm, phải đi ngược chiều gradient — vì vậy công thức cập nhật luôn có dấu trừ.

Xét lại ví dụ L(x) = x²:

- Ở x = 4.3 (bên phải đáy): gradient = +8.6 (dương). Dấu dương nghĩa là "nếu x tăng thêm, loss sẽ tăng". Vậy để loss giảm, phải giảm x. Công thức x_mới = x − lr × gradient = 4.3 − lr × 8.6 → x giảm xuống. Đúng hướng cần đi.
- Ở x = -4.3 (bên trái đáy): gradient = -8.6 (âm). Dấu âm nghĩa là "nếu x giảm thêm, loss sẽ tăng", suy ra tăng x thì loss giảm. Công thức x_mới = x − lr × gradient = -4.3 − lr × (-8.6) = -4.3 + lr × 8.6 → x tăng lên. Cũng đúng hướng cần đi.

Quy tắc gọn: gradient dương → trừ (đi xuống bên trái); gradient âm → cộng (đi xuống bên phải). Dấu trừ trong công thức chính là bước "đảo ngược" từ hướng đi lên (gradient) sang hướng đi xuống (thứ mình thực sự muốn).

## 5. Công thức cập nhật tham số

```
x_mới = x_cũ − learning_rate × gradient(x_cũ)
```

Ba thành phần:

- `x_cũ`: giá trị tham số hiện tại (điểm đang đứng trên đồi).
- `gradient(x_cũ)`: độ dốc tại điểm đó, cho biết hướng và độ lớn của "hướng lên dốc".
- `learning_rate` (tốc độ học, viết tắt `lr`): một số dương nhỏ, quyết định mỗi bước đi xa bao nhiêu.

Lặp lại công thức này nhiều lần (nhiều "iteration" hay "epoch"), x sẽ tiến dần về điểm loss nhỏ nhất.

## 6. Ví dụ số cụ thể, từng bước một

Dùng L(x) = x², bắt đầu tại x = 4.3, learning rate = 0.1:

| Bước | x (trước) | gradient = 2x | x_mới = x − 0.1×gradient | loss = x² |
|---|---|---|---|---|
| 0 | 4.30 | 8.60 | 4.30 − 0.86 = 3.44 | 18.49 |
| 1 | 3.44 | 6.88 | 3.44 − 0.688 = 2.75 | 11.83 |
| 2 | 2.75 | 5.50 | 2.75 − 0.55 = 2.20 | 7.56 |
| 3 | 2.20 | 4.40 | 2.20 − 0.44 = 1.76 | 4.84 |
| 4 | 1.76 | 3.52 | 1.76 − 0.352 = 1.41 | 3.10 |
| 5 | 1.41 | 2.82 | 1.41 − 0.282 = 1.13 | 1.98 |

Nhận xét: x càng gần 0, gradient càng nhỏ, bước đi càng ngắn lại một cách tự nhiên — giống như quả bóng chậm dần khi gần tới đáy phẳng. Loss giảm dần đều ở mỗi bước. Nếu tiếp tục lặp, x sẽ tiệm cận 0 (nhưng không bao giờ chạm đúng 0 tuyệt đối, chỉ tiến rất gần).

## 7. Learning rate quan trọng thế nào

Learning rate là "độ dài mỗi bước chân". Đây là một trong những nguyên nhân gây confuse nhiều nhất khi mới học, vì cùng một công thức nhưng chọn số khác nhau cho ra kết quả hoàn toàn khác:

**Learning rate quá nhỏ** (ví dụ 0.001–0.01): mỗi bước nhích rất ít. Model vẫn hội tụ đúng hướng, nhưng cực kỳ chậm — train rất lâu mới đạt loss thấp, tốn thời gian và tài nguyên.

**Learning rate vừa phải** (ví dụ 0.05–0.5 với hàm này): bước đi đủ dài để tiến nhanh, nhưng không dài tới mức nhảy quá đà. Bóng lăn mượt xuống đáy, hội tụ nhanh và ổn định — đây là vùng lý tưởng.

**Learning rate quá lớn** (ví dụ trên 1.0 với hàm này): mỗi bước nhảy vọt qua bên kia đáy, xa hơn cả vị trí ban đầu. Loss không giảm mà dao động rồi tăng vọt (diverge). Đây chính là nguyên nhân phổ biến khi thấy loss trong lúc train "nổ" thành NaN hoặc tăng vọt thay vì giảm.

Ví dụ minh họa bằng số, cùng x₀ = 4.3:

| Learning rate | x sau bước 1 | x sau bước 2 | Xu hướng |
|---|---|---|---|
| 0.01 | 4.21 | 4.13 | Hội tụ, nhưng rất chậm |
| 0.1 | 3.44 | 2.75 | Hội tụ nhanh, ổn định |
| 0.5 | 0.00 | 0.00 | Chạm đáy ngay lập tức (trường hợp đặc biệt của hàm này) |
| 1.1 | -0.86 | 1.89 | Dao động, biên độ tăng dần → phân kỳ (diverge) |

Trong thực tế, việc chọn learning rate phù hợp (và các kỹ thuật tự động điều chỉnh nó) là một trong những phần quan trọng nhất khi train model.

## 8. Khi có nhiều hơn một tham số

Ví dụ trên chỉ có 1 tham số x, nhưng model thật có thể có hàng triệu tham số (weights, bias của từng layer). Nguyên lý không đổi, chỉ mở rộng:

- Thay vì một con số gradient, ta có một **vector gradient**, mỗi phần tử là đạo hàm riêng phần (partial derivative) của loss theo từng tham số.
- Mỗi tham số được cập nhật độc lập theo cùng công thức: `tham_số_mới = tham_số_cũ − lr × gradient_riêng_của_tham_số_đó`.
- Trong deep learning, việc tính gradient cho hàng triệu tham số cùng lúc được thực hiện hiệu quả bằng thuật toán **backpropagation** (lan truyền ngược) — về bản chất vẫn chỉ là áp dụng liên tiếp quy tắc đạo hàm chuỗi (chain rule), không có gì khác với ví dụ 1 chiều ở trên.

Hình dung: thay vì quả bóng lăn trên một đường cong (2D), giờ nó lăn trên một mặt nhiều chiều (không thể vẽ ra nhưng toán học vẫn hoạt động y hệt).

## 9. Các biến thể phổ biến của Gradient Descent

- **Batch Gradient Descent**: tính gradient dựa trên toàn bộ tập dữ liệu training rồi mới cập nhật tham số một lần. Chính xác nhưng chậm và tốn bộ nhớ nếu dữ liệu lớn.
- **Stochastic Gradient Descent (SGD)**: cập nhật tham số sau mỗi một mẫu dữ liệu. Nhanh hơn, nhưng đường đi "lồi lõm", nhiễu hơn vì mỗi mẫu cho một ước lượng gradient không hoàn hảo.
- **Mini-batch Gradient Descent**: thỏa hiệp giữa hai cái trên — tính gradient trên một nhóm nhỏ mẫu (ví dụ 32, 64, 128 mẫu) mỗi lần cập nhật. Đây là cách phổ biến nhất trong thực tế deep learning hiện nay.

## 10. Các phiên bản cải tiến (nghe qua để không bỡ ngỡ)

Gradient Descent cơ bản (còn gọi "vanilla") có nhược điểm: dễ bị kẹt ở vùng gần như phẳng, dễ dao động nếu bề mặt loss lởm chởm. Vài cải tiến thường gặp:

- **Momentum**: giữ lại một phần "đà" từ bước trước, giống như quả bóng có quán tính thật, giúp vượt qua các đoạn gần phẳng nhanh hơn và bớt dao động.
- **RMSProp / Adagrad**: tự động điều chỉnh learning rate cho từng tham số riêng biệt, dựa trên lịch sử độ lớn gradient của tham số đó.
- **Adam**: kết hợp ý tưởng của Momentum và RMSProp, hiện là optimizer mặc định phổ biến nhất trong deep learning vì hội tụ nhanh và khá ổn định mà không cần tinh chỉnh learning rate quá kỹ.

Tất cả các biến thể này vẫn dựa trên nguyên lý gốc: đi ngược hướng gradient để giảm loss — chúng chỉ thông minh hơn ở chỗ *đi bao xa* và *đi theo hướng nào chính xác* ở mỗi bước.

## 11. Những hiểu lầm / lỗi thường gặp

- **Nhầm rằng gradient chỉ hướng đi xuống**: sai — gradient chỉ hướng đi lên (dốc tăng nhanh nhất). Đó là lý do công thức phải có dấu trừ (xem mục 4).
- **Loss tăng vọt hoặc thành NaN khi train**: dấu hiệu kinh điển của learning rate quá lớn — bước nhảy quá đà liên tục, giống ví dụ lr = 1.1 ở mục 7.
- **Local minima (cực tiểu cục bộ)**: nếu bề mặt loss không phải hình chữ U đơn giản mà có nhiều "hố nhỏ", quả bóng có thể kẹt ở một hố không phải là hố sâu nhất toàn cục. Trong thực tế deep learning với rất nhiều tham số, vấn đề này ít nghiêm trọng hơn tưởng tượng, và các biến thể như Momentum, SGD (nhờ nhiễu) giúp thoát khỏi các hố nông.
- **Learning rate cố định suốt quá trình train là chưa tối ưu**: nhiều pipeline thực tế giảm dần learning rate theo thời gian (learning rate schedule / decay) — bước đi dài lúc đầu để tiến nhanh, ngắn dần về sau để "hạ cánh" chính xác gần đáy.
- **Không chuẩn hóa (normalize) dữ liệu đầu vào**: nếu các đặc trưng (feature) có thang đo chênh lệch quá lớn, bề mặt loss sẽ bị méo (giống một thung lũng dài và hẹp thay vì cái bát tròn), khiến Gradient Descent zic-zac chậm chạp thay vì đi thẳng tới đáy.

## 12. Tóm tắt

- Gradient Descent = phương pháp lặp, đi từng bước ngược hướng gradient để giảm dần hàm loss.
- Gradient chỉ hướng dốc lên; phải lấy dấu ngược lại để đi xuống — đó là lý do có dấu trừ trong công thức.
- Công thức lõi: `tham_số_mới = tham_số_cũ − learning_rate × gradient`.
- Learning rate quá nhỏ → chậm; vừa phải → hội tụ tốt; quá lớn → dao động hoặc phân kỳ.
- Với model thật (nhiều tham số), nguyên lý giống hệt, chỉ là làm đồng thời trên vector gradient, tính bằng backpropagation.
- Batch / SGD / Mini-batch là cách chia dữ liệu khi tính gradient; Momentum / RMSProp / Adam là các cách làm bước đi thông minh hơn.
