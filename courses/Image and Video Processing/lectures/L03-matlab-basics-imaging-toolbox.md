---
title: "Python and OpenCV Basics for Image Processing"
subject: "computer-vision"
type: lecture
lecture_no: 3
status: done
source: slide
tags: [python, opencv, numpy, matplotlib, image-basics, data-types]
date: 2024-09-06
---

# Lecture 3 – Python and OpenCV Basics for Image Processing

> Core content: why Python + OpenCV is the tool combination used throughout this course, the basic building blocks (numpy arrays, dtypes, operators), an overview of OpenCV, the essential functions for reading, displaying, exploring, and writing images, and a hands-on tutorial that ties everything together. Special emphasis is placed on **numpy dtypes and their value ranges**, since misunderstanding them is one of the most common sources of bugs in image processing code.

---

## 3.1 Introduction to Python and OpenCV

**Python**, together with **numpy** (array/matrix support) and **OpenCV** (`opencv-python`, the `cv2` module), is a data analysis, prototyping, and image processing stack with strong visualization support (via `matplotlib`) and a large ecosystem of specialized libraries. It has become extremely popular with engineers, researchers, and industry practitioners for two main reasons:

- **Rich, specialized libraries.** Functionality is packaged into focused libraries covering many application areas — from deep learning (`pytorch`, `tensorflow`), to data analysis (`pandas`), to image processing (`opencv-python`, `scikit-image`, `Pillow`), all interoperating through the common `numpy` array.
- **Extensive, freely available documentation.** Python, numpy, and OpenCV all ship extensive online documentation, docstrings accessible via `help()`, and a huge body of community examples — and unlike MATLAB, the entire stack is free and open source.

A few structural facts about this stack matter a great deal for image processing work:

- **The basic data type is the numpy array (`ndarray`).** Arrays do not need to be dimensioned ahead of time — shapes are inferred and can grow/change dynamically. Even a single scalar can be represented as a 0-dimensional array.
- Python provides a **REPL / Jupyter notebook** workflow with an interpreter, a large library of numerical and string manipulation functions, 2D/3D plotting (`matplotlib`), and the ability to build GUIs. Because the language is interpreted rather than compiled, there is no compile step — this shortens the edit-run cycle considerably, which is why the Python/Jupyter workflow is well suited to fast prototyping, the same role MATLAB traditionally played.

## 3.2 Basic Elements of Python for Image Work

### 3.2.1 Data types (numpy dtypes)

Every numpy array has a **dtype**, and image processing code is only correct when the dtype (and its associated value range) is handled deliberately.

| numpy dtype | Description |
|---|---|
| `np.uint8` | 8-bit unsigned integers (1 byte per element) — the default dtype OpenCV uses when reading images |
| `np.uint16` | 16-bit unsigned integers (2 bytes per element) |
| `np.uint32` | 32-bit unsigned integers (4 bytes per element) |
| `np.int8` | 8-bit signed integers (1 byte per element) |
| `np.int16` | 16-bit signed integers (2 bytes per element) |
| `np.int32` | 32-bit signed integers (4 bytes per element) |
| `np.float32` (single) | single-precision floating-point numbers (4 bytes per element) |
| `np.float64` (double) | double-precision floating-point numbers (8 bytes per element) |
| `np.bool_` | values are `True`/`False` (1 byte per element) |
| `str` | Python's native text type (not stored per-pixel) |

Unless created from image data, a plain numpy array of numbers defaults to `np.float64` — Python's native `float` — mirroring MATLAB's default `double`. Conversion between dtypes — **typecasting**, via `.astype(...)` — is possible and often necessary; we will see below that typecasting an image is *not* the same thing as properly converting it (the range of values matters just as much as the dtype).

Numpy arrays are indexed using a **0-based convention** — the opposite of MATLAB: `a[0]` refers to the *first* element of a one-dimensional array `a`, and `f[0, 0]` refers to the first element of a two-dimensional array — e.g., the top-left pixel of a grayscale image `f`. The colon operator (`:`) provides the same kind of powerful slicing (selecting whole rows, columns, or "flattening" an entire array via `.ravel()`/`.flatten()`).

### 3.2.2 Standard arrays

Numpy ships with a number of built-in functions for generating standard arrays, which are constantly used to set up test images, masks, and filters:

