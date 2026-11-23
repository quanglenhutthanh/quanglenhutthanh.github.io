---
title: "Lab 18 · Arduino · Smart greenhouse với Raspberry Pi"
subject: "iot"
type: lab
lab_no: 18
board: arduino-uno
status: todo
source: note
tags: [arduino, raspberry-pi, greenhouse, dht11, ldr, water-sensor, servo, serial, edge-computing]
date: 2026-11-22
---

> Ghép các cảm biến và cơ cấu chấp hành đã học thành một **nhà kính thông minh** thu nhỏ. **Arduino Uno** đọc cảm biến (nhiệt độ – độ ẩm [DHT11](dht11.md), ánh sáng [LDR](photoresistor.md), mực nước [water sensor](water-sensor.md)) và điều khiển thiết bị (servo mở cửa thông gió, LED chiếu sáng, buzzer báo hết nước). **Raspberry Pi** nhận dữ liệu qua cáp USB (Serial), ghi log, áp luật điều khiển rồi gửi lệnh ngược lại cho Arduino. Lab đi tiếp mô hình chia việc Pi ↔ Arduino ở [Lab 7](seven-segment-5641as.md) và kiến trúc 3 tầng ở [Lab 9](sensor-edge-cloud.md).

::: {.callout-note}
## Đang soạn

Lab đang ở dạng khung. Sơ đồ nối dây thật, ảnh, video và các ghi chú khi làm sẽ được bổ sung sau.
:::

## Kiến trúc hệ thống

```
┌──────────────────────────────┐   dữ liệu cảm biến   ┌────────────────────────────┐
│          Arduino Uno         │  ────────────────►   │        Raspberry Pi        │
│  DHT11 · LDR · water sensor  │      USB Serial      │ ghi log · luật điều khiển  │
│  servo · LED · buzzer · LCD  │  ◄────────────────   │ (tuỳ chọn) gửi lên cloud   │
└──────────────────────────────┘   lệnh điều khiển    └────────────────────────────┘
```

| Tầng | Thiết bị | Nhiệm vụ |
|---|---|---|
| Thiết bị | Arduino Uno | Đọc cảm biến theo chu kỳ, điều khiển servo/LED/buzzer, phản ứng tại chỗ khi mất kết nối với Pi |
| Edge | Raspberry Pi | Nhận dữ liệu, lưu log, quyết định bật/tắt theo ngưỡng, (tuỳ chọn) đẩy lên dashboard |

Vì sao chia như vậy: Arduino xử lý phần cứng cần thời gian thực và chạy được ngay khi cắm nguồn; Pi là máy tính Linux có mạng, lưu trữ và dễ viết logic phức tạp bằng Python.

## Linh kiện

| Linh kiện | Vai trò trong nhà kính | Lab tham khảo |
|---|---|---|
| Arduino Uno + cáp USB | Vi điều khiển, nối với Pi | [Lab 1](led-basics.md) |
| Raspberry Pi | Edge gateway | [Lab 9](sensor-edge-cloud.md) |
| DHT11 | Nhiệt độ, độ ẩm không khí | [Lab 3](dht11.md) |
| Quang trở (LDR) + điện trở 10 kΩ | Cường độ ánh sáng | [Lab 5](photoresistor.md) |
| Water sensor | Mực nước trong bể tưới | [Lab 11](water-sensor.md) |
| Servo SG90 | Mở/đóng cửa thông gió | [Lab 4](servo-sg90.md) |
| LED (+ điện trở 220 Ω) | Đèn chiếu sáng bổ sung | [Lab 1](led-basics.md) |
| Buzzer | Báo bể hết nước | — |
| LCD 1602 I²C (tuỳ chọn) | Hiển thị số đo tại chỗ | [Lab 2](lcd-i2c.md) |

## Nối dây

| Linh kiện | Chân linh kiện | Arduino Uno |
|---|---|---|
| DHT11 | DATA | `D2` |
| LDR (cầu phân áp) | điểm giữa | `A0` |
| Water sensor | S | `A1` |
| Servo SG90 | tín hiệu (cam) | `D9` |
| LED | anode (qua 220 Ω) | `D6` |
| Buzzer | + | `D8` |
| LCD I²C | SDA / SCL | `A4` / `A5` |

Tất cả `VCC` nối 5 V, `GND` nối chung GND. Servo nên cấp nguồn riêng nếu bị giật/reset board.

<!-- TODO: thêm sơ đồ nối dây và ảnh mạch thật -->

## Giao thức Serial

Hai bên trao đổi theo **từng dòng văn bản**, kết thúc bằng `\n`, baud 9600.

**Arduino → Pi** (mỗi 2 giây):

```
T=27.0,H=65,L=540,W=320
```

`T` nhiệt độ (°C), `H` độ ẩm (%), `L` ánh sáng (0–1023), `W` mực nước (0–1023).

