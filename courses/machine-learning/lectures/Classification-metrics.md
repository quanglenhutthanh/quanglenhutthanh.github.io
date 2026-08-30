---
title: "ROC-AUC, PR-AUC, F1"
subject: "machine-learning"
type: lecture
lecture_no: 2
status: done
source: note
tags: [metrics, classification, roc-auc, pr-auc, f1, confusion-matrix]
date: 2026-08-30
---

# ROC-AUC · PR-AUC · F1

Cả ba metric này đều sinh ra từ đúng **bốn con số của confusion matrix** — chúng chỉ tổ hợp bốn con số đó theo cách khác nhau, và mỗi cách trả lời một câu hỏi riêng. Hiểu rõ "cách tổ hợp" là hiểu vì sao trên cùng một model, ba metric có thể kể ba câu chuyện rất khác nhau.

## 1. Nguồn của mọi thứ — Confusion Matrix

Với bài toán phân loại nhị phân, mỗi dự đoán rơi vào một trong bốn ô:

|                    | Thực tế Dương        | Thực tế Âm           |
|--------------------|----------------------|----------------------|
| **Dự đoán Dương**  | TP (bắt đúng)        | FP (báo nhầm)        |
| **Dự đoán Âm**     | FN (bỏ sót)          | TN (loại đúng)       |

- **TP** (True Positive): ca dương, model nói dương → đúng.
- **FP** (False Positive): ca âm, model nói dương → báo nhầm (false alarm).
- **FN** (False Negative): ca dương, model nói âm → bỏ sót (miss).
- **TN** (True Negative): ca âm, model nói âm → đúng.

**Quy tắc mẫu số:** mỗi "rate" chia cho cả một *hàng thật* của nó (toàn bộ ca dương thật, hoặc toàn bộ ca âm thật). Nhờ chia cho hằng số này mà TPR và FPR bền vững khi lớp bị mất cân bằng.

## 2. Bốn tỷ lệ nền

Bốn tỷ lệ dưới đây là "nguyên liệu" để dựng ROC và PR. Lưu ý Recall và TPR là **cùng một con số**, chỉ khác tên gọi theo ngành.

### Recall = TPR

```
Recall = TPR = TP / (TP + FN)
```

Trong tất cả các ca **dương thật**, model bắt được bao nhiêu phần. Mẫu số `TP + FN` = tổng số ca dương thật (hằng số, không đổi khi ta chỉnh ngưỡng). Machine learning quen gọi là **Recall**; thống kê / ROC quen gọi là **TPR** (True Positive Rate) và dùng nó cặp với FPR.

### Precision

```
Precision = TP / (TP + FP)
```

Trong tất cả các ca model **báo dương**, bao nhiêu phần là đúng. Đây là "độ tin khi model báo dương". Mẫu số `TP + FP` = tổng số lần báo-dương — con số này *thay đổi* theo ngưỡng và theo tỷ lệ lớp.

### FPR

```
FPR = FP / (FP + TN)
```

Trong tất cả các ca **âm thật**, bao nhiêu phần bị báo nhầm thành dương. Mẫu số `FP + TN` = tổng số ca âm thật (hằng số). FPR là "cặp đôi" của TPR trong không gian ROC.

### Điểm neo để nhớ

Recall, TPR, Precision đều lấy **TP ở tử số**; chỉ FPR lấy **FP ở tử số**. Recall và TPR y hệt nhau, chỉ khác tên. Khác biệt cốt lõi Precision ↔ TPR nằm ở **mẫu số**: Precision chia cho *pool báo-dương cục bộ*, TPR chia cho *toàn bộ lớp âm* (hằng số).

## 3. F1 — cân bằng Precision & Recall tại một ngưỡng

```
F1 = 2 · (P · R) / (P + R)
```

F1 là **trung bình điều hòa** (harmonic mean) của Precision và Recall, chứ không phải trung bình cộng. Hệ quả: F1 bị kéo về phía con số nhỏ hơn — chỉ cần P hoặc R thấp là F1 sập, không thể "ăn gian" bằng cách đẩy một vế lên thật cao.

Ví dụ lệch cực đại: P = 1.0, R = 0.0
- Trung bình cộng → 0.50 (nghe ổn nhưng vô nghĩa)
- Trung bình điều hòa → 0.00 (đúng bản chất: model này vô dụng)

