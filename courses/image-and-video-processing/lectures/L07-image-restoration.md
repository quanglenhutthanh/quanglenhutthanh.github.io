---
title: "Image Restoration"
subject: "image-and-video-processing"
type: lecture
lecture_no: 7
status: done
source: slide
tags: [image-restoration, noise-models, wiener-filter, inverse-filtering, order-statistic-filters]
date: 2024-10-04
---

# Lecture 7 – Image Restoration

> Main content: the image degradation/restoration model, the main probability density functions used to describe noise and how to estimate them from a histogram, spatial-domain noise reduction (mean filters and order-statistic filters, plus a brief look at adaptive filters), frequency-domain reduction of periodic noise (band-reject, band-pass, and notch filters), and deblurring of linear, position-invariant degradations using inverse filtering and Wiener filtering.

---

## 7.1 Modeling of the Image Degradation and Restoration Problem

Image restoration deals with images that have been subject to some **quality degradation** — blurring caused by lack of focus or camera motion, atmospheric disturbance, or geometric distortion from imperfect lenses — and that may additionally have been contaminated by **additive noise**. Unlike image *enhancement* (Lectures 5 and 6), which improves an image's appearance without modeling the degradation itself, restoration techniques try to **reverse a mathematically modeled degradation process** to recover an image as close as possible to the original.

The degradation model has three components:

- $f(x,y)$ — the original (unknown) image.
- $h(x,y)$ — the degradation function (e.g., blur kernel), applied as a convolution.
- $n(x,y)$ — additive noise, independent of the degradation.

The degraded image $g(x,y)$, which is the actual input available to a restoration algorithm, is given by

$$g(x,y) = f(x,y) * h(x,y) + n(x,y)$$

where $*$ denotes convolution. By the convolution theorem, this becomes a simple product in the frequency domain:

$$G(u,v) = F(u,v)H(u,v) + N(u,v)$$

A restoration filter tries to invert this process, producing a restored image $r(x,y)$, interpreted as an estimate $\hat{f}(x,y)$ of the original image. Designing a restoration filter typically follows three steps:

1. Collect knowledge about the degradation process (e.g., from examples of degraded images, or from knowledge of the acquisition process).
2. Use that knowledge to build a mathematical degradation model.
3. Derive the inverse of the degradation process and implement it as a filter.

Restoration filters are, by construction, specific to the type of degradation they were designed for, and they can operate either in the spatial domain (typically for noise-only degradation) or in the frequency domain (typically for blur or periodic noise).

---

## 7.2 Noise and Noise Models

**Noise** is any undesired artifact contaminating an image. It can originate from many sources — thermal noise in the acquisition sensor, periodic interference in a transmission channel carrying an image from a remote sensor to a base station, and so on. Because noise is essentially unpredictable, it is modeled statistically: treated as a **random variable** whose probability density function (PDF), or empirically its histogram, describes how its values are distributed across the range of gray levels. Some noise patterns can also be characterized in the frequency domain, through their spectrum (this is especially useful for periodic noise, covered in Section 7.4).

Studying noise models serves three purposes: (1) describing the main noise types mathematically and graphically, (2) recognizing that different noise types call for different reduction techniques, and (3) introducing the problem of estimating noise parameters from a real, degraded image.

### 7.2.1 Selected Noise Probability Density Functions

**Gaussian noise.** The PDF of a Gaussian random variable $z$ is

$$p_g(z) = \frac{1}{\sqrt{2\pi}\,\sigma}\, e^{-(z-\bar{z})^2/2\sigma^2}$$

where $z$ is the gray level, $\bar{z}$ is its mean, and $\sigma$ is its standard deviation ($\sigma^2$ is the variance). Gaussian noise is the most common model for sensor/electronic noise, is fully symmetric around the mean, and is the noise type best suited to being reduced by simple averaging.

**Impulse (salt-and-pepper) noise.** The PDF of bipolar impulse noise is

$$p_{sp}(z) = \begin{cases} P_p & \text{for } z = p \\ P_s & \text{for } z = s \\ 0 & \text{otherwise} \end{cases}$$

where $P_p$ and $P_s$ are the probabilities of a pixel taking the value $p$ (pepper, typically the darkest gray level) or $s$ (salt, typically the brightest). Unlike Gaussian noise, which perturbs every pixel by a small amount, salt-and-pepper noise corrupts a fraction of pixels outright, replacing them with extreme values.

