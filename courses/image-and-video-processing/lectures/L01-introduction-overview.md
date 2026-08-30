---
title: "Introduction and Overview"
subject: "image-and-video-processing"
type: lecture
lecture_no: 1
status: done
source: slide
tags: [introduction, image-processing, applications, human-visual-system, machine-vision-system]
date: 2024-08-23
---

# Lecture 1 – Introduction and Overview

> Opening lecture of the course: what image processing is, why it matters, the vocabulary needed to talk about images and digital images, a tour of the operations the course will cover, the hardware/software anatomy of an image processing system, the structure of a machine vision system (using automatic license-plate recognition as a running example), and why the human visual system remains so hard to emulate with cameras and computers.

---

## 1.1 Motivation

Humans have always relied on vision — from instinctive survival reflexes to the detailed, deliberate analysis of a painting. Our ability to guide action and engage cognition from visual input is one of the most remarkable traits of our species, and much of *how* we do it, and why we seem to do it so effortlessly, is still not fully understood. That gap between how easily people extract meaning from a scene and how hard it is to replicate that ability in a machine is one of the central tensions that has driven the development of image processing and computer vision over the past decades: the need to extract information from images and interpret their content.

Image processing applications now touch a very wide range of human activity. The slide deck groups them into a handful of broad domains:

| Domain | Representative examples |
|---|---|
| **Medical** | Diagnostic imaging modalities such as digital radiography, PET (positron emission tomography), CAT (computerized axial tomography), MRI (magnetic resonance imaging), and fMRI (functional MRI) |
| **Industrial** | Manufacturing safety systems, automated quality control/inspection, guidance of automated guided vehicles (AGVs) |
| **Military** | Detection of soldiers or vehicles, missile guidance, object recognition and reconnaissance from unmanned aerial vehicles (UAVs) |
| **Law enforcement & security** | Video surveillance, biometric recognition (fingerprint, face, iris, hand) |
| **Consumer electronics** | Digital cameras/camcorders with built-in processing pipelines; photo/video editing, organizing, and publishing software |
| **Internet / World Wide Web** | The huge volume of visual content online; collaborative image/video uploading, sharing, and tagging; content-based image/video retrieval remains an open research problem |

Two contemporary examples make the stakes of this field concrete rather than abstract.

**Face anti-spoofing.** Any system that authenticates a person from a face image has to distinguish a live face from a *presentation attack* — someone trying to fool the sensor with a printed photo, a video replay, a mask, or a 3D-printed face. The ISO/IEC 30107 standard formalizes this by classifying spoofing artifacts into "species" of increasing sophistication and mapping them to the FIDO alliance's assurance levels:

| Attack instrument | ISO/IEC 30107 species level | FIDO level |
|---|---|---|
| Face image printed on inkjet/laser printer | 1 | A |
| Face image printed at a photo lab | 1 | A |
| Displayed photo on an electronic/mobile device | 1 | A |
| Displayed video on an electronic/mobile device | 1 | B |
| Paper mask | 2 | B |
| Mask of specialized material (ceramic, silicone, theatrical) | 3 | C |
| 3D-printed face | 3 | C |

The pattern is intuitive: a flat printed photo is the crudest (and easiest to detect) attack, while a 3D mask made of skin-like material is far harder to distinguish from a genuine face — and correspondingly demands a higher assurance level from the system. Anti-spoofing is a direct application of image processing techniques (texture analysis, depth cues, liveness signals such as blinking or micro-motion) to a security problem.

**Deepfakes.** A deepfake is AI-generated media that depicts a person saying or doing something they never said or did, or that otherwise diverges from reality, with the specific purpose of fooling a human viewer or an automated system. Deepfakes sit at the opposite end of the spectrum from anti-spoofing: instead of *detecting* a manipulation, the generative side of image/video processing is what *creates* the manipulation in the first place. Understanding the image processing pipeline behind deepfakes — how faces are synthesized, blended, and temporally coherent frames are produced — is exactly what is needed to explain how they work, what fraudulent uses they enable, and how to defend against them.

## 1.2 Basic Concepts and Terminology

### 1.2.1 What is an Image?

An **image** is a visual representation of an object, a person, or a scene, produced by an optical device such as a mirror, a lens, or a camera. Crucially, this representation is two-dimensional (2D), even though it corresponds to just one of the infinitely many possible projections of a real, three-dimensional (3D) object or scene. Every photograph is a lossy 2D shadow of a 3D world, taken from one particular viewpoint.

### 1.2.2 What is a Digital Image?

A **digital image** is a representation of a 2D image using a finite number of points, commonly called picture elements, pels, or — most often — **pixels**. Each pixel carries one or more numerical values:

