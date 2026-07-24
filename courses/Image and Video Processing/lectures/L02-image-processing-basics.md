---
title: "Image Processing Basics"
subject: "computer-vision"
type: lecture
lecture_no: 2
status: done
source: slide
tags: [sampling, quantization, pixel-relationships, image-types, resolution]
date: 2024-08-30
---

# Lecture 2 – Image Processing Basics

> How is a digital image represented and stored in memory? What are the main types of digital image representation, and the most common file formats used to store them? This lecture builds the vocabulary the rest of the course relies on: the image as a 2D function $f(x,y)$, the four basic image types (binary, gray-level, RGB, indexed), the terminology of pixel neighborhoods, adjacency, connectivity and distance, and a first overview of how image processing operations — point, neighborhood, multi-image, and transform-domain — act on pixel values.

---

## 2.1 Digital Image Representation

A digital image — whether it results from sampling and quantizing an analog image (e.g., a photograph digitized by a scanner or camera sensor) or is created directly in digital form (e.g., a rendered graphic) — can always be represented as a two-dimensional matrix of real numbers. Throughout the course we adopt the convention $f(x,y)$ to denote a monochrome image of size $M \times N$, where $x$ is the row index (ranging from $0$ to $M-1$) and $y$ is the column index (ranging from $0$ to $N-1$):

$$
f(x,y) = \begin{bmatrix}
f(0,0) & f(0,1) & \cdots & f(0,N-1) \\
f(1,0) & f(1,1) & \cdots & f(1,N-1) \\
\vdots & \vdots & \ddots & \vdots \\
f(M-1,0) & f(M-1,1) & \cdots & f(M-1,N-1)
\end{bmatrix}
$$

The value of $f$ at a given pixel of coordinates $(x_0, y_0)$, written $f(x_0, y_0)$, is called the **intensity** or **gray level** of the image at that pixel. The range that a pixel intensity can take depends on the data type and convention used:

| numpy dtype | Typical range | Meaning |
|---|---|---|
| `np.float64`/`np.float32` | $[0.0, 1.0]$ (by convention) | $0.0$ = black, $1.0$ = white |
| `np.uint8` | $[0, 255]$ | $0$ = black, $255$ = white |
| `np.uint16` | $[0, 65535]$ | $0$ = black, $65535$ = white |

One convenient fact worth flagging early: numpy (and OpenCV) use **0-based** array indexing (`I[0,0]` is the first pixel) — this matches the mathematical convention $f(x,y)$ used in textbooks and in these notes exactly, unlike MATLAB's 1-based indexing, so no offset needs to be tracked when translating formulas into code.

Monochrome images are, at their core, just 2D numpy arrays. Because numpy treats arrays as a first-class, built-in data type — and OpenCV operates directly on them — it is particularly convenient for manipulating images without resorting to explicit loops or low-level array bookkeeping.

More generally, digital images can be encoded in two fundamentally different ways:

- **Raster (bitmap) representation** — the image is stored as one or more 2D arrays of pixels. This is the format used by cameras, scanners, and the vast majority of image processing algorithms.
- **Vector representation** — the image is stored as a series of drawing commands (lines, curves, fills) rather than as pixel values.

| | Bitmap (raster) | Vector |
|---|---|---|
| Storage | 2D array(s) of pixel values | List of drawing primitives |
| Quality / display speed | High, direct | Needs rasterization before display |
| Memory footprint | Larger, size-dependent | Smaller, resolution-independent |
| Resizing | May introduce artifacts (blur, blockiness) | Resizes/scales without artifacts |
| Typical use | Photographs, scanned documents | Logos, technical drawings, fonts |

Image processing, as covered in this course, works almost exclusively with **bitmap** representations.

### 2.1.1 Binary (1-bit) Images

Binary images are encoded as a 2D array using **1 bit per pixel**, where, by (loose) convention, a $0$ means "black" and a $1$ means "white" — though the opposite convention is also seen, so there is no universal agreement. Their chief advantage is a very small footprint, which makes them well suited to images containing simple graphics, text, or line art (e.g., scanned fax pages, document masks, binarized segmentation masks).