**Uniform noise.** The histogram of uniform noise is

$$p_u(z) = \begin{cases} \dfrac{1}{b-a} & \text{if } a \le z \le b \\ 0 & \text{otherwise} \end{cases}$$

with $0 \le a < b$. Its mean and variance are

$$\bar{z} = \frac{a+b}{2}, \qquad \sigma^2 = \frac{(b-a)^2}{12}$$

**Rayleigh noise.** The PDF is

$$p_r(z) = \begin{cases} \dfrac{2}{b}(z-a)\, e^{-(z-a)^2/b} & \text{for } z \ge a \\ 0 & \text{for } z < a \end{cases}$$

with $a \ge 0$, $0 < a < b$. Its mean and variance are

$$\bar{z} = a + \sqrt{\pi b / 4}, \qquad \sigma^2 = \frac{b(4-\pi)}{4}$$

Note the characteristic asymmetric (right-skewed) shape, which distinguishes it visually from the Gaussian PDF.

**Gamma (Erlang) noise.** The histogram is

$$p_E(z) = \begin{cases} \dfrac{a^b z^{b-1}}{(b-1)!}\, e^{-az} & \text{for } z \ge 0 \\ 0 & \text{for } z < 0 \end{cases}$$

where $a > 0$ and $b$ is a positive integer. Its mean and variance are

$$\bar{z} = \frac{b}{a}, \qquad \sigma^2 = \frac{b}{a^2}$$

**Exponential noise.** A special case of the Erlang PDF with $b = 1$:

$$p_{exp}(z) = \begin{cases} a\, e^{-az} & \text{for } z \ge 0 \\ 0 & \text{for } z < 0 \end{cases}$$

with mean and variance

$$\bar{z} = \frac{1}{a}, \qquad \sigma^2 = \frac{1}{a^2}$$

**Summary of the six PDFs:**

| Noise type | Parameters | Mean | Variance | Typical shape |
|---|---|---|---|---|
| Gaussian | $\bar{z}, \sigma$ | $\bar{z}$ | $\sigma^2$ | symmetric bell curve |
| Salt-and-pepper (impulse) | $P_p, P_s$ | — | — | two spikes at extreme values |
| Uniform | $a, b$ | $(a+b)/2$ | $(b-a)^2/12$ | flat rectangle |
| Rayleigh | $a, b$ | $a+\sqrt{\pi b/4}$ | $b(4-\pi)/4$ | right-skewed, starts at $a$ |
| Gamma (Erlang) | $a, b$ | $b/a$ | $b/a^2$ | right-skewed, controlled by order $b$ |
| Exponential | $a$ | $1/a$ | $1/a^2$ | monotonically decreasing, Erlang with $b=1$ |

**Example 7.1.** Applying each of these noise types to a simple two-gray-level test image and inspecting the resulting histograms makes the theoretical shapes concrete: the Gaussian-corrupted image shows a bell-shaped spread around each original gray level, the exponential and Rayleigh cases show the expected skew, salt-and-pepper produces sharp isolated spikes at the extremes, gamma noise shows a broader skewed lobe, and uniform noise produces a flat-topped spread.

### 7.2.2 Noise Estimation

Before designing a noise-reduction filter, it is generally necessary to **estimate which noise model applies** and what its parameters are. When the noise mainly originates in the acquisition sensor, the standard approach is to capture dedicated test images consisting of large homogeneous gray-level patches and inspect the resulting histograms directly.

When such controlled test images are not available, a practical alternative is to **crop a large, visually homogeneous region** from an already-acquired image and examine its histogram. This matters because the histogram of the *whole* image (which mixes many different true gray levels plus noise) rarely gives a clean read on the noise type, while the histogram of a homogeneous patch — where all pixels should ideally share one true gray level — isolates the noise distribution cleanly.

**Example 7.2.** Adding noise to an image drastically changes its overall histogram, but that overall histogram alone is not a reliable indicator of the noise type. Cropping a homogeneous rectangular patch from the noisy image and plotting *its* histogram, however, can reveal the underlying distribution clearly (e.g., a bell shape indicating Gaussian noise).

**In MATLAB:** the function `imnoise` adds synthetic noise to an image. It supports Gaussian and salt-and-pepper additive noise, as well as speckle multiplicative noise, but it does **not** natively support Rayleigh, uniform, Erlang, or exponential noise (these would need to be implemented manually, as posed in Problem 1 below).

