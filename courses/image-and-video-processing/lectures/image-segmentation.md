---
title: "Image Segmentation"
subject: "image-and-video-processing"
type: lecture
lecture_no: 10
status: done
source: slide
tags: [segmentation, thresholding, region-growing, watershed, hough-transform]
date: 2024-10-25
---

# Lecture 10 – Image Segmentation

> This lecture marks the transition from low-level image processing to image analysis: **segmentation** is the operation that turns a preprocessed image into a representation of the regions it contains — either as region boundaries or as a labeling of which pixel belongs to which region. We cover intensity-based segmentation (global, illumination-robust, and adaptive/local thresholding), region-based segmentation (region growing, split-and-merge), and the morphological watershed transform, together with their MATLAB implementations (`im2bw`, `graythresh`, `blkproc`, `bwdist`, `watershed`).

---

## 10.1 Introduction

Segmentation is one of the most crucial tasks in image processing and computer vision. As introduced back in Lecture 1 (Section 1.5), segmentation is the step that separates *low-level image processing* from *image analysis*: the input of a segmentation block in a machine vision system (MVS) is a preprocessed image, while its output is a **representation of the regions** within that image. That representation can take two forms:

- The **boundaries** among regions — the natural output of edge-based segmentation techniques.
- Information about **which pixel belongs to which region** — the natural output of clustering- or region-based segmentation.

Once an image has been segmented, the resulting individual regions (or objects) can be described, represented, analyzed, and classified using further techniques (shape descriptors, texture features, classifiers, etc.).

Formally, segmentation is the process of **partitioning an image into a set of nonoverlapping regions whose union is the entire image**. Ideally, those regions correspond to meaningful objects, their parts, and the background. Almost every segmentation algorithm exploits one (or a combination) of two basic pixel properties:

- **Discontinuity** — abrupt changes in intensity (edges), used by edge-based methods.
- **Similarity** — pixels that share a common property (intensity, texture, color) are grouped together, used by thresholding and region-based methods.

Segmentation of nontrivial images is a genuinely hard problem, made worse by nonuniform lighting, cast shadows, occlusion among objects, and poor contrast between objects and background. Despite roughly forty years of proposed algorithms, segmentation remains, except for relatively "easy" scenes, an unsolved problem — there is no unifying theory, only ad-hoc methods whose performance is usually judged indirectly, by how well the larger system that uses them performs.

A classic illustration used in this lecture contrasts two test images:

- A **hard** scene of four Lego bricks under uneven lighting, with shadows and occlusion among the bricks — segmenting it into the four objects plus background is essentially impossible for the grayscale techniques covered here without resorting to color information.
- An **easy** scene of coins on a uniform background — after a small amount of preprocessing (e.g., filling holes with `imfill`), a simple global threshold followed by labeling is enough to achieve a near-perfect segmentation.

This pair of examples is a recurring theme throughout the lecture: the same algorithm can range from useless to excellent purely as a function of image conditions (illumination, contrast, occlusion).

### Taxonomy of segmentation techniques

There is no universally accepted classification of segmentation algorithms; techniques vary by image type (binary, gray, color), mathematical framework (morphology, statistics, graph theory), feature type (intensity, color, texture, motion), and strategy (bottom-up, top-down, graph-based). For this course, methods are grouped into three broad categories:

| Category | Also known as | Basis | Representative techniques |
|---|---|---|---|
| **Intensity-based** | Non-contextual methods | Pixel distributions / histograms | Thresholding (global, local, multiple) |
| **Region-based** | Contextual methods | Adjacency and connectivity between a pixel and its neighbors | Region growing, split and merge |
| **Other** | — | Everything that doesn't fit the two categories above | Texture-, edge-, and motion-based segmentation, watershed |

The remainder of this lecture works through intensity-based segmentation (Section 10.2), region-based segmentation (Section 10.3), and the watershed transform (Section 10.4), closing with a hands-on MATLAB tutorial (Section 10.5).

---

## 10.2 Intensity-Based Segmentation

Intensity-based methods are conceptually the simplest approach to segmentation. They rely on pixel statistics — typically expressed as a histogram — to decide which pixels belong to foreground objects and which should be labeled background. The simplest and best-known technique in this family is **image thresholding**.

