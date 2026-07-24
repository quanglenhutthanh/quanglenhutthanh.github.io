---
title: "Color Image Processing"
subject: "computer-vision"
type: lecture
lecture_no: 11
status: done
source: slide
tags: [color, hsv, cie-xyz, rgb, cmyk, ycbcr, pseudocolor, matlab]
date: 2024-11-01
---

# Lecture 11 – Color Image Processing

> Nội dung chính: khái niệm & thuật ngữ về **cảm nhận màu**, các **color model**, cách biểu diễn ảnh màu trong MATLAB, **pseudo-color** vs **full-color processing**, và cách mở rộng kỹ thuật xử lý ảnh xám sang ảnh màu.

---

## 11.1 Psychophysics of Color (Cơ sở tâm-vật lý của màu)

Cảm nhận màu là hiện tượng **tâm-vật lý (psychophysical)**, kết hợp hai thành phần:

1. **Tính chất vật lý của nguồn sáng** — thường mô tả bằng phân bố công suất phổ (*spectral power distribution, SPD*) — và của **bề mặt** (khả năng hấp thụ / phản xạ).
2. **Khía cạnh sinh lý & tâm lý** của hệ thị giác người (*human visual system, HVS*).

### 11.1.1 Khái niệm cơ bản

- Cảm nhận màu bắt đầu từ **nguồn sáng chromatic**, phát bức xạ điện từ bước sóng **≈ 400–700 nm**. Ánh sáng phản xạ từ bề mặt vật thể tới mắt → tạo cảm giác màu.
- Vật phản xạ **đều** mọi bước sóng → thấy **trắng**; hấp thụ hầu hết ánh sáng → thấy **đen**.
- Các mức xám giữa trắng và đen thuần → gọi là **achromatic**. Vật có tính chọn lọc bước sóng cao hơn → **chromatic** (gắn với một tên màu). VD: vật hấp thụ mạnh vùng **565–590 nm** → thấy vàng.

**Ba đại lượng mô tả nguồn sáng chromatic:**

| Đại lượng | Ý nghĩa | Đơn vị |
|---|---|---|
| **Intensity / Radiance** | tổng năng lượng phát ra từ nguồn | watt (W) |
| **Luminance** | lượng thông tin quan sát viên cảm nhận; công suất bức xạ có trọng số theo độ nhạy phổ của HVS | lumen (lm) |
| **Brightness** | cảm nhận chủ quan về cường độ sáng (achromatic) | — |

**Tế bào cảm thụ ở võng mạc:** *rods* và *cones*.
- **Rods**: không mã hoá màu, nhạy ở mức sáng thấp → nhìn trong tối.
- **Cones**: chịu trách nhiệm cảm nhận màu, hoạt động ở điều kiện sáng. Có 3 loại theo bước sóng đỉnh: **L (≈ 610 nm)**, **M (≈ 560 nm)**, **S (≈ 430 nm)**.

> Thuyết ba màu (*trichromatic*) của Thomas Young (1802) tiên đoán tồn tại 3 loại cone trước khi xác nhận được bằng thực nghiệm.

**Màu thứ cấp (cộng ánh sáng, additive):**
$$\text{magenta} = \text{red} + \text{blue}, \quad \text{cyan} = \text{blue} + \text{green}, \quad \text{yellow} = \text{green} + \text{red}$$

**Ánh sáng vs sắc tố (pigment):**
- Với **sắc tố/sơn**: sơ cấp = *magenta, cyan, yellow*; thứ cấp = *red, green, blue*.
- Với **ánh sáng**: màu định nghĩa theo phần phổ **phát ra**; với sắc tố: theo phần phổ **hấp thụ**.
- Trộn cả 3 sơ cấp **ánh sáng** → **trắng**; trộn cả 3 sơ cấp **sơn** → **đen**.

> **Color metamers**: các tổ hợp màu sơ cấp (vd red + green) được HVS cảm nhận thành một màu khác (vd yellow) mà lẽ ra do một bước sóng đơn (≈ 580 nm) tạo ra. → không phải mọi màu nhìn thấy đều tạo được bằng cách trộn 3 sơ cấp.

### 11.1.2 CIE XYZ Chromaticity Diagram

