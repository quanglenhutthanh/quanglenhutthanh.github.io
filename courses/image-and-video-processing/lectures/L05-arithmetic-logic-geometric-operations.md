---
title: "Arithmetic, Logic, and Geometric Operations"
subject: "image-and-video-processing"
type: lecture
lecture_no: 5
status: done
source: slide
tags: [arithmetic-operations, logic-operations, geometric-transformations, interpolation, matlab]
date: 2024-09-20
---

# Lecture 5 – Arithmetic, Logic, and Geometric Operations

> This lecture covers the pixel-by-pixel arithmetic operations (addition, subtraction, multiplication, division) and bit-wise logic operations (AND, OR, NOT, XOR) used to combine, correct, or mask images, together with their typical MATLAB implementations. It then moves to geometric (spatial) operations — affine transformations such as translation, scaling, rotation, and shearing — and the interpolation methods (nearest-neighbor, bilinear, bicubic) needed to resample an image after such a transform, closing with practical MATLAB workflows for resizing, rotating, cropping, and registering images.

---

## 5.1 Arithmetic Operations: Fundamentals and Applications

Arithmetic operations on images are performed **pixel-by-pixel**: the operation is applied independently to each pixel location. Given a 2D array $X$ and either another 2D array of the same size or a scalar $Y$, the result $Z$ is

$$X \; \mathrm{opn} \; Y = Z$$

where $\mathrm{opn}$ is one of the binary arithmetic operators $+, -, \times, /$. The rest of this section walks through each operator, how it is performed in MATLAB, and what it is typically used for.

### 5.1.1 Addition

Image addition serves two distinct purposes:

- **Blending two images.** Adding the pixel contents of two monochrome images causes their contents to visually blend together.
- **Additive image offset.** Adding a constant (scalar) to every pixel of an image increases its overall brightness (or decreases it, if the constant is negative).
- **Simulating additive noise.** Adding a *random* amount to each pixel is a common way of generating a noisy test image, which is then used to evaluate restoration algorithms.

**In MATLAB**, the IPT function `imadd` adds two images, or an image and a constant. Because pixel values are stored using a fixed-range integer type (e.g. `uint8`, range $[0, 255]$), adding two images can easily produce a sum that **overflows** the representable range. Two strategies handle this:

- **Normalization** — the intermediate sum is kept in a temporary array $W$ (using a wider type, e.g. `uint16`), and every output pixel is rescaled back into the valid range:

$$g = \frac{L_{max}}{f_{max} - f_{min}}\left(f - f_{min}\right)$$

  where $f$ is a pixel in $W$, $L_{max}$ is the maximum representable intensity (255 for `uint8`, 1.0 for `double`), $f_{max}$/$f_{min}$ are the maximum/minimum pixel values found in $W$, and $g$ is the corresponding output pixel in $Z$. Normalization preserves the full dynamic range of the sum but changes the *meaning* of the pixel values (they no longer represent raw added intensities).
- **Truncation** — any sum that exceeds the maximum representable value is simply clipped to that maximum. This is what `imadd` does by default when operating on integer classes.

**Example 5.1.** For the two $3\times3$, 8-bit monochrome images

$$X = \begin{bmatrix} 200 & 100 & 100 \\ 0 & 10 & 50 \\ 50 & 250 & 120 \end{bmatrix}, \qquad Y = \begin{bmatrix} 100 & 220 & 230 \\ 45 & 95 & 120 \\ 205 & 100 & 0 \end{bmatrix}$$

the raw (widened) sum $W = X + Y$ is

$$W = \begin{bmatrix} 300 & 320 & 330 \\ 45 & 105 & 170 \\ 255 & 350 & 120 \end{bmatrix}, \qquad f_{max} = 350,\ f_{min} = 45$$

**(a) Normalization** rescales every entry of $W$ into $[0, 255]$ using the formula above:

$$Z_a \approx \begin{bmatrix} 213 & 230 & 238 \\ 0 & 50 & 105 \\ 176 & 255 & 63 \end{bmatrix}$$

**(b) Truncation** simply clips every sum above 255 down to 255 (this is what `imadd` returns):

$$Z_b = \begin{bmatrix} 255 & 255 & 255 \\ 45 & 105 & 170 \\ 255 & 255 & 120 \end{bmatrix}$$

Notice how the two results diverge substantially wherever overflow occurs — truncation destroys information about *how much* a pixel overflowed, while normalization preserves relative contrast but rescales everything.

```matlab
X = uint8([200 100 100; 0 10 50; 50 250 120]);
Y = uint8([100 220 230; 45 95 120; 205 100 0]);
W = uint16(X) + uint16(Y);
fmax = max(W(:));
fmin = min(W(:));
Za = uint8(255.0*double((W-fmin))/double((fmax-fmin)));  % normalization
Zb = imadd(X,Y);                                          % truncation
```

### 5.1.2 Subtraction