### 10.2.1 Image Thresholding

The basic problem thresholding solves is converting an image with many gray levels into one with far fewer — usually just two (black/white). The conversion works by comparing every pixel's intensity against a **reference value**, the threshold $T$ (hence the name), and replacing the pixel with a value that means "white" or "black" depending on the outcome of that comparison:

$$
g(x,y) = \begin{cases} 1 & \text{if } f(x,y) > T \\ 0 & \text{if } f(x,y) \le T \end{cases}
$$

Thresholding is enormously popular because of its simplicity, intuitive interpretation, and ease of implementation. It is a natural preprocessing step in machine vision systems where there are relatively few objects of interest, where an object's shape (silhouette) matters more than its surface properties (texture), and where the average brightness of objects is clearly higher or lower than everything else in the scene.

A classic example is the coins test image: its histogram is **bimodal**, with a narrow, tall peak on the left (background pixels) and a broader peak on the right (pixels belonging to the coins). Whenever a histogram looks like this, a single threshold placed in the valley between the two peaks is enough to separate foreground from background.

**In MATLAB:** the Image Processing Toolbox provides `im2bw` to convert a grayscale image into a binary image, taking the image and a threshold value (normalized to $[0,1]$) as inputs.

### 10.2.2 Global Thresholding

When an image's intensity distribution shows a clear bimodal shape, a single value of $T$ can serve as the threshold for the *entire* image — this is **global thresholding**. For a single image, $T$ can be chosen manually, by trial and error:

1. Inspect the image's histogram (`imhist`).
2. Select a candidate value for $T$.
3. Apply it to the image (`im2bw`).
4. Inspect the result — if acceptable, keep it; otherwise adjust $T$ and repeat steps 2–4.

This manual procedure does not scale to processing many images automatically, which motivates **iterative (automatic) threshold selection**. A standard algorithm works as follows:

1. Pick an initial estimate for $T$ (e.g., the average intensity of the image).
2. Segment the image using $T$ into two groups, $G_1$ (pixels with intensity $> T$) and $G_2$ (pixels with intensity $\le T$).
3. Compute the average intensities $\mu_1$ and $\mu_2$ of $G_1$ and $G_2$.
4. Compute a new threshold: $T' = \tfrac{1}{2}(\mu_1 + \mu_2)$.
5. Repeat steps 2–4 until $T$ stops changing (or changes by less than a small tolerance) between iterations.

**Optimal thresholding.** Many strategies for automatically selecting a threshold have been proposed, most of them modeling the problem as a statistical inference task over an assumed distribution of the pixel population (e.g., a mixture of two Gaussians, one per class). In practice, such statistical models usually cannot account for factors that matter perceptually — borders and their continuity, cast shadows, nonuniform reflectance — which a human eye takes into account automatically. As a consequence, for many real images, manual threshold selection by a human still outperforms fully automatic statistical approaches. (Otsu's method, one of the most widely used automatic strategies and the one implemented by MATLAB's `graythresh`, is used hands-on in the Section 10.5 tutorial.)

### 10.2.3 The Impact of Illumination and Noise on Thresholding

Global thresholding's biggest weakness is its assumption that a *single* value of $T$ is appropriate everywhere in the image. Two common real-world conditions break that assumption:

- **Nonuniform illumination.** If the scene is lit unevenly (a gradient of brightness across the frame, vignetting, a shadow cast over part of the scene), the same physical object can appear with very different average intensities in different parts of the image. A threshold tuned for one region of the image will misclassify pixels in another region — object pixels in a dim area may fall below $T$ and be labeled background, while background pixels in a bright area may exceed $T$ and be labeled foreground.
- **Noise.** Random intensity fluctuations broaden and blur the peaks of the histogram. When the peaks are narrow and well separated, the valley between them is a clear, low-count region — an easy spot for a threshold. As noise increases, the peaks widen and can start to overlap, filling in the valley and making the choice of $T$ ambiguous or, in the worst case, eliminating the bimodal shape altogether.

