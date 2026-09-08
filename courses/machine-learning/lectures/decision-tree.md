---
title: "Decision Tree"
subject: "machine-learning"
type: lecture
lecture_no: 9
status: done
source: slide
tags: [decision-tree, gini, entropy, information-gain, cart, overfitting, pruning, cross-validation, hyperparameter-tuning]
date: 2026-08-31
---

# Decision Tree

Cây quyết định học bằng cách đặt liên tiếp các câu hỏi Yes/No về đặc trưng, mỗi câu hỏi chia dữ liệu thành hai nhánh **tinh khiết hơn**. Kết quả là một tập luật If-Then con người đọc được. Khác với [linear/logistic regression](logistic-regression.md): không cần scaling, xử lý phi tuyến và tương tác đặc trưng tự động, nhưng **rất dễ overfit**. Hiểu decision tree = hiểu nền tảng của toàn bộ họ [Ensemble Methods](ensemble-methods.md) (Random Forest, XGBoost).

Lab: [`Decision_Tree.ipynb`](../labs/Decision_Tree.ipynb).

## 1. Độ tinh khiết (impurity)

Tại một node có phân phối lớp `{p_k}`:

```
Gini    = 1 − Σ p_k²          (min 0 = tinh khiết, max 0.5 khi 50/50)
Entropy = − Σ p_k·log₂(p_k)   (min 0,               max 1 bit khi 50/50)
```

- **Gini**: nhanh hơn (không cần `log`) — mặc định của sklearn.
- **Entropy**: nhạy hơn khi phân phối lệch.
- Thực tế hai thước đo gần như luôn chọn cùng một split.

## 2. Information Gain — tiêu chí chia

```
Gain = Impurity(cha) − Σ (nₖ/n) · Impurity(conₖ)
```

Tại mỗi node, thuật toán **duyệt mọi (đặc trưng, ngưỡng)** và chọn split có **Gain lớn nhất**.

- Đặc trưng số: sắp xếp giá trị, thử các **midpoint** giữa mỗi cặp liên tiếp (`n−1` ngưỡng ứng viên), tính Gain cho từng ngưỡng.
- **Cardinality bias**: đặc trưng liên tục (hoặc nhiều giá trị) có nhiều ngưỡng ứng viên hơn → dễ được ưu tiên hơn đặc trưng nhị phân. Chi phí mỗi node: `O(n·log n · p)`.

*Ví dụ (10 bệnh nhân, 4 High / 6 Low): Gini gốc = 0.48. Split "Hút thuốc = Yes?" cho weighted Gini = 0.317 → Gain = 0.163, cao nhất → chọn làm split đầu tiên.*

## 3. Thuật toán CART

*Classification And Regression Trees:*

1. Tại mỗi node, duyệt mọi đặc trưng × mọi ngưỡng → chọn split có Gain lớn nhất.
2. Chia dữ liệu thành 2 nhánh (trái: điều kiện đúng, phải: sai).
3. Lặp đệ quy trên mỗi nhánh.
4. **Điều kiện dừng**: node tinh khiết (Gini = 0), đạt `max_depth`, hoặc số mẫu `< min_samples_split`.

Hồi quy: thay impurity bằng phương sai (MSE), dự đoán ở lá = trung bình `y`.

## 4. Overfitting

Cây mọc tự do (`max_depth=None`) sẽ **học thuộc lòng**: mỗi lá 1 mẫu, Train accuracy = 100% nhưng Test tụt hẳn.

*Ví dụ điển hình:*

| | depth=None | depth=3 | depth=5 | Logistic Reg |
|---|---|---|---|---|
| Train acc | 1.000 | 0.794 | 0.819 | 0.814 |
| Test acc | 0.728 | 0.754 | 0.765 | 0.750 |
| Số lá | 287 | 8 | 26 | — |

`depth=5` cân bằng nhất ở đây.

### Hyperparameter kiểm soát overfitting

