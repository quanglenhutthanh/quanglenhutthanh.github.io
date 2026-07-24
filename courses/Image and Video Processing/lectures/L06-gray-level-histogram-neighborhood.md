---
title: "Gray-Level Transformations, Histogram and Neighborhood Processing"
subject: "computer-vision"
type: lecture
lecture_no: 6
status: done
source: slide
tags: [gray-level-transformation, histogram-equalization, spatial-filtering, neighborhood-processing, matlab]
date: 2024-09-27
---

# Lecture 6 – Gray-Level Transformations, Histogram and Neighborhood Processing

> Core content: **point (gray-level) transformation functions** used for image enhancement — contrast manipulation, image negatives, power-law/gamma and logarithmic transforms, piecewise-linear transforms, and lookup tables (LUTs) for fast implementation — followed by **image histograms**: how they are defined, computed, and interpreted, and the two classic histogram-modification techniques, **histogram equalization** and **direct histogram specification (matching)**. Note on scope: although the lecture title and the syllabus outline also advertise *neighborhood processing* (correlation/convolution, low-pass/smoothing filters, median filtering, high-pass/sharpening filters), the slide deck as delivered stops right after direct histogram specification and hands off directly to "Lecture 7 – Image Restoration" — the neighborhood-processing material itself is not actually present in this deck and is deferred to a later lecture.

## 6.1 Introduction

Image enhancement techniques are generally applied with one of two goals in mind:

1. **Improving the subjective quality of an image for a human viewer** — for example, enhancing an X-ray image so that a radiologist can more easily judge whether a bone is fractured.
2. **Making an image more suitable for further automatic analysis** — for example, boosting the contrast between text characters and background before feeding a page image into an OCR pipeline.

These two goals can sometimes pull in different directions: a transformation that makes an image look better to a human eye is not necessarily the one that makes it easiest for a downstream algorithm to extract semantic content from, and vice versa.

Two important properties of image enhancement are worth internalizing early:

- It is typically **goal-specific and interactive** — practitioners try different techniques and algorithms, tuning parameters iteratively, until an acceptable result is reached, rather than applying a single "correct" universal procedure.
- It is often **subjective**, in the sense that the observer's specialized skill and domain knowledge matter. A radiology expert may notice meaningful quality differences between two X-ray images that a layperson would never detect.

This lecture focuses on **point operations**, whose shared goal is to enhance an input image. Some point operations are aimed squarely at the human viewer; others produce results that are more useful as an intermediate stage for a machine-vision pipeline.

## 6.2 Overview of Gray-Level (Point) Transformations

Point operations — also called **gray-level transformations** or **spatial transformations** — can be expressed generically as

$$g(x, y) = T[f(x, y)] \tag{6.1}$$

where $f(x,y)$ is the original image, $g(x,y)$ is the processed image, and $T$ is an operator applied to $f$. Because the actual pixel coordinates play no role in how the transformation processes the image, equation (6.1) is more commonly written in the simplified, coordinate-free form

$$s = T[r] \tag{6.2}$$

where $r$ is the original gray level of a pixel and $s$ is the resulting gray level after processing.

Point transformations can be classified as:

- **Linear** (e.g., the identity and negative transformations),
- **Piecewise linear** (e.g., contrast stretching, gray-level slicing), or
- **Nonlinear** (e.g., log, inverse-log, power-law/gamma, $n$-th root transforms).

A defining characteristic of point operations is that the new value at a location $(x_0, y_0)$ depends **only** on the original pixel value at that same location and on the mapping function $T$ — never on neighboring pixels. Consequently, the output image undergoes no change in size, geometry, or local spatial structure relative to the input; only pixel *intensities* are remapped.

Within this lecture, a **linear** point transformation is one describable by a single linear equation:

$$s = c \cdot r + b \tag{6.3}$$

where $r$ is the original pixel value, $s$ is the resulting pixel value, $c$ is a constant that controls the **contrast** of the output image, and $b$ is a constant that controls the output image's overall **brightness**. Graphically, plotting $s$ as a function of $r$ produces a straight line: its slope is set by $c$, and its $y$-intercept is set by $b$.