### 2.1.2 Gray-Level (8-bit) Images

Gray-level (also called **monochrome**) images are likewise encoded as a 2D array of pixels, but typically using **8 bits per pixel**. A pixel value of $0$ corresponds to black, $255$ to white, and every intermediate value is a shade of gray. Eight bits give $256$ discrete gray levels — a number that comfortably exceeds what the human visual system can reliably distinguish under normal viewing conditions, which is why 8-bit gray-level images are the de facto standard for monochrome imaging.

### 2.1.3 Color Images

Representing color is more complex and varied than representing intensity alone. The two most common representations are:

- **RGB (24-bit) representation** — each pixel is described by three values, one for each of the red (R), green (G), and blue (B) channels. Concretely, a color image can be thought of as **three 2D arrays of the same size**, stacked together, one per channel. Each array element holds an 8-bit value in $[0, 255]$ indicating the amount of that primary at that point. Combining the three 8-bit channels into a single 24-bit number yields $2^{24} = 16{,}777{,}216$ (about 16 million, "16M") possible color combinations.
- **Indexed representation** — a single 2D array of the same size as the image stores not color values directly, but **indices (pointers)** into a color palette, or lookup table (LUT).

Indexed color exists mainly for backward compatibility with older display hardware that could not simultaneously render 16 million colors. The solution — devised before 24-bit color displays and video cards were widely available — was to store, alongside the index array, a **color map** (a fixed-size list of colors, usually up to 256) and let each pixel simply point to a row of that map rather than carry a full 24-bit value.

| | RGB (24-bit) | Indexed |
|---|---|---|
| Storage | 3 arrays × 8 bits/pixel | 1 array of indices + a color map (≤ 256 entries) |
| Color range | Up to ~16.7M simultaneous colors | Limited to the size of the color map |
| Typical use | Photographs, natural images | GIF images, palette-limited displays, simple graphics |

### 2.1.4 Compression

Raw (uncompressed) image representations require a large amount of storage space, and proportionally long transmission times when uploading or downloading files. For this reason, most image file formats apply some form of compression. Compression methods fall into two broad categories:

- **Lossy** — a tolerable degree of visual-quality degradation is accepted in exchange for a much smaller file.
- **Lossless** — the image is recovered at full, bit-exact quality after decompression.

The overall outcome of compressing an image — how much storage is saved (often reported as a **compression ratio** or in **bits per pixel, bpp**) and how much quality is lost in the lossy case — depends on the technique, the file format, the chosen options (e.g., the "quality" slider in JPEG), and the actual content of the image being compressed.

---

## 2.2 Image File Formats

Most bitmap image file formats consist of a **file header** followed by (often compressed) pixel data. The header stores metadata about the image — height, width, number of bands (channels), number of bits per pixel, and signature bytes that identify the file type so that readers can recognize the format.

The simplest possible formats are **BIN** and the **PPM family**:

- **BIN** — the raw pixel data with no header at all; the reader must already know the image dimensions and pixel type out of band.
- **PPM and its variants** — PBM (binary images), PGM (grayscale images), PPM (color images), and PNM (a generic name covering any of the above). These are widely used in image processing research because their simplicity makes them trivial to parse, and most free format-conversion tools support them.

Beyond these research-oriented formats, the file formats most commonly encountered in everyday practice are **BMP, GIF, JPEG, TIFF, and PNG**, each trading off compression scheme, color depth support, and lossy/lossless behavior differently (e.g., JPEG is lossy and RGB-oriented; GIF is lossless but limited to an indexed 256-color palette; PNG is lossless and supports both RGB and indexed color; TIFF is a flexible container that can hold either compressed or uncompressed data). In Python, `cv2.imread`/`cv2.imwrite` (or `PIL.Image.open`/`.save`) handle reading from, and writing to, most of these formats and their variants/options transparently.

---

## 2.3 Basic Terminology

