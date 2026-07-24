---
title: "Key-point Detection"
subject: "computer-vision"
type: lecture
lecture_no: 12
status: done
source: slide
tags: [keypoint-detection, harris-corner, sift, fast, feature-detection]
date: 2024-11-08
---

# Lecture 12 – Key-point Detection

> Main content: what a **keypoint (interest point)** is and why plain edges are not enough, the desirable properties of a good keypoint detector (localization, invariance, robustness, repeatability), two **second-derivative blob detectors** (Laplacian / LoG and Determinant-of-Hessian), the **Harris corner detector** built from the local structure matrix and its eigenvalues, and the **FAST** detector used for real-time, on-device corner detection.

---

## 12.1 Why Keypoints, and What Makes a Good One?

Many computer-vision applications need features that are **localized precisely in $(x,y)$**: image registration, panorama stitching, motion estimation and tracking, and object/scene recognition all rely on being able to find the *same* physical point again in a different image (a different frame, a different viewpoint, a different lighting condition) and match it reliably.

A natural first idea is to reuse **edges**, since edge detection is already well understood (see Lecture 9). The problem is that an edge is only well localized **in one direction** — along the gradient — while it is free to slide along its own direction without changing the local appearance. Looking at a small window on a flat edge of a cube, the patch looks the same if you shift it up or down along the edge; there is no unique position. To get a point that is well localized in **both** directions, we need to look for **corners**: places where the local intensity structure changes in more than one direction at once (e.g. where two edges of a cube meet).

This motivates a list of **desirable properties for a keypoint detector**:

- **Accurate localization** — the detected point should sit at a precise, repeatable pixel location.
- **Invariance** against shift, rotation, scale, and brightness change — the same physical point should be detected again even if the image is translated, rotated, rescaled, or captured under different illumination.
- **Robustness against noise** and **high repeatability** — the detector should fire on the same points across different images of the same scene, and not be thrown off by sensor noise.

The lecture walks through four classical keypoint/corner detectors that trade off these properties differently:

| Detector | Core idea |
|---|---|
| **Laplacian detector** | Local extrema of the Laplacian-of-Gaussian (LoG) response |
| **Determinant of Hessian detector** | Local extrema of the determinant of the Hessian (DoH) response |
| **Harris detector** | Eigenvalue analysis of the local second-moment (structure) matrix |
| **FAST detector** | Fast segment test on a circle of pixels around a candidate point |

---

## 12.2 Second-Derivative Blob Detectors

The first two detectors both work by convolving the image with a **second-derivative operator** and then looking for strong, isolated local extrema of the response — points where the image "curves" sharply in more than one direction, which tends to happen at blob-like or corner-like structures rather than along a smooth edge.

### 12.2.1 Laplacian (LoG) Keypoint Detector

The **Laplacian of Gaussian (LoG)** detector applies the standard second-order Laplacian operator,

$$
\nabla^2 f(x,y) = f_{xx}(x,y) + f_{yy}(x,y),
$$

after (or combined with) a Gaussian smoothing step, i.e. the input is convolved with a LoG kernel (visualized on the slide as an inverted "Mexican hat" surface). The full pipeline is:

$$
\text{Input } f[x,y] \;\xrightarrow{\text{LoG convolution}}\; \text{response} \;\xrightarrow{\text{thresholding}}\; \text{thresholded response} \;\xrightarrow{\text{local min/max}}\; \text{keypoints}
$$

Concretely, on the example images used in the deck (a CD cover and a painting of stacked plates, each shown from four different viewpoints/crops):

1. **LoG response** — convolving each input image with the LoG kernel produces a signed response image that is strongly positive/negative around blob-like structures (text edges, object boundaries) and near zero on flat regions.
2. **Thresholding** — the response is passed through a two-sided (dead-zone) threshold, illustrated on the slide by a piecewise-linear curve that clips small responses to zero and keeps only strongly positive or strongly negative responses. This suppresses weak, noise-driven responses.
3. **Local extrema** — within the thresholded response, local minima and maxima are located; these scattered points are the candidate keypoints.
4. **Superimposed keypoints** — the **500 strongest keypoints** (ranked by response magnitude) are overlaid on the original image as yellow dots. They cluster densely along high-contrast text and object edges/corners, exactly where the image content is "busy" enough to produce strong curvature.

### 12.2.2 Determinant of Hessian (DoH) Keypoint Detector

The second blob detector uses the full **Hessian matrix** of second partial derivatives instead of just their sum (the Laplacian). For an image $f[x,y]$,