F1 **bỏ qua TN** → nó tập trung hoàn toàn vào lớp dương, nhờ vậy chống được cái bẫy "accuracy cao giả tạo" khi dữ liệu mất cân bằng (đoán toàn bộ là âm vẫn được accuracy 99% nhưng F1 = 0).

**Quan trọng:** F1 được tính tại **một ngưỡng cụ thể**. Đổi ngưỡng → P, R đổi → F1 đổi. Ngược lại, ROC-AUC và PR-AUC tổng hợp trên *mọi* ngưỡng.

## 4. Ba câu diễn giải (nên thuộc lòng)

- **ROC-AUC — xếp hạng.** Bốc ngẫu nhiên một cặp (một ca dương, một ca âm) → ROC-AUC là *xác suất model chấm điểm ca dương cao hơn ca âm*. Không phụ thuộc ngưỡng. 0.5 = đoán bừa, 1.0 = hoàn hảo.
- **PR-AUC — độ tinh khiết.** Nhìn từ mỗi mức điểm trở lên: nhóm điểm cao đó có "sạch" (ít lẫn ca âm) không? Lấy trung bình trên mọi mức. Trả lời: *khi model kêu to, có tin được không, và tin được bao nhiêu?*
- **F1 — điểm vận hành.** Tại một ngưỡng đã chốt để đem deploy, Precision và Recall có cân bằng và cùng cao không? Đây là con số bạn thật sự "sống cùng" khi hệ thống chạy thật.

## 5. Cùng dữ liệu, ba góc nhìn

Với cùng một tập dự đoán, ta có thể vẽ:

- **Đường ROC**: trục ngang FPR, trục dọc TPR. Quét ngưỡng từ cao xuống thấp, mỗi ngưỡng cho một điểm (FPR, TPR). Đường là hàm bậc thang: gặp một ca dương → bước *lên*, gặp một ca âm → bước *sang phải*. AUC = diện tích dưới đường này.
- **Đường PR**: trục ngang Recall, trục dọc Precision. Cũng quét ngưỡng, nhưng đường "nhấp nhô" chứ không đơn điệu — vì Precision có thể tụt rồi lại lên khi thêm một TP.
- **Đường F1 theo ngưỡng**: F1 thường có *đỉnh* tại một ngưỡng tối ưu nào đó — đây chính là ý nghĩa của việc đi tìm `best_threshold` thay vì cứng nhắc dùng 0.5.

Ví dụ minh họa (8 mẫu): cùng một model có thể ra ROC-AUC ≈ 0.81, PR-AUC ≈ 0.85, F1 max ≈ 0.80 tại ngưỡng ≈ 0.4.

## 6. Vì sao ROC ≠ PR

|      | Trục ngang            | Trục dọc              | Góc "đẹp"    |
|------|-----------------------|-----------------------|--------------|
| ROC  | FPR (thấp → bên trái) | TPR (cao → lên trên)  | trên–trái    |
| PR   | Recall (cao → phải)   | Precision (cao → lên) | trên–phải    |

Chính **mẫu số** quyết định tất cả:

- **ROC**: FP được chia cho *toàn bộ lớp âm N* (một hằng số khổng lồ khi lớp âm áp đảo). Mỗi FP chỉ đẩy FPR lên `1/N` → đường ROC vẫn "trông đẹp" dù model sai nhiều.
- **PR**: FP được chia cho *pool báo-dương cục bộ* (nhỏ). Thêm vài FP là Precision tụt ngay → đường PR phản ánh "sự thật" khắc nghiệt hơn.

Hệ quả: với dữ liệu mất cân bằng nặng (ví dụ 5% dương), cùng một model có thể cho **ROC-AUC = 0.74 nhưng PR-AUC chỉ = 0.15**. ROC-AUC *bất biến* với tỷ lệ lớp; PR-AUC thì *không*. Khi lớp dương hiếm và ta quan tâm chất lượng cảnh báo dương → **dùng PR-AUC**.

## 7. Đọc thế nào là tốt / xấu

