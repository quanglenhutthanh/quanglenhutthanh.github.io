---
title: "Image Sensing and Acquisition"
subject: "computer-vision"
type: lecture
lecture_no: 4
status: done
source: slide
tags: [image-sensors, acquisition, sampling, quantization, resolution]
date: 2024-09-13
---

# Lecture 4 – Image Sensing and Acquisition

> This lecture walks through the physical pipeline that turns a real-world 3D scene into a 2D digital image. We start with light itself — its wave/particle nature, the electromagnetic spectrum, and how humans perceive brightness, hue, and saturation — then look at how contemporary image sensors (CCD and CMOS) and camera optics convert reflected energy into electrical signals. Finally, we cover the two operations that make an image *digital*: sampling (choosing how many points to measure) and quantization (choosing how many amplitude levels to assign), and how the sampling rate and the number of gray levels jointly determine image quality and file size.

## 4.1 Introduction

An image is a two-dimensional representation of a three-dimensional real-world object or scene, and producing one always requires a light source (or some other form of electromagnetic energy) illuminating that scene. A *digital* image, specifically, represents that 2D projection using a finite number of pixels, each holding a finite-precision value.

This lecture covers the full chain that gets us from "a scene bathed in light" to "a digital image stored as an array of numbers":

1. The physics of image formation — light reflecting off (or emitted by, or transmitted through) an object or scene.
2. The sensors used to capture that reflected/emitted/transmitted energy and turn it into an electrical signal.
3. The technical choices involved in digitizing that signal: how many samples to take (spatial resolution) and how many quantization levels to use (gray-level/color resolution).

## 4.2 Light, Color, and the Electromagnetic Spectrum

Light — or, more generally, electromagnetic (EM) radiation — is the essential ingredient that lets an image be created, captured, and perceived in the first place. Before talking about sensors and digitization, it is worth grounding the discussion in the physics of light and how humans perceive it.

### 4.2.1 Light and the Electromagnetic Spectrum

Light can be described either as an electromagnetic wave or as a stream of particles called **photons**. A photon is a tiny packet of vibrating electromagnetic energy characterized by its wavelength or, equivalently, its frequency. Wavelength ($\lambda$) and frequency ($f$) are related through the velocity at which the wave travels:

$$
\lambda = \frac{v}{f}
$$

where $v$ is usually approximated by the speed of light, $c \approx 2.998 \times 10^{8}\ \text{m/s}$.

The human visual system (HVS) is sensitive only to a narrow slice of this spectrum — wavelengths roughly between **400 nm and 700 nm** (violet to red). This visible band sits between radio waves (1 m or longer) at one extreme and gamma rays (0.01 nm or shorter) at the other. Even though a great deal of image processing research deals with images captured outside the visible range (infrared, X-ray, radio astronomy, and so on), this course focuses on images formed with visible light. Light is the imaging community's energy source of choice because it is safe, inexpensive, easy to steer and shape with conventional optics, easy to detect with cheap sensors, and straightforward to process with standard electronics.

### 4.2.2 Brightness Discrimination Experiment