---

## 7.3 Noise Reduction Using Spatial-Domain Techniques

Noise-reduction filters assume that the *only* degradation present is additive noise (no blurring, i.e., $h(x,y)$ is effectively an identity/delta function):

$$g(x,y) = f(x,y) + n(x,y), \qquad G(u,v) = F(u,v) + N(u,v)$$

There are three families of spatial-domain noise-reduction filters: **mean filters** (7.3.1), **order-statistic filters** (7.3.2), and **adaptive filters** (7.3.3).

### 7.3.1 Mean Filters

**Arithmetic mean filter.** Also called the averaging filter. It slides an $m \times n$ window $W$ over the noisy image $g$, replacing the center pixel with the average of all pixel values inside the window:

$$\hat{f}(x,y) = \frac{1}{mn} \sum_{(r,c)\in W} g(r,c)$$

It reduces noise at the cost of a blurring proportional to the window size, and works best on Gaussian, uniform, or Erlang noise.

**Geometric mean filter.** A variant primarily used on Gaussian noise, known to preserve image detail better than the arithmetic mean filter:

$$\hat{f}(x,y) = \left[ \prod_{(r,c)\in W} g(r,c) \right]^{1/mn}$$

**Harmonic mean filter.** Useful for Gaussian or salt noise; it fails on pepper noise (dark/zero-valued pixels dominate the sum and are not filtered out):

$$\hat{f}(x,y) = \frac{mn}{\displaystyle\sum_{(r,c)\in W} 1/g(r,c)}$$

**Contraharmonic mean filter.** Designed specifically for salt-*or*-pepper noise (not both at once). Negative order $R$ removes salt noise; positive $R$ removes pepper noise:

$$\hat{f}(x,y) = \frac{\displaystyle\sum_{(r,c)\in W} g(r,c)^{R+1}}{\displaystyle\sum_{(r,c)\in W} g(r,c)^{R}}$$

**Comparison of the four mean filters:**

| Filter | Formula core | Best suited for | Notes |
|---|---|---|---|
| Arithmetic | average | Gaussian, uniform, Erlang | uniform blurring, proportional to window size |
| Geometric | product$^{1/mn}$ | Gaussian | better detail preservation than arithmetic mean |
| Harmonic | $mn / \sum(1/g)$ | Gaussian, salt | fails on pepper (dark pixels) |
| Contraharmonic | ratio of power sums, order $R$ | salt ($R<0$) or pepper ($R>0$) | wrong sign of $R$ makes the noise worse |

**Example 7.3 (Gaussian noise, zero mean, variance 0.01).** All four filters reduce noise relative to the unfiltered noisy image. The geometric and harmonic mean filters tend to darken the result (more dark pixels appear) compared with the arithmetic mean. Increasing the window size from 3×3 to 5×5 removes more noise but introduces significantly more blur — the classic noise/blur trade-off inherent to averaging filters.

**Example 7.4 (salt-and-pepper noise).** Here the arithmetic mean filter is the only one of the four that gives an acceptable result. The geometric and harmonic mean filters perform very poorly on the pepper component. The contraharmonic filter confirms the expected behavior: with $R=0.5$ it removes pepper noise but leaves salt noise (or amplifies it), and with $R=-0.5$ the opposite happens. This experiment underscores why contraharmonic filtering requires knowing in advance *which* of the two noise polarities is present.

### 7.3.2 Order-Statistic Filters

Order-statistic filters (also called rank filters) operate on a neighborhood by **sorting** the pixel values it contains and computing a function of the sorted (ranked) sequence. They are computationally more expensive than mean filters but perform markedly better in the presence of salt-and-pepper noise, because they can discard outlier values entirely rather than averaging them in.

**Median filter.** The most widely used rank filter. It replaces the reference pixel with the median value of the ordered set of pixels within window $W$ (if $mn$ is even, the average of the two middle values is used):

$$\hat{f}(x,y) = \operatorname{median}\{\, g(r,c) \mid (r,c) \in W \,\}$$

**Min and max filters.** The min filter (0th percentile filter) replaces the reference pixel with the smallest value in the window; it is effective against **salt** noise:

$$\hat{f}(x,y) = \min\{\, g(r,c) \mid (r,c) \in W \,\}$$

