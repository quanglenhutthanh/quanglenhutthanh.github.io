---
title: "Edge Detection"
subject: "image-and-video-processing"
type: lecture
lecture_no: 9
status: done
source: slide
tags: [edge-detection, sobel, prewitt, canny, laplacian-of-gaussian]
date: 2024-10-18
---

# Lecture 9 – Edge Detection

> Core content: what an edge is and why edge detection matters for computer vision; first-order derivative operators (Roberts, Prewitt, Sobel, and the compass masks Kirsch/Robinson); second-order derivative operators (Laplacian, Laplacian of Gaussian / Marr–Hildreth); the Canny edge detector; edge linking and boundary detection with the Hough transform; and how all of this is implemented in MATLAB's `edge` function and the Image Processing Toolbox.

---

## 9.1 Formulation of the Problem

Edge detection is one of the most fundamental operations in image processing, and it sits near the front of almost every classical computer vision pipeline. The goal is deceptively simple to state: find the most relevant edges in an image or scene, then connect them into meaningful lines and boundaries so that the image ends up **segmented** into two or more regions. Everything downstream in a machine vision system — object counting, measurement, feature extraction, classification — typically consumes this segmented representation rather than the raw pixel grid.

The motivation for edge detection is not purely engineering convenience; it also has roots in biological vision. There is compelling neurophysiological evidence that the earliest stages of the human visual system (HVS) contain edge-sensitive cells that fire more strongly when presented with edges of a particular intensity and orientation. Edge detection algorithms are, in a sense, an attempt to emulate an ability that biological vision systems already possess.

Despite the simplicity of the goal, edge detection is a genuinely hard problem. Algorithms that work well on carefully controlled, high-contrast test images often degrade sharply on real-world scenes, where illumination is uneven, object size and position vary, and contrast between object and background is weak. Shadows, occlusion between objects, and sensor noise all have a significant negative impact on the quality of the detected edges. Because of this, it is standard practice to precede the edge detection stage with preprocessing steps such as noise reduction and illumination correction.

## 9.2 Basic Concepts

An **edge** can be defined as a boundary between two image regions that have distinct characteristics with respect to some feature — gray level, color, or texture. This lecture focuses primarily on edges in grayscale 2D images, where an edge is usually associated with a sharp variation of the intensity function across a small portion of the image.

Edge detection methods generally rely on the first or second derivative of the intensity profile taken along a line crossing the edge:

- The **first derivative** is directly proportional to the difference in intensity across the edge, so its *magnitude* can be used to detect the presence of an edge at a given point.
- The **second derivative** changes sign as it crosses the edge: its sign tells us whether a pixel lies on the dark or the bright side of the edge, and the **zero crossing** between its positive and negative peaks can be used to precisely locate the center of thick (ramp) edges.

For a *ramp edge*, the intensity profile rises smoothly from a low to a high value. The first derivative of this profile has a single peak located at the center of the edge, while the second derivative — being the slope of the first derivative — crosses zero exactly at that same center point, with a positive lobe on one side and a negative lobe on the other. This is the classic picture used to justify both first-derivative (gradient) and second-derivative (Laplacian / zero-crossing) approaches to edge detection.

This clean picture only holds for noise-free images. Once the input is corrupted by noise, first and second derivatives respond very differently to it. Even a modest amount of noise — barely perceptible by eye in the original image — can be enough to make the second-derivative results completely unusable, because differentiating twice amplifies high-frequency noise much more aggressively than differentiating once. More pronounced noise eventually degrades the first-derivative results too, to the point where they can no longer be used reliably for edge detection.

Putting this together, the process of edge detection is normally broken down into three main steps:

1. **Noise reduction** — because both derivatives are highly sensitive to noise, it is strongly recommended to smooth the image before applying any edge detection operator.
2. **Detection of edge points** — local operators that respond strongly at edges and weakly elsewhere are applied to the (smoothed) image, producing an output whose bright pixels are *candidate* edge points.
3. **Edge localization** — the raw detection results are postprocessed: spurious pixels are removed, and broken edge fragments are turned into meaningful lines and boundaries, using techniques such as the Hough transform.