- Thí nghiệm color matching (cuối 1920s): chỉnh lượng R, G, B ở patch này để khớp màu ở patch kia. Xuất hiện **giá trị âm** của R, G → phải cộng thêm sáng vào patch còn lại để khớp hoàn hảo.
- Lượng 3 sơ cấp cần để khớp một màu test = **tristimulus values**.

Mô hình **CIE XYZ (CIE 1931)**. Quan hệ tuyến tính XYZ ↔ RGB:

$$
\begin{bmatrix} X \\ Y \\ Z \end{bmatrix} =
\begin{bmatrix}
0.431 & 0.342 & 0.178 \\
0.222 & 0.707 & 0.071 \\
0.020 & 0.130 & 0.939
\end{bmatrix}
\begin{bmatrix} R \\ G \\ B \end{bmatrix}
$$

$$
\begin{bmatrix} R \\ G \\ B \end{bmatrix} =
\begin{bmatrix}
3.063 & -1.393 & -0.476 \\
-0.969 & 1.876 & 0.042 \\
0.068 & -0.229 & 1.069
\end{bmatrix}
\begin{bmatrix} X \\ Y \\ Z \end{bmatrix}
$$

- **Y** ↔ độ sáng (brightness). Toạ độ chromaticity chuẩn hoá:

$$x = \frac{X}{X+Y+Z}, \quad y = \frac{Y}{X+Y+Z}, \quad z = \frac{Z}{X+Y+Z}$$

- **Chromaticity diagram**: biên hình móng ngựa = *spectral locus* (các bước sóng nhìn thấy). **Line of purples** nối hai đầu phổ → tím là **màu phi phổ (nonspectral)** (cần trộn bước sóng ngắn + dài). Trắng thuần ở tâm.
- **Gamut**: tam giác trong = dải màu mà một thiết bị vật lý tái tạo được. Gamut càng lớn → khả năng tái tạo màu càng tốt (khác nhau giữa CRT, máy in, phim).

### 11.1.3 Perceptually Uniform Color Spaces

- Hạn chế của CIE XYZ: **khoảng cách trên mặt phẳng $xy$ không tương ứng với mức khác biệt màu** mà mắt cảm nhận (MacAdam, đầu 1940s).
- **MacAdam ellipses**: các vùng trên biểu đồ chromaticity mà mọi màu bên trong **không phân biệt được** với màu ở tâm ellipse → động lực cho các không gian màu *đều về cảm nhận* (CIELAB, CIELUV).

**MATLAB (IPT):** chuyển đổi không gian màu qua `makecform` (tạo cấu trúc biến đổi) rồi `applycform`.

Bảng hàm CIE XYZ / CIELAB tiêu biểu: `xyz2double`, `xyz2uint16`, `lab2double`, `lab2uint16`, `lab2uint8`, `whitepoint` (trả vector XYZ chuẩn hoá sao cho Y = 1).

### 11.1.4 ICC Profiles

- **ICC profile** (*International Color Consortium*): mô tả chuẩn hoá một thiết bị màu vào/ra hoặc một không gian màu; định nghĩa ánh xạ giữa không gian màu thiết bị và **PCS** (*profile connection space*) — là **CIELAB** hoặc **CIEXYZ**.
- Hàm IPT: `iccread`, `iccfind`, `iccroot`, `iccwrite`.

---

## 11.2 Color Models

> **Color model** (= color space / color system): đặc tả một hệ toạ độ và một không gian con, trong đó mỗi màu là một điểm.

### 11.2.1 RGB

- Dựa trên hệ toạ độ Cartesian, 3 trục R, G, B, thường chuẩn hoá về [0, 1]. 8 đỉnh khối lập phương = 3 sơ cấp + 3 thứ cấp + trắng + đen.
- Biểu diễn hex: mỗi thành phần 00–FF (0–255). VD đỏ thuần = `FF0000`.
- **Pixel depth**: số bit/pixel. Điển hình **24 bit** = 3 mặt phẳng × 8 bit → hơn 16 triệu màu.

**8 đỉnh khối RGB:**

| Màu | R | G | B |
|---|---|---|---|
| Black | 0 | 0 | 0 |
| Blue | 0 | 0 | 1 |
| Green | 0 | 1 | 0 |
| Cyan | 0 | 1 | 1 |
| Red | 1 | 0 | 0 |
| Magenta | 1 | 0 | 1 |
| Yellow | 1 | 1 | 0 |
| White | 1 | 1 | 1 |