The max filter (100th percentile filter) replaces it with the largest value; it is effective against **pepper** noise:

$$\hat{f}(x,y) = \max\{\, g(r,c) \mid (r,c) \in W \,\}$$

**Midpoint filter.** Averages the maximum and minimum values in the window, combining order statistics with averaging. Useful for Gaussian and uniform noise:

$$\hat{f}(x,y) = \frac{1}{2}\Big[ \max\{\, g(r,c) \mid (r,c)\in W \,\} + \min\{\, g(r,c) \mid (r,c)\in W \,\} \Big]$$

**Alpha-trimmed mean filter.** Sorts the pixel values in the window, discards the $D$ lowest and $D$ highest values, and averages the remaining $mn - 2D$ values:

$$\hat{f}(x,y) = \frac{1}{mn - 2D} \sum_{(r,c)\in W} g(r,c)$$

where $D$ can range from $0$ to $(mn-1)/2$. It nicely bridges the two other filter families: at $D = 0$ it is exactly the arithmetic mean filter; at $D = (mn-1)/2$ it is exactly the median filter. This makes it useful when an image is corrupted by **more than one** noise type simultaneously (e.g., both salt-and-pepper, best handled by the median, and Gaussian, best handled by the arithmetic mean).

**Example 7.5 (salt-and-pepper noise).** The median filter clearly outperforms the arithmetic mean filter of the same window size. The midpoint filter is actually counterproductive here: because it averages the extreme min/max values in each window, it spreads the effect of a single noisy pixel to its neighbors, making the noise worse rather than better — a good illustration that filter choice must match noise type.

**In MATLAB:** general sliding-window neighborhood operations are implemented via `nlfilter` or `colfilt`, both of which accept a user-defined function (linear or nonlinear) to apply to each window; `colfilt` is considerably faster than `nlfilter` for large images. For rank filters specifically, `ordfilt2` makes it easy to build min, max, and median filters by choosing which rank (index after sorting) to keep. Because the median filter is so common, IPT also provides the dedicated function `medfilt2`.

### 7.3.3 Adaptive Filters

Adaptive filters change their behavior depending on the statistics of the local neighborhood currently being processed, rather than applying a fixed operation everywhere. A classical application is **edge-preserving smoothing**: applying a low-pass filter selectively so as to minimize the edge-blurring effect that a standard (non-adaptive) LPF would otherwise cause. Many variants of adaptive filters exist in the literature for noise reduction and restoration, trading off implementation complexity against restoration quality.

---

## 7.4 Noise Reduction Using Frequency-Domain Techniques

### 7.4.1 Periodic Noise

Periodic noise typically arises from **electrical or electromechanical interference** during image acquisition (e.g., an improperly grounded or shielded sensor circuit picking up a sinusoidal signal). Because it is periodic in the spatial domain, it appears as a small number of concentrated, bright impulse-like points in the Fourier spectrum — one pair of impulses per sinusoidal interference source, symmetric about the origin. This structure makes periodic noise a natural target for frequency-domain filtering rather than spatial-domain filtering: the noise is compact and localized in frequency, even though it is spread across the whole image in the spatial domain.

**Example 7.6.** An image corrupted by periodic noise, its noise-only component, and its Fourier spectrum together illustrate this: the spectrum shows several bright dot pairs, each pair corresponding to one sinusoidal interference frequency superimposed on the image.

### 7.4.2 Band-Reject Filter

A band-reject filter attenuates frequencies within a chosen annular band (the stopband) while leaving all other frequencies unaffected (or amplified by some gain). The ideal band-reject filter is

$$H_{br}(u,v) = \begin{cases} 1 & \text{if } D(u,v) < D_0 - \dfrac{W}{2} \\[4pt] 0 & \text{if } D_0 - \dfrac{W}{2} \le D(u,v) \le D_0 + \dfrac{W}{2} \\[4pt] 1 & \text{if } D(u,v) > D_0 + \dfrac{W}{2} \end{cases}$$

where $D(u,v)$ is the distance from the origin of the (centered) frequency spectrum, $D_0$ is the radius of the band, and $W$ is its width.

The Butterworth band-reject filter of order $n$ is

$$H_{br}(u,v) = \frac{1}{1 + \left[ \dfrac{D(u,v)\,W}{D^2(u,v) - D_0^2} \right]^{2n}}$$