> **In MATLAB.** The Image Processing Toolbox (IPT) provides a single, versatile function for edge detection, `edge`, whose method argument selects among all of the classical operators covered in this lecture (Sobel, Prewitt, Roberts, LoG, zero-crossing, Canny).

## 9.3 First-Order Derivative Edge Detection

### 9.3.1 The gradient and the Roberts operator

The simplest edge detectors work by estimating the gray-level gradient at a pixel. The gradient components can be approximated by the digital equivalent of the first-order derivative:

$$g_x(x,y) \approx f(x+1,y) - f(x-1,y)$$
$$g_y(x,y) \approx f(x,y+1) - f(x,y-1)$$

The compact, 2×2 neighborhood version of this idea is known as the **Roberts operator** (or Roberts cross operator). Instead of comparing horizontally/vertically opposite neighbors, it takes differences along the two diagonals of a 2×2 neighborhood, expressed as the following convolution kernels:

$$
g_x =
\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}
\qquad
g_y =
\begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}
$$

Roberts is the cheapest of the classical gradient operators (only four multiplications and two additions per pixel), but its small 2×2 support makes it particularly noise-sensitive and biased toward diagonal edges.

### 9.3.2 Prewitt and Sobel operators

In practice, gradients are usually computed over a larger, 3×3 neighborhood via convolution:

$$g_x(x,y) = h_x \star f(x,y) \qquad g_y(x,y) = h_y \star f(x,y)$$

where $h_x$ and $h_y$ are appropriately chosen convolution masks (kernels). The simplest 3×3 pair is the **Prewitt operator**:

$$
h_x =
\begin{bmatrix} -1 & 0 & 1 \\ -1 & 0 & 1 \\ -1 & 0 & 1 \end{bmatrix}
\qquad
h_y =
\begin{bmatrix} -1 & -1 & -1 \\ 0 & 0 & 0 \\ 1 & 1 & 1 \end{bmatrix}
$$

A closely related pair, which gives more weight to the pixels directly on-axis with the center pixel (and therefore has some built-in smoothing), is the **Sobel operator**:

$$
h_x =
\begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix}
\qquad
h_y =
\begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ 1 & 2 & 1 \end{bmatrix}
$$

Despite their differences, all of the 3×3 masks above share two structural properties:

- Coefficients of **opposite sign** are placed across a row or column so that the mask gives a high response wherever intensity varies (i.e., at a possible edge), and zero response over uniform regions.
- The **sum of the coefficients is zero**: applied to a perfectly homogeneous patch of the image, the convolution result is 0, which displays as a black pixel — exactly the desired "no edge here" response.

The following table summarizes how the three operators compare:

| Operator | Neighborhood | Notes |
|---|---|---|
| Roberts | 2×2 (diagonal) | Cheapest, most noise-sensitive, biased to diagonal edges |
| Prewitt | 3×3 | Equal weighting of neighboring rows/columns |
| Sobel | 3×3 | Extra weight (2) on the on-axis pixels → mild smoothing, more robust to noise than Prewitt |

Once $g_x$ and $g_y$ have been computed, they are typically combined into the **gradient magnitude**:

$$g = \sqrt{g_x^2 + g_y^2}$$

which is often approximated (for speed) by:

$$g \approx |g_x| + |g_y|$$

The **gradient direction** (the orientation of maximum rate of change, i.e. perpendicular to the edge) is given by $\theta(x,y) = \tan^{-1}(g_y / g_x)$.

> **In MATLAB.** `edge` has built-in options for both the Prewitt and the Sobel operators (`edge(I,'prewitt')`, `edge(I,'sobel')`). The same result can be obtained manually with `imfilter` using masks generated by `fspecial('prewitt')` or `fspecial('sobel')`.

### Example 9.1 — Prewitt via `imfilter`

Applying the Prewitt kernels with `imfilter` produces two component images (from $h_x$ and $h_y$) that contain both positive and negative values, since the kernels themselves are signed. Because MATLAB truncates negative values when displaying an image directly, the individual $g_x$ and $g_y$ results are usually remapped to a modified gray-level range before display: the most negative value is shown as black, the most positive value as white, and zero is shown as mid-gray. The combined, final result is obtained by computing the gradient magnitude $g = \sqrt{g_x^2 + g_y^2}$ (or its cheaper approximation $g \approx |g_x| + |g_y|$), which yields a proper edge map with no negative values to worry about.

