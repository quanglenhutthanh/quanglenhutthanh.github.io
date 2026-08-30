---
title: "Data Leakage & Kiểm định theo thời gian"
subject: "machine-learning"
type: lecture
lecture_no: 4
status: done
source: note
tags: [data-leakage, validation, cross-validation, time-based-split, feature-engineering, pipeline]
date: 2026-08-30
---

# Data Leakage & Kiểm định theo thời gian

**Data leakage (rò rỉ dữ liệu)** = thông tin mà model *sẽ không có* lúc dự đoán thật lại lọt vào lúc train hoặc lúc đánh giá. Hậu quả kinh điển: metric offline đẹp lộng lẫy, deploy xong tụt thẳng đứng. Leakage là lỗi phổ biến nhất và tốn kém nhất trong một dự án ML thực tế — nó không báo lỗi, không crash, chỉ âm thầm cho ta một con số sai.

Hai lab capstone của môn ([`PharmaDist`](../labs/PharmaDist_Reorder_Timing.ipynb), [`CNC`](../labs/CNC_Failure_Distribution_Shift.ipynb)) dành phần lớn công sức để *chặn* leakage — note này rút ra các nguyên tắc chung.

## 1. Hai họ leakage

### 1.1. Target leakage — feature chứa thông tin từ tương lai / từ nhãn

Một feature được tính bằng dữ liệu chỉ tồn tại *sau* thời điểm dự đoán, hoặc suy ra (một phần) từ chính nhãn.

Ví dụ:

- Dự đoán khách churn, nhưng feature `số_cuộc_gọi_hỗ_trợ` lại tính cả các cuộc gọi *sau* ngày churn.
- Dự đoán đơn hàng gian lận, feature `đã_hoàn_tiền` — chỉ có giá trị vì giao dịch đã bị phát hiện gian lận.
- Dự đoán bệnh, feature `loại_thuốc_đang_dùng` — thuốc được kê *vì* đã có chẩn đoán.

Dấu hiệu nghi ngờ: một feature "tốt bất thường" (coefficient hoặc importance áp đảo), AUC gần 1.0 một cách vô lý.

### 1.2. Train–test contamination — preprocessing "nhìn thấy" tập test

Bất kỳ phép biến đổi nào *học tham số từ dữ liệu* mà được fit trên toàn bộ dataset trước khi split:

- `StandardScaler` / `MinMaxScaler` fit trên cả train + test → mean/std đã "nếm" test.
- Impute missing bằng median của cả dataset.
- `SelectKBest` / feature selection chạy trên toàn bộ dữ liệu.
- Target encoding, PCA, `fit_transform` của bất cứ thứ gì trên full data.
- SMOTE / oversampling trước khi split → bản sao của một mẫu nằm cả ở train lẫn validation.

## 2. Quy tắc chống leakage (rút từ 2 lab)

### 2.1. Fit trên TRAIN, transform cả hai

Mọi transformer có trạng thái đều fit **chỉ trên train**, rồi `.transform()` áp lên test:

```python
scaler = StandardScaler().fit(X_train[NUM])      # chỉ nhìn train
X_train[NUM] = scaler.transform(X_train[NUM])
X_test[NUM]  = scaler.transform(X_test[NUM])      # dùng thống kê của train
```

Kiểm chứng nhanh: sau scale, `X_train` có mean ≈ 0; `X_test` **lệch khỏi 0** — đúng như mong đợi (và nếu có distribution shift, độ lệch này chính là bằng chứng shift, xem [Class Imbalance & Distribution Shift](L03-data-imbalance-shift.md)).

### 2.2. Impute bằng thống kê train-only

Median/mean để điền khuyết phải tính trên **tập train**, kể cả khi việc điền diễn ra trước bước split trong code:

```python
cutoff = df['order_date'].quantile(0.8)
train_median = df.loc[df['order_date'] <= cutoff, 'col'].median()
df['col'] = df['col'].fillna(train_median)
```

### 2.3. Feature *as-of* — chỉ dùng dữ liệu trước thời điểm dự đoán

Với dữ liệu có trục thời gian, mọi feature tổng hợp (đếm, trung bình tích luỹ, RFM…) phải lọc **strict** `event_date < prediction_date`:

```python
merged['before'] = merged['ticket_date'] < merged['order_date']
agg = merged[merged['before']].groupby('order_id').agg(...)
```

Rồi chốt bằng **leakage guard** — một assertion nổ ngay nếu lọt mẫu vi phạm:

```python
leaked = merged[merged['before']]
assert (leaked['ticket_date'] < leaked['order_date']).all(), 'Leakage detected!'
```

### 2.4. Split theo thời gian, không random