## 6.3 Examples of Point Transformations

This section walks through the most widely used point transformations in practice.

### 6.3.1 Contrast Manipulation

**Contrast manipulation** (also called contrast stretching, gray-level stretching, contrast adjustment, or amplitude scaling) is one of the most common uses of point transformation functions. These functions typically follow a **sigmoid-like curve**: pixel values below some midpoint $m$ ($f < m$) are compressed toward darker output values, while values above the midpoint ($f > m$) are pushed toward brighter output values. The steepness (slope) of the curve controls how dramatic the contrast change is. In the most extreme case, the sigmoid degenerates into a **binary thresholding function**: pixels with $f < m$ become black and pixels with $f > m$ become white.

A particularly useful special case is **automatic contrast adjustment (autocontrast)**. For `uint8` images in MATLAB, autocontrast maps the darkest pixel value in the input to 0 and the brightest pixel value to 255, linearly redistributing everything in between:

$$s = \frac{L-1}{r_{max} - r_{min}} \cdot (r - r_{min}) \tag{6.4}$$

where $r$ is a pixel value in $[0, 255]$, $r_{min}$ and $r_{max}$ are the darkest and brightest pixel values present in the image, $s$ is the resulting pixel value, and $L-1$ is the highest representable gray value (typically $L = 256$).

**In MATLAB:** the Image Processing Toolbox (IPT) provides `imadjust` for general contrast adjustments, including autocontrast. Interactive brightness/contrast adjustment is also available through `imcontrast`, which opens the "Adjust Contrast" GUI tool.

### 6.3.2 Negative

The **negative** transformation (also known as contrast reverse) inverts the gray scale of the image — it is a linear transformation of the form of equation (6.3) with $c = -1$ and $b = L-1$. It is typically used to make details easier to notice for the task at hand — dark regions become light and vice versa, which can reveal detail that is hard to see in the original.

**In MATLAB:** the built-in function `imcomplement` computes the negative of an image.

### 6.3.3 Power-Law (Gamma) Transformations

The **power-law** (or **gamma**) transformation is described by

$$s = c \cdot r^{\gamma} \tag{6.5}$$

where $r$ is the original pixel value, $s$ is the resulting pixel value, $c$ is a scaling constant, and $\gamma$ (gamma) is a positive exponent. Plotting equation (6.5) for several values of $\gamma$ produces a family of curves whose shape depends critically on whether $\gamma$ is above or below 1:

- When $\gamma < 1$, the output image is **brighter** than the input (dark tones are stretched, bright tones compressed).
- When $\gamma > 1$, the output image is **darker** than the input.

This asymmetric behavior is exactly what makes gamma correction useful for compensating the non-linear response of display devices and camera sensors.

**In MATLAB:** `imadjust` can also perform gamma correction, using the syntax `g = imadjust(f,[],[],gamma);`.

### 6.3.4 Log Transformations

The **log transformation** (and its inverse) are nonlinear transformations used respectively to compress or expand the dynamic range of pixel values in an image. The log transform is

$$s = c \cdot \log(1 + r) \tag{6.6}$$

where $r$ is the original pixel value, $s$ is the resulting pixel value, and $c$ is a scaling constant. Log transformations are especially valuable when the "image" is really a 2D array whose values lie well outside the usual $[0, 255]$ gray-level range — the classic case being the magnitude of a Fourier transform.

A worked example from the slides: the magnitude array of a Fourier transform has a range of $[0, 2.8591 \times 10^4]$. Displayed linearly on an 8-bit system, essentially nothing is visible except a single bright spot at the center, because virtually all the useful structure is squeezed into a tiny fraction of that huge range. Applying the log transform compresses the dynamic range down to $[0, 10.26]$. A subsequent autocontrast stretch (equation 6.4) linearly extends that compressed range back out to $[0, 255]$, revealing significant detail that was invisible before — a thin vertical line through the center and concentric circular structure in the spectrum.

### 6.3.5 Piecewise Linear Transformations