### Example 9.2 — Sobel, compass masks, and thresholding

A similar experiment using `imfilter` with the Sobel masks is shown on a grayscale test image, with results displayed in negative (via `imcomplement`) purely for better legibility on paper.

The idea behind Prewitt/Sobel — a pair of horizontal and vertical masks — can be generalized to **eight compass directions**: north, northeast, east, southeast, south, southwest, west, and northwest. Two well-known families of compass masks are the **Kirsch** operator and the **Robinson** operator. Each is a set of eight 3×3 kernels, one per compass direction, obtained from each other by rotating the coefficient pattern. The edge response at a pixel is the *maximum* response over all eight masks, and the mask index that produced the maximum also encodes an approximate edge direction.

The eight Kirsch masks are:

$$
\small
\begin{aligned}
k_1 &= \begin{bmatrix}-3&-3&5\\-3&0&5\\-3&-3&5\end{bmatrix} &
k_2 &= \begin{bmatrix}-3&5&5\\-3&0&5\\-3&-3&-3\end{bmatrix} &
k_3 &= \begin{bmatrix}5&5&5\\-3&0&-3\\-3&-3&-3\end{bmatrix} &
k_4 &= \begin{bmatrix}5&5&-3\\5&0&-3\\-3&-3&-3\end{bmatrix} \\
k_5 &= \begin{bmatrix}5&-3&-3\\5&0&-3\\5&-3&-3\end{bmatrix} &
k_6 &= \begin{bmatrix}-3&-3&-3\\5&0&-3\\5&5&-3\end{bmatrix} &
k_7 &= \begin{bmatrix}-3&-3&-3\\-3&0&-3\\5&5&5\end{bmatrix} &
k_8 &= \begin{bmatrix}-3&-3&-3\\-3&0&5\\-3&5&5\end{bmatrix}
\end{aligned}
$$

The Robinson masks follow the same eight-direction idea but use smaller coefficients (0, ±1, ±2):

$$
\small
\begin{aligned}
r_1 &= \begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix} &
r_2 &= \begin{bmatrix}0&1&2\\-1&0&1\\-2&-1&0\end{bmatrix} &
r_3 &= \begin{bmatrix}1&2&1\\0&0&0\\-1&-2&-1\end{bmatrix} &
r_4 &= \begin{bmatrix}2&1&0\\1&0&-1\\0&-1&-2\end{bmatrix}
\end{aligned}
$$

(and $r_5$ through $r_8$ continue rotating the pattern, mirroring $r_1$ through $r_4$).

Since raw gradient-magnitude images typically contain many low-amplitude responses that do not correspond to real edges (false positives), it is common to **threshold** the result. Sweeping the threshold from very low to very high moves the output from "unacceptable — too many spurious pixels" to "unacceptable — too few edge pixels remain," with a useful middle ground somewhere in between. MATLAB's `edge` function can pick a reasonable threshold automatically:

```matlab
[BW, thresh] = edge(I, 'sobel');   % thresh is chosen automatically
```

### 9.3.3 Compass masks recap

| Family | # Masks | Coefficient magnitudes | Comment |
|---|---|---|---|
| Kirsch | 8 | −3, 0, 5 | Larger dynamic range between "on" and "off" coefficients |
| Robinson | 8 | −2 … 2 | Smaller coefficients, gentler response |

For both families, the final edge-strength image is the pixelwise **maximum** across the eight directional responses.

## 9.4 Second-Order Derivative Edge Detection

The **Laplacian** operator is the standard digital approximation of the second-order derivative of the intensity function. Unlike the gradient operators above, it is **isotropic** (omnidirectional) by construction — a single mask, not a horizontal/vertical pair — since the Laplacian is defined as the sum of second partial derivatives, $\nabla^2 f = \partial^2 f/\partial x^2 + \partial^2 f/\partial y^2$, which does not privilege any particular orientation.

Despite this attractive property, the Laplacian is rarely used in isolation, for two reasons already hinted at in Section 9.2:

- It produces **"double edges"** — because it is a second derivative, it produces a positive lobe on one side of the edge and a negative lobe on the other, rather than a single clean peak.
- It is **extremely sensitive to noise** — second differentiation amplifies high-frequency content (including noise) far more than first differentiation.

