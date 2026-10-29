---
title: "Tổng quan IoT & kiến trúc phân tầng"
subject: "iot"
type: lecture
lecture_no: 1
status: todo
source: note
tags: [iot-architecture, sensors, connectivity, edge-computing]
date: 2026-10-29
---

# Tổng quan IoT & kiến trúc phân tầng

> Note khung cho bài mở đầu — sẽ cập nhật lại theo slide bài giảng.

## IoT là gì

**Internet of Things** là mạng lưới các vật thể vật lý được gắn cảm biến, phần mềm và khả năng kết nối, cho phép chúng **thu thập và trao đổi dữ liệu** mà không cần con người can thiệp trực tiếp. Giá trị của IoT không nằm ở từng thiết bị mà ở vòng lặp: *cảm nhận → truyền → xử lý → hành động*.

## Kiến trúc phân tầng

| Tầng | Vai trò | Ví dụ |
|---|---|---|
| **Perception** (thiết bị) | Cảm nhận môi trường, tác động ngược lại | Sensor nhiệt độ, camera, relay, ESP32, Arduino |
| **Network** (kết nối) | Truyền dữ liệu từ thiết bị lên hệ thống | Wi-Fi, BLE, Zigbee, LoRaWAN, NB-IoT, 4G/5G |
| **Processing** (xử lý) | Lưu trữ, tổng hợp, phân tích | Edge gateway, fog node, cloud (AWS IoT, Azure IoT Hub) |
| **Application** (ứng dụng) | Dịch vụ cho người dùng cuối | Smart home, nông nghiệp thông minh, giám sát công nghiệp |

## Giao thức tầng ứng dụng thường gặp

- **MQTT** — publish/subscribe qua broker, nhẹ, phù hợp thiết bị yếu và mạng không ổn định.
- **CoAP** — kiểu REST trên UDP, cho thiết bị bị giới hạn tài nguyên.
- **HTTP/REST** — đơn giản, phổ biến nhưng nặng hơn cho thiết bị nhỏ.

## Vấn đề xuyên suốt

- **Bảo mật**: thiết bị khó cập nhật, mật khẩu mặc định, dữ liệu truyền không mã hoá.
- **Năng lượng**: thiết bị chạy pin cần chu kỳ ngủ/thức và giao thức tiết kiệm năng lượng.
- **Khả năng mở rộng & tương thích**: hàng nghìn thiết bị, nhiều chuẩn khác nhau.
- **Dữ liệu**: chuỗi thời gian lớn, nhiễu — cần lọc ở edge trước khi đẩy lên cloud.