**Piecewise linear** transformations are described by several linear equations, each valid over a different interval of gray-level values in the input image. Their chief advantage is flexibility — because they can be arbitrarily complex, they can be tailored to almost any enhancement need. Their chief disadvantage is that this flexibility requires more user input (the breakpoints and slopes of each segment) than a single closed-form transform.

Two canonical examples appear in the slides:

- An **arbitrary piecewise-linear contrast transformation**, typically specified interactively via a GUI tool such as MATLAB's `glsdemo`, where the user drags breakpoints to shape the transformation curve.
- **Gray-level slicing**, a special case of piecewise linear transformation in which a specific range of intensities (the slides use $[100, 150]$ as an example) is highlighted in the output — e.g., boosted to a high value — while all other gray levels are left untouched. This is useful for emphasizing a particular feature (say, a specific tissue density range in a medical image) without disturbing the rest of the picture.

## 6.4 Specifying the Transformation Function: Lookup Tables (LUTs)

All the transformation functions discussed above have elegant mathematical descriptions appropriate for continuous or discrete input variables. In practice, however, that mathematical elegance is not always the most useful representation, for two reasons:

1. **User interaction**: it is often preferable to let the user specify the desired transformation function interactively with the mouse via a GUI application, rather than typing an equation.
2. **Computational efficiency**: point operations can be executed far faster using a **lookup table (LUT)**. For `uint8` images (256 gray levels), the LUT is simply a 1D array of length 256: instead of recomputing $T(r)$ for every pixel, the transformed value is fetched directly from `LUT[r]`.

A worked example builds a custom LUT that flattens a mid-range band of gray levels to a constant value while otherwise stretching and shifting the rest of the scale:

```matlab
% Build a custom 256-entry lookup table
LUT = uint8(zeros([1 256]));
LUT(1:65)   = 2*(0:64);       % gray levels 0..64  -> stretched to 0..128
LUT(66:129) = 128;            % gray levels 65..128 -> flattened to 128
LUT(130:256) = (130:256)-1;   % gray levels 129..255 -> shifted down by 1

% Test the LUT on a small 3x3 image
A = uint8([20 40 0; 178 198 64; 77 128 1]);
B = intlut(A, LUT);
```

Applying the same LUT to a real gray-level image shows how the flattened middle band ends up merging many distinct input gray levels into a single output value (128):

```matlab
I = imread('klcc_gray.png');
O = intlut(I, LUT);
figure, subplot(1,2,1), imshow(I), subplot(1,2,2), imshow(O)
```

## 6.5 Tutorial: Gray-Level Transformations

**Goal:** learn how to perform basic point transformations on grayscale images in MATLAB.

**Objectives:** explore linear transformations (identity, negative), logarithmic transformations, power-law (gamma) transformations, and gray-level (intensity) slicing.

### Identity transformation

The most basic transformation simply maps every pixel value to itself:

```matlab
x = uint8(0:255);
plot(x); xlim([0 255]); ylim([0 255]);

I = imread('moon.tif');
I_adj = x(I + 1);
figure, subplot(1,2,1), imshow(I), title('Original Image');
subplot(1,2,2), imshow(I_adj), title('Adjusted Image');
```

Note the `I + 1` offset: MATLAB arrays are 1-indexed, while pixel gray levels range from 0 to 255, so a pixel value of 0 must index into `x(1)` — the offset is what makes `x` behave as a genuine lookup table for gray level `r = 0..255`.

### Negative transformation

The negative transformation function generates the negative of an image:

```matlab
y = uint8(255:-1:0);
I_neg = y(I + 1);
figure, subplot(1,3,1), plot(y), title('Transformation Function'), xlim([0 255]), ylim([0 255]);
subplot(1,3,2), imshow(I), title('Original Image');
subplot(1,3,3), imshow(I_neg), title('Negative Image');
```

A negative transformation produces the same result as logically complementing the image, which can be verified directly:

```matlab
I_cmp = imcomplement(I);
I_dif = imabsdiff(I_cmp, I_neg);
figure, imshow(I_cmp);
figure, imshow(I_dif, []);   % should be (near) all-black: I_cmp == I_neg
```

### Logarithmic transformation