Subtraction is most often used to **detect differences** between two images — differences that may come from artificial tampering (e.g. content added/removed with an editing tool), from relative object motion between two video frames, or from many other sources. It is also used for **subtractive image offset**, i.e. subtracting a constant from every pixel to darken an image.

Subtraction introduces the opposite problem of addition: **underflow**, i.e. the possibility of negative intermediate results that cannot be represented by an unsigned integer type. Two ways of handling it:

- **Absolute difference** — compute $|X - Y|$, which always yields non-negative values proportional to the magnitude of the difference, but loses the information about *which* image was brighter at that pixel.
- **Truncation** — clip negative intermediate values to zero.

**In MATLAB**: `imsubtract` subtracts one image from another (or a constant from an image), using truncation; `imabsdiff` computes the absolute difference of two images; `imcomplement` computes the negative (complement) of an image.

**Example 5.2.** Using the same $X$ and $Y$ from Example 5.1, compute (a) $Z = X - Y$, (b) $Z = Y - X$ (both truncated so negative values become 0), and (c) $Z = |Y-X|$.

$$Z_a = X-Y\ (\text{trunc.}) = \begin{bmatrix} 100 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 150 & 120 \end{bmatrix}, \qquad
Z_b = Y-X\ (\text{trunc.}) = \begin{bmatrix} 0 & 120 & 130 \\ 45 & 85 & 70 \\ 155 & 0 & 0 \end{bmatrix}$$

$$Z_c = |Y-X| = \begin{bmatrix} 100 & 120 & 130 \\ 45 & 85 & 70 \\ 155 & 150 & 120 \end{bmatrix}$$

As expected, $Z_a + Z_b = Z_c$ element-wise: at every pixel exactly one of the two truncated subtractions is nonzero, and it equals the absolute difference.

```matlab
X = uint8([200 100 100; 0 10 50; 50 250 120]);
Y = uint8([100 220 230; 45 95 120; 205 100 0]);
Za = imsubtract(X,Y);
Zb = imsubtract(Y,X);
Zc = imabsdiff(Y,X);
```

Image subtraction can also produce the **negative** of an image:

$$g = -f + L_{max}$$

where $L_{max}$ is the maximum representable intensity, $f$ is the input pixel, and $g$ is the output pixel — exactly what `imcomplement` computes.

### 5.1.3 Multiplication and Division

Multiplying or dividing every pixel by a scalar is a common way of adjusting brightness — a process called **multiplicative image scaling** (or *dynamic scaling*). If the scalar factor is greater than 1, the image gets brighter; if it is between 0 and 1, the image gets darker. Multiplicative scaling tends to produce subjectively better-looking results than additive offset, because it preserves *relative* contrast (dark regions stay proportionally dark) rather than shifting every pixel by the same fixed amount.

**In MATLAB**: `immultiply` multiplies two images (or an image by a constant); `imdivide` divides one image by another (or by a constant).

### 5.1.4 Combining Several Arithmetic Operations

Chaining several arithmetic operations compounds the overflow/underflow problems discussed above — each intermediate step may need its own truncation/rounding logic. The IPT provides `imlincomb` to compute a **linear combination** of two or more images in one call. Internally, `imlincomb` performs every computation in double-precision floating point and only truncates/rounds at the very end, when converting the final result back to an integer class. This produces more accurate results than manually chaining `imadd`/`imdivide` calls, each of which truncates its own intermediate output.

**Example 5.3.** Average the three $3\times3$, 8-bit images $X$, $Y$ (as before) and

$$Z = \begin{bmatrix} 200 & 160 & 130 \\ 145 & 195 & 120 \\ 105 & 240 & 150 \end{bmatrix}$$

**(a) Naively chaining `imadd`/`imdivide`** (each `imadd` truncates to `uint8` before the next step): the pairwise sum $Y+Z$ already saturates at 255 in five of the nine cells, and adding $X$ on top saturates the rest, so the pre-division sum is

$$\begin{bmatrix} 255 & 255 & 255 \\ 190 & 255 & 255 \\ 255 & 255 & 255 \end{bmatrix} \; \xrightarrow{\div 3} \;
S_a = \begin{bmatrix} 85 & 85 & 85 \\ 63 & 85 & 85 \\ 85 & 85 & 85 \end{bmatrix}$$

This is clearly wrong — nearly the entire result collapses to 85 because of repeated 8-bit truncation.

**(b) Widening to `uint16` before dividing** avoids the intermediate truncation: $X+Y+Z$ computed in `uint16` gives, after dividing by 3 and rounding,

$$S_b \approx \begin{bmatrix} 167 & 160 & 153 \\ 63 & 100 & 97 \\ 120 & 197 & 90 \end{bmatrix}$$

**(c) `imlincomb(1/3, X, 1/3, Y, 1/3, Z, 'uint8')`** produces the same correct result as (b), but far more concisely — it is the recommended way of combining images arithmetically in MATLAB.

