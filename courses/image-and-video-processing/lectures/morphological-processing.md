---
title: "Morphological Image Processing"
subject: "image-and-video-processing"
type: lecture
lecture_no: 8
status: done
source: slide
tags: [morphology, erosion, dilation, opening, closing, structuring-element]
date: 2024-10-11
---

# Lecture 8 – Morphological Image Processing

> A tour of mathematical morphology: the set-theoretic foundations (translation, reflection, complement, difference) that morphological operators are built on; the structuring element and how its shape/size controls a result; the two fundamental operators, dilation and erosion, and the compound operators built from them — opening, closing, and the hit-or-miss transform; morphological filtering for noise removal; a set of basic morphological algorithms (boundary extraction, region filling, connected-component extraction); the extension of these ideas to grayscale images (grayscale dilation/erosion/opening/closing and the top-hat/bottom-hat transforms); and two hands-on MATLAB tutorials covering the whole toolbox, from `imdilate`/`imerode` to `bwmorph`.

---

## 8.1 Introduction

**Mathematical morphology** is the branch of image processing concerned with representing, describing, and analyzing the *shapes* of objects in an image. Rather than reasoning about intensity values pixel by pixel, it studies the geometrical and topological structure of image components — which makes it a natural tool both for extracting shape-related features directly (boundaries, skeletons, convex hulls, connected components) and for pre- or post-processing images that already contain shapes of interest (cleaning up noise, filling holes, smoothing contours).

The basic principle underlying every morphological operation is deceptively simple: an image is treated as an unknown *set*, and geometrical/topological information about that set is extracted by *transforming* it with another, well-defined set called the **structuring element (SE)**. Because the SE is the "probe" that interacts with the image, its shape and size are the single most important design choice in any morphological algorithm — the same operation applied with two different SEs can produce very different results.

## 8.2 Fundamental Concepts and Operations

Morphology is grounded in ordinary set theory. Given two sets (binary images, thought of as sets of foreground pixel coordinates) $A$ and $B$, the standard operations carry over directly:

- **Union**: $A \cup B$
- **Intersection**: $A \cap B$
- **Complement**: $A^c = \{z \mid z \notin A\}$
- **Difference**: $A - B = \{z \mid z \in A,\ z \notin B\} = A \cap B^c$

Two additional operations are specific to the geometric flavor morphology needs:

**Translation.** Let $A$ be a set of pixels and $\omega = (x, y)$ a coordinate point. The translation of $A$ by $\omega$, written $A_\omega$, is

$$A_\omega = \{c \mid c = a + \omega,\ \text{for } a \in A\}$$

i.e. every point of $A$ shifted by the same offset $\omega$.

**Reflection.** The reflection of $A$ about the origin of the coordinate system, written $\hat A$, is

$$\hat A = \{z \mid z = -a,\ \text{for } a \in A\}$$

i.e. $A$ rotated 180° around its origin. Reflection shows up constantly in the definitions of dilation, erosion, and the hit-or-miss transform.

From a set-theoretic perspective, an intersection $C = A \cap B$ means $C = \{(x,y) \mid (x,y) \in A \text{ and } (x,y) \in B\}$. Written in conventional image-processing notation, with $A(x,y)$ and $B(x,y)$ standing for the pixel value (0 or 1) at $(x,y)$:

$$C(x,y) = \begin{cases} 1 & \text{if } A(x,y) \text{ and } B(x,y) \text{ are both } 1 \\ 0 & \text{otherwise} \end{cases}$$

This translates almost verbatim into MATLAB, because binary images are just logical (or numeric 0/1) matrices:

| Set operation | MATLAB expression |
|---|---|
| Intersection $A \cap B$ | `A & B` |
| Union $A \cup B$ | `A \| B` |
| Complement $A^c$ | `~A` |
| Difference $A - B$ | `A & ~B` |

Following the convention of the Image Processing Toolbox (IPT), foreground (1-valued) pixels are drawn as white against a black background throughout this lecture.

### 8.2.1 The Structuring Element

The **structuring element** is the small "probe" matrix that every morphological operator slides over the image. Its shape and size directly determine the outcome of the operation applied with it. An SE is drawn with a distinguished **origin** (reference point, usually shown as a filled/black dot), with the remaining cells marked as members (1, shown shaded) or non-members (0, shown empty). Even when the intended shape is not rectangular (e.g. a diamond or a disk), it still has to be embedded in a rectangular array for implementation — the "extra" corner cells are padding only and are not members of the SE.