and the Gaussian band-reject filter is

$$H_{br}(u,v) = 1 - e^{-\frac{1}{2}\left[\frac{D^2(u,v)-D_0^2}{D(u,v)\,W}\right]^2}$$

As with low-pass filtering, the ideal filter's sharp cutoff between passband and stopband produces ringing artifacts in the spatial domain; the Butterworth and Gaussian variants trade a softer transition for reduced ringing.

**Example 7.7.** An ideal band-reject filter with $D_0 = 32$ and $W = 6$ successfully removes periodic noise from a test image, but the restored image shows a visible ringing artifact due to the abrupt transition of the ideal filter's transfer function.

### 7.4.3 Band-Pass Filter

A band-pass filter does the opposite of a band-reject filter — it preserves frequencies inside its passband while attenuating everything else. It can be obtained directly from the band-reject filter's transfer function:

$$H_{bp}(u,v) = 1 - H_{br}(u,v)$$

**Ideal band-pass filter:**

$$H_{bp}(u,v) = \begin{cases} 0 & \text{if } D(u,v) < D_0 - \dfrac{W}{2} \\[4pt] 1 & \text{if } D_0 - \dfrac{W}{2} \le D(u,v) \le D_0 + \dfrac{W}{2} \\[4pt] 0 & \text{if } D(u,v) > D_0 + \dfrac{W}{2} \end{cases}$$

**Butterworth band-pass filter (order $n$):**

$$H_{bp}(u,v) = \frac{\left[ \dfrac{D(u,v)\,W}{D^2(u,v) - D_0^2} \right]^{2n}}{1 + \left[ \dfrac{D(u,v)\,W}{D^2(u,v) - D_0^2} \right]^{2n}}$$

**Gaussian band-pass filter:**

$$H_{bp}(u,v) = e^{-\frac{1}{2}\left[\frac{D^2(u,v)-D_0^2}{D(u,v)\,W}\right]^2}$$

Band-reject filters are used to *remove* periodic interference concentrated at specific frequencies; band-pass filters are used in the complementary situation, where the frequencies of interest (e.g., the periodic pattern itself, for analysis purposes) are the ones to keep. A closely related tool not detailed further here is the **notch filter**, which rejects (or passes) small, localized regions of the spectrum centered at specific $(u_0, v_0)$ coordinates rather than a full circular band — this is the natural choice when the noise impulses are isolated points rather than a whole ring, and it is the subject of Problem 7 below.

---

## 7.5 Image Deblurring Techniques

Deblurring addresses the complementary case: an image degraded mainly by **blurring** (camera motion, poor focus) rather than noise. The simplest deblurring technique, **inverse filtering**, operates in the frequency domain and assumes there is no significant noise in the degraded image, i.e., $N(u,v) \approx 0$:

$$G(u,v) = F(u,v)H(u,v)$$

which can be inverted directly:

$$F(u,v) = \frac{G(u,v)}{H(u,v)} = G(u,v)\, \frac{1}{H(u,v)}$$

The term $1/H(u,v)$ is the Fourier transform of the restoration filter, denoted $R_{inv}(u,v)$. In practice, naive inverse filtering is rarely usable: wherever $H(u,v)$ is very small (or zero), the division by $H(u,v)$ amplifies whatever residual noise is present to the point of dominating the result, even when that noise was negligible to begin with. Two common remedies exist:

1. **Low-pass the division.** Multiply the naive inverse result by a low-pass transfer function $L(u,v)$, restricting the correction to frequencies below a chosen restoration cutoff:

   $$F(u,v) = \frac{G(u,v)}{H(u,v)}\, L(u,v)$$

   Within the filter's passband the gain is set to a desired positive value (usually 1); within the stopband the gain is zero. An ideal LPF's sharp transition tends to cause ringing, so smoother filters (e.g., a high-order Butterworth LPF) are often preferred.

2. **Constrained division.** Choose a threshold $T$; only perform the division where $H(u,v)$ is not too small, otherwise leave the frequency component untouched:

   $$F(u,v) = \begin{cases} \dfrac{G(u,v)}{H(u,v)} & \text{if } |H(u,v)| \ge T \\[6pt] G(u,v) & \text{otherwise} \end{cases}$$

