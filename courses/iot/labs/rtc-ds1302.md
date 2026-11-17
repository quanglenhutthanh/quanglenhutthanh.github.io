---
title: "Lab 12 · Module đồng hồ thời gian thực (RTC DS1302)"
subject: "iot"
type: lab
lab_no: 12
status: done
source: note
tags: [arduino, rtc, ds1302, time]
date: 2026-11-17
resources:
  - ../assets/rtc-lcd-clock-real.mp4
  - ../assets/rtc-lcd-clock-real-poster.jpg
---

# Lab 12 · Module đồng hồ thời gian thực (RTC DS1302)

> Giới thiệu module **MH-Real-Time Clock Modules** trong kit, dùng chip **DS1302**. Module giúp Arduino biết được ngày giờ thực, kể cả khi đã rút nguồn.

## RTC là gì

**RTC** (*Real-Time Clock*) là con chip chuyên đếm thời gian: giây, phút, giờ, ngày, tháng, năm, thứ trong tuần.

Arduino tự nó **không biết giờ thực**. Hàm `millis()` chỉ đếm số mili giây kể từ lúc board khởi động, và bị reset về 0 mỗi khi mất điện. Khi cần ghi log có thời gian, hẹn giờ bật/tắt thiết bị, hay hiển thị đồng hồ, ta cần một RTC rời.

## Module trong kit

Module là một bảng mạch nhỏ gồm:

- **Chip DS1302**: bộ đếm thời gian và lịch, tự tính năm nhuận đến năm 2100.
- **Thạch anh 32,768 kHz**: tạo xung chuẩn để đếm giây ($32768 = 2^{15}$, chia đôi 15 lần ra đúng 1 Hz).
- **Hộc pin cúc áo CR2032**: nuôi chip khi Arduino mất nguồn, nên đồng hồ vẫn chạy tiếp.

### Chân kết nối

| Chân module | Chức năng | Nối với Arduino Uno |
|---|---|---|
| VCC | Nguồn 2–5,5 V | 5V |
| GND | Mass | GND |
| CLK | Xung clock (SCLK) | D6 |
| DAT | Dữ liệu (I/O) | D7 |
| RST | Chọn chip (CE) | D8 |

DS1302 giao tiếp qua **3 dây nối tiếp** riêng của nó, không phải I²C, nên dùng được chân digital bất kỳ (D6–D8 ở trên chỉ là gợi ý).

## So sánh nhanh các chip RTC phổ biến

| Chip | Giao tiếp | Độ chính xác | Ghi chú |
|---|---|---|---|
| **DS1302** | 3 dây | Phụ thuộc thạch anh, có thể lệch vài giây/ngày | Rẻ, có trong kit |
| DS1307 | I²C | Tương tự DS1302 | Cần 5 V |
| DS3231 | I²C | ±2 ppm (~1 phút/năm) | Có thạch anh bù nhiệt bên trong, chính xác nhất |

## Ví dụ: đồng hồ trên màn hình LCD

Ghép module RTC với màn hình LCD 1602 I²C ở [Lab 2](lcd-i2c.md) để làm một đồng hồ để bàn:

```
dòng 1:  17/11/2026  T3
dòng 2:  14:05:32
```

Tinkercad không có linh kiện DS1302, nên ví dụ này chỉ lắp được trên mạch thật.

### Chuẩn bị

| Linh kiện | Số lượng |
|---|---|
| Arduino Uno + cáp USB | 1 |
| Module RTC DS1302 + pin CR2032 | 1 |
| Màn hình LCD 1602 có module I²C | 1 |
| Breadboard | 1 |
| Dây cắm đực–đực (Arduino ↔ breadboard) | 4 |
| Dây cắm đực–cái (breadboard/Arduino ↔ module) | 7 |

Hai module đều có **chân đực** (header) nên cần dây có **đầu cái** để cắm vào.

### Sơ đồ tổng quát