```matlab
X = uint8([200 100 100; 0 10 50; 50 250 120]);
Y = uint8([100 220 230; 45 95 120; 205 100 0]);
Z = uint8([200 160 130; 145 195 120; 105 240 150]);

% (a) naive — wrong, due to intermediate truncation
Sa = imdivide(imadd(X,imadd(Y,Z)),3);

% (b) correct — widen to avoid overflow before dividing
a  = uint16(X) + uint16(Y);
b  = a + uint16(Z);
Sb = uint8(b/3);

% (c) correct and concise
Sc = imlincomb(1/3,X,1/3,Y,1/3,Z,'uint8');
```

---

## 5.2 Logic Operations: Fundamentals and Applications

Logic operations act **bit-wise** on the binary representation of each pixel value. `AND`, `OR`, and `XOR` take two (or more) operands; `NOT` takes a single operand. Applied to a **binary image** (using the convention 1 = white/true, 0 = black/false), these operators behave exactly like Boolean logic on the image's shape:

| Operation | Typical effect on binary images |
|---|---|
| **AND** | keeps only the region where both images are white — used to *mask* an image, isolating a region of interest (ROI) |
| **OR** | keeps the region where either image is white — used to *merge* two binary shapes |
| **XOR** | keeps the region where the two images disagree — used to find *differences* between two (binary or grayscale) images |
| **NOT** | inverts white ↔ black — the *complement* of a mask |

Because these operators work bit-by-bit, the two operand images must have the same dimensions and the same number of bits per pixel. Applied to grayscale images, the same bit-wise logic operates independently on every bit plane, which is exactly how they are used to mask a grayscale/color image with a binary ROI mask.

**In MATLAB**: `bitand`, `bitor`, `bitxor` perform the corresponding bit-wise logic on arrays, and `bitcmp` complements (NOT) an array. `imcomplement` performs the same complement operation but additionally accepts binary, grayscale, or RGB images directly (whereas `bitcmp` requires an array of unsigned integers).

---

## 5.3 Tutorial: Arithmetic Operations

**Goal.** Practice `imadd`, `imsubtract`, `immultiply`, and `imdivide` on real images.

**Brightening with `imadd`.** Adding a constant brightens an image; because of truncation, any pixel already near 255 clips, so the number of saturated (255-valued) pixels grows after the operation:

```matlab
I  = imread('tire.tif');
I2 = imadd(I,75);
subplot(1,2,1), imshow(I),  title('Original Image');
subplot(1,2,2), imshow(I2), title('Brighter Image');
```

**Blending with `imadd`.** Adding two unrelated images together blends their content:

```matlab
Ia = imread('rice.png');
Ib = imread('cameraman.tif');
Ic = imadd(Ia,Ib);
imshow(Ic);
```

**Detecting differences with `imsubtract`/`imabsdiff`.** Given an original image and an altered version of it, plain subtraction (`imsubtract`) truncates negative results to zero, which can hide part of the difference (only pixels that got *darker* survive). The absolute difference (`imabsdiff`) captures the change regardless of its sign, and scaling the result for display (`imshow(diffim, [])`) stretches the (often faint) difference across the full gray range so it becomes visible:

```matlab
I = imread('cameraman.tif');
J = imread('cameraman2.tif');
diffim  = imsubtract(I,J);
diffim2 = imabsdiff(I,J);
subplot(2,2,1), imshow(diffim),      title('Subtracted Image');
subplot(2,2,2), imshow(diffim2),     title('Abs Diff Image');
subplot(2,2,3), imshow(diffim, []),  title('Subtracted Image Scaled');
```

**Dynamic scaling with `immultiply`.** Multiplying by a factor > 1 brightens an image while preserving relative contrast — dark pixels stay proportionally dark, unlike additive offset which shifts everything by the same amount and can wash out shadow detail:

```matlab
I  = imread('moon.tif');
I2 = imadd(I,50);        % normal (additive) brightening
I3 = immultiply(I,1.2);  % dynamic (multiplicative) scaling
```

Multiplication is also the basis for simple **3D-look special effects**: multiplying a flat image by a synthetic gradient image creates the illusion of shading/texture (e.g. turning a flat planet texture into a shaded sphere):

```matlab
I = im2double(imread('earth1.tif'));   % planet texture
J = im2double(imread('earth2.tif'));   % shading gradient
K = immultiply(I,J);                   % shaded "3D" result
```

**Dynamic darkening with `imdivide`**, and its equivalence to multiplying by the reciprocal:

```matlab
I  = imread('moon.tif');
I2 = imdivide(I,2);      % darken
I3 = immultiply(I,0.5);  % identical result via multiplication
```

**Background removal with `imdivide`.** If a scanned document has an uneven, non-uniform background, a single global threshold (`graythresh` + `im2bw`) fails to segment the text cleanly. If a *background-only* reference image is available (e.g. a blank page scanned under the same lighting), dividing the text image by that background flattens the illumination and lets the text stand out uniformly:

```matlab
notext = imread('gradient.tif');
text   = imread('gradient_with_text.tif');
fixed  = imdivide(text, notext);
imshow(fixed, []);
```

---

## 5.4 Tutorial: Logic Operations and Region-of-Interest Processing

**Goal.** Use logic operators together with a binary mask to restrict processing to a region of interest (ROI).

The workflow is: (1) build a binary mask for the ROI with `roipoly` (an interactive polygon-selection tool), (2) convert the mask to the same bit-depth as the target image, and (3) combine the mask with `bitand`/`bitor`/`bitcmp` to selectively apply an operation only inside (or outside) the ROI.

```matlab
I  = imread('pout.tif');
bw = roipoly(I);        % interactive polygon -> logical mask
bw2 = uint8(bw);         % match I's bit depth (1 -> 255 needed? see note below)

I2 = bitand(I, bw2);     % keep only the ROI, zero out everything else
```

To combine the ROI-processed region with the *original* content outside the ROI (rather than blacking it out), the complemented mask is needed:

```matlab
bw_cmp = bitcmp(bw2);            % complement of the mask
I3     = bitor(I, bw_cmp);       % everywhere outside the ROI stays as I,
                                  % ROI itself becomes saturated white
```

`XOR` is the natural operator for spotting differences between two images at the bit level (a generalization of the abs-diff technique from §5.3 that also works well on binary content):

```matlab
I     = imread('cameraman.tif');
I2    = imread('cameraman2.tif');
I_xor = bitxor(I, I2);
```

**Putting it all together — darkening only inside an ROI.** This combines every operator covered in this section: divide to precompute a darker version of the whole image, then use the mask and its complement with `bitor`/`bitand` to stitch the darker version inside the ROI together with the original outside it:

```matlab
I     = imread('lindsay.tif');
I_adj = imdivide(I, 1.5);              % darker version of the whole image

bw     = im2uint8(roipoly(I));         % ROI mask
bw_cmp = bitcmp(bw);                   % mask complement

roi     = bitor(I_adj, bw_cmp);        % darker image, valid only inside ROI
not_roi = bitor(I, bw);                % original image, valid only outside ROI
new_img = bitand(roi, not_roi);        % combine: dark inside ROI, original outside
imshow(new_img);
```

The trick generalizes: `bitor(A, complement_of_mask)` "punches through" `A` only where the mask is set (elsewhere it saturates to white), so ANDing two such punched-through images — one built from the "inside" content and one from the "outside" content — reassembles a single composite image.

---

## What have we learned? — Arithmetic and Logic Operations

- **Arithmetic operations** blend two images (addition), detect differences between two images or video frames (subtraction), and adjust average brightness (multiplication/division by a constant), among other uses.
- Whenever performing arithmetic on images, pay close attention to the **data types involved, their representable ranges, and how overflow/underflow are handled** (normalization vs. truncation, absolute difference vs. signed subtraction).
- MATLAB's IPT provides `imadd`, `imsubtract`/`imabsdiff`, `immultiply`, `imdivide`, and `imlincomb` (which chains several arithmetic operations without manual overflow/underflow handling at each step).
- **Logic operations** work bit-by-bit and are commonly used to mask out a region of interest for further, localized processing.
- MATLAB's IPT provides `bitand` (AND), `bitor` (OR), `bitcmp` (NOT), and `bitxor` (XOR) for bit-wise logic on digital images.

---

## 5.5 Introduction to Geometric Operations

Unlike the arithmetic/logic operations above — which change *pixel values* while leaving pixel positions untouched — **geometric operations** modify the geometry of an image by **repositioning pixels** in a constrained way. They alter the spatial relationships between groups of pixels that make up features or objects, rather than the intensities themselves.

Typical applications of geometric operations:

- **Correcting geometric distortions** introduced during image acquisition (e.g. barrel/fish-eye distortion from a wide-angle lens).
- **Creating special effects**, such as twirling, bulging, or squeezing a region of an image (e.g. a face).
- **Image registration** — matching the common features of two or more images of the same scene, acquired from different viewpoints, at different times, or with different equipment.

Most geometric operations combine two components:

1. **A mapping function** — a set of spatial transformation equations (plus a procedure to solve them) that says where each pixel should move to.
2. **An interpolation method** — used to compute the value of each pixel in the transformed image, since the mapping rarely lands exactly on integer pixel coordinates.

---

## 5.6 Mapping and Affine Transformations

A geometric operation transforms an input image $f(x,y)$ into an output image $g(x', y')$ by relocating pixel coordinates:

$$f(x, y) \rightarrow g(x', y')$$

i.e. the value originally at $(x,y)$ moves to $(x', y')$ in the output. This relocation is described by a **mapping function**:

$$(x', y') = T(x, y)$$

The mapping function is a general 2D function, usually split into two component functions, one per axis:

$$x' = T_x(x, y), \qquad y' = T_y(x, y)$$

$T_x$ and $T_y$ are typically expressed as polynomials in $x$ and $y$. The special case where both are **linear combinations** of $x$ and $y$ is called an **affine transformation**:

$$x' = a_0 x + a_1 y + a_2, \qquad y' = b_0 x + b_1 y + b_2$$

which can be written compactly in homogeneous matrix form:

$$
\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} =
\begin{bmatrix} a_0 & a_1 & a_2 \\ b_0 & b_1 & b_2 \\ 0 & 0 & 1 \end{bmatrix}
\begin{bmatrix} x \\ y \\ 1 \end{bmatrix}
$$

A key property of affine transformations is that they preserve **straight lines and parallelism**: straight lines remain straight, and parallel lines remain parallel after the transform. Translation, scaling, rotation, and shearing are all special cases, obtained by choosing different values for $(a_0, a_1, a_2, b_0, b_1, b_2)$:

| Transform | $a_0$ | $a_1$ | $a_2$ | $b_0$ | $b_1$ | $b_2$ |
|---|---|---|---|---|---|---|
| Translation by $(\Delta x, \Delta y)$ | 1 | 0 | $\Delta x$ | 0 | 1 | $\Delta y$ |
| Scaling by $(s_x, s_y)$ | $s_x$ | 0 | 0 | 0 | $s_y$ | 0 |
| Rotation by $\theta$ (CCW) | $\cos\theta$ | $-\sin\theta$ | 0 | $\sin\theta$ | $\cos\theta$ | 0 |
| Shearing by $(sh_x, sh_y)$ | 1 | $sh_x$ | 0 | $sh_y$ | 1 | 0 |

**In MATLAB**, the (legacy) IPT workflow for affine transforms uses two functions together: `maketform` defines the desired 2D spatial transformation and packages it into a `TFORM` structure (it also supports projective and custom transformations, not just affine); `imtransform` then applies a `TFORM` to an input image. (Newer MATLAB releases replace this pair with `affine2d`/`affine3d` objects and `imwarp`, which are functionally equivalent but have a cleaner API — the underlying math is the same.)

> **Note on MATLAB's matrix convention.** MATLAB's `maketform('affine', T)` expects points to be treated as *row* vectors multiplied on the *right*: $[x'\ y'\ 1] = [x\ y\ 1] \cdot T$. This is the **transpose** of the column-vector convention used in the formulas above, which is why the MATLAB code snippets below build the matrix in "textbook" form and then append a trailing `'` (transpose) before passing it to `maketform`.

**Example 5.4.** Build the affine transformation matrix for each of the following operations, then apply it in MATLAB with `maketform`/`imtransform`: (a) rotation by 30°, (b) scaling by a factor of 3.5 in both dimensions, (c) translation by $[25, 15]$ pixels, (d) shearing by a factor $[2, 3]$.

$$R(30^\circ) = \begin{bmatrix} \cos 30^\circ & -\sin 30^\circ & 0 \\ \sin 30^\circ & \cos 30^\circ & 0 \\ 0 & 0 & 1 \end{bmatrix} \approx \begin{bmatrix} 0.866 & -0.500 & 0 \\ 0.500 & 0.866 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \qquad
S(3.5) = \begin{bmatrix} 3.5 & 0 & 0 \\ 0 & 3.5 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

$$T(25,15) = \begin{bmatrix} 1 & 0 & 25 \\ 0 & 1 & 15 \\ 0 & 0 & 1 \end{bmatrix}, \qquad
Sh(2,3) = \begin{bmatrix} 1 & 2 & 0 \\ 3 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

```matlab
filename = 'any image of your choice';
I = imread(filename);

% Rotation (30 deg)
Ta = maketform('affine', [cosd(30) -sind(30) 0; sind(30) cosd(30) 0; 0 0 1]');
Ia = imtransform(I, Ta);

% Scaling (factor 3.5)
Tb = maketform('affine', [3.5 0 0; 0 3.5 0; 0 0 1]');
Ib = imtransform(I, Tb);

% Translation ([25, 15]) -- 'FillValues' sets the color of newly exposed
% background pixels, and 'XData'/'YData' extend the output canvas so the
% translated content is not clipped
xform = [1 0 25; 0 1 15; 0 0 1]';
Tc = maketform('affine', xform);
Ic = imtransform(I, Tc, 'XData', [1 (size(I,2)+xform(3,1))], ...
                        'YData', [1 (size(I,1)+xform(3,2))], ...
                        'FillValues', 128);

% Shearing (factor [2, 3])
Td = maketform('affine', [1 3 0; 2 1 0; 0 0 1]');
Id = imtransform(I, Td);
```

---

## 5.7 Interpolation Methods

### The Need for Interpolation

After the mapping function has been defined, there are two ways to actually compute the resulting pixel values:

- **Forward mapping** (source-to-target mapping): iterate over every pixel of the *input* image, compute its new coordinates $(x', y')$ under $T$, and copy the pixel's value to that location in the output.
- **Backward mapping** (target-to-source mapping): iterate over every pixel of the *output* image, apply the **inverse** transform $T^{-1}$ to find where in the input image that value should be sampled from.

Forward mapping has several practical problems:

- The computed $(x', y')$ are rarely integers and must be rounded to index an output pixel, introducing error.
- Some computed coordinates fall out of bounds (e.g. negative values, or beyond the image edges).
- Several input pixels can map to the *same* output coordinate (wasteful, and only the last one written "wins"), while other output coordinates are never written to at all, leaving **holes** in the result.

Backward mapping avoids the holes/collisions problem by construction — every output pixel is visited exactly once — but because $T^{-1}(x', y')$ generally lands on a non-integer coordinate in the input image, it requires **interpolation** to estimate a value from the surrounding input pixels. This is the standard approach used by all of MATLAB's geometric-transform functions.

### 5.7.1 A Simple Approach to Interpolation

A naive way to enlarge or shrink an image by an integer factor $n$ is:

- **Shrinking**: subsample the image by skipping every other pixel along rows and columns (e.g. keeping every 2nd pixel to shrink by a factor of 2).
- **Enlarging**: replicate each input pixel into an $n \times n$ block of identical output pixels.

These schemes (pixel removal / pixel duplication) are fast and trivial to implement, but have real limitations:

- Enlarging produces a visible **"blockiness"** effect.
- Shrinking risks discarding essential information (aliasing).
- Both are hard to generalize to **arbitrary, non-integer** resize factors.
- Slightly more sophisticated variants — e.g. using the mean or median of each input $n\times n$ block for shrinking — improve things somewhat but still produce low-quality results in many cases.

These limitations motivate the standard interpolation methods below, in increasing order of quality (and computational cost).

### 5.7.2 Zero-Order (Nearest-Neighbor) Interpolation

The simplest real interpolation scheme: round the computed coordinates $(x', y')$ off to their nearest integer, and use the value of that single input pixel. It is fast and simple, but produces visible artifacts — blockiness (more pronounced at large scale factors) and jagged/staircased straight lines, particularly after rotating by an angle that is not a multiple of 90°.

### 5.7.3 First-Order (Bilinear) Interpolation

Bilinear interpolation computes the output value at $(x', y')$ as a **weighted combination of the four input pixels surrounding it**, with weights inversely proportional to distance. It produces visibly smoother, higher-quality results than nearest-neighbor, at the cost of additional computation.

### 5.7.4 Higher-Order Interpolations

Higher-order schemes are more sophisticated — and more computationally expensive — ways to estimate the interpolated value. The most common one, used across several MATLAB functions, is **third-order (bicubic) interpolation**: it looks at the $4\times4$ neighborhood around the reference pixel and computes the output value by convolving that neighborhood with a cubic kernel.

Comparing all three on a $35°$ image rotation: the jagged-edge effect of nearest-neighbor interpolation is clearly visible, while there is little perceptible difference between the bilinear and bicubic results — bicubic mainly pays off at larger scale factors or when the image will be inspected closely.

| Method | Neighborhood used | Quality | Cost |
|---|---|---|---|
| Zero-order (nearest-neighbor) | 1 pixel | low — blocky, jagged edges | lowest |
| First-order (bilinear) | 4 pixels ($2\times2$) | good | moderate |
| Third-order (bicubic) | 16 pixels ($4\times4$) | best | highest |

---

## 5.8 Geometric Operations Using MATLAB

This section summarizes the everyday geometric operations available through the IPT. One useful distinction: **true resizing** changes the image's actual pixel dimensions and is typically done non-interactively as part of a script, with the result saved for later use; **zooming/shrinking for viewing** temporarily changes the on-screen size for human inspection (e.g. via `imshow`/`imtool`) without altering the underlying pixel data, and the effect only lasts for that viewing session. Both rely on the same underlying resampling/interpolation machinery.

### 5.8.1 Translation

Translating $f(x,y)$ with respect to the coordinate origin, so that every pixel is displaced by $[\Delta x, \Delta y]$ (i.e. $x' = x + \Delta x$, $y' = y + \Delta y$), is a special case of the affine transform (row "Translation" in the table of §5.6).

### 5.8.2 Rotation

Rotation is likewise a special case of the affine transform, and so can be performed via `maketform`/`imtransform`. The IPT also has a dedicated function, `imrotate`, which additionally lets the user choose the interpolation method — nearest-neighbor (the default), bilinear, or bicubic — and control the size of the output image (whether the canvas grows to fit the full rotated content, or is cropped back to the original size).

### 5.8.3 Cropping

`imcrop` crops an image to a specified rectangle, either interactively (dragging with the mouse) or by passing the rectangle's coordinates as a parameter — `[xmin ymin width height]`.