Because of the double-edge behavior, the Laplacian is typically used through its **zero crossings** rather than its raw magnitude: the zero crossing between the positive and negative lobes marks the true location of the edge.

> **In MATLAB.** The Laplacian mask can be generated with `fspecial`, and the zero-crossing detector is available as an option of `edge`:
> ```matlab
> h = fspecial('laplacian', 0);
> J = edge(I, 'zerocross', t, h);   % t = user-supplied sensitivity threshold
> ```

### Example 9.3 — Zero-crossing detection and noise sensitivity

Applying the zero-crossing detector to a clean image with the default threshold gives a clean, reasonably sparse edge map. Lowering the threshold to 0 admits far more spurious zero crossings, most of which do not correspond to true edges — clearly a worse result than the default. Repeating the comparison on a *noisy* version of the same image (additive zero-mean Gaussian noise with $\sigma = 0.0001$, an amount that is barely perceptible by eye in the original) is dramatically worse: both the default-threshold and zero-threshold results become unacceptable. This is a direct, concrete illustration of the noise sensitivity discussed above, and it is the main motivation for smoothing the image with a Gaussian filter *before* computing the Laplacian — which is exactly what the Laplacian of Gaussian does.

### 9.4.1 Laplacian of Gaussian

The **Laplacian of Gaussian (LoG)** edge detector — also known as the **Marr–Hildreth** edge detector — addresses the Laplacian's noise sensitivity directly: first smooth the image with a Gaussian low-pass filter, then apply the Laplacian to the smoothed result. Equivalently, since convolution is associative, one can precompute a single combined kernel by taking the Laplacian of a 2D Gaussian:

$$\mathrm{LoG}(x,y) = -\frac{1}{\pi\sigma^4}\left[1 - \frac{x^2+y^2}{2\sigma^2}\right] \exp\!\left(-\frac{x^2+y^2}{2\sigma^2}\right)$$

The 3D plot of this function has a distinctive shape that resembles a **Mexican hat** — a central negative (or positive, depending on sign convention) dip surrounded by a positive (negative) ring — which is why the LoG kernel is sometimes called the "Mexican hat" filter.

Because the exact LoG kernel is somewhat expensive to evaluate, it is often approximated by the difference of two Gaussians of different widths, a technique known as **Difference of Gaussians (DoG)**:

$$\mathrm{DoG}(x,y) = G_{\sigma_1}(x,y) - G_{\sigma_2}(x,y), \qquad \sigma_1 < \sigma_2$$

> **In MATLAB.** The LoG edge detector is available directly through the `log` option of `edge`: `edge(I,'log')`, with $\sigma$ (default 2) controlling the amount of smoothing applied before the Laplacian.

### Example 9.4 — Effect of $\sigma$ on the LoG detector

Using the default $\sigma = 2$ gives a baseline edge map. Reducing $\sigma$ to 1 makes the Gaussian pre-smoothing narrower, so the detector responds to finer image detail and produces more (and finer) edges. Increasing $\sigma$ to 3 broadens the smoothing kernel, suppressing fine detail and producing a coarser, sparser edge representation — exactly as expected from a low-pass filter with a wider support.

## 9.5 The Canny Edge Detector

The **Canny edge detector**, introduced by John Canny in 1986, is widely regarded as one of the most popular, powerful, and effective edge detectors available. It is built from a five-step pipeline:

1. **Gaussian smoothing.** The input image is smoothed with a Gaussian low-pass filter of a specified $\sigma$. Larger $\sigma$ values suppress more noise but at the cost of weakening (and potentially losing) genuinely relevant edges.
2. **Gradient computation.** The local gradient — both magnitude and direction — is computed at every point of the smoothed image (typically using Sobel-like operators).
3. **Non-maximal suppression.** The gradient-magnitude image from step 2 contains wide "ridges" of high response around each true edge rather than single-pixel-wide lines. The algorithm thins these ridges down to a single pixel width by keeping only the local maximum along the gradient direction at each point.
4. **Hysteresis (double) thresholding.** The thinned ridge pixels are compared against two thresholds, $T_{low}$ and $T_{high}$: pixels above $T_{high}$ are classified as **strong** edge pixels, while pixels between $T_{low}$ and $T_{high}$ are classified as **weak** edge pixels. Pixels below $T_{low}$ are discarded outright.
5. **Edge linking.** The algorithm performs edge linking by keeping weak pixels that are **8-connected** to a strong pixel (directly or through a chain of other weak pixels), and discarding weak pixels that are not connected to any strong pixel. This hysteresis mechanism is what lets Canny preserve faint-but-genuine edge segments while still rejecting isolated noise responses.

