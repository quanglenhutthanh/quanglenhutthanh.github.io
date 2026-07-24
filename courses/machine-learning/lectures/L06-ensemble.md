---
title: "Ensemble Methods"
subject: "machine-learning"
type: lecture
lecture_no: 6
status: done
source: slide
tags: [bagging, boosting, xgboost, random-forest]
date: 2024-03-15
---

# Lecture 6 – Ensemble Methods

> Note mock để minh hoạ môn thứ hai.

## Ý tưởng

Kết hợp nhiều mô hình yếu → một mô hình mạnh hơn, giảm variance (bagging) hoặc bias (boosting).

## Bagging vs Boosting

| | Bagging | Boosting |
|---|---|---|
| Huấn luyện | song song | tuần tự |
| Mục tiêu | giảm variance | giảm bias |
| Ví dụ | Random Forest | XGBoost, HistGradientBoosting |

## Random Forest

Dự đoán = trung bình (regression) hoặc vote đa số (classification) của $B$ cây:

$$\hat{f}(x) = \frac{1}{B} \sum_{b=1}^{B} T_b(x)$$