F1 và PR-AUC **không có mốc phổ quát**. Chỉ ROC-AUC có baseline cố định 0.5. Baseline của F1 và PR-AUC *trôi theo prevalence* (tỷ lệ lớp dương) — nên đừng bao giờ so hai giá trị này giữa hai tập có tỷ lệ lớp khác nhau.

| Metric   | Phụ thuộc ngưỡng? | Baseline "vô dụng"      | Nhạy với prevalence? | Trả lời câu hỏi                                  |
|----------|-------------------|------------------------|----------------------|-------------------------------------------------|
| ROC-AUC  | Không (mọi ngưỡng)| 0.5 (cố định)          | Không                | Xếp hạng ca dương trên ca âm có giỏi không?     |
| PR-AUC   | Không (mọi ngưỡng)| = prevalence           | Có                   | Nhóm điểm cao có "sạch" không?                  |
| F1       | Có (một ngưỡng)   | 2·prev / (1 + prev)    | Có                   | Tại điểm vận hành, cân bằng P–R có tốt không?   |

**Quy tắc vàng:** đừng hỏi "0.6 là tốt hay xấu?" theo số tuyệt đối. Hỏi: *"cao hơn baseline / majority trên CÙNG tập này bao nhiêu?"* — prevalence 50% thì F1 baseline đã là 0.667; prevalence 1% thì baseline chỉ 0.02.

## 8. Chọn metric nào khi nào

- **Lớp cân bằng, cần một con số so sánh model:** ROC-AUC là mặc định hợp lý.
- **Lớp dương hiếm (gian lận, bệnh hiếm, anomaly), quan tâm chất lượng cảnh báo:** PR-AUC.
- **Đã chốt ngưỡng, cần báo cáo hiệu năng vận hành thực tế:** F1 (hoặc precision/recall riêng lẻ nếu chi phí FP và FN lệch nhau — khi đó cân nhắc F-beta).
- **Chi phí FP ≠ chi phí FN rõ rệt:** đừng dừng ở F1; xét thẳng precision–recall theo yêu cầu nghiệp vụ, hoặc dùng cost-sensitive threshold.

## 9. Những hiểu lầm thường gặp

- **"ROC-AUC cao nghĩa là model tốt để deploy":** không hẳn. ROC-AUC chỉ nói khả năng *xếp hạng*. Với lớp mất cân bằng, ROC-AUC 0.9 vẫn có thể đi kèm PR-AUC thấp và precision tệ tại mọi ngưỡng dùng được.
- **So F1 giữa hai dataset khác prevalence:** vô nghĩa, vì baseline F1 khác nhau.
- **Nghĩ Precision và Recall đối xứng nhau:** không. Recall có mẫu số hằng số (toàn lớp dương), Precision có mẫu số thay đổi (pool báo-dương). Đó là gốc rễ mọi khác biệt ROC ↔ PR.
- **Dùng ngưỡng 0.5 mặc định rồi báo F1:** F1 phụ thuộc ngưỡng; nên quét ngưỡng để tìm đỉnh F1 (hoặc chọn ngưỡng theo ràng buộc nghiệp vụ) trước khi báo cáo.
- **Recall ≠ TPR:** sai — chúng là **cùng một con số**, chỉ khác tên gọi.

## 10. Tóm tắt

- Bốn số TP/FP/FN/TN là gốc; mọi metric chỉ là cách tổ hợp khác nhau.
- Recall = TPR = TP/(TP+FN); Precision = TP/(TP+FP); FPR = FP/(FP+TN).
- **ROC-AUC** = xác suất xếp đúng một cặp dương–âm; baseline cố định 0.5; bất biến với tỷ lệ lớp.
- **PR-AUC** = độ "tinh khiết" trung bình của các nhóm điểm cao; baseline = prevalence; nhạy với tỷ lệ lớp → ưu tiên khi lớp dương hiếm.
- **F1** = trung bình điều hòa của P và R tại **một ngưỡng**; bỏ qua TN; baseline = 2·prev/(1+prev).
- Khác biệt ROC ↔ PR nằm ở mẫu số của FP: toàn lớp âm (hằng số) so với pool báo-dương (cục bộ).
- Luôn đọc metric tương đối so với baseline trên *cùng* tập dữ liệu, đừng đọc theo số tuyệt đối.