**In MATLAB.** The IPT function `strel` creates structuring elements of arbitrary shape, as well as common built-in shapes — `'square'`, `'diamond'`, `'rectangle'`, `'line'`, `'disk'`, `'ball'`, and others. The result is an object of class `strel`.

For efficiency, `strel` automatically **decomposes** many common SEs into a sequence of smaller SEs whose successive dilations/erosions produce the same result as the single large SE, but faster. The decomposition can be inspected with `getsequence`.

```matlab
% Example 8.1 — square SE and its decomposition
>> se1 = strel('square',4)
se1 =
    Flat STREL object containing 16 neighbors.
    Decomposition: 2 STREL objects containing a total of 8 neighbors
    Neighborhood:
        1  1  1  1
        1  1  1  1
        1  1  1  1
        1  1  1  1

>> decomp = getsequence(se1)
decomp =
    2x1 array of STREL objects

>> decomp(1)
ans =
    Flat STREL object containing 4 neighbors.
    Neighborhood:
        1
        1
        1
        1

>> decomp(2)
ans =
    Flat STREL object containing 4 neighbors.
    Neighborhood:
        1  1  1  1
```

A 4×4 square SE (16 neighbors) decomposes into two 4-neighbor STREL objects — a column and a row — whose sequential application is equivalent to, but cheaper than, using the full 4×4 neighborhood directly.

```matlab
% Example 8.2 — diamond and rectangle SEs
>> se2 = strel('diamond',4)
se2 =
    Flat STREL object containing 41 neighbors.
    Decomposition: 3 STREL objects containing a total of 13 neighbors
    Neighborhood:
        0 0 0 0 1 0 0 0 0
        0 0 0 1 1 1 0 0 0
        0 0 1 1 1 1 1 0 0
        0 1 1 1 1 1 1 1 0
        1 1 1 1 1 1 1 1 1
        0 1 1 1 1 1 1 1 0
        0 0 1 1 1 1 1 0 0
        0 0 0 1 1 1 0 0 0
        0 0 0 0 1 0 0 0 0

>> se3 = strel('rectangle',[1 3])
se3 =
    Flat STREL object containing 3 neighbors.
    Neighborhood:
        1  1  1
```

Note that the rectangular SE `se3` did not require decomposition — a single row is already maximally simple.

## 8.3 Dilation and Erosion

Every other operator and algorithm in this lecture is built from two fundamental operations: **dilation** and **erosion**.

### 8.3.1 Dilation

Dilation "grows" or "thickens" objects in a binary image. The direction and extent of the growth is controlled by the shape and size of the SE. Formally, the dilation of set $A$ by structuring element $B$, denoted $A \oplus B$, is

$$A \oplus B = \{z \mid (\hat B)_z \cap A \neq \emptyset\}$$

i.e. the set of all positions $z$ such that the reflected SE, translated by $z$, overlaps $A$ in at least one pixel. Rectangular SEs cause more dilation along their longer dimension — a $1 \times n$ SE dilates mostly horizontally, an $n \times 1$ SE mostly vertically.

**In MATLAB.** Dilation is implemented by `imdilate(image, se)`.

```matlab
% Example 8.3 — imdilate with two different SEs
>> a = [0 0 0 0 0; 0 1 1 0 0; 0 1 1 0 0; 0 0 1 0 0; 0 0 0 0 0]
a =
    0 0 0 0 0
    0 1 1 0 0
    0 1 1 0 0
    0 0 1 0 0
    0 0 0 0 0

>> se1 = strel('square',2)
se1 =
    Flat STREL object containing 4 neighbors.
    Neighborhood:
        1 1
        1 1

>> b = imdilate(a,se1)
b =
    0 0 0 0 0
    0 1 1 1 0
    0 1 1 1 0
    0 1 1 1 0
    0 0 1 1 0

>> se2 = strel('rectangle',[1 2])
se2 =
    Flat STREL object containing 2 neighbors.
    Neighborhood:
        1  1

>> c = imdilate(a,se2)
c =
    0 0 0 0 0
    0 1 1 1 0
    0 1 1 1 0
    0 0 1 1 0
    0 0 0 0 0
```