### 11.2.2 CMY và CMYK

- CMY dựa trên 3 sơ cấp sắc tố (cyan, magenta, yellow) — dùng cho máy in, mỗi sơ cấp ≈ một hộp mực. Trộn 3 sơ cấp cho ra đen "đục" → thêm màu thứ 4 **K (blacK)** → **CMYK**.
- Chuyển RGB → CMY:

$$
\begin{bmatrix} C \\ M \\ Y \end{bmatrix} =
\begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} -
\begin{bmatrix} R \\ G \\ B \end{bmatrix}
$$

### 11.2.3 HSV

- RGB/CMYK tiện cho hiển thị/in nhưng **không khớp cách con người mô tả màu**. Con người nghĩ theo **hue, saturation, lightness**:
  - **Hue**: loại màu / tông (thường = "tên màu").
  - **Saturation**: độ tinh khiết (bị pha trắng bao nhiêu).
  - **Lightness / Value**: cường độ sáng.
- HSV (còn gọi HSB) = nhìn khối RGB **dọc theo đường chéo chính** (trục xám) → bảng màu lục giác. Di chuyển dọc trục → V giảm từ 1 (trắng) về 0 (đen).
  - **Hue** = góc so với gốc (trục đỏ là 0° theo quy ước).
  - **Saturation** = khoảng cách tới trục (càng xa càng bão hoà).
- Biểu diễn 3D: hình nón lục giác (hexcone), hình trụ, hoặc hình nón đáy tròn.
- **Ưu điểm chính**: tách được thành phần **intensity/value** khỏi **chromaticity** (hue + saturation) → yêu cầu của nhiều thuật toán xử lý ảnh màu.

### 11.2.4 YIQ (NTSC)

- Chuẩn TV analog Mỹ. Ưu điểm: **tách nội dung xám khỏi dữ liệu màu** (để tương thích ngược với TV đen-trắng). 3 thành phần: **Y** (luminance) + **I, Q** (hai tín hiệu chênh lệch màu).

$$
\begin{bmatrix} Y \\ I \\ Q \end{bmatrix} =
\begin{bmatrix}
0.299 & 0.587 & 0.114 \\
0.596 & -0.274 & -0.322 \\
0.211 & -0.523 & 0.312
\end{bmatrix}
\begin{bmatrix} R \\ G \\ B \end{bmatrix}
$$

### 11.2.5 YCbCr

- **Biểu diễn màu phổ biến nhất cho video số.** Y = luminance; **Cb** = chênh lệch thành phần blue so với giá trị tham chiếu; **Cr** = chênh lệch thành phần red.

$$
\begin{bmatrix} Y \\ C_b \\ C_r \end{bmatrix} =
\begin{bmatrix}
0.299 & 0.587 & 0.114 \\
-0.169 & -0.331 & 0.500 \\
0.500 & -0.419 & -0.081
\end{bmatrix}
\begin{bmatrix} R \\ G \\ B \end{bmatrix}
$$

---

## 11.3 Biểu diễn ảnh màu trong MATLAB

Ảnh màu thường ở dạng **RGB (24 bpp)** hoặc **indexed** (dùng palette/color map, thường 256 màu). Độc lập với định dạng file (dù GIF thường indexed, JPEG thường không).

### 11.3.1 RGB images

- Ảnh RGB = mảng 3D kích thước **M × N × 3** (M, N = cao, rộng; 3 = số kênh màu). Mỗi mảng M × N = một **component image** (R, G, hoặc B).
- Dải giá trị theo kiểu dữ liệu: `double` → [0.0, 1.0]; `uint8` → [0, 255]; `uint16` → [0, 65535].
- Bit depth điển hình 24 bpp → $(2^8)^3 = 16{,}777{,}216$ màu.

```matlab
I = imread('peppers.png');
size(I)     % 384 x 512 x 3
class(I)    % uint8
subplot(2,2,1), imshow(I),        title('Color image (RGB)');
subplot(2,2,2), imshow(I(:,:,1)), title('Red component');
subplot(2,2,3), imshow(I(:,:,2)), title('Green component');
subplot(2,2,4), imshow(I(:,:,3)), title('Blue component');
```

