"use strict";(self.webpackChunksrc=self.webpackChunksrc||[]).push([[3334],{7134:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>c,default:()=>f,frontMatter:()=>r,metadata:()=>o,toc:()=>l});var i=n(5893),a=n(1151);const r={sidebar_position:30,sidebar_label:"Azure Face Service"},c="Azure AI Face",o={id:"AI Engineer/Computer Vision/face-api",title:"Azure AI Face",description:"The Azure AI Face service provides AI algorithms that detect, recognize, and analyze human faces in images. Facial recognition software is important in many different scenarios, such as identification, touchless access control, and face blurring for privacy.",source:"@site/docs/AI Engineer/Computer Vision/face-api.md",sourceDirName:"AI Engineer/Computer Vision",slug:"/AI Engineer/Computer Vision/face-api",permalink:"/AI Engineer/Computer Vision/face-api",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:30,frontMatter:{sidebar_position:30,sidebar_label:"Azure Face Service"},sidebar:"tutorialSidebar",previous:{title:"Prebuilt Form Recognizer Models",permalink:"/AI Engineer/Computer Vision/custom-form-recognizer-model"},next:{title:"Natural Language Processing (NLP)",permalink:"/category/natural-language-processing-nlp"}},s={},l=[{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"azure-ai-face",children:"Azure AI Face"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-identity",children:"The Azure AI Face service"})," provides AI algorithms that detect, recognize, and analyze human faces in images. Facial recognition software is important in many different scenarios, such as identification, touchless access control, and face blurring for privacy."]}),"\n",(0,i.jsx)(t.admonition,{type:"danger",children:(0,i.jsxs)(t.p,{children:["Face service access is limited based on eligibility and usage criteria in order to support our Responsible AI principles. Face service is only available to Microsoft managed customers and partners. Use the Face Recognition intake form to apply for access. For more information, see the ",(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/legal/cognitive-services/computer-vision/limited-access-identity?context=%2Fazure%2Fcognitive-services%2Fcomputer-vision%2Fcontext%2Fcontext",children:"Face limited access page"}),"."]})}),"\n",(0,i.jsx)(t.h2,{id:"installation",children:"Installation"}),"\n",(0,i.jsx)(t.p,{children:"Install the client libraries"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-python",children:"pip install --upgrade azure-cognitiveservices-vision-face\n"})}),"\n",(0,i.jsx)(t.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-python",children:'\nimport io\nimport requests\nfrom urllib.parse import urlparse\nfrom io import BytesIO\nfrom PIL import Image, ImageDraw\nimport matplotlib.pyplot as plt\nfrom azure.cognitiveservices.vision.face import FaceClient\nfrom msrest.authentication import CognitiveServicesCredentials\n\n# Utilities functions\ndef show_image_object_in_cell(image_object):\n    plt.figure(figsize=(20,10))\n    plt.imshow(image_object)\n    plt.show()\n\ndef show_image_in_cell(face_url):\n    response = requests.get(face_url)\n    img = Image.open(BytesIO(response.content))\n    plt.figure(figsize=(20,10))\n    plt.imshow(img)\n    plt.show()\ndef list_all_faces_from_detected_face_object(detected_faces_object):\n    print(\'We found total {} face(s) in selected face detected object.\'.format(str(len(detected_faces_object))))\n    for face in detected_faces_object: \n        print (face.face_id)\n        \ndef getRectangle(faceDictionary):\n    rect = faceDictionary.face_rectangle\n    left = rect.left\n    top = rect.top\n    right = left + rect.width\n    bottom = top + rect.height\n    \n    return ((left, top), (right, bottom))\ndef drawFaceRectangles(input_imp, detected_face_object) :\n    # Download the image from the url\n    # response = requests.get(source_file)\n    img = Image.open(BytesIO(input_imp))\n    # Draw a red box around every detected faces\n    draw = ImageDraw.Draw(img)\n    for face in detected_face_object:\n        draw.rectangle(getRectangle(face), outline=\'red\', width= 10)\n    return img\n\n\n# Usage\nFACE_KEY = "FACE_KEY"\nFACE_ENDPOINT = "FACE_ENDPOINT"\nface_client = FaceClient(FACE_ENDPOINT, CognitiveServicesCredentials(FACE_KEY))\nprint(face_client.api_version)\n\n# OPEN LOCAL FILE AND DETECT FACE\nwith open(\'herold.jpg\', \'rb\') as image_stream:\n    image = Image.open(image_stream)\n    stream = io.BytesIO()\n    image.save(stream, format=\'JPEG\')\n    image_data = stream.getvalue()\n    #print(image_data)\ndetected_faces = face_client.face.detect_with_stream(io.BytesIO(image_data))\n\n# Display detected faces information\nfor face in detected_faces:\n    print(f"Face ID: {face.face_id}")\n    print(f"Bounding Box: {face.face_rectangle.left}, {face.face_rectangle.top}, "\n          f"{face.face_rectangle.width}, {face.face_rectangle.height}")\n    print("----------------------")\n\n\nlist_all_faces_from_detected_face_object(detected_faces)\nimg = drawFaceRectangles(image_data,detected_faces)\nshow_image_object_in_cell(img)\n'})})]})}function f(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>o,a:()=>c});var i=n(7294);const a={},r=i.createContext(a);function c(e){const t=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:c(e.components),i.createElement(r.Provider,{value:t},e.children)}}}]);