### 5.8.4 Flipping

`flipud` flips a matrix (or image) top-to-bottom; `fliplr` flips it left-to-right. Both are simple index-reversal operations, requiring no interpolation at all.

---

## 5.9 Other Geometric Operations and Applications

Beyond the basic affine operations, several more advanced geometric techniques build on the same mapping-plus-interpolation foundation:

- **Warping** — a general term for changing an image's geometry according to an arbitrary spatial template or control-point mapping, rather than a single global affine matrix. Warps can be piecewise (different regions transformed differently) and are the basis for correcting complex, non-uniform distortions.
- **Nonlinear image transformations (twirling, rippling)** — special-effect mappings where $T$ is a nonlinear function of position (e.g. rotation amount that increases with distance from a center point for a "twirl," or a sinusoidal displacement for a "ripple"). These are popular for artistic/creative effects rather than correction.
- **Morphing** — an incremental geometric (and often simultaneous cross-fade) transformation that gradually turns one image into another, by interpolating both the *positions* of matching control points and the *pixel values* over a sequence of intermediate frames. It was widely used in film, TV, and advertising in the 1980s–1990s, and has lost some of its novelty impact since then, though the underlying technique is still used.
- **Seam carving** — a content-aware resizing technique that repeatedly removes (or duplicates) low-energy "seams" — connected paths of pixels running top-to-bottom or left-to-right — instead of uniformly scaling every pixel. This lets an image be resized while preserving the proportions of visually important content and discarding low-interest background.
- **Image registration** — the process of geometrically aligning two (or more) images of the same scene so that corresponding features overlap. It typically involves selecting matching control points between a "base" and an "unregistered" image, fitting a transformation (e.g. affine or similarity) from one point set to the other, and resampling the unregistered image into the base image's coordinate frame. Registration is essential whenever images of the same scene are captured from different viewpoints, at different times, or with different sensors, and they must be compared or fused pixel-by-pixel.

---

## 5.10 Tutorial: Image Cropping, Resizing, Flipping, and Rotation

**Goal.** Practice `imcrop`, `imresize`, `flipud`/`fliplr`, and `imrotate`, and compare interpolation methods.

**Cropping** can be done interactively via `imtool`'s Crop Image tool, or programmatically once the target rectangle's corner coordinates are known. `imcrop` expects `[xmin ymin width height]`:

```matlab
I = imread('nature.jpg');
x1 = 186; x2 = 211; y1 = 105; y2 = 159;   % recorded from imtool
xmin = x1; ymin = y1; width = x2-x1; height = y2-y1;
I3 = imcrop(I, [xmin ymin width height]);
```

**Enlarging** with `imresize` defaults to bicubic interpolation; nearest-neighbor and bilinear can be selected explicitly. Comparing the three visually shows progressively smoother edges from nearest-neighbor to bilinear to bicubic:

```matlab
I_big1 = imresize(I, 3);              % default: bicubic
I_big2 = imresize(I, 3, 'nearest');
I_big3 = imresize(I, 3, 'bilinear');
```

**Shrinking** can be done crudely by deleting rows/columns (equivalent to the "simple approach" of §5.7.1, and subject to the same limitations — no anti-aliasing, aliasing artifacts on fine detail), or properly via `imresize` with a scale factor below 1:

```matlab
I_rows = size(I,1); I_cols = size(I,2);
I_sm1 = I(1:2:I_rows, 1:2:I_cols);      % naive pixel-removal shrink

I_sm2 = imresize(I, 0.5, 'nearest');
I_sm3 = imresize(I, 0.5, 'bilinear');
I_sm4 = imresize(I, 0.5, 'bicubic');
```

When shrinking with bilinear or bicubic interpolation, `imresize` automatically applies a low-pass filter (default size $11\times11$) before resampling, to reduce aliasing artifacts — the same anti-aliasing consideration that governs sampling theory more generally.

**Flipping**:

```matlab
I = imread('nature.jpg');
J = flipud(I);   % upside-down
K = fliplr(I);   % left-right
```

**Rotation** with `imrotate`, comparing interpolation methods and the effect of the `'crop'` option (which keeps the output canvas the same size as the input, discarding the corners that would otherwise extend the canvas):

```matlab
I      = imread('eight.tif');
I_rot  = imrotate(I, 35);                     % default: nearest-neighbor
I_rot2 = imrotate(I, 35, 'bilinear');          % smoother edges
I_rot3 = imrotate(I, 35, 'bilinear', 'crop');  % output stays original size
```

Because rotating a rectangular image by a non-multiple-of-90° angle changes its bounding box, `I_rot`'s size differs from `I`'s unless `'crop'` is specified.

---

## 5.11 Tutorial: Spatial Transformations and Image Registration

**Goal.** Apply affine transforms directly via `maketform`/`imtransform`, compare them against the equivalent dedicated functions (`imresize`, `imrotate`), and perform a full image-registration workflow.