### 11.3.2 Indexed images

- Ảnh indexed = ma trận số nguyên **X**, mỗi số trỏ tới một hàng RGB trong ma trận phụ **map** (color map). `map` là ma trận **M × 3** kiểu `double`, mỗi phần tử trong [0.0, 1.0], mỗi hàng = (R, G, B).
- Cơ chế trỏ: nếu X là `uint8`/`uint16` → giá trị 0 trỏ hàng 1, giá trị 1 trỏ hàng 2, … Nếu X là `double` → giá trị ≤ 1.0 trỏ hàng 1, …

```matlab
load clown
size(X)     % 200 x 300   |  class(X)  -> double
size(map)   % 81 x 3      |  class(map)-> double
imshow(X,map), title('Color (Indexed)')
```

**Các color map dựng sẵn** (gọi bằng `colormap`): `hsv, hot, gray, bone, copper, pink, white, flag, lines, colorcube, vga, jet, prism, cool, autumn, spring, winter, summer`. Có thể tự tạo map: mảng `double` kích thước M × 3, giá trị trong [0.0, 1.0].

**Hàm thao tác ảnh indexed:**
- `imapprox` — xấp xỉ bằng ảnh ít màu hơn.
- `rgb2ind` / `ind2rgb` — chuyển RGB ↔ indexed.
- `rgb2gray` / `ind2gray` — chuyển sang xám.
- `dither` — tạo ảnh indexed từ RGB bằng dithering.
- `grayslice` — tạo ảnh indexed từ ảnh xám bằng thresholding (dùng cho pseudocolor).
- `gray2ind` — chuyển ảnh xám sang indexed *nhưng vẫn đơn sắc* (chỉ đổi cách lưu dữ liệu, khác `grayslice`).

---

## 11.4 Pseudocolor Image Processing

- **Mục đích**: tăng cường ảnh đơn sắc để mắt người xem dễ hơn. Lý do: biến thiên mức xám tinh vi có thể che khuất vùng quan trọng (vd khối u trong ảnh y khoa).
- Mắt người phân biệt **hàng ngàn** sắc màu & cường độ, nhưng chỉ **< 100** mức xám → thay xám bằng màu giúp phát hiện chi tiết tốt hơn.
- Giải pháp điển hình: **LUT (color lookup table)** ánh xạ ~256 mức xám → một số màu (thường ít hơn). Để dễ nhìn, màu tương phản nên nằm ở các hàng liên tiếp trong LUT.
- "**Pseudo**" nhấn mạnh: màu gán **không tương ứng** với màu thật trong ảnh gốc.

### 11.4.1 Intensity (Density) Slicing

- Kỹ thuật pseudocolor **đơn giản nhất & phổ biến nhất**.
- Xem ảnh đơn sắc như mặt 3D (mức xám theo toạ độ không gian) → đặt các **mặt phẳng cắt song song** với mặt phẳng ảnh (xy). Mỗi mặt cắt hàm 3D → chia thành các khoảng mức xám; mỗi bên mặt phẳng gán một màu.
- 1 mặt cắt tại $f(x,y) = l_i$ → 2 khoảng; tổng quát **M mặt phẳng → M + 1 khoảng** (màu $c_1, c_2, \dots$).

**MATLAB:** dùng `grayslice`. VD 16 mức với các color map `summer`, `hsv`, `jet`.

---

## 11.6 Tutorial: Pseudocolor Image Processing

**Mục tiêu:** hiển thị ảnh xám bằng pseudocolor; dùng `grayslice`; tự định số màu của color map.

```matlab
% Ảnh gradient
I = repmat(uint8(0:255), 256, 1);
figure, subplot(1,2,1), subimage(I), title('Original Image');

% Slice thành 16 khoảng đều
I2 = grayslice(I, 16);
subplot(1,2,2), subimage(I2, colormap(winter(16))), ...
    title('Pseudo-colored with "winter" colormap')

% Slice thành các khoảng KHÔNG đều
levels = [0.25*255, 0.75*255, 0.9*255];
I3 = grayslice(I, levels);
figure, imshow(I3, spring(4))

% Áp dụng lên ảnh có ý nghĩa
I  = imread('mri.jpg');
I2 = grayslice(I, 16);
subplot(1,2,2), subimage(I2, colormap(jet(16))), ...
    title('Pseudo-colored with "jet" colormap');
```