> **In MATLAB.** The Canny detector is available directly through `edge`:
> ```matlab
> J = edge(I, 'canny', T, sigma);
> % I     - input image
> % T     - [T_low T_high], the two hysteresis thresholds (optional)
> % sigma - std. dev. of the Gaussian smoothing filter (optional)
> % J     - output binary edge image
> ```

### Example 9.5 — Varying $\sigma$ and the thresholds

With `BW = edge(J,'canny')` and no other arguments, MATLAB picks default parameters automatically — in this example $T = [0.0625,\ 0.1563]$ and $\sigma = 1$. Reducing $\sigma$ to 0.5 (with the thresholds unchanged) results in *more* detected edge points, since less noise-suppressing smoothing is applied and finer detail survives into the gradient image. Conversely, increasing $\sigma$ to 2 results in *fewer* edge points, as more detail is smoothed away before the gradient is even computed. Separately, lowering both thresholds to $T = [0.01,\ 0.1]$ (while keeping $\sigma$ at its default) admits more strong and weak pixels through the hysteresis step, again increasing the number of edge pixels in the final result — as expected from a lower detection bar.

### 9.5.1 Summary comparison of the operators covered so far

| Operator | Derivative order | Isotropic? | Typical noise robustness | Notes |
|---|---|---|---|---|
| Roberts | 1st | No | Low | Cheapest, diagonal bias |
| Prewitt | 1st | No | Low–medium | Equal-weight 3×3 |
| Sobel | 1st | No | Medium | On-axis emphasis (mild smoothing) |
| Kirsch / Robinson | 1st (compass) | Approx. (8 dir.) | Medium | 8 masks, take max response |
| Laplacian | 2nd | Yes | Very low | Double edges, needs zero-crossing |
| LoG (Marr–Hildreth) | 2nd | Yes | Tunable via $\sigma$ | Gaussian pre-smoothing + Laplacian |
| Canny | 1st (+ NMS + hysteresis) | No (but multi-directional) | High | Generally considered the best all-around detector |

## 9.6 Edge Linking and Boundary Detection

An ideal edge detector would produce an image containing exactly the true edges of the scene and nothing else. In practice, because of noise, shadows, occlusion, and the other challenges discussed earlier, essentially every edge detection algorithm produces **fragmented** edges — broken segments rather than continuous boundaries. Turning these fragments into useful lines and object boundaries requires additional, typically global, processing. The classical tool for this is the **Hough transform**.

### 9.6.1 The Hough Transform

The Hough transform is a mathematical technique for finding lines in an image. It is used to link the results of edge detection, converting sparse, broken, or isolated edge pixels into coherent lines corresponding to actual structure in the image.

**Basic (slope-intercept) idea.** Let $(x,y)$ be the coordinates of a point in a binary (edge) image. The Hough transform stores, in an accumulator array, all pairs $(a,b)$ that satisfy the line equation $y = ax + b$. This $(a,b)$ space is called the *transform array* (or parameter space). For example, the image point $(x,y) = (1,3)$ satisfies $b = -a + 3$, which traces out a *single line* of $(a,b)$ pairs in parameter space. Since every point in the image maps to a line in parameter space, repeating this for many edge points produces *many* intersecting lines — one per point. Two or more of these lines intersecting at the same $(a,b)$ means that the corresponding image points are **collinear**: the more lines that intersect at a given point in parameter space, the longer the corresponding line segment in the image.

**Normal (polar) representation.** Describing lines as $y = ax + b$ breaks down for vertical lines, whose slope $a$ is infinite. This is fixed by switching to the **normal form** of a line, parameterized by:

- $\rho$ — the perpendicular distance from the line to the origin, and
- $\theta$ — the angle between that perpendicular and the horizontal axis,