$$
\mathbf{H}[x,y] =
\begin{bmatrix}
f_{xx}[x,y] & f_{xy}[x,y] \\
f_{xy}[x,y] & f_{yy}[x,y]
\end{bmatrix}
=
\begin{bmatrix}
D_{xx}[x,y]*f[x,y] & D_{xy}[x,y]*f[x,y] \\
D_{xy}[x,y]*f[x,y] & D_{yy}[x,y]*f[x,y]
\end{bmatrix},
$$

where $D_{xx}$, $D_{yy}$, $D_{xy}$ are the second-derivative-of-Gaussian kernels shown on the slide as small oriented filter patches: $D_{xx}$ looks like a vertical dark bar between two light lobes (second derivative along $x$), $D_{yy}$ its 90°-rotated twin, and $D_{xy}$ a four-lobed checkerboard-like pattern (the mixed partial derivative).

The **cornerness/blob response** is the **determinant of the Hessian**:

$$
\det \mathbf{H}[x,y] = f_{xx}[x,y]\,f_{yy}[x,y] - \big(f_{xy}[x,y]\big)^2 .
$$

The determinant is large and positive when both principal curvatures at a point have the same sign and large magnitude — i.e. when the local surface is bowl- or dome-shaped in *both* directions at once (a genuine blob/corner), and small or negative along ridges/edges where curvature is strong in only one direction.

The pipeline mirrors the Laplacian case exactly: **DoH response → thresholded DoH response (same dead-zone thresholding) → local maxima of the response → superimposed keypoints**, again keeping the **500 strongest keypoints**. Visually, the DoH keypoints on the example images concentrate similarly around text and object contours, though the exact spatial distribution differs slightly from the LoG result because determinant-of-Hessian responds to genuinely bidirectional curvature rather than to the (rotation-invariant but less discriminative) trace of the Hessian.

**Laplacian vs. DoH in one line:** the Laplacian keeps the **trace** of the Hessian ($f_{xx}+f_{yy}$), which is simple and rotation-invariant but can respond along a single strong edge; the determinant of the Hessian additionally penalizes points where curvature is strong in only one direction, making it a slightly better discriminator between edges and blob-like corners — an idea that reappears, at multiple scales, at the heart of detectors like SURF.

---

## 12.3 Harris Corner Detector

### 12.3.1 Local Displacement Sensitivity

Instead of looking at raw second derivatives, the Harris detector starts from a direct operational question: **how much does the local image patch change if we shift it by a small amount $(\Delta x, \Delta y)$?** This is measured, for a continuous image $f(x,y)$, by the sum of squared differences (SSD) between the patch and its shifted copy over a small window:

$$
S(\Delta x, \Delta y) = \sum_{(x,y)\in\text{window}} \big[f(x,y) - f(x+\Delta x, y+\Delta y)\big]^2 .
$$

For small $(\Delta x, \Delta y)$ we can linearize $f$ with a first-order Taylor expansion,

$$
f(x+\Delta x, y+\Delta y) \approx f(x,y) + f_x(x,y)\,\Delta x + f_y(x,y)\,\Delta y,
$$

where $f_x$, $f_y$ are the horizontal and vertical image gradients. Substituting into $S$ and expanding gives a quadratic form:

$$
S(\Delta x, \Delta y) \approx \sum_{(x,y)\in\text{window}}
\Big[\big(f_x(x,y)\;\; f_y(x,y)\big)\begin{pmatrix}\Delta x\\ \Delta y\end{pmatrix}\Big]^2
= \big(\Delta x\;\; \Delta y\big)\,\mathbf{M}\begin{pmatrix}\Delta x\\ \Delta y\end{pmatrix},
$$

with

$$
\mathbf{M} = \sum_{(x,y)\in\text{window}}
\begin{bmatrix}
f_x^2(x,y) & f_x(x,y) f_y(x,y) \\
f_x(x,y) f_y(x,y) & f_y^2(x,y)
\end{bmatrix}.
$$

$\mathbf{M}$ is the **structure matrix** (also called the *normal matrix* or *second-moment matrix*): a $2\times2$, symmetric, positive semi-definite matrix built purely from local gradient statistics inside the window. Because $S(\Delta x,\Delta y)$ is a quadratic form, its **iso-sensitivity curves (level sets)** are **ellipses** — the shape and orientation of the ellipse encode how sensitive the patch is to displacement in each direction.

### 12.3.2 Eigenvalue Analysis of the Structure Matrix

The Harris detector classifies each pixel by looking at the **eigenvalues** $\lambda_1, \lambda_2$ of $\mathbf{M}$ (the axes of the sensitivity ellipse):