Dilating `a` with `se1` (whose origin is at the top-left corner) replaces every foreground pixel with a 2×2 block of 1s. Dilating with `se2` (whose origin is the leftmost cell) replaces every foreground pixel with a 1×2 horizontal run of 1s — a predominantly horizontal dilation.

### 8.3.2 Erosion

Erosion is the opposite of dilation: it "shrinks" or "thins" objects, and the direction/extent of the shrinkage is controlled by the SE's shape and size. Formally, the erosion of $A$ by $B$, denoted $A \ominus B$, is

$$A \ominus B = \{z \mid (B)_z \cap A^c = \emptyset\}$$

equivalently, $A \ominus B = \{z \mid (B)_z \subseteq A\}$ — the set of all positions $z$ at which the SE, translated by $z$, fits entirely inside $A$.

**In MATLAB.** Erosion is implemented by `imerode(image, se)`.

```matlab
% Example 8.4 — imerode with two different SEs
>> a = [0 0 0 0 0; 0 1 1 1 0; 1 1 1 0 0; 0 1 1 1 1; 0 0 0 0 0]
a =
    0 0 0 0 0
    0 1 1 1 0
    1 1 1 0 0
    0 1 1 1 1
    0 0 0 0 0

>> se1 = strel('square',2)
se1 =
    Flat STREL object containing 4 neighbors.
    Neighborhood:
        1 1
        1 1

>> b = imerode(a,se1)
b =
    0 0 0 0 0
    0 1 0 0 0
    0 1 0 0 0
    0 0 0 0 0
    0 0 0 0 0

>> se2 = strel('rectangle',[1 2])
se2 =
    Flat STREL object containing 2 neighbors.
    Neighborhood:
        1  1

>> c = imerode(a,se2)
c =
    0 0 0 0 0
    0 1 1 0 0
    1 1 0 0 0
    0 1 1 1 1
    0 0 0 0 0
```

Eroding `a` with `se1` (origin at the top-left corner) eliminates most foreground pixels; only pixels that anchor a full 2×2 block of 1s survive, and they survive at the top-left corner of that block. Eroding with `se2` (origin at the leftmost cell) similarly only keeps pixels that anchor a full 1×2 run.

**Duality.** Erosion and dilation are dual operations with respect to complementation and reflection:

$$(A \ominus B)^c = A^c \oplus \hat B \qquad\qquad (A \oplus B)^c = A^c \ominus \hat B$$

**Hit/fit interpretation.** Both operators can also be described in terms of whether the SE *hits* or *fits* the image. Given input $f(x,y)$, SE `se`, and output $g(x,y)$:

$$\text{Dilation: } g(x,y) = \begin{cases} 1 & \text{if } se \text{ hits } f \\ 0 & \text{otherwise} \end{cases} \qquad\text{for all } x, y$$

$$\text{Erosion: } g(x,y) = \begin{cases} 1 & \text{if } se \text{ fits } f \\ 0 & \text{otherwise} \end{cases} \qquad\text{for all } x, y$$

"Hits" means the SE overlaps the foreground in at least one pixel at that position; "fits" means the SE lies entirely within the foreground at that position.

## 8.4 Compound Operations

This section builds two more operators — opening and closing — by chaining erosion and dilation, plus the hit-or-miss transform, which combines an erosion of the image with an erosion of its complement.

### 8.4.1 Opening

The morphological **opening** of $A$ by $B$, written $A \circ B$, is an erosion followed by a dilation with the same SE:

$$A \circ B = (A \ominus B) \oplus B$$

Equivalently, in set notation, opening is the union of all translations of $B$ that fit entirely inside $A$:

$$A \circ B = \bigcup \{ (B)_z \mid (B)_z \subseteq A \}$$

Opening is **idempotent**: once an image has been opened with a given SE, opening it again with the same SE has no further effect.

$$(A \circ B) \circ B = A \circ B$$

Practically, opening removes thin protrusions and small isolated objects from a shape, and it can separate objects joined by a thin bridge — all without shrinking the surviving parts of the shape the way plain erosion would. It also smooths an object's contour, rounding off sharp convexities.

**In MATLAB.** Opening is implemented by `imopen(image, se)`.

### 8.4.2 Closing

