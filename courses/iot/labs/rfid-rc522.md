---
title: "Lab 10 · RFID: module RC522 + thẻ MIFARE Classic 1K"
subject: "iot"
type: lab
lab_no: 10
status: todo
source: note
tags: [arduino, rfid, rc522, mfrc522, mifare, spi, servo, access-control]
date: 2026-11-16
lightbox: true
resources:
  - ../assets/rfid-servo-real.mp4
  - ../assets/rfid-servo-real-poster.jpg
---

> Dùng module **RC522** với Arduino Uno để đọc thẻ RFID 13,56 MHz trong kit. Lab đi từ **đọc mã UID** (Phần A), sang **đọc/ghi dữ liệu** vào bộ nhớ thẻ (Phần B), rồi ghép thành **khóa cửa quẹt thẻ** (Phần C): thẻ hợp lệ thì servo mở khóa, đèn xanh và còi kêu một tiếng; thẻ lạ thì đèn đỏ và còi kêu ba tiếng. Đây là lab đầu tiên dùng giao tiếp **SPI**.

::: {.callout-warning}
## Ba điều cần nhớ trước khi cắm điện

- **Nguồn RC522 là 3,3 V**: chân `3.3V` của module vào `3.3V` của Uno, **không phải `5V`**, nếu không chip có thể hỏng.
- **Phải hàn chân header** trước khi dùng. Cắm hờ dây vào lỗ làm SPI lúc chạy lúc không (xem [Hàn chân header](#rc522-header)).
- **Không ghi vào sector trailer** (block 3, 7, 11, …) khi chưa hiểu access bits: ghi sai là khóa vĩnh viễn cả sector. Code Phần B chặn sẵn việc này.
:::

## Tổng quan

:::: {layout="[45,55]" layout-valign="center"}

![Bộ RFID trong kit: module `RFID-RC522` (bản `V133`), hai hàng chân 8 pin chưa hàn (thẳng và cong 90°), thẻ trắng trong túi nilon, móc khóa xanh dương](../assets/kit-rc522-set.jpg)

::: {}
**Sơ đồ chân và nối dây**

| Chân | Nối Uno | Ý nghĩa |
|---|---|---|
| `SDA` | `D10` | Chọn chip SPI (SS) |
| `SCK` | `D13` | Xung nhịp SPI |
| `MOSI` | `D11` | Uno → RC522 |
| `MISO` | `D12` | RC522 → Uno |
| `IRQ` | *bỏ trống* | Báo ngắt |
| `GND` | `GND` | Mass |
| `RST` | `D9` | Reset chip |
| `3.3V` | **`3.3V`** | Nguồn |
| LED xanh (+) | `D5` qua 220 Ω | Phần C |
| LED đỏ (+) | `D6` qua 220 Ω | Phần C |
| Buzzer (+) | `D7` | Phần C |
| Servo cam / đỏ | `D3` / `5V` | Phần C |
:::

::::

:::: {layout="[45,55]" layout-valign="center"}

![Thẻ trắng (MIFARE Classic 1K) và móc khóa xanh dương: nhìn bên ngoài không phân biệt được 13,56 MHz với 125 kHz](../assets/kit-rfid-tags.jpg)

::: {}
**Thông số RC522**

| | |
|---|---|
| Điện áp | **3,3 V**, 13–26 mA khi đọc |
| Tần số | 13,56 MHz |
| Chuẩn thẻ | ISO/IEC 14443A (MIFARE Classic, Ultralight, NTAG…) |
| Tầm đọc | 0–5 cm |
| Giao tiếp | SPI (tới 10 Mbit/s) |

**Thẻ trong kit**

| | |
|---|---|
| Thẻ trắng | MIFARE Classic 1K, UID `5A 4D E5 8B`, đọc được |
| Móc khóa xanh | **Không đọc được**, nhiều khả năng là loại 125 kHz |
:::

::::

**Linh kiện:** Arduino Uno + cáp USB · module RC522 (đã hàn hàng chân cong 90°) + thẻ trắng + móc khóa · LED xanh lá, LED đỏ + 2 điện trở 220 Ω · buzzer · servo SG90 · breadboard, dây đực–đực, dây đực–cái. Phần A, B chỉ cần RC522.

**Chọn chân:**

- `D10`–`D13` là SPI phần cứng, `D9` là `RST`. Đây là cách nối mặc định trong ví dụ của thư viện.
- **Servo ở `D3`**, không phải `D9` như [Lab 4](servo-sg90.md), vì `D9` đã dùng cho `RST`.
- `Servo` chiếm Timer1, `tone()` chiếm Timer2, nên hai thứ không tranh nhau.
- RC522 nối `3.3V`, các module khác nối `5V`. Không kéo chung một thanh nguồn cho tất cả.

## Mạch thực tế

:::: {layout="[45,55]" layout-valign="center"}

![Module RC522 lật ngược (anten ở trên), hàng chân cong 90° đã hàn, dải 8 dây cái cắm vào; LED `D1` sát chân `3.3V` sáng đỏ](../assets/rc522-wiring-real.jpg)

::: {}
```{=html}
<video class="lab-video" controls playsinline preload="metadata" poster="../assets/rfid-servo-real-poster.jpg">
  <source src="../assets/rfid-servo-real.mp4" type="video/mp4">
</video>
```

[Test C1](#test-c1): quẹt thẻ trắng, servo về 0°, 3 giây sau tự quay lại 90°
:::

::::

- **Thứ tự chân** (module lật ngược, anten ở trên, đọc từ trái sang): `SDA` · `SCK` · `MOSI` · `MISO` · `IRQ` · `GND` · `RST` · `3.3V`. `SDA` nằm sát **thạch anh `27.120`** (lỗ pad vuông), `3.3V` sát **LED `D1`**.
- **Màu dây** theo thứ tự trong dải, không theo quy ước: **đen** `SDA` → `D10`, **nâu** `SCK` → `D13`, **đỏ** `MOSI` → `D11`, **cam** `MISO` → `D12`, **vàng** `IRQ` (trống), **xanh lá** `GND`, **xanh dương** `RST` → `D9`, **tím** `3.3V`. Ở đây dây **đỏ không phải nguồn**, nguồn là dây **tím**: luôn dò theo nhãn in trên mạch.
- **LED `D1` sáng đỏ** nghĩa là module đã có điện.
- `D13` là `SCK`, nên **LED `L` trên Uno nháy mờ** mỗi khi đọc thẻ. Đó là bình thường.

## Chuẩn bị

**Thư viện:** Arduino IDE → **Tools → Manage Libraries** → tìm **MFRC522** → cài bản của **GithubCommunity** (tác giả gốc *miguelbalboa*), bản 1.4.x. `SPI.h` có sẵn. Đừng cài nhầm **MFRC522v2**: bản này có cú pháp khác (`MFRC522DriverPinSimple`…) và code trong lab không chạy với nó.

### Hàn chân header {#rc522-header}

Module bán ra **chưa hàn chân**, kèm hai hàng 8 pin: một hàng thẳng, một hàng cong 90°. Lab dùng **hàng cong 90°** để module nằm phẳng trên bàn, mặt anten ngửa lên, nối Uno bằng dây đực–cái.

::: {.callout-tip collapse="true"}
## Các bước hàn và so sánh hai loại hàng chân

![Hàng chân cong 90° đặt vào 8 lỗ trước khi hàn: phần nhựa đen ở mặt có linh kiện, đầu chân dài cong chĩa ra ngoài mép trên](../assets/kit-rc522-header.jpg){width=65%}

| | Hàng **cong 90°** (khuyên dùng) | Hàng **thẳng** |
|---|---|---|
| Sau khi hàn | Chân chĩa **ngang ra ngoài mép** | Chân chĩa **thẳng xuống** |
| Cách dùng | Module **nằm phẳng**, nối bằng **dây đực–cái** | Cắm module **nằm sấp** lên breadboard |
| Ưu điểm | Mặt anten ngửa lên; breadboard trống cho LED, buzzer, servo | Không cần dây đực–cái |
| Nhược điểm | Cần 7 dây đực–cái | Module che mất ~8 hàng breadboard |

1. **Đặt hàng chân từ mặt có linh kiện**: thanh nhựa đen sát mặt này, đầu chân ngắn xuyên ra mặt sau, **đầu cong dài chĩa ra ngoài mép** (không đè lên chip).
2. **Cố định** cho vuông góc mép mạch bằng kẹp giấy hoặc băng dính, hoặc lật úp module và kê đầu chân dài lên cục tẩy.
3. **Hàn một chân ở đầu** (`SDA`) trước, chỉnh cho thẳng, rồi hàn chân **ở đầu kia** (`3.3V`).
4. Hàn **6 chân còn lại**. Mỏ hàn ~320–350 °C, áp vào **cả chân lẫn pad** 1–2 giây rồi mới đưa thiếc vào. Mỗi mối dưới 3–4 giây để không bong pad.
5. **Kiểm tra:**
   - Mối tốt có hình **nón nhỏ, bóng**. Mối **cục tròn** hoặc **xám sần** là hàn nguội, cần hàn lại.
   - Chân cách nhau 2,54 mm: soi kỹ **không có cầu thiếc**, nhất là `GND`–`RST`–`3.3V`.
   - Có đồng hồ vạn năng thì đo thông mạch `3.3V` với `GND`: **không được kêu**.

Chưa có mỏ hàn thì nhờ phòng lab hàn giúp, hoặc mua module đã hàn sẵn chân. Bẻ chân cắm nghiêng vào lỗ chỉ đủ để thử nhanh, không đủ tin cậy cho cả lab.
:::

## Phần A – Đọc UID của thẻ

### Test A1 – kiểm tra module và đọc UID {#test-a1}

Kiểm tra dây SPI bằng phiên bản chip, rồi đọc UID 4 byte của thẻ. **Ghi lại UID** vì Phần C cần dùng.

::: {.panel-tabset}

#### Code

```cpp
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN  10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  delay(10);
  rfid.PCD_DumpVersionToSerial();   // in phiên bản chip, để biết đã nối đúng chưa
  Serial.println("Hay dua the lai gan dau doc...");
}

void loop() {
  // 1. Có thẻ mới trong vùng đọc không?
  if (!rfid.PICC_IsNewCardPresent()) return;
  // 2. Đọc UID của thẻ đó
  if (!rfid.PICC_ReadCardSerial()) return;

  Serial.print("UID:");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(rfid.uid.uidByte[i], HEX);
  }

  MFRC522::PICC_Type type = rfid.PICC_GetType(rfid.uid.sak);
  Serial.print("   | loai the: ");
  Serial.println(rfid.PICC_GetTypeName(type));

  rfid.PICC_HaltA();        // cho thẻ "ngủ", không đọc lại liên tục
  rfid.PCD_StopCrypto1();
}
```

**Tăng độ nhạy anten** (module clone thường đọc yếu): thêm ngay sau `rfid.PCD_Init();`

```cpp
rfid.PCD_SetAntennaGain(rfid.RxGain_max);   // độ nhạy thu tối đa (48 dB)
```

#### Giải thích

- Thư viện gọi đầu đọc là **PCD** (*Proximity Coupling Device*) và thẻ là **PICC** (*Proximity Integrated Circuit Card*), theo chuẩn ISO 14443. Hàm `PCD_` làm việc với module, `PICC_` làm việc với thẻ.
- **`PCD_DumpVersionToSerial()`** đọc thanh ghi phiên bản chip, là bước kiểm tra dây quan trọng nhất:

  | Serial in | Ý nghĩa |
  |---|---|
  | `0x92 = v2.0` hoặc `0x91 = v1.0` | Chip chính hãng, dây SPI đúng |
  | `0x12`, `0x82`, `0x88`, `0xB2` … `= (unknown)` | **Chip clone**, thường vẫn đọc thẻ bình thường. Module trong kit là `0x82` |
  | `0x00` / `0xFF` kèm `WARNING: Communication failure` | **Không nói chuyện được với chip**: sai dây, chưa hàn header, hoặc chưa có nguồn |

- **`PICC_IsNewCardPresent()`** tìm thẻ, **`PICC_ReadCardSerial()`** chọn thẻ và đọc UID vào `rfid.uid`. Phải gọi cả hai, đúng thứ tự.
- **`rfid.uid.sak`** (*Select Acknowledge*) cho biết loại thẻ; `PICC_GetTypeName()` đổi ra chữ, ví dụ `MIFARE 1KB`.
- **`PICC_HaltA()`** cho thẻ nghỉ. Bỏ dòng này thì giữ thẻ trên đầu đọc sẽ in xen kẽ, vì thẻ bị chọn lại mỗi vòng `loop()`.
- `uidByte[i] < 0x10` thêm số `0` đằng trước để byte `0x0B` in ra `0B`.

#### Kết quả

Nạp code, mở Serial Monitor (baud **9600**). Dòng đầu phải là phiên bản chip (không phải `0x00` / `0xFF`). Đặt thẻ **phẳng, sát** lên mặt anten.

![Serial Monitor Test A1: `Firmware Version: 0x82 = (unknown)`, sau đó `UID: 5A 4D E5 8B | loai the: MIFARE 1KB`](../assets/rfid-uid-serial.png){width=70%}

- **`0x82 = (unknown)`**: chip clone. Không có dòng `WARNING` và thẻ vẫn đọc bình thường, nên bỏ qua chữ `unknown`.
- Thẻ trắng được nhận đúng là **MIFARE 1KB**, UID `5A 4D E5 8B`.
- **Móc khóa xanh không đọc được**, kể cả khi đặt sát và đã tăng độ nhạy tối đa. Nhiều khả năng đó là loại **125 kHz** (EM4100) vỏ giống hệt. Kiểm tra bằng điện thoại Android có NFC: điện thoại không phản ứng với móc khóa (trong khi có phản ứng với thẻ trắng) là 125 kHz.
- Lần chạy đầu, Serial báo `0x0` kèm `Communication failure` dù `D1` đã sáng: có điện nhưng dây SPI sai. Dò lại từng dây theo nhãn in trên mạch (xem [Lỗi hay gặp](#lỗi-hay-gặp)) thì chạy.

:::

### Test A2 – xem toàn bộ bộ nhớ thẻ {#test-a2}

Nạp ví dụ có sẵn **File → Examples → MFRC522 → DumpInfo**, đặt thẻ lên đầu đọc và **giữ yên khoảng 2 giây**. Serial in cả 64 block, sector 15 ở trên cùng, sector 0 ở dưới cùng. Đối chiếu với [bộ nhớ thẻ](#tìm-hiểu-thêm):

- **Block 0**: 4 byte đầu là UID đã đọc ở Test A1.
- **Block 3, 7, …, 63** (trailer): `00 00 00 00 00 00  FF 07 80 69  FF FF FF FF FF FF`. Key A hiện `00` vì thẻ không cho đọc Key A; `FF 07 80 69` là access bits mặc định; Key B là `FF…FF`.
- Các block dữ liệu khác của thẻ mới đều là `00`.

Gặp `MIFARE_Read() failed: Timeout` hoặc `Authentication failed` giữa chừng nghĩa là thẻ bị nhấc ra trước khi đọc xong.

## Phần B – Ghi và đọc dữ liệu trên thẻ

### Test B1 – ghi tên lên thẻ {#test-b1}

Biến thẻ thành "bộ nhớ bỏ túi": gõ một dòng chữ (tối đa 16 ký tự) vào Serial Monitor, chạm thẻ để ghi vào **block 4**. Từ đó, mỗi lần chạm thẻ, Arduino đọc lại và in ra.

::: {.panel-tabset}

#### Code

```cpp
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN  10
#define RST_PIN 9
#define BLOCK   4        // block dữ liệu đầu tiên của sector 1

MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;
String pending = "";     // chữ đang chờ ghi vào thẻ tiếp theo

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;   // khóa mặc định FF FF FF FF FF FF
  Serial.println("Cham the de doc. Go chu (toi da 16 ky tu) + Enter de ghi.");
}

bool isTrailer(byte block) { return block % 4 == 3; }

void handleCard() {
  // 1. Xác thực với sector chứa BLOCK bằng Key A
  MFRC522::StatusCode st = rfid.PCD_Authenticate(
      MFRC522::PICC_CMD_MF_AUTH_KEY_A, BLOCK, &key, &rfid.uid);
  if (st != MFRC522::STATUS_OK) {
    Serial.print("Xac thuc loi: ");
    Serial.println(rfid.GetStatusCodeName(st));
    return;
  }

  // 2. Nếu có chữ đang chờ thì ghi trước
  if (pending.length() > 0) {
    if (BLOCK == 0 || isTrailer(BLOCK)) {
      Serial.println("Khong ghi vao block 0 / sector trailer!");
      return;
    }
    byte data[16];
    for (byte i = 0; i < 16; i++) data[i] = i < pending.length() ? pending[i] : ' ';
    st = rfid.MIFARE_Write(BLOCK, data, 16);
    Serial.print("Ghi: ");
    if (st == MFRC522::STATUS_OK) Serial.println("OK");
    else Serial.println(rfid.GetStatusCodeName(st));
    if (st == MFRC522::STATUS_OK) pending = "";
  }

  // 3. Đọc lại block
  byte buf[18];          // 16 byte dữ liệu + 2 byte CRC
  byte size = sizeof(buf);
  st = rfid.MIFARE_Read(BLOCK, buf, &size);
  if (st != MFRC522::STATUS_OK) {
    Serial.print("Doc loi: ");
    Serial.println(rfid.GetStatusCodeName(st));
    return;
  }
  Serial.print("Block "); Serial.print(BLOCK); Serial.print(": \"");
  for (byte i = 0; i < 16; i++) Serial.write(buf[i] >= 32 && buf[i] < 127 ? buf[i] : '.');
  Serial.print("\"   hex:");
  for (byte i = 0; i < 16; i++) {
    Serial.print(buf[i] < 0x10 ? " 0" : " ");
    Serial.print(buf[i], HEX);
  }
  Serial.println();
}

void loop() {
  if (Serial.available()) {
    pending = Serial.readStringUntil('\n');
    pending.trim();
    if (pending.length() > 16) pending = pending.substring(0, 16);
    Serial.print("Se ghi \""); Serial.print(pending); Serial.println("\" vao the tiep theo");
  }

  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  if (rfid.PICC_GetType(rfid.uid.sak) != MFRC522::PICC_TYPE_MIFARE_1K) {
    Serial.println("Khong phai the MIFARE Classic 1K, bo qua");
  } else {
    handleCard();
  }
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();   // bắt buộc sau khi đã xác thực
}
```

#### Giải thích

- **`MIFARE_Key key`** chứa 6 byte khóa, đặt hết là `0xFF` cho thẻ mới.
- **`PCD_Authenticate(KEY_A, BLOCK, …)`** xác thực với **cả sector** chứa `BLOCK` (block 4 → sector 1). Sau đó đọc/ghi được block 4, 5, 6 mà không cần xác thực lại; sang sector khác thì phải xác thực lại.
- **`MIFARE_Write()`** luôn ghi **đủ 16 byte**. Chữ ngắn hơn được đệm bằng dấu cách.
- **`MIFARE_Read()`** cần bộ đệm **18 byte** (16 byte dữ liệu + 2 byte CRC). Dùng mảng 16 byte sẽ báo `STATUS_NO_ROOM`.
- **`isTrailer()`**: block trailer có số thứ tự chia 4 dư 3. Đổi `BLOCK` thành 3, 7, … thì code từ chối ghi.
- **`PCD_StopCrypto1()`** tắt mã hóa sau khi xác thực. Thiếu dòng này thì lần chạm thẻ sau sẽ báo lỗi xác thực.
- Byte không in được (như `00` của thẻ mới) hiện thành dấu `.`.

#### Cách thử

1. Serial Monitor để **baud 9600**, ô kết thúc dòng chọn **Newline**.
2. Chạm thẻ trắng: thẻ mới in `Block 4: "................"`, hex toàn `00`.
3. Gõ `Xin chao IoT` rồi Enter: Serial in `Se ghi "Xin chao IoT" vao the tiep theo`.
4. Chạm thẻ: in `Ghi: OK` rồi `Block 4: "Xin chao IoT    "`.
5. **Rút USB, cắm lại**, chạm thẻ lần nữa: chữ vẫn còn, vì dữ liệu nằm **trong thẻ**.
6. Chạm một thẻ 13,56 MHz khác (nếu có): vẫn là `....`.

Dùng chữ không dấu: mỗi chữ có dấu chiếm 2–3 byte UTF-8 nên bị cắt ngắn và hiện sai.

**Thử thêm:**

- Chạm thẻ rồi **nhấc ra ngay**: có thể báo `Ghi: Timeout`, chữ cũ vẫn còn. Thẻ cần nằm trong từ trường suốt lúc ghi.
- Đặt giấy, nhựa, bàn tay giữa thẻ và đầu đọc: vẫn đọc được. Thử với **tấm kim loại**: không đọc được, vì kim loại chặn từ trường.

:::

## Phần C – Khóa cửa quẹt thẻ

Chỉ thẻ có UID trong danh sách được phép mới mở khóa. Test C1 chỉ thêm servo vào code Test A1 cho dễ kiểm tra; Test C2 thêm đèn và còi.

### Test C1 – quẹt thẻ, servo mở rồi tự đóng {#test-c1}

Giữ nguyên mạch Phần A, nối thêm servo: **cam** → `D3`, **đỏ** → `5V`, **nâu** → `GND`.

| Sự kiện | Servo |
|---|---|
| Khởi động / đang chờ | **90°** (đóng) |
| Quẹt **thẻ trắng** | Về **0°** (mở), 3 s sau **tự quay lại 90°** |
| Thẻ khác | Đứng yên, Serial in `the la` |

::: {.panel-tabset}

#### Code

```cpp
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

#define SS_PIN    10
#define RST_PIN   9
#define SERVO_PIN 3

#define ANGLE_CLOSE 90     // bình thường: 90 độ
#define ANGLE_OPEN  0      // quẹt thẻ: về 0 độ
#define OPEN_MS     3000   // giữ ở 0 độ 3 giây rồi tự quay lại

MFRC522 rfid(SS_PIN, RST_PIN);
Servo s;
const byte WHITE_CARD[4] = {0x5A, 0x4D, 0xE5, 0x8B};   // UID thẻ trắng, lấy từ Test A1

bool isOpen = false;
unsigned long openedAt = 0;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  delay(10);
  rfid.PCD_DumpVersionToSerial();
  s.attach(SERVO_PIN);
  s.write(ANGLE_CLOSE);
  Serial.println("Hay dua the lai gan dau doc...");
}

void loop() {
  // Tự quay lại 90 độ khi đã mở đủ 3 giây
  if (isOpen && millis() - openedAt >= OPEN_MS) {
    s.write(ANGLE_CLOSE);
    isOpen = false;
    Serial.println("   -> het gio, servo tu ve 90");
  }

  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  Serial.print("UID:");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(rfid.uid.uidByte[i], HEX);
  }
  MFRC522::PICC_Type type = rfid.PICC_GetType(rfid.uid.sak);
  Serial.print("   | loai the: ");
  Serial.println(rfid.PICC_GetTypeName(type));

  if (memcmp(rfid.uid.uidByte, WHITE_CARD, 4) == 0) {
    s.write(ANGLE_OPEN);
    isOpen = true;
    openedAt = millis();          // quẹt lại khi đang mở thì tính lại 3 giây
    Serial.println("   -> the dung, servo ve 0");
  } else {
    Serial.println("   -> the la");
  }

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
```

#### Giải thích

- Phần đọc và in UID **giữ nguyên Test A1**: nếu servo không chạy, Serial vẫn cho biết thẻ đã được đọc chưa, nên biết ngay lỗi ở phần đọc thẻ hay phần servo.
- **Tự đóng bằng `millis()`**: lúc quẹt lưu thời điểm vào `openedAt`, đầu mỗi vòng `loop()` kiểm tra đã đủ `OPEN_MS` chưa. Không dùng `delay(3000)`, nên trong 3 giây đó vẫn đọc thẻ bình thường.
- Đổi thời gian giữ bằng `OPEN_MS`, đổi góc bằng `ANGLE_CLOSE` / `ANGLE_OPEN` tùy cách gắn chốt khóa.

#### Kết quả

```{=html}
<video class="lab-video" controls playsinline preload="metadata" poster="../assets/rfid-servo-real-poster.jpg">
  <source src="../assets/rfid-servo-real.mp4" type="video/mp4">
</video>
```

Đưa thẻ trắng lại gần module, servo quay về 0°, 3 giây sau tự quay lại 90°. RC522 nối bằng dải dây 8 màu, servo SG90 cắm qua breadboard.

:::

### Test C2 – thêm đèn và còi {#test-c2}

Mạch đầy đủ theo bảng [Tổng quan](#tổng-quan): thêm LED xanh `D5`, LED đỏ `D6`, buzzer `D7`. Code này dùng góc ngược với Test C1 (khóa ở 0°, mở ở 90°); đổi `ANGLE_LOCK` / `ANGLE_OPEN` cho khớp cách gắn servo.

| Sự kiện | Đèn | Còi | Servo |
|---|---|---|---|
| Đang chờ | Tắt | | 0° (khóa) |
| **Thẻ hợp lệ** | **Xanh** sáng 3 s | 1 tiếng dài | **90° (mở)**, 3 s sau tự về 0° |
| **Thẻ lạ** | **Đỏ** nháy 3 lần | 3 tiếng ngắn | Đứng yên |

::: {.panel-tabset}

#### Code

```cpp
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

#define SS_PIN    10
#define RST_PIN   9
#define LED_OK    5
#define LED_DENY  6
#define BUZZER    7
#define SERVO_PIN 3

#define ANGLE_LOCK   0
#define ANGLE_OPEN   90
#define OPEN_MS      3000

// Danh sách UID được phép: thay bằng UID ghi lại ở Test A1
const byte ALLOWED[][4] = {
  {0x5A, 0x4D, 0xE5, 0x8B},   // thẻ trắng
  {0x7A, 0x21, 0xE4, 0x80},   // thẻ thứ hai (mẫu, thay bằng UID thật)
};
const byte N_ALLOWED = sizeof(ALLOWED) / sizeof(ALLOWED[0]);

MFRC522 rfid(SS_PIN, RST_PIN);
Servo lock;

bool isOpen = false;
unsigned long openedAt = 0;

bool isAllowed(const MFRC522::Uid& uid) {
  if (uid.size != 4) return false;
  for (byte i = 0; i < N_ALLOWED; i++) {
    if (memcmp(uid.uidByte, ALLOWED[i], 4) == 0) return true;
  }
  return false;
}

void printUid(const MFRC522::Uid& uid) {
  for (byte i = 0; i < uid.size; i++) {
    Serial.print(uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(uid.uidByte[i], HEX);
  }
}

void grant() {
  Serial.println("  -> MO CUA");
  digitalWrite(LED_OK, HIGH);
  lock.write(ANGLE_OPEN);
  tone(BUZZER, 2000, 400);
  isOpen = true;
  openedAt = millis();
}

void deny() {
  Serial.println("  -> TU CHOI");
  for (byte i = 0; i < 3; i++) {
    digitalWrite(LED_DENY, HIGH);
    tone(BUZZER, 400, 120);
    delay(200);
    digitalWrite(LED_DENY, LOW);
    delay(100);
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_OK, OUTPUT);
  pinMode(LED_DENY, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  lock.attach(SERVO_PIN);
  lock.write(ANGLE_LOCK);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Khoa cua RFID san sang");
}

void loop() {
  // 1. Tự khóa lại sau OPEN_MS
  if (isOpen && millis() - openedAt > OPEN_MS) {
    lock.write(ANGLE_LOCK);
    digitalWrite(LED_OK, LOW);
    isOpen = false;
    Serial.println("Da khoa lai");
  }

  // 2. Quẹt thẻ
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  Serial.print("The:");
  printUid(rfid.uid);
  if (isAllowed(rfid.uid)) grant();
  else deny();

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
```

#### Giải thích

- **`ALLOWED`** là mảng 2 chiều, mỗi hàng là một UID 4 byte. Thêm thẻ thì thêm một hàng, `N_ALLOWED` tự tính lại.
- **`memcmp(a, b, 4) == 0`** so sánh 4 byte một lúc.
- **Tự khóa lại bằng `millis()`**: lúc cửa đang mở, `loop()` vẫn chạy nên thẻ lạ vẫn được báo ngay. Cùng ý tưởng với Phần C của [Lab 8](infrared-remote-fc51.md#phần-c--công-tắc-đèn-2-cách). Quẹt thẻ hợp lệ khi cửa đang mở sẽ gia hạn thêm 3 s.
- **`deny()`** dùng `delay()` (~0,9 s): chấp nhận được vì lúc báo lỗi không cần phản hồi gì khác.
- **`tone(pin, tần số, thời gian)`** chạy với cả buzzer **passive** (đúng tần số) và **active** (kêu nhưng không đổi cao độ). Với active buzzer có thể thay bằng `digitalWrite(BUZZER, HIGH)` + `delay()` + `LOW`.
- Servo quay có thể làm sụt áp nguồn chung. Nếu RC522 đọc chập chờn **đúng lúc servo quay**, cấp nguồn servo bằng pin 4×AA riêng (nối chung `GND` với Uno).

#### Cách thử

1. Hàng đầu của `ALLOWED` là UID thẻ trắng trong kit (`5A 4D E5 8B`). Thẻ của bạn khác UID thì sửa theo Test A1.
2. Quẹt thẻ trắng: đèn xanh, bíp dài, servo quay 90°, 3 s sau quay về và Serial in `Da khoa lai`.
3. Quẹt một **thẻ 13,56 MHz khác** (thẻ xe buýt, thẻ thang máy, thẻ gửi xe…): đèn đỏ nháy 3 lần, 3 tiếng bíp ngắn, servo đứng yên. Móc khóa trong kit không dùng được cho bước này.
4. Thêm UID của thẻ đó vào `ALLOWED`, nạp lại: giờ cả hai đều mở được.

> 📷 *Chờ ảnh/video Test C2 (đèn + còi).*

#### Mở rộng

- **Thẻ quản trị (master card):** quẹt thẻ master để vào chế độ "học", thẻ tiếp theo được thêm vào danh sách. Lưu danh sách vào **EEPROM** để không mất khi rút điện.
- **Hiển thị lên LCD** ([Lab 2](lcd-i2c.md)): `Xin chao, Quang` theo UID, hoặc `The khong hop le`. Có thể lấy tên từ block 4 ghi ở Phần B.
- **Chấm công:** mỗi lần quẹt in ra `UID,thời gian`. Arduino không có đồng hồ thời gian thực, nên gửi lên Raspberry Pi (kiến trúc [Lab 9](sensor-edge-cloud.md)) để gắn giờ, lưu CSV và đẩy lên cloud qua MQTT ([bài MQTT](../lectures/mqtt.md)).
- **Chống quẹt thử:** sai 3 lần liên tiếp thì khóa đầu đọc 30 s.

:::

## Tìm hiểu thêm

::: {.callout-note collapse="true"}
## RFID là gì, các dải tần

**RFID** (*Radio Frequency Identification*) là nhận dạng bằng sóng vô tuyến, gồm hai phần:

| | Đầu đọc (reader) | Thẻ (tag) |
|---|---|---|
| Trong lab | Module RC522 | Thẻ trắng |
| Nguồn điện | Lấy từ Arduino | **Không có pin** (thẻ thụ động) |
| Thành phần | Chip MFRC522 + anten in trên mạch | Chip nhỏ + cuộn dây anten trong vỏ nhựa |

Anten của đầu đọc tạo **từ trường xoay chiều 13,56 MHz**. Khi đưa thẻ lại gần, cuộn dây trong thẻ **sinh ra dòng điện cảm ứng** (giống máy biến áp không lõi), đủ nuôi chip. Chip trả lời bằng cách **thay đổi tải** trên cuộn dây, đầu đọc nhận ra thay đổi đó thành dữ liệu. Vì năng lượng truyền bằng cảm ứng nên **tầm đọc rất ngắn** (0–5 cm với RC522), và đó cũng là điểm cố ý của chuẩn 13,56 MHz: khó bị đọc trộm từ xa.

| Dải tần | Tầm đọc | Ví dụ |
|---|---|---|
| **LF 125 kHz** | ~10 cm | Thẻ chấm công, thẻ thang máy đời cũ (EM4100). Chỉ có mã số, không ghi được |
| **HF 13,56 MHz** | ~0–10 cm | **Thẻ trong lab (MIFARE)**, thẻ xe buýt, thẻ ngân hàng không chạm, **NFC**, CCCD gắn chip |
| **UHF 860–960 MHz** | 1–10 m | Tem hàng hóa trong kho, thu phí không dừng (ETC) |

RC522 chỉ đọc **13,56 MHz** theo chuẩn **ISO/IEC 14443A**; thẻ 125 kHz không đọc được. **NFC** trên điện thoại là một nhánh của RFID 13,56 MHz: app như *NFC Tools* hay *MIFARE Classic Tool* đọc được thẻ trong kit, tiện để kiểm tra chéo Phần A. Thẻ **không cần bóc túi nilon**: sóng đi xuyên nilon, ví, vỏ điện thoại nhựa.
:::

::: {.callout-note collapse="true"}
## Thẻ MIFARE Classic 1K: UID, bộ nhớ, xác thực

Thẻ trắng trong kit là **MIFARE Classic 1K** (còn gọi là **S50**).

**UID** dài **4 byte**, ghi sẵn từ nhà máy. Đa số hệ thống gửi xe, khóa cửa giá rẻ chỉ dựa vào UID. ⚠️ UID **không phải bí mật**: đầu đọc nào cũng đọc được, và thẻ "magic" cho phép chép UID sang thẻ khác. Khóa cửa dùng UID như Phần C chỉ hợp cho học tập hoặc độ an toàn thấp.

**Bộ nhớ:** 1 KB chia thành **16 sector × 4 block × 16 byte**, block đánh số 0–63:

```
Sector 0   block 0   [UID + dữ liệu nhà sản xuất]   ← chỉ đọc
           block 1   [dữ liệu]
           block 2   [dữ liệu]
           block 3   [Key A | Access bits | Key B]   ← sector trailer
Sector 1   block 4   [dữ liệu]                       ← Phần B ghi vào đây
           block 5   [dữ liệu]
           block 6   [dữ liệu]
           block 7   [Key A | Access bits | Key B]   ← sector trailer
...
Sector 15  block 60–62 [dữ liệu], block 63 [trailer]
```

- **Block 0** chứa UID, khóa cứng từ nhà máy.
- **Block cuối mỗi sector** (3, 7, …, 63) là **sector trailer**: Key A, Key B (6 byte mỗi khóa) và **access bits** quy định ai được đọc/ghi block nào.
- Còn lại **47 block dữ liệu**, tổng 752 byte ghi được.

**Xác thực:** muốn đọc/ghi một block, đầu đọc phải **xác thực** với sector chứa block đó bằng Key A hoặc Key B. Thẻ mới có cả hai khóa là **`FF FF FF FF FF FF`**. Thuật toán *Crypto1* của MIFARE Classic đã bị bẻ khóa từ năm 2008, nên hệ thống mới dùng **MIFARE DESFire** hoặc **MIFARE Plus** với AES.
:::

::: {.callout-note collapse="true"}
## Nhìn module RC522 (vị trí chân, mức logic)

- **Nửa dưới** module là **anten in trên mạch** (đường đồng chạy vòng quanh mép): chỗ đặt thẻ.
- **Nửa trên**: **chip MFRC522** (32 chân), **thạch anh `27.120`** MHz (= 2 × 13,56 MHz), **LED nguồn `D1`** ở góc trái và hàng 8 lỗ chân dọc mép trên.

Nhìn mặt có linh kiện (anten ở dưới), nhãn chân in **lộn ngược**, đọc từ **phải sang trái**:

```
   phía LED D1                                      phía thạch anh
   3.3V   RST   GND   IRQ   MISO  MOSI  SCK   SDA ■   (■ = pad vuông, chân 1)
    ○      ○     ○     ○     ○     ○     ○     □
   ┌─────────────────────────────────────────────┐
   │  D1      chip MFRC522              27.120   │
   │                                             │
   │             ~~~ anten ~~~                   │
   └─────────────────────────────────────────────┘
```

**Mức logic:** chân tín hiệu (`SCK`, `MOSI`, `SDA`, `RST`) nhận mức 5 V từ Uno. Datasheet không ghi là chịu được 5 V, nhưng nối thẳng là cách phổ biến và chạy ổn; muốn đúng chuẩn thì dùng **module chuyển mức logic** 5 V ↔ 3,3 V. Chiều ngược lại, `MISO` ra 3,3 V, Uno vẫn đọc là `HIGH` (xem bảng điện áp ở [Lab 8](infrared-remote-fc51.md#low-là-bao-nhiêu-volt)).
:::

::: {.callout-note collapse="true"}
## SPI là gì

Các lab trước dùng `digitalRead()` một chân ([Lab 8](infrared-remote-fc51.md)), giao thức 1 dây của DHT11 ([Lab 3](dht11.md)), I²C 2 dây của LCD ([Lab 2](lcd-i2c.md)), dịch bit qua 74HC595 ([Lab 7](seven-segment-5641as.md)). RC522 dùng **SPI** (*Serial Peripheral Interface*): 4 dây, nhanh hơn I²C nhiều.

```
         Uno (master)                 RC522 (slave)
   D13 SCK  ───────────────────────▶  SCK     xung nhịp, do master tạo
   D11 MOSI ───────────────────────▶  MOSI    master gửi
   D12 MISO ◀───────────────────────  MISO    slave trả lời
   D10 SS   ───────────────────────▶  SDA     LOW = "tôi đang nói với bạn"
```

| | I²C (LCD, Lab 2) | SPI (RC522) |
|---|---|---|
| Số dây tín hiệu | 2 (`SDA`, `SCL`) | 4 (`SCK`, `MOSI`, `MISO`, `SS`) |
| Chọn thiết bị | Bằng **địa chỉ** gửi trên dây | Bằng **một chân SS riêng** mỗi thiết bị |
| Tốc độ thường dùng | 100–400 kbit/s | 1–10 Mbit/s |
| Chân trên Uno | `A4`, `A5` | **Cố định** `D11`, `D12`, `D13`; `SS` tùy ý |

`SCK`, `MOSI`, `MISO` **cố định** vì nối với bộ SPI phần cứng của ATmega328P (cũng có trên header ICSP 6 chân). Tên chân `SDA` trên module là vì chip cũng hỗ trợ I²C, nhưng module nối sẵn để chạy SPI.
:::

::: {.callout-note collapse="true"}
## Ứng dụng, RFID hay mã vạch / QR

| Ứng dụng | Dùng gì |
|---|---|
| Khóa cửa phòng, tủ đồ | RC522 + servo / khóa chốt điện (*solenoid*) + relay |
| Chấm công, điểm danh | RC522 + LCD + gửi dữ liệu về server |
| Bãi giữ xe | RC522 đọc thẻ + camera chụp biển số, ghép theo UID |
| Thẻ xe buýt, ví điện tử nội bộ | Ghi số dư vào block dữ liệu (MIFARE có *value block* với lệnh cộng/trừ) |
| Quản lý thiết bị, sách thư viện | Dán tem NFC vào từng món, quét bằng điện thoại |
| Kho hàng, chuỗi cung ứng | RFID **UHF**: đọc hàng trăm tem cùng lúc từ vài mét |

| | RFID 13,56 MHz | Mã vạch / QR |
|---|---|---|
| Cần nhìn thấy | Không, đọc xuyên giấy, nhựa | Có, phải thấy rõ tem |
| Ghi lại được | Có (752 byte trên MIFARE 1K) | Không, in một lần |
| Chép / làm giả | Khó hơn (cần thẻ đặc biệt) | Chụp ảnh là xong |
| Bền | Chip trong vỏ nhựa, chịu bẩn, trầy | Mờ, rách là không đọc được |
| Giá mỗi tem/thẻ | Vài nghìn đồng | Gần như bằng 0 |
:::

## Lỗi hay gặp

| Hiện tượng | Nguyên nhân / cách xử lý |
|---|---|
| LED `D1` trên module không sáng | Module chưa có điện: dây `3.3V` / `GND` cắm sai chân (đọc **nhãn in trên mạch**, đừng đếm theo vị trí), lỏng đầu dây cái, hoặc mối hàn hai chân này chưa ăn |
| `D1` đã sáng nhưng Serial in `Firmware Version: 0x00` hoặc `0xFF`, `Communication failure` | Có điện nhưng không nói chuyện được với chip. Dò **từng dây** tín hiệu theo nhãn trên mạch: `SDA`→`D10`, `SCK`→`D13`, `MOSI`→`D11`, `MISO`→`D12`, `RST`→`D9` (thiếu `RST` thì chip ở trạng thái tắt, trả về đúng `0x00`). Kiểm tra mối hàn 5 chân này và đếm lại lỗ `D9`–`D13` trên Uno |
| Phiên bản `(unknown)` như `0x12`, `0x88` | Chip clone. Thường vẫn đọc thẻ bình thường, bỏ qua cảnh báo. Nếu không đọc được thẻ thì thử đổi module |
| Phiên bản đúng nhưng đặt thẻ không in gì | Thẻ chưa đủ gần: đặt **phẳng, sát** lên phần anten (vùng có đường đồng chạy vòng quanh mép), không phải phần chip. Hoặc thẻ không phải 13,56 MHz (thẻ chấm công 125 kHz) |
| Đọc được thẻ trắng, móc khóa thì phải để thật sát | Anten trong móc khóa nhỏ hơn nhiều: bình thường. Thêm `PCD_SetAntennaGain(rfid.RxGain_max)` |
| Thẻ trắng đọc được, móc khóa **không bao giờ** đọc được | Móc khóa là loại **125 kHz**, RC522 không đọc được. Kiểm tra bằng NFC trên điện thoại |
| Đang chạy được, chạm thẻ xong thì lại báo `0x0` | Dây bị lỏng do module xê dịch khi ấn thẻ. Ấn chặt lại các đầu dây, dán băng dính cố định module và bó dây |
| Lúc được lúc không, chạm nhẹ vào dây thì chạy | Tiếp xúc kém: chưa hàn header hoặc dây đực – cái lỏng. Dây SPI nên ngắn dưới 20 cm |
| Module nóng, rồi không chạy nữa | Đã cấp **5V** vào chân `3.3V`. Rút ra ngay; nếu không phục hồi thì chip đã hỏng |
| Lỗi biên dịch `MFRC522DriverPinSimple`, `MFRC522DriverSPI` | Đang dùng code của thư viện **MFRC522v2**. Dùng thư viện MFRC522 bản 1.4.x và cú pháp như trong lab |
| Giữ thẻ trên đầu đọc thì UID in liên tục / in ngắt quãng | Thiếu `PICC_HaltA()` sau khi đọc |
| `Authentication failed` / `Xac thuc loi: Timeout` | Thẻ nhấc ra quá nhanh, hoặc thẻ đã bị đổi khóa (thẻ cũ từ hệ thống khác). Hoặc thiếu `PCD_StopCrypto1()` ở lần đọc trước |
| `MIFARE_Read` báo `STATUS_NO_ROOM` / `A buffer is not big enough` | Bộ đệm đọc phải là **18 byte**, không phải 16 |
| Phần B chạm thẻ báo `Khong phai the MIFARE Classic 1K` | Thẻ là loại khác (Ultralight, NTAG, thẻ CCCD…). Các thẻ này đọc UID được nhưng không dùng cách xác thực bằng Key A |
| Gõ chữ vào Serial nhưng không thấy `Se ghi …` | Ô kết thúc dòng của Serial Monitor đang là `No line ending`: đổi sang **Newline** |
| LED `L` trên board nháy mờ | `D13` là chân `SCK` của SPI: bình thường |
| Quẹt thẻ đúng nhưng vẫn báo `TU CHOI` | UID trong `ALLOWED` gõ sai. Copy đúng từng byte từ Serial Test A1, nhớ tiền tố `0x` |
| Servo quay thì RC522 đọc lỗi, hoặc Uno tự reset | Servo kéo sụt áp nguồn. Cấp nguồn servo riêng (pin 4×AA), nối chung `GND` |