| Region type | Eigenvalue pattern | Interpretation |
|---|---|---|
| **Flat region** | $\lambda_1, \lambda_2$ both small | almost no intensity variation in any direction — displacement barely changes $S$ |
| **Edge** | one eigenvalue $\gg$ the other ($\lambda_1 \gg \lambda_2$ or $\lambda_2 \gg \lambda_1$) | strong sensitivity in one direction (across the edge), almost none along it |
| **Corner** | $\lambda_1$ and $\lambda_2$ both large | strong sensitivity to displacement in *every* direction |

This matches the intuition from Section 12.1: a genuine corner is a point that is well localized in both directions, which is exactly the "both eigenvalues large" case.

### 12.3.3 Harris Cornerness Response

Computing eigenvalues explicitly at every pixel is expensive, so Harris and Stephens proposed a **cornerness score** that uses only the determinant and trace of $\mathbf{M}$ (both cheap to compute directly from the matrix entries, without eigendecomposition):

$$
C = \det(\mathbf{M}) - k\cdot\big(\text{trace}(\mathbf{M})\big)^2 = \lambda_1\lambda_2 - k\cdot(\lambda_1+\lambda_2)^2 .
$$

$C$ is large and positive at corners (both eigenvalues large), negative along edges (one eigenvalue dominates), and close to zero in flat regions. The constant $k$ is an empirical sensitivity parameter that shapes how aggressively edges are suppressed relative to corners; the slide compares contour plots of $C$ over the $(\lambda_1,\lambda_2)$ plane for $k=0.2$ and $k=0.05$, showing that a larger $k$ pushes the zero-crossing of $C$ closer to the diagonal $\lambda_1=\lambda_2$ (more of the edge region is scored negative, i.e. the detector is more conservative about what counts as a corner), while a smaller $k$ lets more edge-like points score positive. In practice $k$ is typically chosen in the range $0.04$–$0.06$.

The full detection pipeline mirrors the blob detectors: **Harris cornerness map → thresholding (dead-zone, same style as before) → local maxima (non-maximum suppression) → superimposed keypoints**, again keeping the **500 strongest** on the example images. The resulting keypoints again cluster along text strokes and object corners, visually similar to but not identical to the LoG/DoH results, since Harris is explicitly designed to favor points that are well localized in *both* directions rather than just points of strong curvature.

### 12.3.4 Robustness of the Harris Detector

- **Invariant to brightness offset**: because the response is built entirely from derivatives, adding a constant to every pixel, $f[x,y] \to f[x,y]+c$, leaves $f_x$, $f_y$, $\mathbf{M}$, and hence $C$, unchanged.
- **Invariant to shift and rotation**: translating or rotating the image translates/rotates the local gradient field the same way, so the eigenvalues of $\mathbf{M}$ (and therefore the cornerness score) are preserved — a corner detected in the original image is detected again, at the corresponding location, in the shifted/rotated one.
- **Not invariant to scaling.** This is the key limitation. As a corner is viewed at a coarser scale (the image is zoomed out, or the same fixed-size window is applied to a rescaled image), the corner's local neighborhood can start to look like a smooth edge or a flat patch inside the fixed detection window — the geometric feature that made it a corner "shrinks" relative to the analysis window. The lecture illustrates this with a **repeatability vs. scale factor** curve: repeatability starts near 1.0 at scale factor 1 and drops sharply, falling below 0.2 by around scale factor 2–3 and continuing to decay toward 0 at scale factor 6. This is exactly the motivation for later, explicitly **scale-invariant** detectors (built on multi-scale pyramids of LoG/DoH-style responses), which search for extrema across scale as well as space.

---

## 12.4 FAST: Features from Accelerated Segment Test

The three detectors above all involve convolving the image with derivative-of-Gaussian kernels over a window — accurate, but too slow for real-time or embedded use (e.g. tracking on a mobile phone at video rate). **FAST** trades some of that generality for raw speed by replacing convolutions with a small number of pixel-intensity comparisons.

**The test.** For a candidate pixel $p$ (the "nucleus"), consider a **Bresenham circle of 16 pixels** of radius 3 around it (numbered 1–16 on the slide, tracing the circle starting from directly above $p$). The pixel $p$ is declared a **feature point (corner) if and only if there exists a set of at least $n = 9$ contiguous pixels on this circle of 16** that are **all brighter than $p$ by more than a threshold $\theta$**, or **all darker than $p$ by more than $\theta$**:

$$
\exists\, S \subset \{1,\dots,16\},\ |S| \ge n=9,\ S \text{ contiguous},\quad
\text{s.t. either } \forall i\in S: I(i) > I(p)+\theta \;\text{ or }\; \forall i \in S: I(i) < I(p)-\theta.
$$