Human sensitivity to changes in brightness is not unlimited. The classical brightness-discrimination experiment measures the smallest change in luminance $\Delta I$ that an observer can detect against a background luminance $I$. This ratio is nearly constant over a wide range of intensities and is known as the **Weber fraction** (or **Weber's Law**):

$$
\frac{\Delta I}{I} \approx 1\%\text{–}2\%
$$

where $I$ is luminance, measured in $\text{cd/m}^2$. In practice this means the HVS is a *relative*, not absolute, brightness detector: whether a change in intensity is noticeable depends on how bright the surrounding region already is, not just on the absolute size of the change. This fact underlies why 8-bit (256-level) quantization is usually "enough" for typical viewing conditions — it later motivates the choice of gray-level resolution discussed in Section 4.4.3.

### 4.2.3 Types of Images

Images can be grouped into three categories, depending on the interaction between the radiation source, the object's properties, and the position of the sensor relative to both:

| Category | How the image is formed | Typical information extracted | Examples |
|---|---|---|---|
| **Reflection images** | Radiation (ambient or artificial) bounces off the surface of an object | Surface properties: shape, color, texture | Everyday photographs, most of what we perceive visually |
| **Emission images** | The object itself is self-luminous | Presence/intensity of a self-emitting source | Stars, light bulbs, thermal/infrared imagery |
| **Absorption images** | Radiation passes *through* an object, attenuated along the way | Internal structure of the object | X-ray images |

Most consumer and computer-vision imagery is of the reflection type, which is why the rest of this lecture (sensors, optics, digitization) is framed around light reflected from a scene.

### 4.2.4 Light and Color Perception

Colors perceived by humans depend on the nature of the light reflected by an object, which is itself a function of (a) the spectral properties of the illuminating light source and (b) the object's own absorption and reflectance properties.

Historically, Sir Isaac Newton demonstrated that a beam of sunlight passing through a prism decomposes into a continuous spectrum, from red at one end to violet at the other. This gave fundamental insight into the *physical* nature of light — but, importantly, Newton also noted that "colors" are not a property of the light itself but rather an effect of light on the visual system. Color is, in that sense, a perceptual phenomenon layered on top of a physical one.

The physical power carried by a light source is expressed by its **spectral power distribution (SPD)** — how much radiant power the source emits at each wavelength. Different physical sources have very different SPDs (sunlight, tungsten bulbs, LEDs, mercury-arc lamps, helium–neon lasers), and this directly shapes how we perceive them: tungsten bulbs read as "warm"/yellowish, while a helium–neon laser produces an extremely pure, saturated red.

### 4.2.5 Color Encoding and Representation

Color can be encoded numerically using three components together with appropriate spectral weighting functions. **Colorimetry** is the branch of science concerned with the quantitative study of color perception — specifically, with representing color using *tristimulus values* (three numbers) from which the perceived color can be reconstructed. The simplest and most common scheme in cameras and displays is to encode each pixel's color using its red (R), green (G), and blue (B) components.

Independently of the RGB encoding used in hardware, human color perception is commonly described along three perceptual axes:

| Attribute | Definition |
|---|---|
| **Brightness** | The subjective perception of (achromatic) luminous intensity — how much light an area appears to emit |
| **Hue** | The attribute that makes an area appear similar to one of red, yellow, green, or blue (or a mixture of two); spectrally, associated with the SPD's dominant wavelength |
| **Saturation** | The colorfulness of an area relative to its own brightness — essentially how "white" or "pure" the light is. Spectrally, the more the SPD is concentrated at a single wavelength, the more saturated the color; adding white light (power spread across all wavelengths) desaturates a color |

These three perceptual attributes (brightness, hue, saturation) reappear later in the course as the basis for perceptually oriented color spaces such as HSV/HSI, in contrast to the hardware-oriented RGB encoding introduced above.

## 4.3 Image Acquisition

Image acquisition has two main building blocks: the **image sensor**, which converts incoming EM energy into an electrical signal, and the **optics** (lens system) that focuses the scene onto that sensor.

### 4.3.1 Image Sensors

The job of an image sensor is to convert EM energy into an electrical signal that can subsequently be processed, displayed, or interpreted as an image. Exactly how this conversion happens depends heavily on the underlying technology.

**CCD sensors.** Two of the most common, relatively inexpensive image-acquisition devices are the digital camera and the flatbed scanner. Cameras typically use 2D (area) CCD (charge-coupled device) sensors, while scanners typically use a 1D (line) CCD that physically moves across the document as each row is scanned. A CCD is built as an array of light-sensitive cells called **photosites**, fabricated in silicon; each photosite produces a voltage proportional to the intensity of the light striking it.

A saturated photosite can overflow and corrupt its neighbors — a defect known as **blooming**, which appears as bright vertical or horizontal streaks radiating from an overexposed region.

The **nominal resolution** of a CCD sensor is defined as the size of the scene element that maps to a single pixel on the image plane. For example, if a 20 cm × 20 cm sheet of paper is imaged into a 500 × 500 digital image, the nominal resolution is:

$$
\frac{20\ \text{cm}}{500\ \text{px}} = 0.04\ \text{cm per pixel}
$$

Related to this is the **field of view (FOV)** — a measure of how much of the scene the sensor can "see," e.g. 10 cm × 10 cm. Because the physical FOV changes with the distance to the scene, it is often more useful to describe it as an **angular field of view** (e.g. 55º × 40º), which is independent of scene distance. A CCD camera is sometimes connected to a **frame buffer** — a computer board with fast-access memory (on the order of 0.1 ms per image) dedicated to holding captured frames.

**Color from a single CCD.** In single-CCD cameras, color is obtained by covering the photosite array with a mosaic of red, green, and blue filters, most commonly arranged in a **Bayer pattern**. Under this scheme each pixel physically records only *one* of the three primary colors; a **demosaicing** algorithm is then used to interpolate the missing two color values at every pixel, producing a full RGB image. Demosaicing can run inside the camera itself (before the image is saved, e.g. as a JPEG) or afterward, on a separate computer working from the raw sensor output. More expensive camera designs avoid the interpolation step altogether by using **three separate CCDs** — one per primary color — combined with an optical beam splitter that sends the same image simultaneously to all three sensors.

**CMOS sensors.** CMOS is the main alternative to CCD technology. Its main advantages are lower manufacturing cost and lower power consumption; its main drawback is higher susceptibility to noise, which limits performance at low illumination levels. CMOS sensors first appeared in low-end devices such as webcams but have since found their way into far more sophisticated cameras — for instance the Panavision HDMAX 35 mm video camera — with the Foveon X3 sensor being a notable recent example of the technology.

| | CCD | CMOS |
|---|---|---|
| Cost / power | More expensive, higher power draw | Cheaper, lower power draw |
| Noise / low-light performance | Better | Worse (more noise-prone) |
| Typical use | High-end cameras, scanners | Webcams, and increasingly high-end cameras |

### 4.3.2 Camera Optics

A camera lens focuses part of the scene onto the image sensor. Two of its most important properties are magnifying power and light-gathering capacity. Magnifying power is captured by the **magnification factor** $m$, the ratio between image size and object size:

$$
m = \frac{v}{u}
$$

where $u$ is the distance from the object to the lens, and $v$ is the distance from the lens to the image plane.

Lenses are not perfect and may introduce **aberrations** — distortions that degrade image quality. Two commonly cited geometric distortions are **pincushion distortion** (straight lines bow inward toward the center) and **barrel distortion** (straight lines bow outward from the center).

**MATLAB note.** The MATLAB Image Acquisition Toolbox (IAT) extends MATLAB with functions for acquiring images directly from hardware — anything from professional frame grabbers to USB webcams — via *hardware device adaptors* that talk to each device through its native driver.

## 4.4 Image Digitization

The digitization stage is the bridge between the analog physical world, from which a scene is originally acquired, and the digital representation that computer algorithms expect for processing, storage, or transmission.

Digitization consists of two distinct operations:

- **Sampling** — in time or in space.
- **Quantization** — in amplitude.

These two steps can in principle happen in either order, but in practice sampling is almost always performed first, followed by quantization. Sampling selects a finite number of points within an interval; quantization then assigns each of those points an amplitude value drawn from a finite set of possible values. The end result of digitizing an image is a **pixel array** — a rectangular matrix of picture elements whose values encode intensity (for monochrome images) or color components (for color images).

For consumer cameras and camcorders it is common to describe the size of the pixel array as the product of its horizontal and vertical pixel counts, expressed in **megapixels (Mpx)**. Over time, digitization has moved progressively closer to the camera hardware itself, to the point where standalone "video capture cards" or "frame grabbers" have become comparatively rare — most of that work now happens on-chip, inside the camera.

### 4.4.1 Sampling

Sampling is the process of measuring the value of a 2D function at discrete intervals along the $x$ and $y$ dimensions. A system with equal horizontal and vertical sampling densities is said to use **square sampling**; several imaging and video systems instead use **nonsquare sampling**, where the horizontal and vertical sample pitch differ.

Two parameters govern how an image is sampled:

1. **Sampling rate** — the number of samples taken across the width and height of the image. Choosing an appropriate sampling rate is critical to image quality; too low a rate produces **aliasing**.
2. **Sampling pattern** — the physical arrangement of the samples. A rectangular grid, with pixels aligned into rows and columns, is overwhelmingly the most common arrangement, though other lattices are possible (e.g. hexagonal or log-polar sampling).

The theoretical backbone here is the **Nyquist criterion**: if a signal is sampled at a rate lower than twice its highest frequency component, there will not be enough samples to reconstruct the original signal correctly. This failure mode — **undersampling**, or **aliasing** — is exactly why choosing a sufficient sampling rate matters so much for image quality. Intuitively (illustrated for a 1D signal): sampling is equivalent to multiplying the analog signal by a train of narrow sampling impulses; with enough samples the original signal can be faithfully reconstructed, but the same number of samples that suffices for a lower-frequency signal is insufficient once the signal's frequency content increases — the reconstruction then aliases into a different (typically lower, spurious) frequency.

### 4.4.2 Quantization

Quantization is the process of replacing a continuously varying function with a discrete set of quantization levels. For images, the function being quantized is the intensity function $f(x, y)$, and the quantization levels are commonly called **gray levels**. It is standard to adopt $N$ quantization levels, where $N$ is an integral power of two:

$$
N = 2^{n}
$$

with $n$ the number of bits used to encode each pixel value. The most common case, $n = 8$ ($N = 2^{8} = 256$ levels), represents each pixel as an unsigned byte ranging from 0 (black) to 255 (white).

Image quantization can be thought of as a many-to-one mapping: groups of pixels whose original values fall within a given range are all mapped to a single representative gray level. **Uniform quantization** — the simplest and most common scheme — divides the input gray-level range into $N$ equal-width intervals. For example, reducing an 8-bit image (256 levels) down to 4 levels using uniform quantization means dividing the 0–255 range into 4 intervals of length 64 each (0–63 → level 0, 64–127 → level 1, and so on).

### 4.4.3 Spatial and Gray-Level Resolution

**Spatial resolution** expresses the density of pixels in an image: the higher the spatial resolution, the more pixels are used to represent the image within a given physical size. It is commonly quantified in dots per inch (**dpi**).

**Gray-level resolution** refers to the smallest change in intensity that the human visual system can discern. As noted in Section 4.2.2, the Weber fraction places a practical limit on how many distinguishable gray levels are actually useful to a human observer. Using 8 bits per pixel (256 levels) for monochrome images is a good compromise between subjective visual quality and practical implementation — each pixel value fits neatly into a single byte. Higher-end imaging applications may need more than 8 bits per channel, and several file formats support this (e.g., 12-bit RAW, 16-bit TIFF).

Reducing either type of resolution degrades image quality, but in visually distinct ways:

- **Reducing spatial resolution** (fewer samples) makes fine detail disappear and, at the extreme, produces a blocky/checkerboard appearance as individual large pixels become visible.
- **Reducing gray-level resolution** (fewer quantization levels) causes smooth intensity gradients to break up into visible bands — an effect known as **false contouring**, where the eye perceives sharp, artificial edges ("contours") along what was originally a smooth ramp of intensity, because too few levels are available to represent the gradual change.

**MATLAB note.** Requantizing an image in MATLAB can be done with the `grayslice` function, which maps an image's intensity values into a specified number of gray levels:

```matlab
I1 = imread('nature.jpg');
Iplus = im2uint8(rgb2gray(I1));

I2 = grayslice(Iplus, 128); figure, imshow(I2, gray(128));
I3 = grayslice(Iplus, 64);  figure, imshow(I3, gray(64));
I4 = grayslice(Iplus, 32);  figure, imshow(I4, gray(32));
I5 = grayslice(Iplus, 16);  figure, imshow(I5, gray(16));
I6 = grayslice(Iplus, 8);   figure, imshow(I6, gray(8));
I7 = grayslice(Iplus, 4);   figure, imshow(I7, gray(4));
I8 = grayslice(Iplus, 2);   figure, imshow(I8, gray(2));
```

Running this on a 480 × 640, 256-gray-level image and progressively requantizing it down to 128, 64, 32, 16, 8, 4, and finally 2 gray levels makes the false-contouring effect increasingly visible: the image still "reads" correctly at 128 or 64 levels, starts showing visible banding around 16–8 levels, and at 2 levels degenerates into a stark black-and-white silhouette of the original scene.

Separately, **(re-)sampling** an image in MATLAB (i.e., changing its spatial resolution) is handled by the `imresize` function.

## What have we learned?

- Images are formed through the interaction of a radiation source (typically visible light), the properties of the objects/surfaces in the scene, and the relative position and characteristics of the image sensor.
- Based on the type of that interaction, images fall into three categories: **reflection images**, **emission images**, and **absorption images**.
- Contemporary image sensors are built primarily on **CCD** or **CMOS** solid-state technology. A CCD is an array of light-sensitive "photosites," each producing a voltage proportional to incident light intensity; these cells are arranged in a 1D or 2D array that a computer can read sequentially.
- **Image digitization** is the process of sampling a continuous image in space and quantizing the resulting amplitude values so that they fall within a finite range.
- The main parameters that determine how "faithful" a digitized image is (and how large its file size is) are the **total number of pixels** (spatial resolution) and the **maximum number of gray levels/colors per pixel** (gray-level resolution).
- **Sampling** measures a function's value at discrete intervals; in MATLAB, `imresize` handles resampling.
- **Quantization** replaces a continuous amplitude range with a discrete set of levels; in MATLAB, `grayslice` handles requantization.