**Pi → Arduino** (lệnh):

| Lệnh | Ý nghĩa |
|---|---|
| `VENT=OPEN` / `VENT=CLOSE` | Mở / đóng cửa thông gió (servo 90° / 0°) |
| `LIGHT=ON` / `LIGHT=OFF` | Bật / tắt đèn LED |
| `ALARM=ON` / `ALARM=OFF` | Bật / tắt buzzer |

## Code Arduino

```cpp
#include <DHT.h>
#include <Servo.h>

const int DHT_PIN    = 2;
const int LDR_PIN    = A0;
const int WATER_PIN  = A1;
const int SERVO_PIN  = 9;
const int LED_PIN    = 6;
const int BUZZER_PIN = 8;

DHT dht(DHT_PIN, DHT11);
Servo vent;

char buf[32];
byte len = 0;
unsigned long lastSend = 0;

void handleCommand(const char *cmd) {
  if      (!strcmp(cmd, "VENT=OPEN"))  vent.write(90);
  else if (!strcmp(cmd, "VENT=CLOSE")) vent.write(0);
  else if (!strcmp(cmd, "LIGHT=ON"))   digitalWrite(LED_PIN, HIGH);
  else if (!strcmp(cmd, "LIGHT=OFF"))  digitalWrite(LED_PIN, LOW);
  else if (!strcmp(cmd, "ALARM=ON"))   tone(BUZZER_PIN, 2000);
  else if (!strcmp(cmd, "ALARM=OFF"))  noTone(BUZZER_PIN);
}

void readSerial() {                     // đọc không chặn, gặp '\n' mới xử lý
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      buf[len] = '\0';
      handleCommand(buf);
      len = 0;
    } else if (c != '\r' && len < sizeof(buf) - 1) {
      buf[len++] = c;
    }
  }
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  vent.attach(SERVO_PIN);
  vent.write(0);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  readSerial();

  if (millis() - lastSend >= 2000) {
    lastSend = millis();
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    if (isnan(t) || isnan(h)) return;   // DHT11 đọc lỗi, bỏ qua lần này

    Serial.print("T=");  Serial.print(t, 1);
    Serial.print(",H="); Serial.print(h, 0);
    Serial.print(",L="); Serial.print(analogRead(LDR_PIN));
    Serial.print(",W="); Serial.println(analogRead(WATER_PIN));
  }
}
```

## Code Raspberry Pi

Cần `pip install pyserial`.

```python
import csv
import time
from datetime import datetime

import serial

PORT = "/dev/ttyACM0"   # clone CH340 thường là /dev/ttyUSB0
TEMP_HIGH  = 30.0       # °C  → mở cửa thông gió
LIGHT_LOW  = 300        # LDR → bật đèn (tuỳ cách mắc cầu phân áp)
WATER_LOW  = 100        # water sensor → báo hết nước

ser = serial.Serial(PORT, 9600, timeout=1)
time.sleep(2)           # mở cổng làm Uno reset, chờ bootloader

state = {}

def send(cmd):
    if state.get(cmd.split("=")[0]) != cmd:      # chỉ gửi khi trạng thái đổi
        ser.write((cmd + "\n").encode())
        state[cmd.split("=")[0]] = cmd
        print("→", cmd)

def parse(line):
    return {k: float(v) for k, v in (p.split("=") for p in line.split(","))}

with open("greenhouse_log.csv", "a", newline="") as f:
    log = csv.writer(f)
    while True:
        line = ser.readline().decode(errors="ignore").strip()
        if not line.startswith("T="):
            continue
        d = parse(line)
        log.writerow([datetime.now().isoformat(timespec="seconds"),
                      d["T"], d["H"], d["L"], d["W"]])
        f.flush()
        print(d)

        send("VENT=OPEN"  if d["T"] > TEMP_HIGH else "VENT=CLOSE")
        send("LIGHT=ON"   if d["L"] < LIGHT_LOW else "LIGHT=OFF")
        send("ALARM=ON"   if d["W"] < WATER_LOW else "ALARM=OFF")
```

Ngưỡng ở trên là giá trị mẫu, cần chỉnh lại theo số đo thực tế của từng cảm biến.

## Kết quả

<!-- TODO: ảnh mô hình nhà kính, video demo, log mẫu -->

## Ghi chú khi làm

<!-- TODO: bổ sung từ note thực hành -->

## Mở rộng

- Đẩy dữ liệu từ Pi lên cloud/dashboard như [Lab 9](sensor-edge-cloud.md).
- Thêm máy bơm mini qua relay để tự tưới khi đất khô (cảm biến độ ẩm đất).
- Nếu mất kết nối với Pi quá 10 giây, Arduino tự chạy luật dự phòng tại chỗ.