- For a **monochrome (grayscale)** image, a single value is enough, usually expressing intensity in the range $[0, 255]$.
- For a **color** image, three values are typically required — commonly the amounts of red (R), green (G), and blue (B).

It is worth being precise about a distinction that is often blurred casually: *monochrome* photography varies a **single** hue (e.g. all green tones, or all blue tones) — the choice of that one color is a stylistic decision by the photographer, but only one hue is ever used. *Grayscale* photography is the special case of monochrome built specifically from black-and-white tones, i.e. varying shades of neutral gray with no hue at all. Every grayscale image is monochrome, but not every monochrome image is grayscale.

### 1.2.3 What is Digital Image Processing?

**Digital image processing** is the science of modifying digital images by means of a digital computer. The changes applied to an image are performed automatically, driven by carefully designed algorithms rather than by hand. This stands in clear contrast to *image manipulation* — for example, touching up a photograph with an airbrush tool in photo-editing software — where the image is modified manually and the outcome depends on the skill and dexterity of the human operator, not on an algorithm.

### 1.2.4 What is the Scope of Image Processing?

The output of an image processing task can take one of three forms, and this distinction is used to stratify the field into levels of abstraction:

| Level | What it does | Input → Output |
|---|---|---|
| **Low level** | Primitive operations: noise reduction, contrast enhancement, etc. | image → image |
| **Mid level** | Extraction of attributes: edges, contours, regions, etc. | image → attributes/features |
| **High level** | Analysis and interpretation of scene content | image → nonpictorial description |

Two more distinctions are worth internalizing early:

- **Image synthesis** is the process of *rendering* a 2D or 3D image from numerical data (going from data to pixels), while **image analysis** is the reverse process of *extracting* textual/numerical data from an array of pixels (going from pixels to data). Most of this course lives on the analysis side, though synthesis (e.g. rendering, generative models) is the mirror-image problem.
- Image processing is inherently **multidisciplinary**. It draws on mathematics, physics, and computer science, and on computer, optical, and electrical engineering. It also overlaps substantially with pattern recognition, machine learning, artificial intelligence, and human vision research — none of these fields can be cleanly separated from image processing in practice.

## 1.3 Examples of Typical Image Processing Operations

To preview the rest of the course, the lecture walks through eight representative operations that recur throughout image processing. They are summarized below; each will be treated in far more depth in later lectures.

| # | Operation | What it does |
|---|---|---|
| 1 | **Sharpening** | Enhances edges and fine detail in an image for human viewing. |
| 2 | **Noise removal** | Filters reduce the amount of noise present before further processing; the right technique depends on the type of noise (e.g. Gaussian, salt-and-pepper). |
| 3 | **Deblurring** | Recovers a sharper image from one blurred by, for example, improper lens focus or shutter speed too slow for a fast-moving subject. |
| 4 | **Edge extraction** | A fundamental preprocessing step that separates objects from one another before their contents are identified. |
| 5 | **Binarization** | Reduces the number of gray levels in a monochrome image, typically all the way down to two (black and white), to simplify and speed up interpretation. |
| 6 | **Blurring** | Deliberately smooths an image to de-emphasize texture and fine detail — useful, for instance, when objects are better recognized by their overall shape; can be done in the spatial or frequency domain. |
| 7 | **Contrast enhancement** | Improves an image for human viewing and makes downstream tasks (e.g. edge extraction) easier, via transformation functions and histogram processing. |
| 8 | **Object segmentation and labeling** | Segments and labels the objects present in a scene — a prerequisite for most recognition/classification systems, since features can only be extracted and compared once objects have been isolated. |

Notice that these eight operations already span the low/mid/high-level hierarchy from §1.2.4: 1, 2, 3, 6, and 7 are low-level (image in, image out); 4, 5, and 8 begin to produce mid-level attributes (edges, binary masks, labeled regions) that later stages will reason about.

## 1.4 Components of a Digital Image Processing System

A digital image processing system is built around a **computer**, in which most of the actual processing takes place, but it also needs hardware and software for image **acquisition**, **storage**, and **display**. A useful mental model: even an ordinary contemporary digital camera fits this same diagram — its CCD/CMOS sensor is the *acquisition* block, its flash memory is *storage*, its small LCD screen is *display*, and its onboard digital signal processor (DSP) chip is the *computer*, where operations such as converting a RAW capture to JPEG take place.

### 1.4.1 Hardware

| Component | Role | Examples |
|---|---|---|
| **Acquisition devices** | Capture and digitize images or video sequences | Scanners, cameras, camcorders |
| **Processing equipment** | The computer itself — runs the software that processes and analyzes the acquired images | Any general-purpose computer, in whatever size/shape/configuration |
| **Display and hardcopy devices** | Present image content for human viewing | Color monitors, printers |
| **Storage devices** | Long-term storage of image data | Magnetic or optical disks |