Intuitively, this is a discretized, purely intensity-based stand-in for "the local structure matrix has two large eigenvalues": if a long, contiguous arc of the surrounding ring is uniformly much brighter (or darker) than the center, the center sits at a sharp corner of a bright (or dark) blob.

**Speed optimizations.** Checking all 16 pixels at every candidate location would already be fast, but FAST goes further by rejecting non-corners as early as possible. A common **high-speed test** first examines only 4 pixels equally spaced around the circle (e.g. pixels 1, 5, 9, 13, i.e. top, right, bottom, left); if fewer than 3 of these 4 already satisfy the brighter/darker-by-$\theta$ condition, $p$ cannot possibly have 9 contiguous qualifying pixels out of 16 and is rejected immediately, without ever touching the remaining 12 pixels. For further speed, the ordering of pixel comparisons — and the decision of when to stop early — can be **learned from data** with a machine-learning approach (an ID3-style decision tree trained on example images), so that at run time each candidate needs only a handful of comparisons on average rather than 16. This is what makes FAST fast enough for **real-time corner detection and tracking directly on a smartphone**, as shown in the demo videos below.

**Non-maximum suppression.** As with the other detectors, a raw FAST test can fire on multiple adjacent pixels around the same physical corner; a cornerness score (typically the sum of absolute differences between the qualifying circle pixels and $p$) is used to keep only the locally strongest response.

Applied to the same example images (CD cover, painting), the **FAST corners superimposed** slide again shows dense clusters of yellow keypoints along text strokes, printed logos, and object silhouettes/edges — qualitatively similar coverage to Harris/LoG/DoH, obtained with dramatically less computation per pixel.

### 12.4.1 Demos

- [FAST corner detection on smartphone](https://www.youtube.com/watch?v=Z_HwkG90Yvw)
- [FAST keypoint tracking on smartphone](https://www.youtube.com/watch?v=L7jbcOf5rDA)

---

## 12.5 Comparing the Four Detectors

| Detector | Built from | Rotation-invariant? | Scale-invariant? | Relative speed |
|---|---|---|---|---|
| Laplacian (LoG) | $\nabla^2 f = f_{xx}+f_{yy}$, local extrema | Yes | Only if applied across a scale pyramid | Slow (Gaussian second-derivative convolution) |
| Determinant of Hessian (DoH) | $\det \mathbf{H} = f_{xx}f_{yy}-f_{xy}^2$, local maxima | Yes | Only if applied across a scale pyramid | Slow (same as LoG) |
| Harris | Eigenvalues of structure matrix $\mathbf{M}$ | Yes | No (repeatability collapses with scale change) | Moderate |
| FAST | Contiguous-arc segment test on a 16-pixel circle | Approximately (circle is discretized) | No (fixed circle radius) | Very fast — real-time on mobile hardware |

All four share the same overall design pattern seen throughout the pipeline slides: **compute a per-pixel response → threshold it → keep local extrema → rank and keep the strongest $N$ keypoints**. What differs is *what* the response measures (signed curvature sum, determinant of curvature, directional displacement sensitivity, or a discrete brightness test) and how expensive it is to compute, which is precisely the accuracy-vs-speed trade-off that determines which detector is appropriate for a given application (offline recognition/registration vs. real-time tracking).

---

## What have we learned?

- A good **keypoint** must be accurately localized, invariant to shift/rotation/scale/brightness, robust to noise, and highly repeatable across images of the same scene.
- Plain **edges are only localized in one direction**; **corners** — points where local structure varies strongly in more than one direction — are what keypoint detectors actually look for.
- The **Laplacian (LoG)** and **Determinant of Hessian (DoH)** detectors both find keypoints as local extrema of a second-derivative response (trace vs. determinant of the Hessian, respectively), following the same pipeline: filter → threshold → find local extrema → keep the strongest points.
- The **Harris detector** builds a local **structure matrix** $\mathbf{M}$ from squared/cross gradients over a window; its eigenvalues classify a pixel as flat, edge, or corner, and the cheap-to-compute score $C = \det(\mathbf{M}) - k\,\text{trace}(\mathbf{M})^2$ avoids explicit eigendecomposition. Harris is invariant to brightness offset, shift, and rotation, but **not to scale**.
- **FAST** replaces convolution with a fast segment test on a 16-pixel Bresenham circle around each candidate pixel (needing $n=9$ contiguous pixels uniformly brighter or darker than the center), with early-rejection and machine-learned comparison ordering making it fast enough for **real-time keypoint detection and tracking on mobile devices**.
- All four detectors follow the same conceptual pipeline (response → threshold → local extrema → strongest-$N$ keypoints); they differ mainly in what local property they measure and how expensive that measurement is, which drives the accuracy/speed trade-off in practice.