with the relationship to image coordinates given by:

$$\rho = x\cos\theta + y\sin\theta$$

In this representation vertical lines correspond to $\theta = 0$, and it is conventional to let $\rho$ take negative values so that $\theta$ can be restricted to the range $-90^\circ < \theta \le 90^\circ$ without losing any lines.

**The algorithm.** Using $(\rho,\theta)$ coordinates, the Hough transform proceeds as:

1. Create a 2D array over a discrete set of $(\rho,\theta)$ values; each cell of this array is called an **accumulator cell**.
2. For every edge pixel $(x,y)$ in the image and for every candidate value of $\theta$, compute $\rho = x\cos\theta + y\sin\theta$ and increment (accumulate a vote in) the corresponding $(\rho,\theta)$ cell.
3. The cells with the highest accumulated values correspond to the most prominent lines in the image.

> **In MATLAB.** The IPT provides `hough`, which takes a binary image as input and returns the Hough transform matrix together with the $\rho$ and $\theta$ value arrays over which it was computed; the resolution of the discretized $(\rho,\theta)$ grid can optionally be specified.

### Example 9.6 — Finding lines with `hough`

```matlab
[H, T, R] = hough(BW, 'RhoResolution', 0.5, 'ThetaResolution', 0.5);
```

Applied to a binary edge image of a pair of scissors, the highest peaks in the transform image appear near $\theta \approx -60^\circ$ and $\theta \approx 60^\circ$, corresponding to the two main diagonal blades of the scissors shape.

### Example 9.7 — `hough`, `houghpeaks`, and `houghlines` together

The IPT also provides two companion functions built on top of `hough`:

- **`houghpeaks`** — identifies the $k$ most salient peaks in the Hough transform result, where $k$ is supplied as a parameter.
- **`houghlines`** — draws the actual line segments associated with those peaks on top of the original image.

Applying this trio to the edges extracted from a grayscale test image by the Canny detector: the Hough transform image shows two small markers at the two highest peaks; the Canny edge image itself is displayed as black edges on a white background for legibility; and the original image is shown with the highest-ranked line overlaid in cyan and the second-highest in yellow.

## 9.7 Tutorial: Edge Detection

**Goal.** Implement edge detection and the associated linking/postprocessing techniques in MATLAB.

**Objectives.**

- Use the IPT `edge` function.
- Explore the most popular first-derivative edge detectors: Roberts, Sobel, and Prewitt.
- Explore the Marr–Hildreth Laplacian of Gaussian edge detector.
- Explore the Canny edge detector.
- Implement edge detection with compass masks (Kirsch and Robinson), which are *not* built into `edge` and must be implemented by hand.

### Prewitt

```matlab
I = imread('lenna.tif');
figure, subplot(2,2,1), imshow(I), title('Original Image');

[I_prw1, t1] = edge(I, 'prewitt');
subplot(2,2,2), imshow(I_prw1), title('Prewitt, default thresh');

% Compare against a noisy version of the same image
I_noise = imnoise(I, 'gaussian');
[I_prw2, t2] = edge(I_noise, 'prewitt');
subplot(2,2,3), imshow(I_noise), title('Image w/ noise');
subplot(2,2,4), imshow(I_prw2), title('Prewitt on noise');
```

Questions worth working through here: what does the automatically chosen threshold `t1` represent? Does `edge` pick a *different* threshold for the noisy image (`t2`) than for the clean one? How does manually overriding the threshold change the operator's sensitivity to noise versus its ability to pick up the true edges of the object?

### Sobel

```matlab
[I_sob1, t1] = edge(I, 'sobel');
figure, subplot(2,2,1), imshow(I), title('Original Image');
subplot(2,2,2), imshow(I_sob1), title('Sobel, default thresh');

[I_sob2, t2] = edge(I_noise, 'sobel');
subplot(2,2,3), imshow(I_noise), title('Image w/ noise');
subplot(2,2,4), imshow(I_sob2), title('Sobel on noise');
```

`edge` also supports a `'nothinning'` option, which skips the edge-thinning postprocessing step for faster (but thicker) results:

```matlab
I_sob3 = edge(I, 'sobel', 'nothinning');
figure, subplot(1,2,1), imshow(I_sob1), title('Thinning');
subplot(1,2,2), imshow(I_sob3), title('NoThinning');
```