**Câu hỏi tự kiểm tra:**
- Q1. Vì sao dùng `subimage` thay vì `imshow` để hiển thị?
- Q2. Số 16 trong `grayslice(I,16)` nghĩa là gì? (số khoảng cắt)
- Q3. Số 16 trong `colormap(winter(16))` nghĩa là gì? (số màu trong map)
- Q4. Nếu ảnh gốc ở dải [0.0, 1.0] thì code đổi thế nào? (`levels` cũng phải ở [0,1])
- Q5. Nếu không chỉ định số màu, MATLAB lấy bao nhiêu màu cho color map?

---

## 11.7 Tutorial: Full-Color Image Processing

**Mục tiêu:** chuyển đổi không gian màu (`rgb2hsv`, `hsv2rgb`) và lọc ảnh màu; so sánh smoothing/sharpening trên RGB vs HSV.

```matlab
% RGB -> HSV, xem các thành phần
I    = imread('onion.png');
Ihsv = rgb2hsv(I);
% Ihsv(:,:,1)=Hue, (:,:,2)=Saturation, (:,:,3)=Value

% So sánh grayscale vs Value
Igray = rgb2gray(I);   % gần giống thành phần Value

% Smoothing trên RGB: lọc từng kênh rồi ghép lại
fn = fspecial('average');
I2(:,:,1) = imfilter(I(:,:,1), fn);
I2(:,:,2) = imfilter(I(:,:,2), fn);
I2(:,:,3) = imfilter(I(:,:,3), fn);

% Smoothing trên HSV: lọc cả 3 thành phần, rồi hsv2rgb để hiển thị
Ihsv2(:,:,1) = imfilter(Ihsv(:,:,1), fn);
Ihsv2(:,:,2) = imfilter(Ihsv(:,:,2), fn);
Ihsv2(:,:,3) = imfilter(Ihsv(:,:,3), fn);
imshow(hsv2rgb(Ihsv2));

% Chỉ lọc thành phần Value (giữ Hue, Saturation)
Ihsv3(:,:,[1 2]) = Ihsv(:,:,[1 2]);
Ihsv3(:,:,3)     = imfilter(Ihsv(:,:,3), fn);
imshow(hsv2rgb(Ihsv3));

% Sharpening HSV: laplacian trên Value rồi trừ
fn2 = fspecial('laplacian', 0);
Ihsv4(:,:,[1 2]) = Ihsv(:,:,[1 2]);
Ihsv4(:,:,3)     = imsubtract(Ihsv(:,:,3), imfilter(Ihsv(:,:,3), fn2));
imshow(hsv2rgb(Ihsv4));
```

**Ý chính rút ra:**
- Thành phần **Value** của HSV ≈ ảnh grayscale; Hue/Saturation khó "đọc" bằng mắt.
- Với RGB, làm mượt = lọc **từng kênh** rồi ghép.
- Với HSV, thường **chỉ lọc Value** là hợp lý (lọc cả Hue/Saturation dễ làm hỏng màu).

---

## What have we learned? (Tóm tắt)

**Color models phổ biến & công dụng:**

| Model | Dùng cho |
|---|---|
| RGB, CMY(K) | hiển thị & in ấn |
| YIQ, YCbCr | truyền hình & video |
| XYZ | chuẩn hoá màu |
| CIELAB, CIELUV | đều về cảm nhận (perceptual uniformity) |
| HSV, HSI, HSL | mô tả trực quan thuộc tính màu |

- Ảnh màu trong MATLAB: **M × N × 3** (RGB) hoặc **M × N chỉ số** trỏ palette (~256×3) = **indexed**.
- **Pseudocolor**: gán màu theo *diễn giải dữ liệu*, không phải màu thật. **Full-color**: xử lý pixel của ảnh có màu tương ứng cảnh thật.
- Nhiều kỹ thuật ảnh đơn sắc (edge detection, histogram equalization…) mở rộng được sang ảnh màu; thành công phụ thuộc **chọn color model**.