```
                 Arduino Uno
              ┌───────────────┐
   ┌──────────┤ 5V         D6 ├──────── CLK ┐
   │  ┌───────┤ GND        D7 ├──────── DAT ├─ RTC DS1302
   │  │       │            D8 ├──────── RST ┘
   │  │       │            A4 ├──────── SDA ┐
   │  │       │            A5 ├──────── SCL ┘─ LCD I²C
   │  │       └───────────────┘
   │  │
   │  │   Breadboard
   │  └── hàng (−) ──┬── GND của RTC
   │                 └── GND của LCD
   └───── hàng (+) ──┬── VCC của RTC
                     └── VCC của LCD
```

### Vị trí các chân

**Arduino Uno** (nhìn từ trên xuống, cổng USB bên trái):

```
  Header trên (digital):   ... D8  D7  D6  D5 ...
                                │   │   │
                               RST DAT CLK   ← của RTC

  Header dưới (POWER | ANALOG IN):
        IOREF RESET 3.3V [5V] [GND] GND VIN | A0 A1 A2 A3 [A4] [A5]
                          │     │                         │    │
                     breadboard (+)/(−)                  SDA  SCL  ← của LCD
```

- Chân **D6, D7, D8** nằm ở hàng header **phía trên** (dãy DIGITAL), in số `6`, `7`, `8` cạnh chân. Không cần dấu `~`.
- Chân **5V, GND** nằm ở cụm **POWER** phía dưới. Có 2 chân GND cạnh nhau, dùng chân nào cũng được.
- Chân **A4, A5** là 2 chân cuối của cụm **ANALOG IN**.

**Module RTC DS1302** (nhìn mặt có chip, hàng chân ở cạnh dưới):

```
  ┌──────────────────────────┐
  │   [thạch anh]  [DS1302]  │
  │                          │
  └─┬─────┬─────┬─────┬─────┬┘
   VCC   GND   CLK   DAT   RST
```

**Module I²C sau lưng LCD** (4 chân ở mép module):

```
  ┌─────────────────┐
  │  [PCF8574]   GND├──
  │              VCC├──   ← chân đực chĩa ra ngoài
  │  [biến trở]  SDA├──
  │              SCL├──
  └─────────────────┘
```

Thứ tự chân ở trên là thứ tự thường gặp. **Luôn đọc nhãn in cạnh chân** trên module của bạn trước khi cắm.

**Breadboard:** hai hàng dài ở mép là **thanh nguồn**. Hàng có vạch **đỏ (+)** dùng cho 5V, hàng có vạch **xanh/đen (−)** dùng cho GND. Mọi lỗ trên cùng một hàng thông nhau. Một số breadboard dài bị **ngắt đôi thanh nguồn ở giữa**, nên cắm tất cả dây nguồn trên cùng một nửa.

### Từng sợi dây

Có tất cả **11 sợi dây**. Với dây đực–cái: **đầu cái** cắm vào chân của module, **đầu đực** cắm vào Arduino hoặc breadboard.

**Nhóm 1 · Nguồn từ Arduino ra breadboard** (dây đực–đực)

| Dây | Màu | Đầu 1 | Đầu 2 |
|---|---|---|---|
| 1 | đỏ | Arduino `5V` | Breadboard hàng **(+)** |
| 2 | đen | Arduino `GND` | Breadboard hàng **(−)** |

**Nhóm 2 · Module RTC DS1302** (dây đực–cái)

| Dây | Màu | Đầu cái (cắm vào RTC) | Đầu đực (cắm vào) | Vai trò |
|---|---|---|---|---|
| 3 | đỏ | `VCC` | Breadboard hàng **(+)** | Cấp nguồn 5V |
| 4 | đen | `GND` | Breadboard hàng **(−)** | Mass chung |
| 5 | vàng | `CLK` | Arduino `D6` | Xung nhịp do Arduino phát |
| 6 | cam | `DAT` | Arduino `D7` | Dữ liệu đi hai chiều |
| 7 | trắng | `RST` | Arduino `D8` | Bật chip khi Arduino muốn giao tiếp |