**Example 7.8.** Applying naive inverse filtering to a blurry image yields a completely unacceptable result, dominated by noise amplified from divisions by near-zero values of $H(u,v)$. Applying a 10th-order Butterworth LPF to the division (at two different cutoff frequencies) produces a much cleaner restored image, with the trade-off that a lower cutoff sacrifices some sharpness in exchange for less amplified noise. Constrained division, at two different thresholds $T$, achieves a comparable trade-off directly. Motion deblurring — restoring an image blurred by relative motion between sensor and scene, e.g., simulated in MATLAB with `fspecial('motion',10,0)` for a 10-pixel horizontal displacement — is treated as a special case of the same inverse-filtering approach.

---

## 7.6 Wiener Filtering

The **Wiener filter**, developed by Norbert Wiener in 1942, addresses the general (and realistic) case where the degraded image contains **both** blurring and noise — the worst-case scenario in the degradation model of Section 7.1. Unlike inverse filtering, it does not assume noise is negligible.

The Wiener filter is derived by modeling the restoration error statistically and minimizing it in a **minimum mean square error (MMSE)** sense: given the original image $f(x,y)$ and the restored image $r(x,y)$, the sum of squared pixel-wise differences is used as a figure of merit — smaller values indicate better restoration — and the filter is designed to minimize the *expected* value of this quantity.

The transfer function of the Wiener filter is

$$R(u,v) = \frac{1}{H(u,v)}\, \frac{|H(u,v)|^2}{|H(u,v)|^2 + K}\, G(u,v)$$

where $H(u,v)$ is the degradation function and $K$ is a constant that approximates the noise-to-signal power ratio (i.e., it stands in for the noise level relative to the signal). Note that as $K \to 0$, the Wiener filter reduces to the plain inverse filter $G(u,v)/H(u,v)$; larger $K$ increasingly favors noise suppression over sharpness.

**In MATLAB:** `deconvwnr` implements Wiener-filter-based deblurring.

**Example 7.9.** For an image degraded by both blur and noise, plain inverse filtering (even with a 10th-order Butterworth LPF limiting the restoration to frequencies below cutoff 50) leaves visible artifacts. Applying the Wiener filter with different values of $K$ demonstrates the fundamental trade-off: higher $K$ improves noise suppression but at the cost of less aggressive deblurring, while lower $K$ deblurs more aggressively but lets more noise through. When the degradation involves blurring **without** noise, the Wiener filter can still be used and performs best at low $K$ — but even then the result is somewhat less crisp than what plain inverse filtering achieves in the noise-free case, since the Wiener filter is inherently a compromise designed for the noisy scenario.

**Other MATLAB deblurring functions:**

| Function | Method |
|---|---|
| `deconvwnr` | Wiener filter |
| `deconvreg` | Regularized filter (constrained least squares) |
| `deconvlucy` | Lucy–Richardson iterative method |
| `deconvblind` | Blind deconvolution (degradation function unknown, estimated jointly with the image) |

The mathematical formulation and parameter tuning of `deconvreg`, `deconvlucy`, and `deconvblind` go beyond what is covered in this lecture; consult the MATLAB documentation and demos for details.

---

## 7.7 Tutorial: Noise Reduction Using Spatial-Domain Techniques

**Goal:** practice implementing spatial-domain noise-reduction filters directly in MATLAB.

**Objectives:** implement the arithmetic mean filter and its variants (contraharmonic, harmonic, geometric mean), and implement order-statistic filtering (median, min, max, midpoint, alpha-trimmed mean).

### Arithmetic mean filter

```matlab
% 1. Load the image, add Gaussian noise, display before/after
I  = imread('eight.tif');
In = imnoise(I,'gaussian',0,0.001);
figure, subplot(2,2,1), imshow(I),  title('Original Image');
subplot(2,2,2), imshow(In), title('Noisy Image');

% 2. Apply an averaging filter with the default 3x3 kernel
f1 = fspecial('average');
I_blur1 = imfilter(In,f1);
subplot(2,2,3), imshow(I_blur1), title('Averaging with default kernel size');

% 3. Apply an averaging filter with a 5x5 kernel
f2 = fspecial('average',[5 5]);
I_blur2 = imfilter(In,f2);
subplot(2,2,4), imshow(I_blur2), title('Averaging with 5x5 kernel');
```

*Question 1: What is the general effect of the arithmetic mean filter?*
*Question 2: How does the size of the kernel affect the resulting image?*

### Contraharmonic mean filter