This section introduces the vocabulary of **image topology** — the study of fundamental structural properties of an image (usually a binary image), typically investigated with the help of morphological operators. Typical questions in this space: how many separate objects does the image contain? How many disconnected regions? How many holes does a given object have?

**Neighborhood.** The pixels surrounding a given pixel form its neighborhood — conceptually a small matrix, usually centered on the reference pixel. Most neighborhoods used in image processing algorithms are small square arrays with an odd side length (3×3, 5×5, …), so that a well-defined center pixel exists.

In the specific context of image topology, "neighborhood" takes on a more precise, discrete meaning. For a reference pixel $p$:

| Neighborhood | Pixels included |
|---|---|
| **4-neighborhood**, $N_4(p)$ | The pixel above, below, to the left, and to the right of $p$ |
| **Diagonal neighborhood**, $N_D(p)$ | The four diagonal pixels of $p$ (belong to $N_8(p)$ but not $N_4(p)$) |
| **8-neighborhood**, $N_8(p)$ | $N_4(p) \cup N_D(p)$ — all eight immediate neighbors of $p$ |

**Adjacency.** Two pixels $p$ and $q$ are **4-adjacent** if they are 4-neighbors of each other, and **8-adjacent** if they are 8-neighbors of each other. A third notion, **mixed adjacency** (or **m-adjacency**), is sometimes introduced specifically to eliminate the ambiguities — redundant or multiple paths — that can arise when plain 8-adjacency is used to trace connected regions.

**Paths.** A **4-path** between pixels $p$ and $q$ is a sequence of pixels, starting at $p$ and ending at $q$, such that every pixel in the sequence is 4-adjacent to its predecessor. An **8-path** is defined analogously, requiring 8-adjacency between consecutive pixels.

**Connectivity.** If a 4-path exists between $p$ and $q$, the two pixels are said to be **4-connected**; if an 8-path exists between them, they are **8-connected**.

**Components.** A maximal set of pixels that are pairwise connected to each other is called a **component**: a **4-component** if connectivity is defined via 4-adjacency, or an **8-component** if via 8-adjacency. Components are typically labeled (and optionally pseudo-colored for visualization) in a unique way, producing a **labeled image** $L(x,y)$ whose pixel values are symbols from a chosen alphabet — usually just the integer index of the component that pixel belongs to.

The choice of connectivity rule is not a mere technicality — it changes the answer. A classic illustration (`cv2.connectedComponents(image, connectivity=8)` vs. `connectivity=4` on a simple test pattern) shows the number of connected components varying from **2** components when using **8-connectivity** to **3** components when using **4-connectivity** on the very same binary image — because two diagonally touching regions count as connected under 8-connectivity but not under 4-connectivity.

**Distances between pixels.** Many image processing applications require measuring the distance between two pixels. Given $p = (x_0, y_0)$ and $q = (x_1, y_1)$, the three most common distance measures are:

$$
D_e(p,q) = \sqrt{(x_1 - x_0)^2 + (y_1 - y_0)^2} \qquad \text{(Euclidean distance)}
$$

$$
D_4(p,q) = |x_1 - x_0| + |y_1 - y_0| \qquad \text{(city-block / Manhattan distance)}
$$

$$
D_8(p,q) = \max\big(|x_1 - x_0|,\ |y_1 - y_0|\big) \qquad \text{(chessboard distance)}
$$

| Distance | Also known as | Shape of equidistant contour |
|---|---|---|
| $D_e$ | Euclidean | Circle |
| $D_4$ | City-block, Manhattan | Diamond (rotated square) |
| $D_8$ | Chessboard | Square |

$D_4$ measures distance as if only 4-connected moves were allowed (like a rook restricted to one step at a time along rows/columns), while $D_8$ measures distance as if diagonal moves were free (like a king on a chessboard, where a diagonal step counts the same as a horizontal/vertical one).

---

## 2.4 Overview of Image Processing Operations

