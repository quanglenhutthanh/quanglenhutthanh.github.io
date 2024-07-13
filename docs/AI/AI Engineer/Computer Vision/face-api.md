--- 
sidebar_position: 30
sidebar_label: "Azure Face Service"
---
# Azure AI Face

[The Azure AI Face service](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-identity) provides AI algorithms that detect, recognize, and analyze human faces in images. Facial recognition software is important in many different scenarios, such as identification, touchless access control, and face blurring for privacy.

:::danger
Face service access is limited based on eligibility and usage criteria in order to support our Responsible AI principles. Face service is only available to Microsoft managed customers and partners. Use the Face Recognition intake form to apply for access. For more information, see the [Face limited access page](https://learn.microsoft.com/en-us/legal/cognitive-services/computer-vision/limited-access-identity?context=%2Fazure%2Fcognitive-services%2Fcomputer-vision%2Fcontext%2Fcontext).
:::

## Installation

Install the client libraries

```python
pip install --upgrade azure-cognitiveservices-vision-face
```

## Usage

```python

import io
import requests
from urllib.parse import urlparse
from io import BytesIO
from PIL import Image, ImageDraw
import matplotlib.pyplot as plt
from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials

# Utilities functions
def show_image_object_in_cell(image_object):
    plt.figure(figsize=(20,10))
    plt.imshow(image_object)
    plt.show()

def show_image_in_cell(face_url):
    response = requests.get(face_url)
    img = Image.open(BytesIO(response.content))
    plt.figure(figsize=(20,10))
    plt.imshow(img)
    plt.show()
def list_all_faces_from_detected_face_object(detected_faces_object):
    print('We found total {} face(s) in selected face detected object.'.format(str(len(detected_faces_object))))
    for face in detected_faces_object: 
        print (face.face_id)
        
def getRectangle(faceDictionary):
    rect = faceDictionary.face_rectangle
    left = rect.left
    top = rect.top
    right = left + rect.width
    bottom = top + rect.height
    
    return ((left, top), (right, bottom))
def drawFaceRectangles(input_imp, detected_face_object) :
    # Download the image from the url
    # response = requests.get(source_file)
    img = Image.open(BytesIO(input_imp))
    # Draw a red box around every detected faces
    draw = ImageDraw.Draw(img)
    for face in detected_face_object:
        draw.rectangle(getRectangle(face), outline='red', width= 10)
    return img


# Usage
FACE_KEY = "FACE_KEY"
FACE_ENDPOINT = "FACE_ENDPOINT"
face_client = FaceClient(FACE_ENDPOINT, CognitiveServicesCredentials(FACE_KEY))
print(face_client.api_version)

# OPEN LOCAL FILE AND DETECT FACE
with open('herold.jpg', 'rb') as image_stream:
    image = Image.open(image_stream)
    stream = io.BytesIO()
    image.save(stream, format='JPEG')
    image_data = stream.getvalue()
    #print(image_data)
detected_faces = face_client.face.detect_with_stream(io.BytesIO(image_data))

# Display detected faces information
for face in detected_faces:
    print(f"Face ID: {face.face_id}")
    print(f"Bounding Box: {face.face_rectangle.left}, {face.face_rectangle.top}, "
          f"{face.face_rectangle.width}, {face.face_rectangle.height}")
    print("----------------------")


list_all_faces_from_detected_face_object(detected_faces)
img = drawFaceRectangles(image_data,detected_faces)
show_image_object_in_cell(img)
```