Both effects push the histogram away from the clean, bimodal shape that global thresholding needs. The usual remedies are: preprocessing to normalize illumination (e.g., background/shading correction, homomorphic filtering) or noise reduction *before* thresholding, and — when the illumination itself is fundamentally nonuniform across the image — abandoning a single global $T$ in favor of **local (adaptive) thresholding**, described next.

### 10.2.4 Local Thresholding

Local, or **adaptive**, thresholding uses block processing: the image is divided into blocks, and each block is thresholded independently using a value of $T$ computed from that block's own statistics (rather than the whole image's). Block size is a trade-off the user must specify: blocks that are too small can require an excessive amount of processing time and are noisier/less statistically reliable, whereas blocks that are too large start behaving like a single global threshold, defeating the purpose.

**In MATLAB:** block processing is implemented with the `blkproc` function (in modern MATLAB, `blockproc`), which applies a user-supplied function to each block of the image in turn.

**Example 10.1** in the deck applies global vs. local thresholding side by side to a non-uniformly illuminated image: the global threshold fails to separate foreground from background consistently across the frame, while block-wise (local) thresholding — recomputing $T$ per block — tracks the local illumination and produces a cleaner binary result.

---

## 10.3 Region-Based Segmentation

Region-based methods are the *contextual* counterpart of intensity-based methods: instead of relying purely on the global pixel distribution, they exploit **adjacency and connectivity** between a pixel and its neighbors to decide how regions are formed. The two best-known techniques in this family are region growing and region splitting-and-merging, covered below.

### 10.3.1 Region Growing

Region growing is a **bottom-up** approach: it starts from individual pixels — called **seeds** — and grows a region around each seed for as long as the resulting region continues to satisfy a homogeneity criterion. The process ends once every pixel that can be added has been added, producing the final segmented regions.

Three design choices govern region growing:

- **Choice of similarity criteria.** For monochrome images, pixels are typically compared using intensity levels directly, or measures derived from them (moments, texture descriptors), together with connectivity.
- **Selection of seed points.** Seeds can be placed interactively by a user, or derived automatically from a preliminary cluster analysis of the image — for example, taking the centroid of each cluster as a seed.
- **Definition of a stopping rule.** A region stops growing once no neighboring pixel satisfies the homogeneity and connectivity criteria for inclusion.

The core of the algorithm can be summarized as:

```text
Let f(x,y) be the input image.
Define regions R1, R2, ..., Rn, each initially a single seed pixel.
Let Mi be the running mean gray level of pixels currently in Ri.

repeat
    for i = 1 to n do
        for each pixel p at the border of Ri do
            for all neighbors (x,y) of p do
                if (x,y) is unassigned AND |f(x,y) - Mi| <= Delta then
                    add (x,y) to Ri
                    update Mi
                end if
            end for
        end for
    end for
until no more pixels can be assigned to any region
```

Here `Delta` is a homogeneity tolerance chosen by the user: a candidate pixel joins a region if its intensity does not deviate from the region's running mean by more than `Delta`.

**Examples 10.2–10.3** in the deck apply this algorithm to the two test images introduced in Section 10.1:

- On the **hard** Lego-bricks image, with seed points placed interactively by the user, the result is largely useless — poor contrast between two of the darker and two of the brighter bricks, combined with cast shadows, causes regions to bleed into each other or fragment incorrectly.
- On the **easy** coins image, run in fully *unsupervised* mode (no seeds or region count specified in advance), the result is good — comparable in quality to the global-thresholding result obtained earlier in the lecture.

**Limitations of region growing.**

- It is not very stable: switching between 4-connectivity and 8-connectivity can produce significantly different results.
- Results are very sensitive to the choice of the homogeneity ("uniformity") predicate.
- The number of seeds supplied by the user may not be sufficient to assign every pixel to some region.
- If two or more seeds that logically belong to the same object are placed separately, the algorithm is forced to grow distinct regions around each, fragmenting what should have been a single region.

### 10.3.2 Region Splitting and Merging