Image processing operations can be organized along two broad axes: operations performed directly on pixel values (**spatial domain**) and operations performed after transforming the image into another representation (**transform domain**).

**Operations in the spatial domain** perform arithmetic and/or logical calculations directly on the original pixel values. They subdivide further into three categories:

| Category | Also known as | Resulting pixel depends on |
|---|---|---|
| **Global operations** | Point operations | Only the pixel's own original value |
| **Neighborhood-oriented operations** | Local / area operations | The pixel's original value **and** its neighbors' values |
| **Operations combining multiple images** | — | The corresponding pixels of two (or more) input images |

**Operations in a transform domain** first apply a mathematical transformation to the image — such as the Fourier Transform (FT) or the Discrete Cosine Transform (DCT) — and the actual processing algorithm operates on the transformed coefficients rather than on the original pixel grid.

### 2.4.1 Global (Point) Operations

Point operations apply the **same** transformation function to every pixel, regardless of that pixel's location or the values of its neighbors. In the spatial domain this is written as

$$
g(x,y) = T\big[f(x,y)\big]
$$

where $g(x,y)$ is the processed (output) image, $f(x,y)$ is the original (input) image, and $T$ is an operator acting on $f$. Because the actual pixel coordinates play no role in how $T$ transforms the value, a shorthand notation is commonly used instead:

$$
s = T(r)
$$

where $r$ is the original gray level and $s$ is the resulting gray level after the transformation. A simple example is halving the overall intensity of an image, i.e., $s = r/2$ — a linear, monotonically increasing point transformation that darkens every pixel by the same proportion, independent of where it sits in the image.

```python
# Global (point) operation example: halve the intensity of every pixel
import cv2
import matplotlib.pyplot as plt

I  = cv2.imread('cameraman.tif', cv2.IMREAD_GRAYSCALE)
I2 = (I / 2).astype(I.dtype)   # s = r / 2, applied identically to every pixel

fig, axes = plt.subplots(1, 2)
axes[0].imshow(I, cmap='gray');  axes[0].set_title('Original');                    axes[0].axis('off')
axes[1].imshow(I2, cmap='gray'); axes[1].set_title('Halved intensity (s = r/2)');  axes[1].axis('off')
plt.show()
```

### 2.4.2 Neighborhood-Oriented Operations

Neighborhood-oriented (local, or area) operations compute the resulting value at coordinates $(x,y)$ as a function of the pixel's original value **and** the values of (some of) its neighbors — most typically via a **convolution** operation.

Convolving a source image with a small 2D array — variously called a **window**, **template**, **mask**, or **kernel** — produces a destination image in which each output pixel depends on the corresponding input pixel and its neighbors. The convolution mask determines *which* neighbors participate and the *relative weight* given to each.

Masks are most commonly $3 \times 3$. Each of the nine mask coefficients ($W_1, \dots, W_9$) is a weight:

$$
\text{Mask} = \begin{bmatrix} W_1 & W_2 & W_3 \\ W_4 & W_5 & W_6 \\ W_7 & W_8 & W_9 \end{bmatrix}
$$

The mask can be visualized as a small window overlaid on the image, used to compute one output pixel at a time; as each pixel is processed, the window slides to the next position and the computation repeats until every pixel of the source image has been visited.

```python
# Neighborhood-oriented operation example: 3x3 averaging (smoothing) filter
import cv2
import matplotlib.pyplot as plt

I  = cv2.imread('cameraman.tif', cv2.IMREAD_GRAYSCALE)
I2 = cv2.blur(I, (3, 3))   # 3x3 mask with W1..W9 all equal to 1/9

fig, axes = plt.subplots(1, 2)
axes[0].imshow(I, cmap='gray');  axes[0].set_title('Original');                              axes[0].axis('off')
axes[1].imshow(I2, cmap='gray'); axes[1].set_title('3x3 averaging (neighborhood operation)'); axes[1].axis('off')
plt.show()
```

### 2.4.3 Operations Combining Multiple Images

Many applications combine two images pixel-by-pixel, via an arithmetic or logical operator, to produce a third image $Z$:

$$
X \; \mathit{op}_n \; Y = Z
$$

where $X$ and $Y$ may be images (arrays) or scalars, $Z$ is necessarily an array, and $\mathit{op}_n$ is a binary mathematical operator ($+, -, \times, /$) or logical operator (AND, OR, XOR).

```python
# Combining two images pixel-by-pixel
import cv2

X = cv2.imread('image1.tif')
Y = cv2.imread('image2.tif')

Zadd = cv2.add(X, Y)          # X + Y  (e.g., blending / double exposure)
Zsub = cv2.subtract(X, Y)     # X - Y  (e.g., background subtraction, change detection)
Zand = cv2.bitwise_and(X, Y)  # X AND Y (logical masking)
```

Typical uses include image blending (weighted addition), background subtraction (subtracting a reference frame to isolate moving objects), and masking (logical AND/OR with a binary mask to select a region of interest).

### 2.4.4 Operations in a Transformation Domain

A **transform** is a mathematical tool that converts one set of values into another set of values, giving a new way of representing the same underlying information. In image processing, the original pixel grid is referred to as the **spatial domain**, and the result of applying a transform is said to lie in the **transform domain**.

The motivation for using mathematical transforms is that certain tasks are best carried out not directly in the spatial domain, but by: (1) transforming the input image, (2) applying selected algorithms to the transformed coefficients, and (3) applying the inverse transform to bring the result back into the spatial domain. The Fourier Transform, for instance, exposes an image's frequency content, making operations like low-pass (blurring) or high-pass (edge-enhancing) filtering a matter of simply attenuating or amplifying the appropriate frequency components before inverting the transform. The DCT plays an analogous role and is, notably, the backbone of JPEG compression.

### 2.4.5 Image Registration

Image registration is the process of geometrically aligning two or more images of the same scene — acquired, for example, from different viewpoints, at different times, or with different sensors — into a single, common coordinate system. It typically involves estimating a spatial transformation (translation, rotation, scaling, or a more general warp) that maps corresponding features in one image onto their counterparts in the other. Registration is a prerequisite for many downstream tasks, such as change detection over time, multi-sensor (e.g., visible + infrared) fusion, and building panoramas or mosaics from overlapping frames.

---

## What have we learned?

- Digital images can be encoded in two fundamentally different ways: **bitmap (raster)** representations, which use one or more 2D arrays of pixels (picture elements), and **vector** representations, which use a series of drawing commands.
- **Binary images** are encoded as a 2D array using 1 bit per pixel, where — usually, but not always — $0$ means "black" and $1$ means "white."
- **Gray-level (monochrome) images** are encoded as a 2D array using 8 bits per pixel, where $0$ usually means "black," $255$ means "white," and intermediate values are shades of gray.
- The two most common ways of storing **color image** contents are **RGB** representation — each pixel described by a 24-bit number combining its red, green, and blue components — and **indexed** representation, where a 2D array of indices points into a color palette (lookup table).
- Some of the most popular image file formats in use today are **BMP, GIF, JPEG, TIFF, and PNG**. Python's `cv2.imread`/`cv2.imwrite` (and `PIL.Image`) support most of these formats and their variants/options.
- **Image topology** is the branch of image processing concerned with fundamental image properties — such as the number of connected components and the number of holes in an object — expressed through concepts like **adjacency** and **connectivity** (4- vs. 8-neighborhoods, 4- vs. 8-paths, 4- vs. 8-components).
- **Distances between pixels** are commonly measured with the Euclidean ($D_e$), city-block ($D_4$), or chessboard ($D_8$) metrics, each corresponding to a different notion of "closeness" and a different equidistant contour shape (circle, diamond, square).
- Image processing operations split into two big families: **spatial-domain** techniques — further divided into **point (global)** operations, **neighborhood-oriented (local/area)** operations, and **operations combining multiple images** — and **transform-domain** techniques, which process the image after applying a mathematical transform such as the FT or DCT.