Since Sobel internally performs two separate convolutions (horizontal and vertical), the individual component images can be retrieved via extra output arguments:

```matlab
[I_sob4, t, I_sobv, I_sobh] = edge(I, 'sobel');
figure
subplot(2,2,1), imshow(I),               title('Original Image');
subplot(2,2,2), imshow(I_sob4),          title('Complete Sobel');
subplot(2,2,3), imshow(abs(I_sobv), []), title('Sobel Vertical');
subplot(2,2,4), imshow(abs(I_sobh), []), title('Sobel Horizontal');
```

The absolute value is required here because `I_sobv`/`I_sobh` are signed (they contain both positive and negative gradient values) and are also returned *before* any thresholding or thinning has been applied.

### Roberts

```matlab
I_rob1 = edge(I, 'roberts');
figure
subplot(2,2,1), imshow(I),      title('Original Image');
subplot(2,2,2), imshow(I_rob1), title('Roberts, default thresh');

[I_rob2, t] = edge(I_noise, 'roberts');
subplot(2,2,3), imshow(I_noise), title('Image w/ noise');
subplot(2,2,4), imshow(I_rob2),  title('Roberts on noise');
```

Comparing Roberts against Sobel and Prewitt on the same noisy image is a good way to appreciate concretely why the larger 3×3 masks tend to hold up better under noise than the 2×2 Roberts kernel — and to think about what preprocessing (e.g. a smoothing filter) could be applied *before* edge detection to help Roberts perform closer to the level of Sobel/Prewitt.

### Laplacian of Gaussian

```matlab
I_log1 = edge(I, 'log');
figure
subplot(2,2,1), imshow(I),      title('Original Image');
subplot(2,2,2), imshow(I_log1), title('LoG, default parameters');

[I_log2, t] = edge(I_noise, 'log');
subplot(2,2,3), imshow(I_noise), title('Image w/ noise');
subplot(2,2,4), imshow(I_log2),  title('LoG on noise');
```

By default the LoG detector uses $\sigma = 2$. Increasing $\sigma$ trades detail for robustness to noise, exactly as seen in Example 9.4.

### Canny

```matlab
I_can1 = edge(I, 'canny');
figure
subplot(2,2,1), imshow(I),      title('Original Image');
subplot(2,2,2), imshow(I_can1), title('Canny, default parameters');

[I_can2, t] = edge(I_noise, 'canny', [], 2.5);
subplot(2,2,3), imshow(I_noise), title('Image w/ noise');
subplot(2,2,4), imshow(I_can2),  title('Canny on noise');
```

Since Canny starts with its own internal Gaussian smoothing step, noisy images can often be handled better simply by *increasing* sigma:

```matlab
[I_can3, t] = edge(I_noise, 'canny', [], 2);
figure
subplot(1,2,1), imshow(I_can2), title('Canny, default parameters');
subplot(1,2,2), imshow(I_can3), title('Canny, sigma = 2');
```

The threshold argument works the same way as for the other operators — a higher threshold suppresses more (weaker) edges:

```matlab
I = imread('mandrill.tif');
[I_can1, thresh] = edge(I, 'canny');
figure
subplot(2,2,1), imshow(I),      title('Original Image');
subplot(2,2,2), imshow(I_can1), title('Canny, default parameters');

[I_can2, thresh] = edge(I, 'canny', 0.4);
subplot(2,2,3), imshow(I_can2), title('Canny, thresh = 0.4');

[I_can2, thresh] = edge(I, 'canny', 0.08);
subplot(2,2,4), imshow(I_can2), title('Canny, thresh = 0.08');
```

### Kirsch (implemented from scratch)

The remaining detectors, Kirsch and Robinson, are not built into `edge`, so they have to be implemented directly by convolving each of the eight compass masks with the image and combining the results.