The morphological **closing** of $A$ by $B$, written $A \bullet B$, is a dilation followed by an erosion with the same SE:

$$A \bullet B = (A \oplus B) \ominus B$$

Like opening, closing is idempotent:

$$(A \bullet B) \bullet B = A \bullet B$$

Practically, closing fills small holes, fuses narrow breaks, and closes thin gaps in a shape, without enlarging it the way plain dilation would. It also smooths contours, but by rounding off sharp concavities (indentations) rather than convexities.

Geometrically, $A \bullet B$ is the complement of the union of all translations of $B$ that do *not* overlap $A$. Closing and opening are dual operations:

$$A \bullet B = (A^c \circ \hat B)^c \qquad\qquad A \circ B = (A^c \bullet \hat B)^c$$

**In MATLAB.** Closing is implemented by `imclose(image, se)`.

### 8.4.3 Hit-or-Miss Transform

The **hit-or-miss (HoM) transform** locates pixel configurations rather than just growing/shrinking shapes. It uses a *pair* of structuring elements $B = (B_1, B_2)$: the output consists of every location where $B_1$ matches the foreground (a "hit") *and* $B_2$ matches the background, i.e. none of $B_2$'s pixels fall on the foreground (a "miss"). Formally,

$$A \otimes B = (A \ominus B_1) \cap (A^c \ominus B_2)$$

or, equivalently,

$$A \otimes B = (A \ominus B_1) - (A \oplus \hat B_2)$$

A classic use case is locating squares of a specific size in a binary image containing squares of several sizes: choose $B_1$ to be a square exactly the size of the target squares (so it hits only at their interior), and $B_2$ to be a larger square (so it forces the surrounding pixels to be background, ruling out larger squares that would otherwise also satisfy $B_1$). Applying $A \ominus B_1$ hits the smallest target square at a single spot but also produces many hits inside the larger square (since the smaller SE fits inside it too); intersecting with $A^c \ominus B_2$ then discards every hit that is not properly surrounded by background, leaving only the small target square's location.

**In MATLAB.** The binary hit-or-miss transform is implemented by `bwhitmiss`, with basic syntax `J = bwhitmiss(I, B1, B2)`, where `I` is the input image, `B1`/`B2` are the two structuring elements, and `J` is the resulting image.

## 8.5 Morphological Filtering

Morphological filters are Boolean filters: a many-to-one Boolean function $h$ is applied within a window $W$ sliding over the binary image $f(x,y)$, producing an output $g(x,y) = h(W_f(x,y))$. Three common choices for $h$:

| Boolean function $h$ | Morphological equivalent |
|---|---|
| **OR** | Dilation with a square SE the same size as $W$ |
| **AND** | Erosion with a square SE the same size as $W$ |
| **MAJ** (majority vote) | The binary equivalent of a median filter |

A particularly useful application is **noise reduction**. If a binary image $A$ has been corrupted by impulse (salt-and-pepper) noise, applying an opening followed by a closing with the same SE $B$ removes a large fraction of the noise:

$$C = (A \circ B) \bullet B$$

The opening removes isolated foreground specks ("salt"); the subsequent closing fills isolated background pits ("pepper"). Example 8.5 in the slides demonstrates this on a $641 \times 535$ binary image using a circular SE of radius 2: after the opening step, all "salt" noise is gone but "pepper" noise remains; after the closing step, the noise is essentially entirely removed, at the cost of some rounding/imperfection at object edges. Larger SEs remove noise more aggressively but distort object edges more severely — the deck illustrates this with a radius-4 circular SE, which produces a visibly rougher result than radius 2.

## 8.6 Basic Morphological Algorithms

**In MATLAB.** The IPT function `bwmorph(image, operation, n)` bundles a large family of morphological algorithms into one call, taking the input image, the desired operation as a string, and the number of times to repeat it (use `Inf` to iterate until no further change occurs). Commonly used operation strings include:

| Operation | Effect |
|---|---|
| `'dilate'` / `'erode'` | Single-pixel-SE dilation / erosion |
| `'open'` / `'close'` | Morphological opening / closing |
| `'skel'` | Skeletonization (with `Inf` iterations, reduces objects to a 1-pixel-wide skeleton) |
| `'thin'` | Thins objects to lines, without disconnecting them |
| `'thicken'` | Thickens objects without merging previously disconnected ones |
| `'spur'` | Removes spur pixels (short spurious branches, useful after skeletonization) |
| `'remove'` | Removes interior pixels, leaving only boundary pixels |
| `'clean'` | Removes isolated 1-pixel foreground specks |
| `'bridge'` | Bridges gaps of one background pixel between foreground pixels |
| `'fill'` | Fills isolated interior background pixels (1-pixel holes) |
| `'majority'` | Sets a pixel to 1 if a majority of its 3×3 neighborhood is 1 |
| `'shrink'` | Shrinks objects to points (or loops, for objects with holes) |
| `'hbreak'` / `'diag'` | Removes H-connected pixels / fills diagonal-connectivity gaps |
| `'tophat'` / `'bothat'` | Top-hat / bottom-hat filtering |

```matlab
% Example 8.6 — chaining bwmorph operations
B = bwmorph(A,'skel', Inf);
C = bwmorph(B,'spur',Inf);
D = bwmorph(A,'remove');
E = bwmorph(D,'thicken',3);
F = bwmorph(E,'thin',3);
```

Applied to a small test image, this sequence produces: `B`, the skeleton of the original image `A`; `C`, that skeleton pruned of spurious short branches; `D`, `A` with its interior pixels removed (leaving just the boundary); `E`, `D` thickened for 3 iterations; and `F`, `E` thinned back down for 3 iterations. Each step visibly changes the topology or thickness of the shape while (for `skel`/`thin`/`thicken`) generally preserving connectivity.

### 8.6.1 Boundary Extraction

Dilation, erosion, and set difference combine to extract the boundary $\mathcal{BE}(A)$ of a set $A$ in three flavors:

$$\text{Internal boundary: } \mathcal{BE}(A) = A - (A \ominus B)$$

$$\text{External boundary: } \mathcal{BE}(A) = (A \oplus B) - A$$

$$\text{Morphological gradient: } \mathcal{BE}(A) = (A \oplus B) - (A \ominus B)$$

where $B$ is a suitable SE (typically a 3×3 square). The internal boundary consists of pixels *inside* $A$ that touch the edge of the shape; the external boundary consists of background pixels immediately outside $A$; the morphological gradient combines both, giving a boundary "straddling" the true edge.

**In MATLAB.** `bwperim(image, conn)` directly returns a binary image containing only the perimeter (internal boundary) pixels of the objects in the input, using the specified connectivity (4 or 8).

```matlab
% Example 8.7 — internal boundary via erosion + subtraction, vs. bwperim
a = ones(5,12);
a(1:2,1) = 0;
a(1:2,9) = 0;
a(4:5,5) = 0;
b = bwperim(a,8);   % identical to A - (A erode 3x3-square), computed with 8-connectivity
```

### 8.6.2 Region Filling

Region filling starts from a single pixel $p$ inside a region bounded by an 8-connected boundary $A$, and grows a filled region outward to occupy the entire hole. The iterative formula is

$$X_k = (X_{k-1} \oplus B) \cap A^c \qquad k = 1, 2, 3, \dots$$

with $X_0 = p$ and $B$ the cross-shaped (4-connected) SE. The algorithm stops at iteration $k$ once $X_k = X_{k-1}$ (no further growth). Intersecting with $A^c$ at each step is what confines the growth to the interior of the hole — it prevents the filled region from leaking through the boundary. The final filled region is $X_k \cup A$, which contains both the original boundary and every pixel enclosed by it. The slide example needs 6 iterations to fill a small test hole completely.

**In MATLAB.** `imfill` implements region filling. It can run interactively (the user clicks the starting pixel(s) inside each hole, then presses Enter) or take explicit seed coordinates as a parameter; `imfill(I,'holes')` fills every hole in the image automatically without needing seed points at all.

### 8.6.3 Extraction and Labeling of Connected Components

The algorithm for extracting a connected component is nearly identical to region filling — the only difference is that growth is confined to *inside* the set $A$ rather than outside it. Given a starting pixel $p \in A$ belonging to the component of interest, the iteration is

$$X_k = (X_{k-1} \oplus B) \cap A \qquad k = 1, 2, 3, \dots$$

with $X_0 = p$, and $B$ a suitable SE: cross-shaped for 4-connectivity, or a 3×3 square for 8-connectivity. As before, the algorithm terminates once $X_k = X_{k-1}$; the slide example converges after six iterations.