Region splitting is a **top-down** counterpart to region growing: it starts from the *entire* image and recursively partitions it into smaller subimages until every resulting region satisfies a homogeneity criterion on its own. A standard way to implement the splitting step is with a **quadtree**: at each step, a region that fails the homogeneity test is split into four equal quadrants, and each quadrant is tested (and, if necessary, further split) recursively, until every region in the tree is homogeneous or has reached a minimum allowed size.

Splitting alone guarantees that every final region satisfies the homogeneity criterion, but it does **not** guarantee that the partition is "natural" — two or more adjacent regions produced by splitting can be similar enough that they really should form a single region (this is an artifact of the rigid, fixed quadrant boundaries the quadtree imposes). This is exactly the goal of the **merging** step: examine adjacent regions $R_i$ and $R_j$ and combine them into one whenever their union $R_i \cup R_j$ also satisfies the homogeneity criterion. In practice, splitting and merging are applied together, alternating passes over the region adjacency structure, until no further split or merge operation is possible.

---

## 10.4 Watershed Segmentation

The **watershed transform** is a popular morphological technique for segmentation, and its name comes directly from geography: a *watershed* is the ridge that divides areas drained by different river systems, and the *catchment* (or drainage) *basin* is the geographical area that drains into a particular river or reservoir. In morphological image processing, the watershed transform reuses this metaphor: it represents the regions of a segmented image as **catchment basins**, and the boundaries between them as the **ridge lines** (watersheds) that separate those basins.

Conceptually, an image is viewed as a topographic surface, where the intensity (or, more commonly, the gradient magnitude) at each pixel is its "elevation." Imagine water rising from the surface's local minima: as the water level increases, it fills up separate catchment basins around each minimum; where waters from two different basins would merge, a dam (the watershed line) is built instead. The final set of dams is the watershed segmentation.

**In MATLAB:** the IPT function `watershed` implements the transform directly. It takes an input image and, optionally, a connectivity specification (4- or 8-connected) and returns a **label matrix** the same size as the input: elements labeled `1` and above belong to a distinct watershed region (identified by that label), while elements labeled `0` belong to none — they sit on a watershed (ridge) line.

**Avoiding oversegmentation with markers.** Applying `watershed` directly to a raw gradient image almost always produces a drastically **oversegmented** result: noise and small local irregularities in the surface create huge numbers of spurious local minima, each spawning its own tiny catchment basin. The standard fix is **marker-controlled watershed segmentation**: the user (or an automated procedure) supplies a set of **internal markers**, one per object of interest, and **external markers** delineating the background, and the gradient image is modified (via *minima imposition*) so that the only regional minima left are the ones at the markers. Running `watershed` on this modified surface then produces exactly one catchment basin per marker, eliminating the spurious oversegmentation. Internal markers are commonly obtained from regional minima of the distance transform (`imregionalmin` on the output of `bwdist`) or from the results of an earlier, coarser segmentation step (e.g., thresholding).

### 10.4.1 The Distance Transform

The **distance transform** is a tool frequently used alongside the watershed transform. For a binary image, it computes, for every pixel, its distance to the nearest nonzero-valued pixel. It is implemented in MATLAB by the `bwdist` function, which supports several distance metrics — Euclidean distance is the default, but city-block, chessboard, and quasi-Euclidean distances are also available.

**Example 10.4** demonstrates `bwdist` on a small 5×5 test matrix, comparing the Euclidean and city-block metrics:

```matlab
>> a = [0 1 1 0 1; 1 1 1 0 0; 0 0 0 1 0; 0 0 0 0 0; 0 1 0 0 0];
a =
     0     1     1     0     1
     1     1     1     0     0
     0     0     0     1     0
     0     0     0     0     0
     0     1     0     0     0

>> b = bwdist(a)          % Euclidean distance (default)
b =
    1.0000         0         0    1.0000         0
         0         0         0    1.0000    1.0000
    1.0000    1.0000    1.0000         0    1.0000
    1.4142    1.0000    1.4142    1.0000    1.4142
    1.0000         0    1.0000    2.0000    2.2361

>> b = bwdist(a, 'cityblock')   % City-block distance
b =
     1     0     0     1     0
     0     0     0     1     1
     1     1     1     0     1
     2     1     2     1     2
     1     0     1     2     3
```