| Tham số | Ý nghĩa | Giảm → | Khuyến nghị |
|---|---|---|---|
| `max_depth` | số tầng tối đa | overfit | thử 3–6 |
| `min_samples_leaf` | số mẫu tối thiểu ở lá | overfit | thử 10–50 |
| `min_samples_split` | số mẫu tối thiểu để chia | overfit | mặc định 2 |
| `max_leaf_nodes` | số lá tối đa | overfit | thay cho `max_depth` |
| `ccp_alpha` | hệ số cắt tỉa (cost-complexity pruning) | cây phức tạp | tìm qua CV |

**Pre-pruning** = dừng sớm khi mọc (các tham số trên). **Post-pruning** = mọc đầy rồi cắt bớt nhánh ít giá trị (`ccp_alpha`).

### Chiến lược thực hành

① `max_depth=3` → ② tăng dần, vẽ đường Train/Test → ③ dừng khi Test bắt đầu giảm → ④ `GridSearchCV` tinh chỉnh.

## 5. Cross-Validation

Train/test split một lần → kết quả phụ thuộc cách chia. **K-Fold**: chia `K` phần, mỗi phần lần lượt làm test → báo cáo `mean ± std`. `K = 5` hoặc `10` phổ biến.

| Biến thể | Khi nào |
|---|---|
| **K-Fold** | dữ liệu cân bằng |
| **Stratified K-Fold** | giữ tỷ lệ lớp mỗi fold — bắt buộc khi imbalance; mặc định sklearn cho classification |
| **Repeated (Stratified) K-Fold** | lặp nhiều seed → giảm phương sai ước lượng; tốn thời gian hơn |

Xem thêm về CV và rò rỉ trong [L04](data-leakage-validation.md).

## 6. Hyperparameter Tuning

| | Grid Search | Random Search |
|---|---|---|
| Cách | thử **tất cả** tổ hợp | chọn **ngẫu nhiên** `n_iter` tổ hợp |
| Ưu | chắc chắn tìm best trong lưới | nhanh, phủ nhiều vùng tham số hơn |
| Nhược | chậm khi nhiều tham số (curse of dimensionality) | không đảm bảo best tuyệt đối |
| Khi nào | ≤ 2–3 tham số, ít giá trị mỗi tham số | ≥ 3 tham số, không gian lớn |

### Learning curve vs Validation curve

- **Learning curve** (trục X = số mẫu train): hai đường Train/Val hội tụ → ổn; khoảng cách lớn → overfit; cả hai thấp → underfit.
- **Validation curve** (trục X = một hyperparameter, ví dụ `max_depth`): chọn điểm Val cao nhất *trước khi* nó bắt đầu giảm.

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold
grid = GridSearchCV(
    DecisionTreeClassifier(random_state=42),
    {'max_depth': [3,4,5,6,7], 'min_samples_leaf': [5,10,20,50], 'criterion': ['gini','entropy']},
    cv=StratifiedKFold(5, shuffle=True, random_state=42), scoring='accuracy', n_jobs=-1)
grid.fit(X_train, y_train)
```

## 7. Ưu / nhược

| Ưu | Nhược |
|---|---|
| luật If-Then trực quan, giải thích được | dễ overfit — phải kiểm soát |
| không cần feature scaling | không ổn định (đổi data chút → cây khác hẳn) |
| xử lý phi tuyến & tương tác tự động | ranh giới quyết định vuông góc trục (bậc thang) |
| numerical & categorical | extrapolation kém |
| — | một cây đơn lẻ thường yếu → dùng ensemble |

## 8. Tóm tắt

- Chia node theo **Information Gain** = giảm impurity (**Gini** nhanh / **Entropy** nhạy); duyệt mọi (đặc trưng, ngưỡng).
- **CART**: đệ quy chia đôi đến điều kiện dừng; hồi quy thì dùng phương sai + trung bình ở lá.
- Cây tự do → overfit (Train 100%, Test thấp) → kiểm soát bằng `max_depth` (3–6), `min_samples_leaf` (10–50), `ccp_alpha` (pruning).
- **Cross-validation** (Stratified K-Fold) để đánh giá ổn định; **Grid/Random Search** + learning/validation curve để tune.
- Một cây = nền tảng của [Random Forest & Boosting](ensemble-methods.md).