### 1.4.2 Software

The software side of a digital image processing system usually consists of specialized modules, and building it is inherently **iterative**: an algorithm is designed, tested against real images, refined, and tested again. Because of this, practitioners tend to favor programming languages and development environments that support modular, agile, iterative work. **MATLAB** in particular has become extremely popular among engineers, scientists, and researchers in both industry and academia — largely because of its ecosystem of toolboxes with ready-made functions spanning everything from data acquisition to image processing, which is why it is the software of choice used throughout this course (together with its Image Processing Toolbox).

## 1.5 Machine Vision Systems

A **machine vision system (MVS)** is best understood through a concrete example: an automatic license-plate recognition system at a highway toll booth. The problem domain is the automated, unsupervised extraction of the alphanumeric content of a vehicle's license plate as it passes through the booth — without any human intervention. In practice such a system also has to satisfy demanding operational requirements: 24/7 operation (including under artificial lighting), all-weather robustness, a minimum acceptable success rate, and a valid range of vehicle speeds.

Image processing, in this setting, is never a one-step process. Real solutions are built as a **sequential pipeline**, where each stage's output feeds the next stage's input:

| Stage | Role |
|---|---|
| **Acquisition** | Captures one or more images of the vehicle (front or rear view, including the plate) — e.g. via a CCD camera with controlled lighting — and outputs a digital image suitable for further processing. |
| **Preprocessing** | Improves the quality of the acquired image: contrast improvement, brightness correction, noise removal. |
| **Segmentation** | Partitions the image into relevant foreground objects vs. background, producing labeled regions/"sub-images." Here segmentation typically happens at *two* levels: first extracting the plate from the rest of the image, then segmenting individual characters within the plate. This is generally the most challenging stage in an MVS. |
| **Feature extraction** (representation & description) | Encodes image content concisely — measures of color/intensity, texture, and shape of the segmented objects — usually packed into a numerical **feature vector**. |
| **Pattern classification** (recognition & interpretation) | Takes the $K$-dimensional feature vector and maps it to a class/label, using classical pattern recognition techniques: minimum-distance classifiers, probabilistic classifiers, neural networks, and more. |
| **Knowledge base** | Not a sequential stage but a hub connected to every other module. It stores domain knowledge that disambiguates decisions elsewhere in the pipeline — e.g. knowing the first character of a plate must be a digit helps distinguish a "0" from an "O" during classification. |

The success of the whole system hinges on how much of that domain knowledge is captured and made available to every stage, not just on any single algorithm being clever in isolation.

This naturally raises the comparison the lecture closes on: how does a machine vision system stack up against the **human visual system (HVS)**? Three gaps stand out as the biggest challenges in trying to emulate the HVS with cameras and computers:

1. **Scale of prior knowledge.** The HVS draws on a vast database of images and associated concepts, built up and continually refined over an entire lifetime of experience — something no MVS can be trained with equivalently.
2. **Decision speed.** The HVS makes decisions from visual input at remarkably high speed. Some image processing/machine vision tasks are approaching or matching this in narrow settings, but general-purpose speed parity remains elusive.
3. **Robustness to conditions.** The HVS operates gracefully across an enormous range of conditions — from poor lighting to awkward, less-than-ideal viewpoints for a 3D object — a level of adaptability that machine vision systems still struggle to match.

## What have we learned?

- **Digital image processing** is the science of modifying digital images using a digital computer, closely related to (and overlapping with) computer vision and pattern recognition.
- Image processing algorithms take an image as input and produce one of three kinds of output: a modified/processed image, an encoded version of the image's main attributes, or a nonpictorial description of its contents.
- The field's applications span nearly every corner of modern life — from medical imaging to manufacturing quality control, from consumer electronics to law enforcement and security.
- An **image** is a 2D visual representation of an object/person/scene, corresponding to one of infinitely many possible projections of a 3D world. A **digital image** represents that 2D image with a finite number of pixels, each encoding gray level or color at that point.
- **Image manipulation** (e.g. airbrushing) is manual; **image processing** is automated and algorithmic — that distinction matters throughout the course.
- Representative image processing operations include sharpening, noise removal, edge extraction, contrast enhancement, and object segmentation and labeling.
- A digital image processing system is typically built around a general-purpose computer plus hardware for acquisition, storage, and display; its software consists of specialized, iteratively developed modules — **MATLAB** (with its Image Processing Toolbox) is the software used in this course.
- A **machine vision system** combines hardware and software to analyze visual scenes with intelligent algorithms; its core pipeline is acquisition → preprocessing → segmentation → feature extraction → classification, all supported by a shared knowledge base.
- It remains extremely difficult to emulate the human visual system's processing speed, breadth of prior knowledge, and robustness across conditions using machine vision systems.