```matlab
% 5. Load noisy versions of the image (salt-only, pepper-only)
I_salt   = im2double(imread('eight_salt.tif'));
I_pepper = im2double(imread('eight_pepper.tif'));
figure
subplot(2,3,1), imshow(I),        title('Original Image');
subplot(2,3,2), imshow(I_salt),   title('Salt Noise');
subplot(2,3,3), imshow(I_pepper), title('Pepper Noise');
```

The contraharmonic function requires `double`-class images, hence the `im2double` conversion above.

```matlab
% 6. Filter the salt-noise image with r = -1
I_fix1 = nlfilter(I_salt,[3 3],@c_harmonic,-1);
subplot(2,3,5), imshow(I_fix1), title('Salt Removed, r = -1');

% 7. Filter the pepper-noise image with r = 1
I_fix2 = nlfilter(I_pepper,[3 3],@c_harmonic,1);
subplot(2,3,6), imshow(I_fix2), title('Pepper Removed, r = 1');

% 8. Use the wrong sign for r on the pepper-noise image
I_bad = nlfilter(I_pepper,[3 3],@c_harmonic,-1);
subplot(2,3,4), imshow(I_bad), title('Using wrong sign for r');
```

`c_harmonic` is a user-defined function taking the current window matrix (implicitly passed by `nlfilter`) plus the order `r`, supplied after the function handle in the `nlfilter` call.

*Question 3: What is the effect of using the wrong sign when filtering with the contraharmonic mean filter?*

### Harmonic mean filter

The harmonic mean filter is good for salt and Gaussian noise, but fails on pepper noise.

```matlab
% 10. Filter the salt-noise image with the harmonic filter
I_fix4 = nlfilter(I_salt,[3 3],@harmonic);
figure
subplot(2,3,1), imshow(I),        title('Original Image');
subplot(2,3,2), imshow(I_salt),   title('Salt Noise');
subplot(2,3,3), imshow(I_pepper), title('Pepper Noise');
subplot(2,3,5), imshow(I_fix4),   title('Harmonic Filtered (salt)');

% 11. Filter the pepper-noise image and display the (poor) result
I_bad2 = nlfilter(I_pepper,[3 3],@harmonic);
subplot(2,3,6), imshow(I_bad2), title('Harmonic Filtered (pepper)');
```

*Question 4: Why does the harmonic mean filter fail for images with pepper noise?*

```matlab
% 12. Filter the Gaussian-noise image with the harmonic mean filter
In_d   = im2double(In);
I_fix5 = nlfilter(In_d,[3 3],@harmonic);
figure
subplot(1,3,1), imshow(I),      title('Original Image');
subplot(1,3,2), imshow(In_d),   title('Image w/ Gaussian Noise');
subplot(1,3,3), imshow(I_fix5), title('Filtered w/ Harmonic Mean');
```

*Question 5: How does the size of the window affect the output image?*

### Geometric mean filter

The geometric mean filter preserves detail better than the arithmetic mean and works best on Gaussian noise.

```matlab
% 14. Geometric mean filter on the Gaussian-noise image
I_fix6 = nlfilter(In_d,[3 3],@geometric);
figure
subplot(1,3,1), imshow(I),      title('Original Image');
subplot(1,3,2), imshow(In_d),   title('Gaussian Noise');
subplot(1,3,3), imshow(I_fix6), title('Geometric Mean Filtered');
```

*Question 6: Filter the salt-and-pepper noise images with the geometric mean filter. How does the filter perform?*

### Order-statistic filters

The median filter — the most popular order-statistic filter — is available directly as `medfilt2`.

```matlab
% 16-17. Median filtering of salt-and-pepper noise
I     = imread('coins.png');
I_snp = imnoise(I,'salt & pepper');
figure
subplot(1,3,1), imshow(I),     title('Original Image');
subplot(1,3,2), imshow(I_snp), title('Salt & Pepper Noise');

I_filt = medfilt2(I_snp,[3 3]);
subplot(1,3,3), imshow(I_filt), title('Filtered Image');
```

*Question 7: How does the size of the window affect the output image?*

```matlab
% 18. Median filter applied to Gaussian noise instead
I_g     = imnoise(I,'gaussian');
I_filt2 = medfilt2(I_g,[3 3]);
figure
subplot(1,3,1), imshow(I),      title('Original Image');
subplot(1,3,2), imshow(I_g),    title('Gaussian Noise');
subplot(1,3,3), imshow(I_filt2), title('Filtered');
```

