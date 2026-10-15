---
title: "Dữ liệu → Thông tin → Tri thức"
subject: "data-mining"
type: lecture
lecture_no: 1
status: done
source: note
tags: [dikw, kdd, data-mining-process, crisp-dm]
date: 2026-10-11
---

# Dữ liệu → Thông tin → Tri thức

Data Mining tồn tại vì một khoảng cách: tổ chức có **rất nhiều dữ liệu** nhưng **rất ít tri thức** dùng được để ra quyết định (*"data rich, information poor"*). Khai phá dữ liệu là quá trình đi từ đầu này sang đầu kia.

## 1. Tháp DIKW

Bốn tầng, mỗi tầng được xây từ tầng dưới bằng cách **thêm ngữ cảnh, xử lý và hiểu biết**:

| Tầng | Là gì | Trả lời câu hỏi | Ví dụ (siêu thị) |
|---|---|---|---|
| **Data** (dữ liệu) | Sự kiện, con số, ký hiệu thô, chưa có ngữ cảnh | — | `TX1023, 2025-10-04, SKU_88, 2, 45000` |
| **Information** (thông tin) | Dữ liệu đã được tổ chức, gắn ngữ cảnh, có ý nghĩa | *Who? What? When? Where? How many?* | "Tuần trước bán được 1.200 hộp sữa, giảm 15% so với tuần trước nữa" |
| **Knowledge** (tri thức) | Quy luật, mẫu, mối quan hệ rút ra từ thông tin; dùng được để giải thích và dự đoán | *How? Why?* | "Khách mua tã thường mua kèm sữa; doanh số sữa giảm khi đối thủ chạy khuyến mãi tã" |
| **Wisdom** (sự khôn ngoan) | Vận dụng tri thức để phán đoán, ra quyết định đúng | *What should we do?* | "Đặt sữa cạnh tã, chạy combo khi đối thủ khuyến mãi" |

Lưu ý:

- Càng lên cao: **khối lượng giảm, giá trị tăng**, mức độ cần con người diễn giải tăng.
- Ranh giới giữa các tầng **không tuyệt đối** — cùng một con số có thể là thông tin với người này, là dữ liệu thô với người khác.
- Biến đổi giữa các tầng:
  - Data → Information: làm sạch, tích hợp, tổng hợp, thống kê mô tả, báo cáo (đây là việc của **truy vấn, OLAP, BI**).
  - Information → Knowledge: tìm mẫu ẩn, quy luật, mô hình dự đoán (đây là việc của **Data Mining**).
  - Knowledge → Wisdom: con người (hoặc hệ thống ra quyết định) đánh giá, cân nhắc bối cảnh và hành động.

Phân biệt quan trọng: **truy vấn** trả lời câu hỏi mà ta *đã biết để hỏi* ("doanh thu tháng 9 bao nhiêu?"); **khai phá** tìm ra những gì ta *chưa biết để hỏi* ("nhóm khách nào sắp rời bỏ, và vì sao?").

## 2. Data Mining là gì

> Data Mining là quá trình **tự động hoặc bán tự động** phát hiện các **mẫu (pattern)** trong lượng dữ liệu lớn, sao cho các mẫu đó **hợp lệ, mới, có ích tiềm năng và hiểu được**.

Bốn tiêu chí của một mẫu "đáng giá":

1. **Valid** — đúng trên dữ liệu mới, không chỉ trên dữ liệu đã thấy (không overfit).
2. **Novel** — chưa biết trước. "Bệnh nhân mang thai đều là nữ" đúng nhưng vô dụng.
3. **Potentially useful** — dẫn tới hành động có lợi.
4. **Understandable** — con người diễn giải được (ít nhất là sau khi xử lý thêm).

Theo nghĩa hẹp, Data Mining là **một bước** trong quy trình KDD; theo nghĩa rộng (cách dùng phổ biến), nó chỉ cả quy trình.

## 3. Quy trình KDD (Knowledge Discovery in Databases)

Quy trình kinh điển của Fayyad et al. (1996), đi từ dữ liệu đến tri thức:

```
Databases ─► Selection ─► Preprocessing ─► Transformation ─► Data Mining ─► Interpretation/Evaluation ─► Knowledge
   (data)     target data   clean data      transformed data    patterns                                (knowledge)
```

| Bước | Làm gì |
|---|---|
| 1. **Selection** | Hiểu bài toán, chọn nguồn dữ liệu và tập con liên quan |
| 2. **Preprocessing** | Làm sạch: xử lý thiếu, nhiễu, ngoại lai, trùng lặp, mâu thuẫn; tích hợp nhiều nguồn |
| 3. **Transformation** | Chuẩn hoá, rời rạc hoá, tạo feature, giảm chiều (PCA, chọn feature) |
| 4. **Data Mining** | Áp dụng thuật toán để tìm mẫu: luật kết hợp, phân lớp, phân cụm… |
| 5. **Interpretation / Evaluation** | Đánh giá mẫu theo 4 tiêu chí trên, trực quan hoá, loại mẫu tầm thường, diễn giải cho người dùng |

Quy trình **lặp**: kết quả ở bước 5 thường buộc quay lại bước trước (thêm dữ liệu, sửa cách làm sạch, đổi feature). Trên thực tế, bước 2–3 chiếm phần lớn thời gian (thường được nói là 60–80%).

Ánh xạ sang DIKW: bước 1–3 biến *data* thành dữ liệu sẵn sàng phân tích; bước 4 tìm *pattern*; bước 5 biến pattern thành *knowledge*.

### CRISP-DM — phiên bản hướng doanh nghiệp

Quy trình chuẩn công nghiệp, nhấn mạnh hai đầu mà KDD ít nói tới — hiểu bài toán kinh doanh và triển khai:

1. Business Understanding → 2. Data Understanding → 3. Data Preparation → 4. Modeling → 5. Evaluation → 6. Deployment (có vòng lặp giữa các bước).

## 4. Các loại tác vụ khai phá

| Nhóm | Mục tiêu | Tác vụ | Ví dụ |
|---|---|---|---|
| **Mô tả** (*descriptive*) | Tìm cấu trúc, quy luật có sẵn trong dữ liệu | Luật kết hợp, mẫu phổ biến, phân cụm, tóm tắt | Giỏ hàng: {tã} ⇒ {sữa}; phân khúc khách hàng |
| **Dự đoán** (*predictive*) | Dùng biến đã biết để đoán biến chưa biết | Phân lớp, hồi quy, dự báo chuỗi thời gian, phát hiện bất thường | Khách có rời bỏ không; doanh số tháng sau |

Loại dữ liệu đầu vào (xem [Cấu trúc dữ liệu](data-structures.md)) quyết định một phần tác vụ và cách đánh giá.

## 5. Tóm tắt

- **Data** là sự kiện thô; **information** là dữ liệu có ngữ cảnh (trả lời *cái gì, bao nhiêu*); **knowledge** là quy luật rút ra từ thông tin (trả lời *thế nào, tại sao*); **wisdom** là biết nên làm gì.
- Truy vấn/BI đưa ta từ data lên information; Data Mining đưa ta từ information lên knowledge.
- Mẫu đáng giá phải **valid, novel, useful, understandable**.
- KDD: Selection → Preprocessing → Transformation → Data Mining → Interpretation, lặp nhiều vòng; tiền xử lý tốn công nhất.