**Example 10.5** applies the watershed transform end to end on the coins test image: (a) a binarized and postprocessed version of the coins image is the starting point; (b) the distance transform of (a) is computed; (c) the watershed transform of (the negative of) that distance map produces ridge lines that separate the individual coins; (d) overlaying the ridge lines from (c) on the original binary image (a) shows an excellent segmentation, with each coin correctly separated from its neighbors — a case where the combination of distance transform + watershed cleanly resolves touching objects that a simple threshold alone could not separate.

---

## 10.5 Tutorial: Image Thresholding

**Goal.** Learn to perform image thresholding in MATLAB using the Image Processing Toolbox.

**Objectives.**

- Learn how to visually select a threshold value using a heuristic approach.
- Explore the `graythresh` function for automatic (Otsu) threshold selection.
- Learn how to implement adaptive (block-based) thresholding.

### Procedure — global thresholding

The first method explored is visually inspecting an image's histogram to pick a threshold value $T$ by hand.

1. **Load and display the test image.**

   ```matlab
   I = imread('coins.png');
   figure, imshow(I), title('Original Image');
   ```

2. **Display the histogram** to see what threshold level might work.

   ```matlab
   figure, imhist(I), title('Histogram of Image');
   ```

   The histogram shows a clearly bimodal distribution — the leftmost, taller peak corresponds to background pixels, while the broader peak to the right corresponds to the coins. Because the two populations are well separated, this image is a good candidate for global thresholding. Using the data cursor to inspect the histogram near the right edge of the background peak suggests that values between roughly 80 and 85 sit right in the valley between the two modes and would make a reasonable threshold.

3. **Threshold the image** at $T = 85$.

   ```matlab
   T = 85;
   I_thresh = im2bw(I, T/255);
   figure, imshow(I_thresh), title('Threshold Image (heuristic)');
   ```

   Note that `im2bw` expects its threshold argument normalized to $[0,1]$, so the raw gray-level value ($T=85$, on the usual $[0,255]$ 8-bit scale) is divided by 255 before being passed in. The result will typically show some residual noise — a few stray white pixels in the background and a few black pixels inside the coins — which can be cleaned up afterward with morphological operations (opening/closing, or removing small connected components).

   Instead of hand-tuning $T$ every time, the same result can be obtained automatically with **Otsu's method**, implemented by `graythresh`. Otsu's method chooses the threshold that minimizes the intraclass intensity variance of the two resulting pixel classes (equivalently, maximizes their interclass variance) — it is fully automatic and needs no manual inspection of the histogram.

4. **Threshold automatically with `graythresh`.**

   ```matlab
   T2 = graythresh(I);
   I_thresh2 = im2bw(I, T2);
   figure, imshow(I_thresh2), title('Threshold Image (graythresh)');
   ```

   For a well-behaved, bimodal image like this one, the automatic Otsu threshold and the heuristic one chosen by eye typically produce very similar, high-quality results — which is exactly why Otsu's method is the default automatic choice for global thresholding.

### Procedure — adaptive thresholding

Bimodal images are relatively easy to threshold globally, but not every image is so well behaved. A scanned text document with a nonuniform gradient background is a classic counter-example: its histogram is not bimodal, so no single value of $T$ separates text from background everywhere in the image.

5. **Load the gradient/text image.**

   ```matlab
   I = imread('gradient_with_text.tif');
   figure, imshow(I), title('Original Image');
   ```

6. **Attempt global thresholding first**, to see it fail.

   ```matlab
   I_gthresh = im2bw(I, graythresh(I));
   figure, imshow(I_gthresh), title('Global Thresholding');
   figure, imhist(I), title('Histogram of Original');
   ```

   Because there is no single value of $T$ that works across the whole gradient background, this produces a poor result: text is lost in the darker part of the gradient, and background noise appears as false foreground in other parts.

7. **Set up adaptive thresholding via `blkproc`.** Adaptive thresholding needs a small function that thresholds one block at a time; `blkproc` applies that function block-by-block over the whole image.

   ```matlab
   function y = adapt_thresh(x)
       y = im2bw(x, graythresh(x));
   end
   ```