The log transform (equation 6.6) is used to compress the dynamic range and reveal features that are otherwise buried:

```matlab
x = 0:255; c = 255 / log(256);
y = c * log(x + 1);
figure, subplot(2,2,1), plot(y), title('Log Mapping Function'), axis tight, axis square

I = imread('radio.tif');
I_log = uint8(y(I + 1));
subplot(2,2,2), imshow(I), title('Original Image');
subplot(2,2,3), imshow(I_log), title('Adjusted Image');
```

`I_log` must be explicitly cast back to `uint8` since `imshow` only treats a matrix in the $[0,255]$ range as an image if it is of class `uint8`. Simply brightening the original image with a constant offset does **not** reveal the same hidden detail:

```matlab
I_br = imadd(I, 100);
subplot(2,2,4), imshow(I_br), title('Original Image Scaled');
```

The reason is that the log transform compresses/expands the dynamic range **non-uniformly** (it boosts dark tones proportionally more than bright ones), whereas a constant additive brightening shifts every gray level by the same amount and does not change the relative distribution of detail.

The inverse-log transform, $y(x) = e^{x/c} - 1$, undoes the log mapping:

```matlab
z = exp(x/c) - 1;
I_invlog = uint8(z(I_log + 1));
figure, subplot(2,1,1), plot(z), title('Inverse-log Mapping Function');
subplot(2,1,2), imshow(I_invlog), title('Adjusted Image');
```

### Power-law ($n$-th root / $n$-th power) transformation

Power-law transformations are more versatile than the log transform because the exponent $n$ can be tuned to reshape the curve as needed. An $n$-th root mapping brightens the image (analogous to $\gamma < 1$):

```matlab
x = 0:255; n = 2; c = 255/(255^n);
root = nthroot((x/c), n);
figure, subplot(2,2,1), plot(root), title('2nd-root transformation'), axis tight, axis square

I = imread('drill.tif');
I_root = uint8(root(I + 1));
subplot(2,2,2), imshow(I), title('Original Image');
subplot(2,2,[3 4]), imshow(I_root), title('Nth Root Image');
```

The $n$-th power transformation is the inverse of the $n$-th root and can be used to undo it (up to rounding error):

```matlab
power = c*(x.^n);
figure, subplot(1,2,1), plot(power), title('2nd-power transformation'); axis tight, axis square

I_power = uint8(power(I_root + 1));
subplot(1,2,2), imshow(I_power), title('Adjusted Image');
```

### Piecewise linear transformation and gray-level slicing

Gray-level slicing lets a specific range of the gray scale be enhanced for further analysis while everything else is left as-is (or suppressed):

```matlab
I = imread('micro.tif');
figure, subplot(1,3,1), imshow(I), title('Original Image');

% Transformation function: flatten the [175, 200] band to white (255)
y(1:175)   = 0:174;
y(176:200) = 255;
y(201:256) = 200:255;
subplot(1,3,2), plot(y), axis tight, axis square

I2 = uint8(y(I + 1));
subplot(1,3,3), imshow(I2), title('Adjusted Image');
```

A second variant highlights only the target band and suppresses everything else to a low/mid value:

```matlab
z(1:175)   = 50;
z(176:200) = 250;
z(201:256) = 50;
I3 = uint8(z(I + 1));
figure, subplot(1,2,1), plot(z), xlim([0 255]), ylim([0 255]), axis square
subplot(1,2,2), imshow(I3)
```

Defining a transformation function vector by hand, one segment at a time, is tedious. MATLAB's `glsdemo` GUI tool lets the user define the same kind of piecewise-linear function interactively (with the mouse) and apply it directly to an image such as `micro.tif`.

### Self-check questions from the tutorial

| # | Question |
|---|---|
| Q1 | Why is `I + 1` required when indexing the LUT, instead of just `I`? |
| Q2 | How can we show the adjusted (identity-transformed) image and the original image are equivalent? |
| Q3 | How was the negative transformation function created? |
| Q4 | Why does the log-transformed image reveal hidden detail while the brightened image does not? |
| Q5 | How does the shape of the root/power curve change for different values of $n$? |
| Q6 | How can we show that `I_power` and the original image `I` are (almost) identical? |
| Q7 | What visual effect do we expect from the gray-level-slicing transformation before running it? |