This manual iterative procedure is instructive for understanding *why* connectivity works, but in practice MATLAB provides ready-made functions for the same task: `bwlabel` (and its modern counterpart `bwconncomp`) label every connected component of a binary image in one call, without requiring the user to seed each component individually — this is what the tutorial in §8.9 uses in practice.

## 8.7 Grayscale Morphology

Most of the binary operations above extend naturally to grayscale images $f(x,y)$ using a structuring element $b(x,y)$. Grayscale SEs come in two flavors: **flat** SEs (same shape semantics as binary SEs — a set of positions with no associated height) and **nonflat** SEs (which additionally carry a height value $b_N(s,t)$ at each position, letting the SE itself act like a small 3D "stamp").

**In MATLAB.** Nonflat SEs are created with the same `strel` function used for flat ones; you additionally pass a matrix of height values as a second argument.

### 8.7.1 Dilation and Erosion

For a flat SE $b(x,y)$ with domain $D_b$, grayscale dilation and erosion are defined pointwise as the max/min of $f$ over the SE's footprint:

$$(f \oplus b)(x,y) = \max\{f(x+s,\, y+t) \mid (s,t) \in D_b\} \tag{8.1}$$

$$(f \ominus b)(x,y) = \min\{f(x+s,\, y+t) \mid (s,t) \in D_b\} \tag{8.3}$$

For a nonflat SE $b_N(x,y)$, the SE's height values shift the values being compared:

$$(f \oplus b_N)(x,y) = \max\{f(x+s,\, y+t) + b_N(s,t) \mid (s,t) \in D_b\} \tag{8.2}$$

$$(f \ominus b_N)(x,y) = \min\{f(x+s,\, y+t) - b_N(s,t) \mid (s,t) \in D_b\} \tag{8.4}$$

(Some references write $f(x-s, y-t)$ instead, which is equivalent to using the reflected SE $\hat B(x,y) = b(-x,-y)$ — the same reflection convention as in the binary case.)

Intuitively, grayscale dilation brightens an image and expands/thickens bright regions (it replaces each pixel with the local maximum under the SE), while grayscale erosion darkens an image and expands dark regions (local minimum under the SE). Example 8.8 in the slides applies both with a nonflat ball-shaped SE of radius 5 (`se = strel('ball',5,5)`), producing visibly brighter/expanded highlights (dilation) and darker/expanded shadows (erosion).

### 8.7.2 Opening and Closing

Grayscale opening and closing are defined by exactly the same formulas as in the binary case, just applied to the grayscale erosion/dilation above:

$$f \circ b = (f \ominus b) \oplus b \qquad\qquad f \bullet b = (f \oplus b) \ominus b$$

As in the binary case, opening removes small bright details (peaks) that don't fit the SE while leaving the rest of the image roughly intact, and closing removes small dark details (pits). Used together, opening followed by closing is a common smoothing/noise-reduction combination — Example 8.9 demonstrates this with a flat disk-shaped SE of radius 3 (`se = strel('disk',3)`), applied both to an image corrupted by Gaussian noise (mean 0, variance 0.01) and to one corrupted by salt-and-pepper noise.

### 8.7.3 Top-hat and Bottom-hat Transformations

The **top-hat** and **bottom-hat** transforms combine opening/closing with image subtraction to isolate small bright or dark features that an opening/closing would otherwise discard. The top-hat transform of $f$ is the residual removed by opening:

$$\text{Top-hat}(f) = f - (f \circ b)$$

and the bottom-hat transform is the residual added by closing:

$$\text{Bottom-hat}(f) = (f \bullet b) - f$$

Top-hat filtering is frequently used for **shading correction** — compensating for non-uniform illumination across a scene, since the opening tracks the slowly varying background and subtracting it out leaves just the small bright detail riding on top of it. Top-hat and bottom-hat can be combined for **contrast enhancement**.

**In MATLAB.** `imtophat` and `imbothat` implement the two transforms directly.

```matlab
% Example 8.10 — contrast enhancement via top-hat + bottom-hat, flat disk SE radius 3
se = strel('disk',3);
J = imsubtract(imadd(I,imtophat(I,se)), imbothat(I,se));
```

