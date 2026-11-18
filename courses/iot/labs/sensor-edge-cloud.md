---
title: "Lab 9 · Hệ IoT 3 tầng: Arduino → Raspberry Pi → Cloud dashboard"
subject: "iot"
type: lab
lab_no: 9
status: todo
source: note
tags: [arduino, raspberry-pi, edge-computing, cloud, dashboard]
date: 2026-11-15
---

# Lab 9 · Hệ IoT 3 tầng: Arduino → Raspberry Pi → Cloud dashboard

## Abstract

Lab xây dựng một hệ IoT hoàn chỉnh theo kiến trúc 3 tầng. **Tầng thiết bị**: Arduino đọc cảm biến. **Tầng edge**: Raspberry Pi nhận dữ liệu từ Arduino, xử lý sơ bộ rồi gửi lên cloud. **Tầng cloud**: server tiếp nhận, lưu trữ dữ liệu và hiển thị trên dashboard.

```
┌───────────┐    ┌────────────────┐    ┌──────────────┐    ┌───────────┐
│  Sensor   │───►│      Edge      │───►│ Cloud server │───►│ Dashboard │
│ (Arduino) │    │ (Raspberry Pi) │    │              │    │           │
└───────────┘    └────────────────┘    └──────────────┘    └───────────┘
```