**Scaling via affine transform vs. `imresize`** — both should produce equivalent (though not necessarily bit-identical) results; the affine route additionally lets scaling be combined with other transforms in a single matrix:

```matlab
I1 = imread('nature.jpg');
sx = 2; sy = 2;
T  = maketform('affine', [sx 0 0; 0 sy 0; 0 0 1]');
I2 = imtransform(I1, T);
I3 = imresize(I1, 2);
```

**Rotation via affine transform vs. `imrotate`**:

```matlab
theta = 35*pi/180;
xform = [cos(theta) sin(theta) 0; -sin(theta) cos(theta) 0; 0 0 1]';
T  = maketform('affine', xform);
I4 = imtransform(I1, T);
I5 = imrotate(I1, 35);
```

**Translation with an explicit fill color**, using `'XData'`/`'YData'` to grow the output canvas so the shifted content is not clipped, and `'FillValues'` to color the newly exposed background:

```matlab
delta_x = 50; delta_y = 100;
xform = [1 0 delta_x; 0 1 delta_y; 0 0 1]';
tform_translate = maketform('affine', xform);
I6 = imtransform(I1, tform_translate, ...
        'XData', [1 (size(I1,2)+xform(3,1))], ...
        'YData', [1 (size(I1,1)+xform(3,2))], ...
        'FillValues', 128);
```

**Shearing**:

```matlab
sh_x = 2; sh_y = 1.5;
xform = [1 sh_y 0; sh_x 1 0; 0 0 1]';
T  = maketform('affine', xform);
I7 = imtransform(I1, T);
```

**Image registration workflow.** Given a `base` (reference) image and an `unregistered` image of the same scene:

1. **Select control points** interactively with `cpselect(unregistered, base)` — clicking matching landmarks in both images, at least a handful of well-distributed pairs (e.g. 10).
2. **Refine the points** with `cpcorr`, which nudges each input-image control point to better align with a small correlation-matched neighborhood around its base-image counterpart.
3. **Choose a transformation type** appropriate to the expected distortion — e.g. `'nonreflective similarity'` (translation + rotation + uniform scaling, requiring only 2 point pairs) if the misalignment is a simple rigid-body-plus-scale shift, or an `'affine'`/higher-order transform for more complex distortions.
4. **Fit the transform** with `cp2tform` from the matched point pairs, then **apply it** with `imtransform`, resampling the unregistered image into the base image's coordinate frame (matching `'XData'`/`'YData'` to the base image's dimensions).
5. **Overlay and inspect** the registered result on top of the base image (e.g. with partial transparency) to visually verify alignment quality.

```matlab
base         = imread('klcc_a.png');
unregistered = imread('klcc_b.png');

cpselect(unregistered, base);   % interactively pick matching points
                                 % -> input_points, base_points

input_points_adj = cpcorr(input_points, base_points, ...
                           unregistered(:,:,1), base(:,:,1));

mytform1 = cp2tform(input_points, base_points, 'nonreflective similarity');

info = imfinfo('klcc_a.png');
registered = imtransform(unregistered, mytform1, ...
                          'XData', [1 info.Width], 'YData', [1 info.Height]);

imshow(registered); hold on;
h = imshow(base);
set(h, 'AlphaData', 0.6);   % translucent overlay to check alignment
```

> **Note.** `maketform`/`imtransform`/`cp2tform` are the legacy IPT API used throughout this deck. Modern MATLAB releases provide the equivalent (and recommended) `affine2d`/`projective2d`/`fitgeotrans` + `imwarp` workflow, which is functionally the same but with a cleaner, more consistent interface.

---

## What have we learned? — Geometric Operations

- **Geometric operations** modify an image's geometry by repositioning pixels in a constrained way. They can remove distortions introduced during acquisition, or deliberately introduce a distortion to align one image with another (e.g. registration, morphing).
- Enlarging or reducing an image serves two different purposes: (1) **true resizing** — actually changing the pixel dimensions, done in MATLAB with `imresize`; (2) **zooming/shrinking for display** — temporarily changing the viewed size, handled by display primitives such as `imtool`/`imshow`.
- The three main interpolation methods used with geometric operations are **zero-order/nearest-neighbor** (fast, low quality), **first-order/bilinear** (better quality, more cost), and **higher-order/bicubic** (best quality, highest cost).
- **Affine transformations** are geometric operations that preserve straight lines and parallelism. Translation, rotation, scaling, and shearing are all special cases. MATLAB's IPT provides `maketform` and `imtransform` for general affine (and other) transforms.
- **Rotation** has a dedicated function, `imrotate`; **flipping** is achieved with simple matrix operations (`flipud`, `fliplr`); **cropping** uses `imcrop`, either interactively or by parameter.
- **Image warping** changes an image's geometry according to an arbitrary template; **image morphing** incrementally transforms one image into another (positions and values), a technique especially popular in film/TV/advertising in the 1980s–1990s.