```matlab
I = imread('mandrill.tif');
I = im2double(I);   % must convert to double to preserve negative values

% Store all eight Kirsch masks in one 3x3x8 array
k = zeros(3,3,8);
k(:,:,1) = [-3 -3 5; -3 0 5; -3 -3 5];
k(:,:,2) = [-3 5 5; -3 0 5; -3 -3 -3];
k(:,:,3) = [5 5 5; -3 0 -3; -3 -3 -3];
k(:,:,4) = [5 5 -3; 5 0 -3; -3 -3 -3];
k(:,:,5) = [5 -3 -3; 5 0 -3; 5 -3 -3];
k(:,:,6) = [-3 -3 -3; 5 0 -3; 5 5 -3];
k(:,:,7) = [-3 -3 -3; -3 0 -3; 5 5 5];
k(:,:,8) = [-3 -3 -3; -3 0 5; -3 5 5];

% Convolve each mask with the image
I_k = zeros(size(I,1), size(I,2), 8);
for i = 1:8
    I_k(:,:,i) = imfilter(I, k(:,:,i));
end

% Display all eight directional responses
figure
for j = 1:8
    subplot(2,4,j), imshow(abs(I_k(:,:,j)), []), ...
        title(['Kirsch mask ', num2str(j)]);
end

% Combine into a single edge-strength image (per-pixel max over directions)
I_kir = max(I_k, [], 3);
figure, imshow(I_kir, []);

% Rescale to [0,255] and convert to uint8 for thresholding/display
m = 255 / (max(I_kir(:)) - min(I_kir(:)));
I_kir_adj = uint8(m * I_kir);
figure, imshow(I_kir_adj);
```

The absolute value is needed when displaying each individual mask's response because Kirsch coefficients are signed; taking `max(I_k,[],3)` along the third (mask) dimension collapses the eight directional responses into one combined edge map in a single line of code.

### Robinson (implemented from scratch)

The Robinson detector follows exactly the same recipe as Kirsch — only the mask coefficients differ (smaller magnitudes: 0, ±1, ±2 instead of −3/5):

```matlab
r = zeros(3,3,8);
r(:,:,1) = [-1 0 1; -2 0 2; -1 0 1];
r(:,:,2) = [0 1 2; -1 0 1; -2 -1 0];
r(:,:,3) = [1 2 1; 0 0 0; -1 -2 -1];
r(:,:,4) = [2 1 0; 1 0 -1; 0 -1 -2];
r(:,:,5) = [1 0 -1; 2 0 -2; 1 0 -1];
r(:,:,6) = [0 -1 -2; 1 0 -1; 2 1 0];
r(:,:,7) = [-1 -2 -1; 0 0 0; 1 2 1];
r(:,:,8) = [-2 -1 0; -1 0 1; 0 1 2];

I_r = zeros(size(I,1), size(I,2), 8);
for i = 1:8
    I_r(:,:,i) = imfilter(I, r(:,:,i));
end
figure
for j = 1:8
    subplot(2,4,j), imshow(abs(I_r(:,:,j)), []), ...
        title(['Robinson mask ', num2str(j)]);
end

I_rob = max(I_r, [], 3);
figure, imshow(I_rob, []);
```

Comparing `I_rob` against `I_kir` on the same input (with and without added Gaussian noise) is a useful exercise for building intuition about how mask magnitude affects both edge strength and noise sensitivity.

## What have we learned?

- **Edge detection** is a fundamental image processing operation that tries to emulate an ability present in the human visual system. In grayscale 2D images an edge is usually defined as a sharp variation of the intensity function; more generally, an edge is a boundary between two regions with distinct characteristics in some feature (gray level, color, texture). Edge detection is a foundational step for many later stages of an image processing pipeline: once edges are found, the regions they enclose can be segmented and processed further.
- There are numerous edge detection techniques in the literature, ranging from simple convolution masks (Sobel, Prewitt) to biologically motivated approaches (Marr–Hildreth / LoG), and the quality of their results varies widely. The **Canny** edge detector is generally regarded as the most popular and effective contemporary method.
- MATLAB's `edge` function implements several of these methods directly — Prewitt, Sobel, Roberts, Laplacian of Gaussian, zero-crossing, and Canny — behind a single, consistent interface.
- Raw edge detection output is typically fragmented. An **edge linking** stage postprocesses these results, eliminating spurious points and bridging gaps, to produce cleaner edges suitable for later edge-based segmentation.
- The **Hough transform** is the standard technique for finding long, straight edges (line segments) among a set of raw edge detection results, and it generalizes (with the appropriate parameterization) to other simple shapes such as circles.