8. **Run it.**

   ```matlab
   I_thresh = blkproc(I, [10 10], @adapt_thresh);
   figure
   subplot(1,2,1), imshow(I), title('Original Image');
   subplot(1,2,2), imshow(I_thresh), title('Adaptive Thresholding');
   ```

   The first attempt is a disaster everywhere *except* right around the text: applying Otsu's method independently to every 10×10 block means that even perfectly uniform background blocks (with essentially zero contrast) get split roughly in half by `graythresh`, because Otsu's method always finds *some* separating threshold, whether or not the block actually contains two distinct classes.

9. **Diagnose with the standard deviation** of a block with text vs. one without.

   ```matlab
   std_without_text = std2(I(1:10, 1:10));
   std_with_text    = std2(I(100:110, 100:110));
   ```

   A block with no text is nearly uniform and has a very small standard deviation; a block containing text has much higher local contrast and a correspondingly larger standard deviation. That gap is exactly the signal needed to fix the function.

10. **Refine `adapt_thresh`** to only threshold blocks that actually contain meaningful contrast, and label everything else as background:

    ```matlab
    function y = adapt_thresh(x)
        if std2(x) < 1
            y = ones(size(x,1), size(x,2));   % low-contrast block -> background
        else
            y = im2bw(x, graythresh(x));       % high-contrast block -> threshold normally
        end
    end
    ```

11. **Re-run** and compare.

    ```matlab
    I_thresh2 = blkproc(I, [10 10], @adapt_thresh);
    figure
    subplot(1,2,1), imshow(I), title('Original Image');
    subplot(1,2,2), imshow(I_thresh2), title('Adaptive Thresholding');
    ```

    The refined version cleanly isolates the text from the gradient background across the whole image, succeeding where the single global threshold failed.

### Self-check questions

- What is the purpose of the `im2bw` function, and why must the threshold argument be normalized to $[0,1]$ (i.e., divided by 255 for an 8-bit image)?
- How does the automatic `graythresh` (Otsu) threshold compare to the heuristic threshold chosen by eye, for the coins image?
- What noise-removal code would you add after global thresholding to clean up stray misclassified pixels?
- Why does the *un-refined* `adapt_thresh` function fail almost everywhere except near the text?
- What is the main limitation of the block-based adaptive-thresholding function developed in this tutorial (hint: think about what happens at block boundaries, and about the fixed block size)?

---

## What have we learned?

- **Segmentation** is the process of grouping image pixels into meaningful, usually connected, regions. It is a required step in most image-processing pipelines: it establishes the transition from treating an image as a whole to processing its individual, relevant regions.
- Segmentation is a genuinely hard problem — result quality depends jointly on the algorithm used, the careful tuning of that algorithm's parameters, and the input image itself (illumination, contrast, occlusion).
- **Thresholding** requantizes a grayscale image to two gray levels (i.e., converts it to a binary image) by comparing every pixel against a reference value $T$. The simplest variant, **global thresholding** (`im2bw` in MATLAB), uses one value of $T$ for the entire image; it works well when the histogram is clearly bimodal and illumination is uniform.
- Segmentation techniques fall into three broad groups: **intensity-based** methods (e.g., thresholding), **region-based** methods (e.g., region growing, split and merge), and **other** methods (e.g., texture-, edge-, and motion-based segmentation, of which watershed is a prominent example).

| Technique | Approach | Key idea | Key MATLAB functions |
|---|---|---|---|
| Global thresholding | Intensity-based | Single $T$ for the whole image, from a bimodal histogram | `imhist`, `im2bw`, `graythresh` |
| Local / adaptive thresholding | Intensity-based | Block-wise $T$, recomputed per block | `blkproc` |
| Region growing | Region-based, bottom-up | Grow regions from seeds under a homogeneity criterion | — |
| Split and merge | Region-based, top-down | Recursively split (quadtree) then merge similar adjacent regions | — |
| Watershed | Other (morphological) | Treat gradient/distance surface as terrain; flood from minima; build dams at basin boundaries | `watershed`, `bwdist`, `imregionalmin` |