*Question 8: Why does the median filter work well on salt-and-pepper noise but not on Gaussian noise?*

`ordfilt2` implements general order-statistic operations: the second argument selects which rank (index after sorting) is kept, and the third argument (a matrix of 0/1) defines the window shape and which positions participate in the ordering.

```matlab
% 20. Min filter (rank 1 of 9) on salt-noise image
I_s = imread('eight_salt.tif');
I2  = ordfilt2(I_s, 1, ones(3,3));
figure
subplot(1,2,1), imshow(I_s), title('Salt Noise');
subplot(1,2,2), imshow(I2),  title('Min Filter');
```

*Question 9: Why would this filter not work on pepper noise?* (A 3×3 all-ones mask uses all 9 window values for ordering; e.g. restricting the mask to only the top row would use only the top three values.)

*Question 10: Implement the median filter using `ordfilt2`.* (For a 3×3 window, this is rank 5 of 9: `ordfilt2(I, 5, ones(3,3))`.)

```matlab
% 21. Max filter (rank 9 of 9) on pepper-noise image
I_p = imread('eight_pepper.tif');
I3  = ordfilt2(I_p, 9, ones(3,3));
figure
subplot(1,2,1), imshow(I_p), title('Pepper Noise');
subplot(1,2,2), imshow(I3),  title('Max Filter');
```

```matlab
% 22. Midpoint filter on Gaussian noise
I   = imread('coins.png');
I_g = imnoise(I,'gaussian',0,0.001);
midpoint = inline('0.5 * (max(x(:)) + min(x(:)))');
I_filt   = nlfilter(I_g,[3 3],midpoint);
figure
subplot(1,2,1), imshow(I_g),   title('Gaussian Noise');
subplot(1,2,2), imshow(I_filt), title('Midpoint Filter');
```

### Alpha-trimmed mean filter

```matlab
% 24. Image with both salt-and-pepper AND Gaussian noise
I   = imread('cameraman.tif');
Id  = im2double(I);
In  = imnoise(Id,'salt & pepper');
In2 = imnoise(In,'gaussian');

% 25. Alpha-trimmed mean filter, 5x5 window, D = 6
I_filt = nlfilter(In2,[5 5],@atmean,6);
figure
subplot(1,3,1), imshow(I),      title('Original Image');
subplot(1,3,2), imshow(In2),    title('S&P and Gaussian Noise');
subplot(1,3,3), imshow(I_filt), title('Alpha Trimmed Mean');
```

*Question 11: When filtering an image with both types of noise, how does the alpha-trimmed mean filter compare to the arithmetic mean filter?* (It should do noticeably better, since it can discard the salt-and-pepper outliers before averaging out the remaining Gaussian noise — exactly the scenario it was designed for.)

---

## What have we learned?

- In image processing, **noise** describes deviations from a pixel's expected (true) value. When these are offsets, the noise is **additive**; when the true value is rescaled, the noise is **multiplicative**.
- Noise is usually modeled statistically, independent of its physical cause. Common PDFs are Gaussian, exponential, uniform, and gamma (Erlang), plus the special impulsive case of salt-and-pepper noise.
- **Gaussian noise** (zero-mean, additive, symmetric) and **salt-and-pepper noise** (impulsive, additive) are the two most common noise types encountered in practice.
- The most common spatial-domain noise-removal techniques are the **mean filter**, the **median filter**, and their variants and combinations (geometric, harmonic, contraharmonic mean filters; min, max, midpoint, alpha-trimmed mean filters).
- The most common frequency-domain noise-removal techniques are **low-pass, band-pass, band-reject, and notch filters** — particularly effective against periodic noise, which concentrates in a small set of frequencies.
- **Blurring** is loss of sharpness, caused by poor focusing, relative motion between sensor and scene, or other factors. Deblurring techniques apply **inverse filtering** to "undo" a known (or estimated) degradation function.
- The best-known deblurring approach that also handles noise gracefully is the **Wiener filter**, implemented in MATLAB by `deconvwnr`; naive inverse filtering, by contrast, is only usable when noise is negligible, and even then needs to be tempered with a low-pass constraint or a constrained-division threshold to avoid amplifying near-zero values of $H(u,v)$.

