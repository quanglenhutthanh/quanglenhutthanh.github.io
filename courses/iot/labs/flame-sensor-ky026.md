---
title: "Lab 17 · Cảm biến lửa KY-026"
subject: "iot"
type: lab
lab_no: 17
status: todo
source: note
tags: [arduino, flame-sensor, ky-026, infrared, lm393, sensor, buzzer]
date: 2026-11-21
lightbox: true
resources:
  - ../assets/flame-ky026-remote-real.mp4
  - ../assets/flame-ky026-remote-real-poster.jpg
---

# Lab 17 · Cảm biến lửa KY-026

> Đọc module cảm biến lửa KY-026 với Arduino Uno qua cả ngõ ra **analog** (`A0`) lẫn **digital** (`D0`). Sau đó chỉnh ngưỡng bằng biến trở, đo "độ mạnh" ngọn lửa, rồi làm mạch báo cháy bằng LED và buzzer có chống báo động giả. Module dùng chung ý tưởng với cảm biến hồng ngoại FC-51 ở [Lab 8](infrared-remote-fc51.md); cách đọc analog và ngưỡng giống cảm biến nước ở [Lab 11](water-sensor.md).

::: {.callout-warning}
## An toàn khi thử với lửa

- Chỉ dùng **bật lửa** hoặc **một cây nến** nhỏ, bật/thắp trong vài giây rồi tắt. Không thử với giấy, cồn hay bất kỳ thứ gì có thể bắt lửa lan ra.
- Làm trên bàn trống, giữ ngọn lửa cách module **ít nhất 20 cm**. Module, dây cắm và breadboard bằng nhựa nên hơ sát sẽ chảy.
- Có thể làm gần hết lab **không cần lửa**: remote hồng ngoại ở [Lab 8](infrared-remote-fc51.md) cũng làm cảm biến phản ứng (xem [Test 1](#test-1)).
- Đây là module học tập, **không thay được đầu báo cháy thật**: nó không phát hiện khói, không thấy lửa bị che khuất và báo nhầm với ánh nắng.
:::

## Tổng quan

:::: {layout="[48,52]"}

::: {}
**Sơ đồ chân và nối dây**

| Chân | Nối Uno | Ý nghĩa |
|---|---|---|
| `A0` | `A0` | Ngõ ra analog (0–1023) |
| `G` | `GND` | Mass |
| `+` | `5V` | Nguồn |
| `D0` | `2` | Ngõ ra digital (sau LM393) |
| LED đỏ (+) | `D6` qua 220 Ω | Test 1b, 3 |
| Buzzer (+) | `D7` | Test 3 |
:::

::: {}
**Thông số**

| | |
|---|---|
| Điện áp | 3,3–5 V |
| Bước sóng nhạy | ~760–1100 nm (đỉnh ~940 nm) |
| Góc / tầm phát hiện | ~60° · 20 cm – 1 m (bật lửa) |
| IC so sánh | LM393, ngưỡng chỉnh bằng biến trở xanh |
| LED trên module | `L1` nguồn · `L2` sáng khi `D0` báo lửa |
:::

::::

**Linh kiện:** Arduino Uno + cáp USB · module KY-026 · LED đỏ + điện trở 220 Ω · buzzer (active hoặc passive) · breadboard, dây đực–đực, đực–cái · bật lửa/nến hoặc remote hồng ngoại để thử.

## Sơ đồ và mạch thực tế

:::: {layout-ncol=2 layout-valign="center"}

![Sơ đồ nối: `A0` → `A0`, `D0` → `D2`, `+`/`G` vào thanh nguồn; LED đỏ qua 220 Ω vào `D6`, buzzer vào `D7`](../assets/flame-ky026-wiring.svg)

::: {}
```{=html}
<video class="lab-video" controls playsinline preload="metadata" poster="../assets/flame-ky026-remote-real-poster.jpg">
  <source src="../assets/flame-ky026-remote-real.mp4" type="video/mp4">
</video>
```

Mạch thật chạy [Test 1b](#test-1b), thử bằng remote thay cho lửa
:::

::::

- Module có chân đực, nối sang Uno bằng dây **đực–cái**; LED và buzzer lấy GND chung từ thanh `−` của breadboard.
- **Hướng mắt cảm biến** (bóng vỏ đen, không bao giờ sáng): bẻ nhẹ cho nằm ngang, hướng ra phía trước, không chĩa lên trần vì đèn và cửa sổ dễ gây nhiễu. Đừng bẻ đi bẻ lại vì chân dễ gãy.
- `D0` vào chân `2` để có thể dùng ngắt ngoài (`attachInterrupt`) sau này; chân digital nào cũng chạy được với code bên dưới.

## Các bài test

### Test 1 – đọc hai ngõ ra {#test-1}

In `A0` và `D0` lên Serial Monitor để xác định module trong kit phản ứng theo chiều nào. Kết quả được dùng cho các test sau.

::: {.panel-tabset}

#### Code

```cpp
const int FLAME_A = A0;
const int FLAME_D = 2;

void setup() {
  Serial.begin(9600);
  pinMode(FLAME_D, INPUT);
}

void loop() {
  int a = analogRead(FLAME_A);
  int d = digitalRead(FLAME_D);

  Serial.print("A0 = ");
  Serial.print(a);
  Serial.print("   D0 = ");
  Serial.println(d);

  delay(200);
}
```

#### Cách thử

Mở Serial Monitor (9600 baud) và làm lần lượt:

1. **Không có lửa**: ghi lại `A0` và `D0`. `L2` nên tắt. Nếu `L2` đang sáng sẵn, vặn biến trở (thường là ngược chiều kim đồng hồ) tới khi nó vừa tắt.
2. **Bật lửa cách ~50 cm**, trước mắt cảm biến: `A0` thay đổi rõ, ghi lại nó **tăng hay giảm**.
3. **Đưa lại gần ~20 cm**: `A0` đổi nhiều hơn. Khi vượt ngưỡng, `L2` sáng và `D0` đổi mức. Ghi lại `D0` lúc có lửa là `0` hay `1`.
4. **Xoay mắt cảm biến lệch** 45°, 90° so với ngọn lửa để thấy góc phát hiện có hạn.
5. **Không cần lửa**: bấm giữ một nút remote chĩa vào mắt cảm biến. `A0` dao động, `L2` nháy theo xung hồng ngoại. Thử thêm với cửa sổ có nắng hoặc bóng đèn sợi đốt.

Ghi kết quả bước 3 vào hằng số dùng cho Test 3:

```cpp
const bool FLAME_D_ACTIVE = LOW;    // D0 lúc CÓ lửa (bước 3). Module trong kit: LOW
```

Chiều của `A0` không cần ghi: Test 2 tự đo mức nền nên chạy được với cả hai chiều.

#### Chỉnh ngưỡng `D0`

Đặt ngọn lửa ở khoảng cách muốn bắt đầu báo (ví dụ 40 cm), vặn biến trở từ từ tới đúng lúc `L2` vừa sáng. Từ đó, lửa ở gần hơn khoảng này sẽ làm `D0` báo. Vặn quá nhạy thì `L2` sáng cả khi không có lửa (do ánh sáng phòng).

:::

### Test 1b – `D0` bật LED {#test-1b}

Mạch nhỏ nhất: module và một LED (qua 220 Ω vào `D6`). LED trên breadboard sáng tắt giống hệt `L2` trên module vì cả hai cùng theo `D0`.

::: {.panel-tabset}

#### Code

```cpp
const int FLAME_D = 2;     // chân D0 của KY-026
const int LED_PIN = 6;     // LED (qua điện trở 220 Ω)

// Mức của D0 khi CÓ lửa. Nếu LED sáng khi KHÔNG có lửa, đổi HIGH <-> LOW
const bool FLAME_ACTIVE = LOW;

void setup() {
  Serial.begin(9600);
  pinMode(FLAME_D, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  bool flame = (digitalRead(FLAME_D) == FLAME_ACTIVE);

  digitalWrite(LED_PIN, flame ? HIGH : LOW);

  Serial.println(flame ? "CO LUA" : "khong co lua");
  delay(100);
}
```

#### Kết quả

```{=html}
<video class="lab-video" controls playsinline preload="metadata" poster="../assets/flame-ky026-remote-real-poster.jpg">
  <source src="../assets/flame-ky026-remote-real.mp4" type="video/mp4">
</video>
```

- Bấm giữ nút remote chĩa vào mắt đen: **đèn báo lửa trên module** và **LED trên breadboard** cùng sáng. Thả nút thì cả hai tắt.
- Module trong kit kéo `D0` xuống `LOW` khi có hồng ngoại, nên `FLAME_ACTIVE = LOW`. Để `HIGH` thì kết quả ngược lại: Serial báo "CO LUA" suốt khi không có gì.
- Remote bắt được mà lửa không bắt được thì module vẫn tốt, vì remote ở gần phát hồng ngoại mạnh hơn nhiều. Lau muội trên mắt đen, đưa lửa vào 10–15 cm, rồi vặn biến trở tới khi đèn báo vừa sáng.

:::

### Test 2 – đo độ mạnh ngọn lửa bằng `A0` {#test-2}

`D0` chỉ nói "có / không", còn `A0` cho biết lửa **gần hay xa, to hay nhỏ**. Giá trị thô phụ thuộc ánh sáng phòng, nên code **đo mức nền** lúc khởi động rồi tính độ lệch so với nền.

::: {.panel-tabset}

#### Code

```cpp
const int FLAME_A = A0;
const int SAMPLES = 50;

int baseline = 0;   // mức A0 khi không có lửa

int readAvg(int n) {               // lấy trung bình để bớt nhiễu
  long sum = 0;
  for (int i = 0; i < n; i++) {
    sum += analogRead(FLAME_A);
    delay(2);
  }
  return sum / n;
}

void setup() {
  Serial.begin(9600);
  Serial.println("Do muc nen, KHONG de lua gan cam bien...");
  delay(1000);
  baseline = readAvg(SAMPLES);
  Serial.print("baseline = ");
  Serial.println(baseline);
}

void loop() {
  int a = readAvg(10);
  int strength = abs(a - baseline);    // lệch càng nhiều, lửa càng gần/mạnh
  int maxDelta = max(baseline, 1023 - baseline);
  int percent = constrain(map(strength, 0, maxDelta, 0, 100), 0, 100);

  // In dạng "nhan:gia_tri" để Serial Plotter vẽ nhiều đường
  Serial.print("A0:");
  Serial.print(a);
  Serial.print(" baseline:");
  Serial.print(baseline);
  Serial.print(" percent:");
  Serial.println(percent);

  delay(100);
}
```

#### Cách thử

- Mở **Tools → Serial Plotter**: đường `A0` nhảy lên/xuống mỗi khi bật lửa, `baseline` là đường ngang.
- Đưa lửa ra xa dần từng 10 cm và ghi `percent`. Số giảm rất nhanh theo khoảng cách (cường độ giảm theo bình phương khoảng cách), nên chỉ dùng để so "gần hơn / xa hơn", không đo được khoảng cách chính xác.
- Nhấn reset trên Uno lúc đang để lửa trước cảm biến: `baseline` sai, `percent` gần 0 khi có lửa và tăng khi tắt lửa. Vì vậy code in lời nhắc lúc khởi động.

:::

### Test 3 – báo cháy bằng LED và buzzer {#test-3}

Mạch báo cháy có hai chi tiết của hệ thống thật:

- **Chống báo động giả**: chỉ báo khi thấy lửa **liên tục ≥ 300 ms**, nên tia nắng lóe qua hay một lần bấm remote ngắn không kích hoạt được.
- **Giữ báo động** thêm **3 giây** sau khi hết lửa, để ngọn lửa chập chờn không làm còi tắt bật liên tục.

::: {.panel-tabset}

#### Code

Có lửa khi `D0` báo **hoặc** `A0` lệch nền quá `A_THRESHOLD`. Còi kêu ngắt quãng bằng `millis()` thay vì `delay()`, nên vẫn đọc cảm biến liên tục trong lúc báo động.

```cpp
const int FLAME_A = A0;
const int FLAME_D = 2;
const int LED_PIN = 6;
const int BUZZER  = 7;

const bool FLAME_D_ACTIVE = LOW;             // lấy từ Test 1 (module trong kit: LOW)
const int  A_THRESHOLD    = 150;             // lệch nền bao nhiêu thì coi là có lửa
const unsigned long CONFIRM_MS = 300;        // phải thấy lửa liên tục ngần này
const unsigned long HOLD_MS    = 3000;       // giữ báo động sau khi hết lửa
const unsigned long BEEP_MS    = 150;        // nhịp còi bật / tắt

int baseline = 0;
unsigned long flameSince = 0;   // thời điểm bắt đầu thấy lửa (0 = đang không thấy)
unsigned long lastFlame  = 0;   // lần cuối thấy lửa
bool alarm = false;

int readAvg(int n) {
  long sum = 0;
  for (int i = 0; i < n; i++) {
    sum += analogRead(FLAME_A);
    delay(2);
  }
  return sum / n;
}

void setAlarmOutputs(bool on) {
  if (!on) {
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER);
    return;
  }
  bool beepOn = (millis() / BEEP_MS) % 2;    // đổi trạng thái mỗi 150 ms
  digitalWrite(LED_PIN, beepOn);
  if (beepOn) tone(BUZZER, 2000);
  else        noTone(BUZZER);
}

void setup() {
  Serial.begin(9600);
  pinMode(FLAME_D, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  delay(1000);
  baseline = readAvg(50);
  Serial.print("baseline = ");
  Serial.println(baseline);
}

void loop() {
  int a = readAvg(5);
  bool flameD = (digitalRead(FLAME_D) == FLAME_D_ACTIVE);
  bool flameA = (abs(a - baseline) > A_THRESHOLD);
  bool flame  = flameD || flameA;
  unsigned long now = millis();

  if (flame) {
    if (flameSince == 0) flameSince = now;
    lastFlame = now;
    if (!alarm && now - flameSince >= CONFIRM_MS) {
      alarm = true;
      Serial.print("!!! CO LUA  A0=");
      Serial.print(a);
      Serial.print(flameD ? "  (D0)" : "");
      Serial.println(flameA ? "  (A0)" : "");
    }
  } else {
    flameSince = 0;
    if (alarm && now - lastFlame >= HOLD_MS) {
      alarm = false;
      Serial.println("Het lua, tat bao dong");
    }
  }

  setAlarmOutputs(alarm);
}
```

#### Nối thêm

| Linh kiện | Nối |
|---|---|
| LED đỏ: chân dài (+) | `D6` qua điện trở 220 Ω |
| LED đỏ: chân ngắn (−) | `GND` |
| Buzzer: chân `+` (dài) | `D7` |
| Buzzer: chân `−` | `GND` |

#### Cách thử

- Bật lửa **chưa tới 0,3 giây** rồi tắt ngay thì không báo; giữ lâu hơn thì báo.
- Tắt lửa: còi còn kêu thêm 3 giây rồi mới tắt.
- Bấm remote một cái ngắn: không báo. Bấm giữ: có thể báo, vì với cảm biến, remote cũng là "lửa".
- Nâng `A_THRESHOLD` lên `300` để chỉ báo khi lửa gần; hạ xuống `60` để nhạy hơn (dễ báo nhầm hơn).
- Buzzer **active** vẫn kêu với `tone()`, chỉ không đổi cao độ. Có thể thay `tone()` / `noTone()` bằng `digitalWrite(BUZZER, HIGH/LOW)`.

:::

## Tìm hiểu thêm

::: {.callout-note collapse="true"}
## Cảm biến lửa hoạt động thế nào

Ngọn lửa không chỉ phát ánh sáng nhìn thấy mà còn phát rất mạnh ở vùng **hồng ngoại gần** (bước sóng ~760–1100 nm). Mắt cảm biến của KY-026 là một **photodiode/phototransistor hồng ngoại** vỏ đen; nhựa đen lọc bớt ánh sáng nhìn thấy, chỉ cho hồng ngoại đi qua. Càng nhiều hồng ngoại chiếu vào, dòng qua nó càng lớn và điện áp ở chân analog càng thay đổi nhiều.

Điện áp đó được đưa tới hai nơi:

1. Thẳng ra chân **`A0`**: ngõ ra **analog**, Arduino đọc bằng `analogRead()` (0–1023) để biết lửa gần hay xa, to hay nhỏ.
2. Vào IC so sánh **LM393**, so với điện áp do **biến trở xanh** đặt ra: ngõ ra **digital** `D0` chỉ có hai mức "có lửa / không có lửa". Khi vượt ngưỡng, LED `L2` trên module sáng.

Vì đo hồng ngoại nên cảm biến **không phân biệt được** lửa thật với các nguồn hồng ngoại khác như **ánh nắng**, **bóng đèn sợi đốt / halogen**, **remote TV** hay bếp điện đang đỏ. Đèn LED và đèn huỳnh quang phát rất ít hồng ngoại nên ít gây nhiễu.
:::

::: {.callout-note collapse="true"}
## Nhìn module

Từ đầu xa hàng chân vào:

- **Mắt cảm biến**: "bóng LED" **vỏ đen** 5 mm, chân dài để bẻ cong hướng mắt về phía cần canh. Nó không bao giờ sáng, đừng nhầm với LED.
- **Biến trở xanh** (hộp vuông có vít đồng): vặn để đổi ngưỡng của `D0`.
- **IC LM393** (8 chân), các điện trở dán và hai LED `L1`, `L2`.

**KY-026 và module lửa "4 chân" khác:** loại bo xanh dương ghi `AO DO GND VCC` (thường in "Flame sensor") dùng cùng sơ đồ LM393, nhưng **mức logic của `D0` có thể ngược**. Loại này kéo `D0` xuống `LOW` khi có lửa, một số board KY-026 lại đưa `D0` lên `HIGH`. Chiều thay đổi của `A0` cũng tùy cách mắc phototransistor. Vì vậy [Test 1](#test-1) cho bạn tự xác định trên module trong kit.
:::

::: {.callout-note collapse="true"}
## Ứng dụng, giới hạn và mở rộng

| | Cảm biến lửa IR (KY-026) | Đầu báo khói | Cảm biến nhiệt (DHT11, [Lab 3](dht11.md)) |
|---|---|---|---|
| Phát hiện | Ánh sáng hồng ngoại của ngọn lửa | Hạt khói trong không khí | Nhiệt độ tăng |
| Tốc độ | Gần như tức thì | Vài giây – vài chục giây | Chậm (phải đợi phòng nóng lên) |
| Cần "nhìn thấy" lửa | Có, trong góc ~60° | Không | Không |
| Báo nhầm với | Nắng, đèn sợi đốt, remote | Hơi nước, bụi | Máy sưởi, nắng chiếu |
| Lửa âm ỉ không ngọn | Không thấy | Thấy | Thấy (chậm) |

Hệ thống thật thường **kết hợp** nhiều loại. Robot chữa cháy dùng vài mắt hồng ngoại xếp vòng cung để biết lửa ở bên trái hay phải rồi quay về phía đó; lò đốt gas dùng cảm biến lửa để ngắt van khi ngọn lửa tắt.

Mở rộng gợi ý:

- Gắn hai module KY-026 lệch nhau ~45°, so `percent` hai bên để biết lửa nằm bên nào, rồi cho servo ([Lab 4](servo-sg90.md)) quay về phía đó.
- Hiển thị `percent` lên LCD I²C ([Lab 2](lcd-i2c.md)) hoặc LED 7 đoạn ([Lab 15](seven-segment-1-digit.md)).
- Gửi cảnh báo lên dashboard qua hệ 3 tầng ở [Lab 9](sensor-edge-cloud.md).
:::

## Lỗi hay gặp

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| `L1` không sáng | Chưa có nguồn: kiểm tra `+` vào `5V`, `G` vào `GND` |
| `L2` sáng liên tục dù không có lửa | Ngưỡng quá nhạy: vặn biến trở ngược lại. Hoặc mắt cảm biến đang hướng ra cửa sổ / đèn sợi đốt |
| `L2` không bao giờ sáng, `A0` vẫn đổi khi có lửa | Ngưỡng quá cao: vặn biến trở về phía nhạy hơn tới khi `L2` sáng với lửa ở ~30 cm |
| `A0` gần như không đổi khi có lửa | Nhầm chân: dây `A0` của module đang cắm vào chân khác. Hoặc mắt cảm biến không hướng về ngọn lửa |
| `D0` luôn đọc cùng một giá trị dù `L2` có đổi | Dây `D0` lỏng hoặc cắm nhầm chân `2`; kiểm tra `pinMode(FLAME_D, INPUT)` |
| Remote làm đèn báo sáng nhưng bật lửa thì không | Lửa ở xa yếu hơn remote rất nhiều. Lau muội trên mắt đen, đưa lửa vào 10–15 cm ngay trước mắt, vặn biến trở về phía nhạy hơn |
| Test 1b: Serial báo "CO LUA" suốt dù không có lửa | `FLAME_ACTIVE` sai mức. Module trong kit cần `LOW` |
| Test 3 báo ngược: báo khi **không** có lửa | `FLAME_D_ACTIVE` sai mức so với module trong kit, đổi `HIGH` ↔ `LOW` |
| Test 2/3: `percent` sai hoặc báo động ngay khi bật nguồn | Lúc khởi động có lửa / nắng / đèn chiếu vào cảm biến nên `baseline` sai. Che bớt nguồn sáng rồi nhấn reset |
| Báo nhầm khi trời nắng hoặc bật đèn | Cảm biến đo hồng ngoại, không phân biệt được nguồn. Tăng `A_THRESHOLD`, tăng `CONFIRM_MS`, che chắn hai bên mắt cảm biến bằng ống nhỏ (thu hẹp góc nhìn) |
| Còi kêu liên tục không tắt | `HOLD_MS` chưa hết hoặc ngọn lửa vẫn trong tầm nhìn. Nếu lửa đã tắt hẳn mà còi vẫn kêu, xem dòng trên (nguồn hồng ngoại khác) |