**Nhóm 3 · LCD 1602 I²C** (dây đực–cái)

| Dây | Màu | Đầu cái (cắm vào LCD) | Đầu đực (cắm vào) | Vai trò |
|---|---|---|---|---|
| 8 | đỏ | `VCC` | Breadboard hàng **(+)** | Cấp nguồn 5V |
| 9 | đen | `GND` | Breadboard hàng **(−)** | Mass chung |
| 10 | xám | `SDA` | Arduino `A4` | Dữ liệu I²C |
| 11 | xanh lá | `SCL` | Arduino `A5` | Xung nhịp I²C |

Dùng màu dây cố định (đỏ = nguồn, đen = mass) giúp dò lỗi nhanh hơn rất nhiều khi mạch không chạy.

**Khớp code với dây:** số chân trong code phải trùng với dây đã cắm.

```cpp
ThreeWire myWire(7, 6, 8);   // (DAT = D7, CLK = D6, RST = D8)
```

Nếu cắm sang chân khác, sửa lại 3 số này theo đúng thứ tự **DAT, CLK, RST**. Riêng LCD thì **bắt buộc** dùng A4/A5 vì đó là chân I²C cố định của Uno.

### Các bước lắp

1. **Rút cáp USB** khỏi Arduino trước khi cắm dây, tránh chạm chập.
2. **Lắp pin CR2032** vào hộc pin ở mặt sau module RTC, **mặt có dấu (+) hướng lên trên**.
3. **Kéo nguồn ra breadboard:** dây đỏ từ chân `5V` của Arduino sang hàng (+), dây đen từ `GND` sang hàng (−). Uno chỉ có một chân 5V, nên cần breadboard để chia nguồn cho hai module.
4. **Nối module RTC:**
   - `VCC` → hàng (+), `GND` → hàng (−).
   - `CLK` → D6, `DAT` → D7, `RST` → D8.
   - Đọc kỹ nhãn in trên module. Thứ tự chân thường là `VCC GND CLK DAT RST` nhưng có thể khác tùy lô hàng.
5. **Nối LCD:** 4 chân của module I²C nằm ở mặt sau màn hình.
   - `VCC` → hàng (+), `GND` → hàng (−).
   - `SDA` → A4, `SCL` → A5.
6. **Kiểm tra lại** từng dây theo bảng trên, đặc biệt là VCC/GND không bị cắm ngược.
7. **Cắm cáp USB** và nạp code. Nếu LCD sáng đèn nền nhưng không có chữ, vặn biến trở xanh sau lưng module I²C để chỉnh độ tương phản.

### Lỗi thường gặp

| Hiện tượng | Nguyên nhân hay gặp |
|---|---|
| LCD không sáng | Dây VCC/GND của LCD lỏng, hoặc chưa nối 5V/GND từ Arduino ra breadboard |
| LCD sáng nhưng không có chữ | Sai địa chỉ I²C (thử `0x3F`), hoặc chưa chỉnh biến trở tương phản |
| Giờ hiện `165/165/2165` hoặc toàn số 0 | Nối nhầm CLK/DAT/RST, hoặc sai số chân trong `ThreeWire myWire(7, 6, 8)` |
| Giờ quay về lúc nạp code mỗi khi rút điện | Chưa lắp pin, pin hết, hoặc lắp ngược chiều |
| Giây đứng yên không chạy | Thạch anh hỏng hoặc chip chưa được bật (code đã gọi `SetIsRunning(true)`) |

### Cài thư viện

Vào **Library Manager**, cài thêm:

- **Rtc by Makuna**: điều khiển DS1302 (và cả DS1307, DS3231).
- **LiquidCrystal I2C** by Frank de Brabander: đã cài ở Lab 2.

### Code