- `np.zeros((m, n))` — an *m × n* array of zeros.
- `np.ones((m, n))` — an *m × n* array of ones.
- `np.ones((m, n), dtype=bool)` — an *m × n* array of `True`.
- `np.zeros((m, n), dtype=bool)` — an *m × n* array of `False`.
- `np.eye(n)` — the *n × n* identity matrix.
- `np.random.rand(m, n)` — an *m × n* array of pseudorandom numbers uniformly distributed in [0, 1].
- `np.random.randn(m, n)` — an *m × n* array of pseudorandom numbers following a normal (Gaussian) distribution with mean 0 and variance 1.

(numpy has no direct built-in equivalent of MATLAB's `magic(m)` — magic squares are rarely needed for image work, so it is safely omitted here.)

### 3.2.3 Array and matrix arithmetic operators

Numpy, unlike MATLAB, defaults to **element-by-element (array)** semantics for its arithmetic operators — this is the opposite convention from MATLAB and a common source of bugs when porting code between the two.

| Operator | Name | numpy function |
|---|---|---|
| `+` | Element-wise addition | `np.add(a, b)` |
| `-` | Element-wise subtraction | `np.subtract(a, b)` |
| `*` | Element-wise multiplication | `np.multiply(a, b)` |
| `@` | Matrix multiplication | `np.matmul(a, b)` (or `a.dot(b)`) |
| `/` | Element-wise division | `np.divide(a, b)` |
| `**` | Element-wise power | `np.power(a, b)` |
| `.T` | Array/matrix transpose | `np.transpose(a)` |
| `.conj().T` | Complex conjugate transpose | `np.conjugate(a).T` |
| `+` (unary) | Unary plus | `np.positive(a)` |
| `-` (unary) | Unary minus | `np.negative(a)` |
| `:` | Slicing | `a[start:stop:step]` |

`*` and `/` on two numpy arrays are **already element-wise** — exactly what you want for pixel-wise operations on images — whereas `@` (or `np.matmul`) invokes true linear-algebra matrix multiplication. There is no separate "dotted" operator family to remember, but the flip side is that reused MATLAB habits (`*` meaning matrix multiply) will silently do the wrong thing in numpy.

### 3.2.4 Specialized matrix operations

| Name | numpy operator or function |
|---|---|
| Array/matrix transpose | `.T` attribute |
| Inversion | `np.linalg.inv(a)` |
| Matrix determinant | `np.linalg.det(a)` |
| Flip up and down | `np.flipud(a)` |
| Flip left and right | `np.fliplr(a)` |
| Array rotation | `np.rot90(a)` |
| Array reshape | `a.reshape(...)` |
| Sum of the diagonal elements | `np.trace(a)` |

### 3.2.5 Specialized arithmetic functions supported by OpenCV

Plain numpy arithmetic on `uint8` image arrays does **not** saturate/clip the way image data usually requires — `np.uint8(250) + np.uint8(10)` silently **wraps around** to 4 rather than clipping to 255. Because of this, OpenCV ships dedicated arithmetic functions that handle images correctly by saturating instead of wrapping:

| Function | Description |
|---|---|
| `cv2.add(a, b)` | Adds two images, or adds a constant to an image (saturates instead of wrapping) |
| `cv2.subtract(a, b)` | Subtracts two images, or subtracts a constant from an image (clips at 0 instead of wrapping) |
| `cv2.multiply(a, b)` | Multiplies two images (element-by-element), or multiplies an image by a constant |
| `cv2.divide(a, b)` | Divides one image by another (element-by-element), or by a constant |
| `cv2.absdiff(a, b)` | Computes the absolute difference between two images |
| `cv2.bitwise_not(a)` | Complements (inverts) an image |
| `cv2.addWeighted(a, alpha, b, beta, gamma)` | Computes a weighted linear combination `a*alpha + b*beta + gamma` of two images |

### 3.2.6 Relational and logical operators

| Operator | Name |
|---|---|
| `<` | Less than |
| `<=` | Less than or equal to |
| `>` | Greater than |
| `>=` | Greater than or equal to |
| `==` | Equal to |
| `!=` | Not equal to |

| Operator | Name |
|---|---|
| `&` | Element-wise AND |
| `\|` | Element-wise OR |
| `~` | Element-wise NOT |

| Function | Description |
|---|---|
| `np.logical_xor(a, b)` | Exclusive-or (XOR) between two operands |
| `np.all(a)` | Returns `True` if all elements are nonzero (accepts an `axis` argument; with none, reduces over the *whole* array, unlike MATLAB's column-wise default) |
| `np.any(a)` | Returns `True` if any element is nonzero (same `axis` behavior as `np.all`) |

Relational operators applied to arrays return a `bool` array of the same shape — this is the mechanism behind thresholding operations, where `f > 128` produces a binary mask directly, exactly as in MATLAB. Note that `&`/`\|`/`~` on numpy arrays require **parentheses** around each comparison (e.g. `(f > 50) & (f < 200)`), since Python's operator precedence would otherwise bind them incorrectly.

## 3.3 OpenCV: An Overview

**OpenCV** (Open Source Computer Vision Library, imported as `cv2`) is a library that extends numpy's base array capability with specialized signal and image processing operations. It covers, among others:

- Spatial transformations
- Image analysis and enhancement
- Neighborhood and block operations (filtering)
- Linear filtering and filter design
- Mathematical transforms (DFT, DCT)
- Deblurring / restoration
- Morphological operations
- Color image processing

OpenCV rarely works alone: `numpy` provides the underlying array math, `matplotlib` is the usual choice for plotting and (in notebooks) for image display, `Pillow` (`PIL`) fills in format/metadata gaps OpenCV doesn't cover (e.g. palette images), and `scikit-image` supplies some higher-level algorithms not present in OpenCV core.

The remainder of this lecture walks through the essential, everyday functions for reading, converting, displaying, exploring, and writing images.

## 3.4 Essential Functions and Features

### 3.4.1 Displaying information about an image file — `PIL.Image.open`

Before even reading pixel data, `PIL.Image.open` (Pillow) lazily opens a file and lets you inspect its metadata without decoding the whole image into memory — the closest Python equivalent of MATLAB's `imfinfo`:

```python
from PIL import Image
import os

img = Image.open('maxresdefault.jpg')
print(f"Format: {img.format}")
print(f"Size: {img.size}")   # (width, height)
print(f"Mode: {img.mode}")   # e.g. 'RGB'
print(f"File size: {os.path.getsize('maxresdefault.jpg')} bytes")
```

```
Format: JPEG
Size: (1280, 720)
Mode: RGB
File size: 201014
```

From this single call we already learn the image's dimensions (1280×720) and that it is stored as a truecolor (`RGB`) JPEG. `cv2.imread`, by contrast, always decodes the full pixel data immediately — there is no metadata-only OpenCV equivalent.

### 3.4.2 Reading an image file — `cv2.imread`

`cv2.imread` reads image files of virtually any common format, located anywhere on disk. Two details matter that have no MATLAB parallel:

- **Channel order.** `cv2.imread` returns color images as **BGR**, not RGB — a very common source of bugs when combining OpenCV with `matplotlib` or `Pillow`, both of which expect RGB.
- **No separate "indexed image" return.** Unlike MATLAB's `imread`, which returns an index array + color map for palette-based files, OpenCV has no concept of indexed images — it always expands palette-based formats (indexed PNG/TIFF/GIF) into full RGB/BGR pixel data on read. If you need the raw indexed representation, use Pillow instead (§3.4.5).

The read mode is controlled by a flag: `cv2.IMREAD_COLOR` (default, 3-channel BGR), `cv2.IMREAD_GRAYSCALE` (force single channel), or `cv2.IMREAD_UNCHANGED` (preserve alpha/original channel count).

### 3.4.3 Data types and data conversions

The most common numpy dtypes used for images are:

- **`np.uint8`** — 1 byte per pixel, values in the range **[0, 255]**. What `cv2.imread` returns by default.
- **`np.float64`/`np.float32`** — 8/4 bytes per pixel, values *conventionally* normalized to **[0.0, 1.0]** — but numpy does not enforce this range the way MATLAB's `double`-image convention implicitly assumes it either.
- **`np.bool_`** — 1 byte per pixel, representing `True` (white) or `False` (black).

Once an image has been read into a variable, it is good practice to check its dtype (`img.dtype`) and its range of values (`img.min()`, `img.max()`) — this tells you how pixel data is represented and what range of values is legal.

Numpy allows straightforward dtype conversion (typecasting) via `.astype(...)`, e.g. `img.astype(np.uint8)`, but plain typecasting **does not handle the range problem** and is usually not what you want when working with images — worse, casting an out-of-range float to `uint8` **wraps around** rather than clipping (see the worked example below). OpenCV has no dedicated `im2uint8`-style conversion functions; the equivalent range-aware conversions are usually written explicitly:

| Goal | Python equivalent |
|---|---|
| `uint8` [0,255] → normalized `float64` [0,1] | `img.astype(np.float64) / 255.0` |
| normalized `float64` [0,1] → `uint8` [0,255] | `np.clip(img * 255, 0, 255).astype(np.uint8)` |
| rescale any range to [0,1] (like `mat2gray`) | `(img - img.min()) / (img.max() - img.min())`, or `cv2.normalize(img, None, 0, 1, cv2.NORM_MINMAX)` |
| threshold a normalized image to binary (like `im2bw`) | `binary = img > threshold` |

The input to any of the manual conversions above can come from `bool`, `uint8`, `uint16`, `int16`, `float32`, or `float64` arrays.

### 3.4.4 Worked example: typecasting vs. proper conversion

The difference between plain typecasting and a range-aware conversion is best shown with a small worked example. Consider a 2×2 `float64` array:

```python
import numpy as np

A = np.array([[-8.0, 4.0],
              [ 0.0, 0.5]])
```

**Plain typecasting** does *not* clip out-of-range values the way MATLAB does — it **wraps around** using integer overflow rules, which can silently produce a very different (and misleading) result:

```python
>>> B = A.astype(np.uint8)
>>> B
array([[248,   4],
       [  0,   0]], dtype=uint8)
```

Here `-8.0` did not clip to `0` — it wrapped around to `248` (i.e. `256 - 8`), and `0.5` truncated to `0` rather than rounding. This is a real, easy-to-hit bug: **numpy's `.astype()` is closer in spirit to a raw C-style cast than to any of MATLAB's `im2*` functions.**

A **proper, clipping conversion** — the behavior `im2uint8` provides in MATLAB — must be written explicitly, assuming the input is a normalized `double` image in [0.0, 1.0]: anything ≤ 0 clips to 0, anything ≥ 1 clips to 255, and 0.5 maps to the midrange point 128:

```python
>>> C = np.clip(A * 255, 0, 255).astype(np.uint8)
>>> C
array([[  0, 255],
       [  0, 128]], dtype=uint8)
```

**Min-max rescaling** — the behavior `mat2gray` provides — does something different again: since `A` is already floating-point, there is no dtype conversion to perform, only a **range** conversion. The smallest value (−8.0) maps to 0.0, the largest value (4.0) maps to 1.0, and everything in between is linearly rescaled:

```python
>>> D = (A - A.min()) / (A.max() - A.min())
>>> D
array([[0.        , 1.        ],
       [0.66666667, 0.70833333]])
```

Finally, **thresholding** — the behavior `im2bw` provides — turns a normalized array into a binary (`bool`) result. Applying a threshold of 0.4 to `D`:

```python
>>> E = D > 0.4
>>> E
array([[False,  True],
       [ True,  True]])
```

Every value greater than 0.4 becomes `True`; everything else becomes `False`. Because this comparison implicitly assumes `D` is already a normalized array, applying `A > 0.4` directly to the un-normalized `A` would run without error, but the result would not be meaningful — a clear illustration of why understanding dtypes and value ranges matters just as much in Python as in MATLAB.

### 3.4.5 Converting between color spaces and palette (indexed) images

OpenCV provides `cv2.cvtColor` for converting between color representations:

| Call | Converts | Into |
|---|---|---|
| `cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)` | A BGR (truecolor) image | Its grayscale equivalent |
| `cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)` | A grayscale image | A 3-channel BGR image (channel replicated, not re-colorized) |
| `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)` | A BGR image | Its RGB equivalent (needed before handing an OpenCV image to `matplotlib`/`Pillow`) |

For **palette (indexed)** images — which OpenCV cannot represent — use Pillow instead, which preserves the raw index + palette structure MATLAB's `imread` exposes:

```python
from PIL import Image
import numpy as np

im = Image.open('trees.tif')
print(im.mode)              # 'P' means palette (indexed) image
palette = im.getpalette()   # flat [R,G,B, R,G,B, ...] list — analogous to MATLAB's `map`
X_rgb = np.array(im.convert('RGB'))
X_gray = np.array(im.convert('L'))
```

`cv2.applyColorMap(img, cv2.COLORMAP_JET)` is a related but different tool — it maps grayscale *intensity* onto a fixed color lookup table (pseudocoloring) rather than exposing a genuine index/palette pair; pseudocolor mapping is covered in more depth in the color-image lecture.

## 3.5 Displaying the Contents of an Image

Two libraries cover image display, each with a different purpose:

- **`cv2.imshow(winname, img)`** — opens a native GUI window; expects BGR order; must be paired with `cv2.waitKey()` to actually render and stay open.
- **`matplotlib.pyplot.imshow(img)`** — the usual choice inside Jupyter notebooks; expects **RGB** order (convert BGR images first with `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)`), and needs `cmap='gray'` for single-channel images or they render through a default color map (`viridis`) instead of true grayscale.

**Example 3.3.** The following code opens an image file and displays it with different `imshow` options:

```python
import cv2
import matplotlib.pyplot as plt

I = cv2.imread('nature.jpg')
gray = cv2.cvtColor(I, cv2.COLOR_BGR2GRAY)

plt.imshow(gray, cmap='gray')
plt.show()

plt.imshow(gray, cmap='gray', vmin=gray.min(), vmax=gray.max())
plt.show()

plt.imshow(gray, cmap='gray', vmin=100, vmax=160)
plt.show()
```

The first call displays the grayscale image using matplotlib's default intensity scaling. The second call explicitly scales the display range to the image's own min/max — `matplotlib`'s `vmin`/`vmax` play exactly the role of MATLAB's `imshow(I, [])`. The third call specifies an explicit display range `vmin=100, vmax=160`: any value at or below 100 is displayed as black, and any value at or above 160 is displayed as white — a quick way to enhance contrast in a narrow band of gray levels without modifying the underlying pixel data.

## 3.6 Exploring the Contents of an Image

Beyond simply displaying an image, practitioners frequently need to inspect its pixel contents more closely. Unlike MATLAB, no single tool ships with OpenCV/matplotlib that combines everything `imtool` offers (Pixel Region, Image Information, and Adjust Contrast in one window). The closest equivalents are assembled from a few smaller pieces:

- **Colorbar + hover readout.** `plt.colorbar()` next to an `imshow` gives a static intensity legend; in an interactive matplotlib backend (or `%matplotlib widget` in Jupyter), hovering over the image shows the live `(x, y)` coordinate and pixel value in the toolbar.
- **`cv2.setMouseCallback`** — attach a click handler to an OpenCV window to read out pixel values interactively, the direct equivalent of `impixel`:

```python
import cv2

RGB = cv2.imread('peppers.png')

def on_click(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print(f"(x={x}, y={y}) -> BGR {RGB[y, x]}")

cv2.imshow('peppers', RGB)
cv2.setMouseCallback('peppers', on_click)
cv2.waitKey(0)
```

Note the index order: the callback reports `(x, y)` — i.e. `(column, row)` — but array indexing is `RGB[row, col]`, i.e. `RGB[y, x]`. Mixing these up is a very common bug.

- **Manual line profile** (the `improfile` equivalent) — sample pixel values along a line by interpolating coordinates and indexing directly:

```python
import numpy as np

def profile_line(img, p1, p2, num=200):
    r1, c1 = p1
    r2, c2 = p2
    rows = np.linspace(r1, r2, num).astype(int)
    cols = np.linspace(c1, c2, num).astype(int)
    return img[rows, cols]
```

For a full standalone interactive viewer (playing the role of `imtool`), external tools such as **napari** or **ImageJ/Fiji** are the common choices outside the OpenCV/matplotlib stack.

## 3.7 Writing the Resulting Image onto a File

`cv2.imwrite` writes the contents of an image array to disk in one of the popular graphics file formats. When the destination format uses lossy compression (e.g., JPEG), `cv2.imwrite` accepts an encoder parameter list that trades off subjective image quality against file size:

```python
import cv2

I = cv2.imread('nature.jpg')
cv2.imwrite('naturedefault.jpg', I)
cv2.imwrite('nature05.jpg', I, [cv2.IMWRITE_JPEG_QUALITY, 5])
cv2.imwrite('nature95.jpg', I, [cv2.IMWRITE_JPEG_QUALITY, 95])
```

A quality value of 5 produces a small, heavily compressed (visibly degraded) file; a quality value of 95 produces a much larger file that is nearly indistinguishable from the original.

## 3.8 Tutorial: Basic Image Manipulation

**Goal.** Explore basic image manipulation techniques using Python, numpy, OpenCV, and Pillow.

**Objectives.**

- Explore the different image representations supported by OpenCV and Pillow.
- Learn how to read images in Python.
- Explore image conversion (dtype, range, color space).
- Learn how to display images.
- Learn how to write images to disk.

**Step 1.** Load the image `coins.png`:

```python
import cv2

I = cv2.imread('coins.png')
```

> **Question 1.** What is the `dtype` and `shape` of `I`? What does each dimension of `shape` correspond to?
> **Question 2.** In a Jupyter notebook, why does typing just `I` on its own line print (part of) the array's contents, while `I = cv2.imread(...)` does not? (Hint: think about what a bare expression vs. an assignment does at a REPL prompt.)

Truecolor and grayscale images can both be read with `cv2.imread` exactly as above. Palette (**indexed**) images, however, need Pillow — OpenCV silently expands them to full RGB/BGR on read, discarding the index + palette structure.

**Step 2.** Load the image `trees.tif`, which is stored as an indexed (palette) image, using Pillow:

```python
from PIL import Image

im = Image.open('trees.tif')
print(im.mode)   # 'P' = palette (indexed)
```

> **Question 3.** What does `im.mode == 'P'` tell you about how the file stores its pixels? What does `im.getpalette()` return?

Some operations require converting an image from one representation to another — for instance, applying image adjustments directly to a palette image's index values would not give meaningful results, since the calculations would operate on palette indices rather than actual RGB values.

**Step 3.** Convert the indexed image to an RGB array `X_rgb`:

```python
import numpy as np

X_rgb = np.array(im.convert('RGB'))
```

> **Question 4.** How many dimensions does `X_rgb` have, and what are their sizes?

**Step 4.** Convert the same indexed image to a grayscale array:

```python
X_gray = np.array(im.convert('L'))
```

> **Question 5.** What `dtype` is `X_gray`?

**Step 5.** Verify that the new grayscale array's pixel values fall within [0, 255]:

```python
X_gray.max(), X_gray.min()
```

> **Question 6.** In MATLAB, this same check requires the colon operator (`X_gray(:)`) to force `max`/`min` to reduce over the *whole* array instead of column-wise. Do we need anything similar in numpy? Why or why not?

(`np.ndarray.max()`/`.min()` reduce over the *entire* array by default — the opposite default from MATLAB's `max`/`min`, which operate column-wise unless you pass `A(:)`. This is one case where numpy's default is actually the more convenient one for this particular check.)

**Step 6.** Convert `X_gray` to normalized `float64`:

```python
X_gray_dbl = X_gray.astype(np.float64) / 255.0
```

> **Question 7.** What is the range of values for `X_gray_dbl`?

(Dividing by 255 normalizes a `uint8` input into the [0.0, 1.0] range expected of a normalized floating-point image — so a value of 255 becomes 1.0, not literally 255.0. The same idea extends to converting toward `uint16`/`int16`: going from a wider integer dtype down to a narrower one **quantizes** the value range, an inherently lossy step.)

**Step 7.** Display the `coins.png` image (already loaded in `I`) with a pixel-value colorbar readout:

```python
import matplotlib.pyplot as plt

gray = cv2.cvtColor(I, cv2.COLOR_BGR2GRAY)
plt.imshow(gray, cmap='gray')
plt.colorbar(label='Gray level')
plt.show()
```

**Step 8.** Display two images side by side using `plt.subplots` — the RGB-converted `trees` image (`X_rgb`) and the grayscale `coins` image:

```python
fig, axes = plt.subplots(1, 2)
axes[0].imshow(gray, cmap='gray')
axes[0].axis('off')
axes[1].imshow(X_rgb)
axes[1].axis('off')
plt.show()
```

> **Note.** In MATLAB, mixing an indexed image and an intensity image in the same figure via `subplot` is a classic gotcha: a MATLAB figure has only **one** shared color map, so displaying the `trees` color map in one subplot silently recolors every other subplot sharing that figure — which is exactly why the original MATLAB tutorial needs `subimage`/manual RGB conversion as a workaround. This problem **does not exist in matplotlib**: each `imshow` call carries its own independent color mapping, so plain `subplots` is always safe here — no `subimage`-style workaround is needed.

**Step 9.** Use a mouse callback to interactively explore pixel values in an image, the direct equivalent of MATLAB's `impixel`:

```python
RGB = cv2.imread('peppers.png')
points = []

def on_click(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        points.append((x, y, tuple(RGB[y, x])))
        print(f"(x={x}, y={y}) -> BGR {RGB[y, x]}")

cv2.imshow('peppers', RGB)
cv2.setMouseCallback('peppers', on_click)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

> **Question 8.** The callback receives `(x, y)`, but pixel lookup uses `RGB[y, x]`. Why the swap — what do `x`/`y` and `row`/`col` each refer to, and why don't they line up directly?

(`x`/`y` are *display* coordinates — horizontal/vertical position on screen, i.e. column/row — while numpy indexes arrays as `[row, col]`. So `x` corresponds to the column index and `y` to the row index: `RGB[y, x]`, not `RGB[x, y]`. Mixing these up is one of the most common bugs when porting pixel-coordinate code between display libraries and array indexing.)

A manual line-sampling function (§3.6) complements this by reading intensity values *along a line or path*, rather than at isolated points.

**Step 10.** Explore a line profile across `coins.png` (loaded in `I`):

```python
r1, c1, r2, c2 = 17, 18, 201, 286

overlay = I.copy()
cv2.line(overlay, (c1, r1), (c2, r2), (0, 255, 0), 2)  # cv2.line takes (x, y) = (col, row)
plt.imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
plt.show()

num = int(np.hypot(r2 - r1, c2 - c1))
rows = np.linspace(r1, r2, num).astype(int)
cols = np.linspace(c1, c2, num).astype(int)
profile = gray[rows, cols]

plt.plot(profile)
plt.ylabel('Gray level')
plt.show()
```

This overlays a green line on the displayed image to show where the profile is taken, then plots the gray-level values sampled along that line in a separate figure. Note again that `cv2.line` takes its endpoints as `(x, y)` pairs, the reverse of the `(row, col)` order used for array indexing above.

**Step 11.** Use `cv2.imwrite` to save two of the modified images to disk — one in JPEG format, one in PNG format:

```python
cv2.imwrite('rgb_trees.jpg', cv2.cvtColor(X_rgb, cv2.COLOR_RGB2BGR))
cv2.imwrite('gray_trees.png', X_gray)
```

(`cv2.imwrite` expects BGR channel order, so an array that was assembled in RGB — like `X_rgb` from Pillow — must be converted back with `cv2.cvtColor(..., cv2.COLOR_RGB2BGR)` before saving; forgetting this swaps the red and blue channels in the saved file.)

## What have we learned?

- `cv2.imread` opens and reads image files in most popular formats, but returns color images in **BGR** order and has no concept of indexed (palette) images — use `Pillow` (`PIL.Image`) when you need the raw index + palette structure.
- The most common dtypes for images are **`np.uint8`** (1 byte/pixel, [0, 255]) and **`np.float64`/`np.float32`** (conventionally [0.0, 1.0], though numpy does not enforce this), plus **`np.bool_`** for binary images.
- Dtype compatibility is a prerequisite for image processing algorithms to work correctly. Plain typecasting (`.astype(...)`) does *not* clip or rescale — it can silently **wrap around** for out-of-range values — so range-aware conversions (dividing/multiplying by 255, `np.clip`, min-max rescaling) must be written explicitly, since OpenCV ships no `im2uint8`-style helpers.
- A solid understanding of dtypes and pixel value ranges is essential to writing correct image processing code — ignoring this can silently corrupt intermediate results, set incorrect thresholds, or produce other subtle bugs.
- `matplotlib.pyplot.imshow` (with `cmap='gray'` and `vmin`/`vmax` for scaled display) is the usual choice for image display in notebooks; `cv2.imshow` opens a native GUI window. Unlike MATLAB figures, each matplotlib `imshow` call has its own independent color mapping, so mixing indexed and grayscale images in the same figure is safe without any `subimage`-style workaround.
- `cv2.imwrite` is the function for saving processed image results back to a file, with optional format-specific parameters (e.g., JPEG quality via `cv2.IMWRITE_JPEG_QUALITY`) — remember it expects BGR channel order.