Adding back the top-hat residual boosts small bright details, and subtracting the bottom-hat residual deepens small dark details — together widening the effective contrast range of the image.

## 8.8 Tutorial: Binary Morphological Image Processing

**Goal.** Practice implementing the basic binary morphological operations in MATLAB.

**Objectives.** Dilate an image with `imdilate`; erode it with `imerode`; open it with `imopen`; close it with `imclose`; explore the hit-or-miss transform with `bwhitmiss`.

The tutorial works through a single test image (`blobs.png`) and two structuring elements — a 3×3 square and a 1×7 rectangle — comparing how each operator responds to a "compact" SE versus an "elongated" one.

```matlab
% Load the test image
I = imread('blobs.png');
figure, imshow(I), title('Original Image');

% --- Dilation ---
SE_1 = strel('square',3);
I_dil_1 = imdilate(I,SE_1);
figure, imshow(I_dil_1), title('Dilated with 3x3');

SE_2 = strel('rectangle',[1 7]);
I_dil_2 = imdilate(I,SE_2);
figure, imshow(I_dil_2), title('Dilated with 1x7');

% --- Erosion (reuses SE_1, SE_2) ---
I_ero_1 = imerode(I,SE_1);
figure, imshow(I_ero_1), title('Eroded with 3x3');

I_ero_2 = imerode(I,SE_2);
figure, imshow(I_ero_2), title('Eroded with 1x7');

% --- Opening ---
I_open_1 = imopen(I,SE_1);
figure, subplot(2,2,1), imshow(I), title('Original Image');
subplot(2,2,2), imshow(I_ero_1), title('Result of Erosion');
subplot(2,2,3), imshow(I_open_1), title('Result of Opening (3x3)');

I_open_2 = imopen(I,SE_2);
subplot(2,2,4), imshow(I_open_2), title('Result of Opening (1x7)');

% --- Closing ---
SE_3 = strel('square',5);
I_clo_1 = imclose(I,SE_3);
figure, imshow(I_clo_1), title('Closing the image');
```

Working through this sequence is a good self-check on §8.3–8.4: dilation with the square SE grows blobs symmetrically while the 1×7 SE stretches them mostly horizontally (and a 7×1 SE would do the mirror-image vertical stretch); erosion mirrors the same asymmetry in reverse; opening removes small blobs/protrusions without inflating survivors (unlike plain dilation would), and comparing `I_open_1` against `I_ero_1` shows opening restoring the eroded shapes closer to their original size; closing with the larger 5×5 SE fills small gaps and rounds concavities without shrinking objects the way plain erosion would.

**Hit-or-miss transformation.** Unlike the operators above, the two SEs for `bwhitmiss` are not simple all-ones matrices — they encode a specific local configuration to search for, so they must be defined by hand rather than generated with `strel`.

```matlab
SE1 = [0 0 0 0 0
       0 0 0 0 0
       0 1 1 0 0
       0 0 1 0 0
       0 0 0 0 0];

SE2 = [0 0 0 0 0
       1 1 1 1 0
       0 0 0 1 0
       0 0 0 1 0
       0 0 0 1 0];

I_hm = bwhitmiss(I,SE1,SE2);
figure, imshow(I), title('Original Image');
figure, imshow(I_hm), title('Hit-or-miss operation');
```

Because `SE1` and `SE2` never overlap (no cell is 1 in both), the pair can be collapsed into a single **interval** array, where `1` marks cells belonging to `SE1` (the "hit" pattern), `-1` marks cells belonging to `SE2` (the "miss" pattern), and `0` is ignored:

```matlab
Interval = [ 0  0  0  0  0
            -1 -1 -1 -1  0
             0  1  1 -1  0
             0  0  1 -1  0
             0  0  0 -1  0];

I_hm2 = bwhitmiss(I,Interval);
figure, imshow(I_hm), title('Using two SEs');
figure, imshow(I_hm2), title('Using interval');
```

`I_hm` and `I_hm2` should be identical. This single-array shortcut only works, however, when the "hit" and "miss" patterns never share a cell — if they did, a single value at that cell could not simultaneously mean "must be foreground" and "must be background".

## 8.9 Tutorial: Basic Morphological Algorithms

**Goals.** Perform boundary extraction; fill object holes with `imfill`; select objects interactively with `bwselect`; label connected components with `bwlabel`; and explore thinning, thickening, and skeletonization via `bwmorph`.