```cpp
#include <ThreeWire.h>
#include <RtcDS1302.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ThreeWire(DAT, CLK, RST)
ThreeWire myWire(7, 6, 8);
RtcDS1302<ThreeWire> rtc(myWire);
LiquidCrystal_I2C lcd(0x27, 16, 2);

const char* thu[] = {"CN", "T2", "T3", "T4", "T5", "T6", "T7"};

void setup() {
  lcd.init();
  lcd.backlight();
  rtc.Begin();

  // Thời điểm biên dịch sketch, lấy từ đồng hồ máy tính
  RtcDateTime compiled = RtcDateTime(__DATE__, __TIME__);

  if (rtc.GetIsWriteProtected()) rtc.SetIsWriteProtected(false);
  if (!rtc.GetIsRunning()) rtc.SetIsRunning(true);

  // Chỉ đặt giờ khi RTC chưa có giờ hợp lệ hoặc đang chậm hơn giờ biên dịch
  RtcDateTime now = rtc.GetDateTime();
  if (!now.IsValid() || now < compiled) {
    rtc.SetDateTime(compiled);
  }
}

void loop() {
  RtcDateTime now = rtc.GetDateTime();
  char line1[17], line2[17];

  snprintf(line1, sizeof(line1), "%02u/%02u/%04u  %s",
           now.Day(), now.Month(), now.Year(), thu[now.DayOfWeek()]);
  snprintf(line2, sizeof(line2), "%02u:%02u:%02u",
           now.Hour(), now.Minute(), now.Second());

  lcd.setCursor(0, 0);
  lcd.print(line1);
  lcd.setCursor(0, 1);
  lcd.print(line2);

  delay(500);
}
```

### Giải thích

- **Đặt giờ lần đầu:** `__DATE__` và `__TIME__` là giờ trên máy tính lúc biên dịch sketch. Lần nạp đầu, RTC chưa có giờ nên được đặt theo giờ này (thường chậm vài giây do thời gian nạp code).
- **Không đặt lại mỗi lần khởi động:** khi rút điện rồi cắm lại, pin CR2032 đã giữ cho đồng hồ chạy tiếp, nên RTC lúc này nhanh hơn `compiled` và code bỏ qua bước đặt giờ.
- **`snprintf` với `%02u`:** in số luôn đủ 2 chữ số (`09` thay vì `9`), để chữ trên LCD không bị xê dịch khi giây đổi từ 59 về 0.
- **`delay(500)`:** đọc 2 lần mỗi giây để màn hình cập nhật đúng lúc giây nhảy.

Nếu màn hình hiện giờ sai kiểu `165/165/2165`, kiểm tra lại dây CLK/DAT/RST và pin của module.

### Video mạch thật

<video controls playsinline preload="metadata" poster="../assets/rtc-lcd-clock-real-poster.jpg" style="display:block; max-width:640px; width:100%; margin:0 auto; border-radius:8px;">
  <source src="../assets/rtc-lcd-clock-real.mp4" type="video/mp4">
</video>

Mạch thật chạy code đồng hồ ở trên:

- **Module RTC DS1302** cắm trên breadboard, pin CR2032 nằm trong hộc pin ở mặt trước module.
- **LCD 1602 I²C** đặt cạnh RTC, dòng trên hiện `17/11/2026  T3`, dòng dưới hiện giờ, số giây nhảy đều mỗi giây.
- Arduino Uno cấp nguồn qua cáp USB.

Khi mới lắp, LCD sáng đèn nền nhưng không hiện chữ. Chạy sketch kiểm tra in ra Serial Monitor thì thấy quét I²C tìm được LCD ở `0x27` và RTC đếm giây đúng, nên lỗi nằm ở dây LCD. Sau khi cắm lại dây và nạp lại code đồng hồ, màn hình hiện giờ bình thường.

## Hướng tiếp theo

- Ghi log nhiệt độ/độ ẩm có kèm thời gian ([Lab 3](dht11.md)).
- Hẹn giờ bật/tắt LED hoặc còi theo giờ thực.
