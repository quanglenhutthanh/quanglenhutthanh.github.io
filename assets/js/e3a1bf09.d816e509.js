"use strict";(self.webpackChunksrc=self.webpackChunksrc||[]).push([[4645],{4352:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var i=t(5893),o=t(1151);const r={sidebar_position:30,sidebar_label:"Project: Meme Generator"},s="Project: Meme Generator",a={id:"Udacity Courses/Intermediate Python/meme-generator",title:"Project: Meme Generator",description:"The project for this course is a meme generator, an application you'll write in Python that will pair random images with random quotes.",source:"@site/docs/Udacity Courses/Intermediate Python/meme-generator.md",sourceDirName:"Udacity Courses/Intermediate Python",slug:"/Udacity Courses/Intermediate Python/meme-generator",permalink:"/docs/Udacity Courses/Intermediate Python/meme-generator",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Udacity Courses/Intermediate Python/meme-generator.md",tags:[],version:"current",sidebarPosition:30,frontMatter:{sidebar_position:30,sidebar_label:"Project: Meme Generator"},sidebar:"tutorialSidebar",previous:{title:"Project: Exploring Near-Earth Objects",permalink:"/docs/Udacity Courses/Intermediate Python/near-earth-objects"},next:{title:"Data Analyst (nd002)",permalink:"/docs/category/data-analyst-nd002"}},l={},d=[{value:"Overview",id:"overview",level:2},{value:"Description",id:"description",level:2},{value:"Quote Engine",id:"quote-engine",level:3},{value:"Meme Engine",id:"meme-engine",level:3},{value:"Getting Started",id:"getting-started",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Install",id:"install",level:3}];function c(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"project-meme-generator",children:"Project: Meme Generator"}),"\n",(0,i.jsx)(n.p,{children:"The project for this course is a meme generator, an application you'll write in Python that will pair random images with random quotes."}),"\n",(0,i.jsxs)(n.p,{children:["Source Code: ",(0,i.jsx)(n.a,{href:"https://github.com/quanglenhutthanh/Meme-Generator",children:"https://github.com/quanglenhutthanh/Meme-Generator"})]}),"\n",(0,i.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,i.jsx)(n.p,{children:"The goal of this project is to build a \"meme generator\" \u2013 a multimedia application to dynamically generate memes, including an image with an overlaid quote. It's not that simple though! Your content team spent countless hours writing quotes in a variety of filetypes. You could manually copy and paste these quotes into one standard format \u2013 but you're going to over-engineer a solution to load quotes from each file to show off your fancy new Python skills."}),"\n",(0,i.jsx)(n.p,{children:"The application you build must:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Interact with a variety of complex filetypes. This emulates the kind of data you'll encounter in a data engineering role."}),"\n",(0,i.jsx)(n.li,{children:"Load quotes from a variety of filetypes (PDF, Word Documents, CSVs, Text files)."}),"\n",(0,i.jsx)(n.li,{children:"Load, manipulate, and save images."}),"\n",(0,i.jsx)(n.li,{children:"Accept dynamic user input through a command-line tool and a web service. This emulates the kind of work you'll encounter as a full stack developer."}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"This project will give you a hands-on opportunity to practice what you've learned in this course, such as:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Object-oriented thinking in Python, including abstract classes, class methods, and static methods."}),"\n",(0,i.jsx)(n.li,{children:"DRY (don't repeat yourself) principles of class and method design."}),"\n",(0,i.jsx)(n.li,{children:"Working with modules and packages in Python."}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"description",children:"Description"}),"\n",(0,i.jsx)(n.h3,{id:"quote-engine",children:"Quote Engine"}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"Quote Engine"})," module is responsible for ingesting many types of files that contain quotes. For our purposes, a quote contains a body and an author:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'\n"This is a quote body" \u2013 Author\n\n'})}),"\n",(0,i.jsx)(n.p,{children:"This module will be composed of many classes and will demonstrate your understanding of complex inheritance, abstract classes, classmethods, strategy objects and other fundamental programming principles."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Ingestors"})}),"\n",(0,i.jsxs)(n.p,{children:["An abstract base class, ",(0,i.jsx)(n.code,{children:"IngestorInterface"})," should define two methods with the following class method signatures:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"\ndef can\\_ingest(cls, path: str) -\\> boolean\n\ndef parse(cls, path: str) -\\> List[QuoteModel]\n\n"})}),"\n",(0,i.jsx)(n.p,{children:"Separate strategy objects should realize IngestorInterface for each file type (csv, docx, pdf, txt)."}),"\n",(0,i.jsxs)(n.p,{children:["A final ",(0,i.jsx)(n.code,{children:"Ingestor"})," class should realize the ",(0,i.jsx)(n.code,{children:"IngestorInterface"})," abstract base class and encapsulate your helper classes. It should implement logic to select the appropriate helper for a given file based on filetype."]}),"\n",(0,i.jsx)(n.h3,{id:"meme-engine",children:"Meme Engine"}),"\n",(0,i.jsx)(n.p,{children:"The Meme Engine Module is responsible for manipulating and drawing text onto images. It will reinforce your understanding of object-oriented thinking while demonstrating your skill using a more advanced third party library for image manipulation."}),"\n",(0,i.jsx)(n.h2,{id:"getting-started",children:"Getting Started"}),"\n",(0,i.jsx)(n.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,i.jsxs)(n.p,{children:["Install the ",(0,i.jsx)(n.code,{children:"python-docx"})," library."]}),"\n",(0,i.jsx)(n.p,{children:"Install xpdfreader."}),"\n",(0,i.jsxs)(n.p,{children:["Install the ",(0,i.jsx)(n.code,{children:"Pillow"})," library to perform basic image operations."]}),"\n",(0,i.jsx)(n.h3,{id:"install",children:"Install"}),"\n",(0,i.jsx)(n.p,{children:"Install all dependencies given in the requirements.txt file using pip:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"\npip install -r requirements.txt\n\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Download and install pdftotext: ",(0,i.jsx)(n.a,{href:"https://www.xpdfreader.com/download.html",children:"https://www.xpdfreader.com/download.html"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Unzip the files in a location of your choice."}),"\n",(0,i.jsx)(n.li,{children:"Get the full file path to the folder named bin32 (if you have a 32-bit machine) or bin64 (if you have a 64-bit machine)."}),"\n",(0,i.jsxs)(n.li,{children:["Add this path to the Path environment variable. This will allow you to use the xpdf command from the command line. If you've never done this before, check out:",(0,i.jsx)(n.a,{href:"https://stackoverflow.com/questions/44272416/how-to-add-a-folder-to-path-environment-variable-in-windows-10-with-screenshot",children:"https://stackoverflow.com/questions/44272416/how-to-add-a-folder-to-path-environment-variable-in-windows-10-with-screenshot"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"The application can be started by running the following command:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"\npython app.py\n\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"img alt",src:t(5762).Z+"",width:"1042",height:"669"})})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},5762:(e,n,t)=>{t.d(n,{Z:()=>i});const i=t.p+"assets/images/meme-generator-ee5e64822363af2c8e2ad379effd1af1.png"},1151:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>s});var i=t(7294);const o={},r=i.createContext(o);function s(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);