## 6.6 Image Histogram: Definition and Example

The **histogram** of a monochrome image is a graphical representation of how often each gray level occurs in the image. It is stored as a 1D array $h$ whose entries record the number (or percentage) of pixels at each possible gray level. Formally,

$$h(k) = n_k = \text{card}\{(x,y) \mid f(x,y) = k\} \tag{6.7}$$

for $k = 0, 1, \dots, L-1$, where $L$ is the number of gray levels and $\text{card}\{\cdot\}$ denotes set cardinality (i.e., $n_k$ is simply the pixel count at level $k$). The **normalized histogram** expresses these counts as probabilities:

$$p(r_k) = \frac{n_k}{n} \tag{6.8}$$

where $n$ is the total number of pixels in the image. Histograms are conventionally drawn as bar charts, one bar per gray level, with bar height proportional to $n_k$ (or $p(r_k)$).

**In MATLAB:** the built-in `imhist` computes and displays the histogram of a monochrome image; generic plotting functions such as `bar`, `plot`, and `stem` can also be used.

**Worked example.** The slides work through a hypothetical $128 \times 128$ image quantized to only eight gray levels ($k = 0, \dots, 7$), whose per-level pixel counts $n_k$ and probabilities $p(r_k)$ are tabulated (the deck calls this "Table 9.1"). Because $\sum_k p(r_k) = 1$ by construction, a histogram is, mathematically, nothing more than an (empirical) **probability mass function** of the random variable "gray level of a randomly chosen pixel," and it obeys the ordinary axioms of probability theory. One concrete data point quoted in the slides: 3214 of the 16384 pixels have gray level $r_1 = 1$, i.e. $p(r_1) = 3214/16384 \approx 0.196$. This same eight-level histogram is reused as the running example for histogram equalization (§6.9) and histogram specification (§6.10) below.

## 6.7 Computing Image Histograms

To compute the histogram of an 8-bit (256-gray-level) monochrome image, allocate a 256-element counter array initialized to zero, scan the image pixel by pixel, and increment the counter at the index matching each pixel's gray level. Once the whole image has been scanned, each array element holds the pixel count for that gray level; dividing by the total pixel count normalizes the histogram into probabilities.

For images with **more than 8 bits per pixel**, mapping every possible gray level $k$ ($0 \le k \le K$) to its own array element is impractical — the array would be far too large. Instead, **binning** is used: an array of $B$ elements ($B \le K$) is created, where each bin $h(j)$ counts pixels whose value falls in the half-open interval $[r_j, r_{j+1})$:

$$h(j) = \text{card}\{(x,y) \mid r_j \le f(x,y) < r_{j+1}\}, \quad 0 \le j < B \tag{6.8'}$$

The lower limit of bin $j$ is given by

$$r_j = j \cdot \frac{K}{B} = j \cdot k_B \tag{6.9}$$

where $k_B$ is the length (width) of each bin's interval.

## 6.8 Interpreting Image Histograms

Histograms provide a fast, practical way to assess an image's overall **contrast** and **brightness** at a glance:

- A predominantly **dark** image concentrates its histogram mass on the lower end of the gray-level range.
- A predominantly **bright** image concentrates its mass on the upper end.
- A **low-contrast** image has a histogram clustered tightly within a narrow band of gray levels (e.g., mostly within $[100, 150]$).
- A **high-contrast** image typically exhibits a **bimodal** histogram, with two well-separated peaks — a more pronounced one for the dark background and a smaller one for the bright foreground (or vice versa).

This diagnostic value is why many digital cameras offer a real-time histogram overlay in the viewfinder: it lets the photographer catch under- or over-exposed shots before taking them, without needing to interpret the raw image visually. Beyond diagnostics, histograms are also the raw material for a family of **histogram modification (modeling)** techniques used to enhance or reshape an image's contrast: **histogram equalization**, **histogram specification (matching)**, **histogram stretching** (input cropping), and **histogram shrinking** (output cropping). The next two sections cover the first two of these in depth.

## 6.9 Histogram Equalization

**Histogram equalization** reshapes the gray-level distribution of an image so that the resulting histogram is as close to **uniform (flat)** as possible — ideally, every gray level would occur with equal frequency. This requires an auxiliary **transformation function** $T(r)$ satisfying two conditions:

1. $T(r)$ must be **monotonically increasing** over $0 \le r \le L-1$ (so that relative gray-level ordering is preserved — no dark/light reversal).
2. $0 \le T(r) \le L-1$ for $0 \le r \le L-1$ (so the output stays within the valid range).

The transformation function that satisfies both, and that is normally used in practice, is the **cumulative distribution function (cdf)** of the original probability mass function:

$$s_k = T(r_k) = \sum_{j=0}^{k} \frac{n_j}{n} = \sum_{j=0}^{k} p(r_j) \tag{6.10}$$

where $s_k$ is the new (mapped) gray level for every pixel whose original gray level was $r_k$. This choice is convenient precisely because the cdf can be computed directly from the pixel data itself, with no extra input required.

**In MATLAB:** the IPT provides `histeq` for histogram equalization of a monochrome image. Typical syntax: `J = histeq(I, n)`, where `n` (default 64) is the desired number of gray levels in the output. `histeq` can also perform histogram *matching* — see §6.10.

### Example: equalizing the eight-level histogram

Using the cdf as the transformation function on the eight-level histogram from §6.6, the running example computes $s_2 = 0.560$, $s_3 = 0.769$, $s_4 = 0.891$, $s_5 = 0.939$, $s_6 = 0.972$, and $s_7 = 1$ (the values of $s_0$ and $s_1$ follow the same cumulative-sum recipe).

Because the image was quantized to only eight gray levels, each raw $s_k$ must be **rounded** to the nearest valid level — i.e., the nearest multiple of $1/7$ in $[0,1]$:

| $r_k$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| rounded $s_k$ | 0 | 2 | 4 | 5 | 6 | 7 | 7 | 7 |

Reading this table as a remapping recipe: pixels originally at level 0 stay at level 0 (unchanged); the 3214 pixels originally at level 1 move to level 2; pixels at level 2 move to level 4; level 3 moves to level 5; level 4 moves to level 6; and — because levels 5, 6, and 7 all round to the same target — those three bins get **merged**, and all pixels originally at levels 5, 6, or 7 end up at level 7.

The resulting equalized histogram distributes pixels more evenly across the gray scale than the original, although it is visibly **not** perfectly flat. This is expected and should be read as "the best result achievable for this particular image with this particular transformation function," not as a failure of the method — with a small, fixed number of discrete gray levels, exact rounding artifacts and bin merging are unavoidable.

### Global vs. local equalization

A second worked example (a $600 \times 800$, 256-gray-level image processed with `histeq`) illustrates two further practical points:

- Equalization can introduce a visible side effect called **false contouring**, where a nominally smooth gradient region (the slides' example is a sky) develops visible banding after equalization, because nearby gray levels get merged into the same output bin.
- The algorithm as described is **global**: once the mapping/lookup table is computed from the whole image's histogram, it is applied uniformly to every pixel.

When the goal is instead to enhance detail within **small local regions**, a **local** variant of histogram equalization is used: a small rectangular (often square) sliding window ("tile") is moved across the image, and for each pixel a local histogram (computed from just the window around it), a local mapping function, and a locally-remapped value are computed. This is considerably more computationally expensive than the global variant, and it tends to produce a noisier-looking output because the mapping function can change abruptly from one tile to the next.

**In MATLAB:** `adapthisteq` performs local (adaptive) histogram equalization, operating on small tiles rather than the whole image, in contrast with the global `histeq`. A comparison example in the slides shows that local equalization (via `adapthisteq`) can improve local contrast while still preserving the bimodal character of the original global histogram — something plain global `histeq` tends to wash out.

## 6.10 Direct Histogram Specification

Despite its usefulness for general contrast enhancement, histogram equalization is a fairly **inflexible** technique: its only real "knob" is the choice of transformation function, and that choice is essentially always the cdf of the image's own histogram. Sometimes, however, the goal is not "as flat as possible" but rather to reshape the histogram to match a **specific target distribution**. This is achieved with **direct histogram specification**, also known as **histogram matching**.

Given an image (and its histogram) and a desired target histogram, the procedure has three steps:

1. **Equalize** the original image's histogram using its own cdf as the transformation function:
$$s_k = T(r_k) = \sum_{j=0}^{k} \frac{n_j}{n} = \sum_{j=0}^{k} p(r_j)$$
2. **Equalize the desired (target) histogram** in the same way — i.e., compute the cdf of the desired probability mass function:
$$v_k = G(z_k) = \sum_{j=0}^{k} p(z_j)$$
3. **Apply the inverse of the target's transformation function**, $z = G^{-1}(s)$, to the values obtained in step 1, mapping each equalized level $s_k$ to whichever target level $z$ has $G(z) \approx s_k$.

**In MATLAB:** `histeq` is reused for histogram matching, with a different call signature: `J = histeq(I, h)`, where `h` is a 1D array specifying the desired target histogram.

### Worked example (continuing the eight-level histogram)

Reusing the same eight-level histogram from §6.6/§6.9, suppose the desired resulting pixel distribution has the cdf values $v_0 = 0$, $v_1 = 0$, $v_2 = 0$, $v_3 = 0.1$, $v_4 = 0.3$, $v_5 = 0.7$, $v_6 = 0.9$, $v_7 = 1$. Step 1 (equalizing the original histogram) has already been done in §6.9. Step 2 gives the $v_k$ values above directly.

Step 3 — inverting $G$ — is the trickiest conceptually, but because we are working with discrete values it reduces to a simple **nearest-neighbor search**: for each equalized value $s_k$, find whichever $v_k$ is closest to it. For example, $s_1 = 2/7 \approx 0.286$. Scanning the target cdf, the closest value is $v_4 = G(z_4) = 0.3$, so $G^{-1}(0.3) = z_4$. This means: pixels that histogram equalization had already shifted to level $s_1 = 2$ should, for histogram *matching* purposes, be remapped one step further, to target gray level $z_4 = 4$. The same nearest-value search is repeated for every $s_k$ to build the complete matching lookup table.

---

## What have we learned?

- **Image enhancement** modifies pixel values so that the resulting image is an improved version of the original for some particular purpose — either better subjective quality for a human viewer, or better suitability for further machine-vision processing.
- **Gray-level (point) transformations** are one major route to enhancement: the defining trait is that the output gray level of a pixel depends only on the original value at that pixel and on the transformation function, never on neighboring pixels. In MATLAB, they are implemented via `imadjust` (and interactively via `imcontrast`).
- The most commonly used point transformations are the **negative**, **power-law (gamma)**, **logarithmic**, and **piecewise-linear** transformations; piecewise-linear functions such as gray-level slicing can be specified interactively with tools like `glsdemo`.
- **Lookup tables (LUTs)** dramatically speed up the application of any point transformation function, since the transform only needs to be computed once per possible gray level (256 entries for `uint8`), not once per pixel.
- The **histogram** of an image is a probability mass function over gray levels; it is cheap to compute (via `imhist` or manual binning) and provides an immediate diagnostic of overall brightness and contrast (dark vs. bright, low- vs. high-/bimodal-contrast).
- **Histogram equalization** (`histeq`) reshapes a histogram toward uniformity using the cdf of the image's own histogram as the transformation function; it is simple, parameter-free, and effective for general contrast enhancement, but can introduce false contouring and is *global* by default (a *local*, tile-based variant is available via `adapthisteq`).
- **Direct histogram specification / matching** generalizes equalization by allowing an arbitrary target histogram to be specified; it is implemented as a three-step process (equalize source, equalize target, invert the target's cdf) and is available in MATLAB through an alternate `histeq(I, h)` call signature.
- Despite being introduced as a lecture on gray-level transformations *and* neighborhood processing, this deck in practice covers only the point-processing and histogram half of that scope; correlation/convolution and spatial (neighborhood) filters are addressed separately.