Dữ liệu sinh theo thời gian (đơn hàng, log cảm biến, giao dịch) → **train = phần cũ, test = phần mới** (ví dụ oldest 80% / newest 20%). Random split trộn tương lai vào train, cho metric lạc quan và giấu mất distribution shift.

### 2.5. Đồng bộ cột sau one-hot

`get_dummies` trên train và test độc lập có thể ra tập cột khác nhau (một hạng mục chỉ xuất hiện ở một bên). Căn lại theo train:

```python
test_cat = pd.get_dummies(test[CAT]).reindex(columns=train_cat.columns, fill_value=0)
```

Với NaN trong biến phân loại: `get_dummies(dummy_na=True)` coi NaN là một hạng mục riêng — không mất thông tin, không cần impute.

### 2.6. Resample / chọn ngưỡng bên trong CV

- SMOTE, undersampling: đặt **trong** pipeline CV, chỉ tác động lên các fold train.
- Chọn `best_threshold` cho F1: tính trên **out-of-fold predictions của tập train**, không bao giờ trên test. `argmax` trên một lần chia dao động mạnh → trung bình ngưỡng qua nhiều seed.

## 3. Cross-validation cho đúng

| Loại dữ liệu | Chiến lược | Lý do |
|---|---|---|
| I.I.D., phân loại | **StratifiedKFold** (shuffle) | Giữ tỷ lệ lớp trong mỗi fold — quan trọng khi imbalance |
| Có trục thời gian | **TimeSeriesSplit** / walk-forward | Fold train luôn *trước* fold validation về thời gian |
| Có nhóm (nhiều dòng / 1 khách) | **GroupKFold** | Không để cùng một khách nằm cả train lẫn validation |

**Out-of-fold (OOF) predictions**: `cross_val_predict` cho mỗi mẫu train một dự đoán được tạo bởi model *không* nhìn thấy nó. Dùng OOF để: chọn ngưỡng, hiệu chỉnh xác suất, stacking — tất cả mà không đụng test.

**Đánh giá drift classifier / bất kỳ meta-model nào cũng phải bằng OOF** — đánh giá in-sample cho AUC lạc quan giả.

## 4. Pattern an toàn: sklearn Pipeline

Gói toàn bộ preprocessing + model vào một `Pipeline`; khi truyền vào `cross_val_score` / `RandomizedSearchCV`, mỗi fold tự fit lại preprocessing **chỉ trên phần train của fold đó** — leakage bị chặn theo cấu trúc, không phải nhờ kỷ luật thủ công.

```python
pipe = Pipeline([
    ('scale', StandardScaler()),
    ('clf', LogisticRegression(class_weight='balanced')),
])
scores = cross_val_score(pipe, X_train, y_train, cv=StratifiedKFold(5), scoring='average_precision')
```

Việc fit thủ công một scaler chung (như §2.1) chấp nhận được khi ranh giới train/test là **một mốc thời gian cố định** và bạn cần cùng một không gian feature cho nhiều model — nhưng với CV lồng nhau thì Pipeline là chuẩn.

## 5. Checklist trước khi tin vào một con số offline

- [ ] Có feature nào tính từ dữ liệu *sau* thời điểm dự đoán không?
- [ ] Có feature nào là hệ quả của nhãn (chỉ tồn tại vì sự kiện đã xảy ra) không?
- [ ] Scaler / imputer / encoder / feature-selector có fit **chỉ trên train** không?
- [ ] Impute dùng thống kê train-only?
- [ ] Dữ liệu thời gian → split theo thời gian, CV là TimeSeriesSplit?
- [ ] Nhiều dòng / một thực thể → GroupKFold?
- [ ] Resampling và chọn ngưỡng nằm **trong** CV / trên OOF train?
- [ ] Nhãn được định nghĩa **trước** khi làm feature, với horizon rule rõ ràng (xem [L03](L03-data-imbalance-shift.md) Phần C)?
- [ ] Có feature nào "tốt bất thường" khiến AUC gần 1.0 không? → nghi leakage.

## 6. Tóm tắt

- **Target leakage**: feature chứa thông tin tương lai hoặc suy từ nhãn → xoá feature.
- **Contamination**: preprocessing fit trên full data → fit chỉ trên train.
- Dữ liệu thời gian: **as-of features** + **split theo thời gian** + **leakage guard assertion**.
- CV: Stratified (imbalance), TimeSeries (thời gian), Group (nhóm); dùng **OOF** để chọn ngưỡng / hiệu chỉnh / đánh giá meta-model.
- **Pipeline** đóng gói preprocessing + model → chặn leakage theo cấu trúc.
- Metric offline chỉ đáng tin sau khi đã qua checklist ở §5.