```matlab
% --- Boundary extraction: manual (erosion + subtraction) vs. bwperim ---
I = imread('morph.bmp');
figure, imshow(I), title('Original image');

se = strel('square',3);
I_ero = imerode(I,se);
I_bou = imsubtract(I,I_ero);
figure, imshow(I_bou), title('Boundary Extraction');

I_perim = bwperim(I,8);
figure, imshow(I_perim), title('Boundary using bwperim');
% I_perim should match I_bou exactly, since bwperim(I,8) computes
% the same internal boundary A - (A erode 3x3-square) internally.

% --- Region filling ---
I_fill1 = imfill(I,'holes');
figure, imshow(I_fill1), title('Holes filled');

I_fill2 = imfill(I);   % interactive: click seed points inside holes, then press Enter
imshow(I_fill2), title('Interactive fill');

% --- Selecting and labeling objects ---
bwselect(I);           % interactively pick a connected component

I_label = bwlabel(I);
figure, imshow(I_label,[]), title('Labeled image');
% each connected component is assigned a distinct integer label,
% displayed as a distinct shade of gray (or, better, with a
% pseudocolor map via label2rgb for easier visual separation)

% --- Thinning, thickening, skeletonization ---
I_thin = bwmorph(I,'thin',5);
figure, imshow(I_thin), title('Thinning, 5 iterations');

I_thick = bwmorph(I,'thicken',5);
figure, imshow(I_thick), title('Thicken, 5 iterations');

I_skel = bwmorph(I,'skel',Inf);
figure, imshow(I_skel), title('Skeleton of image');
```

A few things worth confirming hands-on while running this: using 4-connectivity instead of 8-connectivity in `bwperim` changes which boundary pixels count as touching the object's edge, and can alter the resulting perimeter for diagonally-connected shapes; `imfill` accepts either interactive seed clicks or, with `'holes'`, fills every enclosed background region automatically with no seeding at all; increasing `bwmorph(...,'thin'/'thicken',N)` beyond what is needed for full convergence has no further effect once the shape stabilizes — passing `Inf` iterations reveals exactly when that happens, since MATLAB simply runs until nothing changes; and `'skel'` and `'thin'` both reduce a shape's thickness while trying to preserve its topology/connectivity, but skeletonization pushes all the way down to a maximally thin (typically 1-pixel-wide) medial representation, whereas thinning with a small, finite iteration count only shaves a fixed number of layers off the boundary.

## What have we learned?

- **Mathematical morphology** represents, describes, and analyzes shapes in images by transforming a set (the image) with another well-defined set, the **structuring element (SE)**. It is a tool both for extracting shape-based image components (boundaries, skeletons, connected components) and for pre-/post-processing images that contain shapes of interest.
- The main morphological operations are **erosion** (`imerode`), **dilation** (`imdilate`), **opening** (`imopen`), **closing** (`imclose`), and the **hit-or-miss transform** (`bwhitmiss`). Dilation grows/thickens objects; erosion shrinks/thins them; they are dual operations under complement and reflection.
- **Opening** (erosion then dilation) removes small protrusions/objects and severs thin bridges without shrinking survivors; **closing** (dilation then erosion) fills small holes and gaps without enlarging objects. Both are idempotent and mutually dual.
- The **structuring element** is the basic neighborhood structure behind every morphological operator; its shape and size are what determine the result of applying that operator to a given image.
- Morphological operators combine into useful algorithms: **boundary extraction** (dilation/erosion + set difference), **region filling** and **connected-component extraction** (both iterative dilation-and-intersect procedures that differ only in whether growth is confined to a hole's interior or a component's own pixels), and, at the toolbox level, `bwmorph`'s catalog of thinning/thickening/skeletonization/pruning operations.
- Grayscale morphology extends dilation and erosion to intensity images via local max/min under the SE's footprint, and reuses the same formulas for opening/closing; the **top-hat** and **bottom-hat** transforms subtract out the opened/closed image to isolate small bright/dark detail, useful for shading correction and contrast enhancement.
- Morphological filtering — opening followed by closing with the same SE — is an effective way to remove impulse (salt-and-pepper) noise from binary and grayscale images, at the cost of some edge rounding that grows with SE size.

