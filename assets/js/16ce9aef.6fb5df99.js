"use strict";(self.webpackChunksrc=self.webpackChunksrc||[]).push([[2269],{2428:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>d});var a=i(5893),t=i(1151);const r={sidebar_position:30,sidebar_label:"File I/O"},s=void 0,o={id:"Python/file-i-o",title:"file-i-o",description:"What we're doing",source:"@site/docs/Python/file-i-o.md",sourceDirName:"Python",slug:"/Python/file-i-o",permalink:"/Python/file-i-o",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Python/file-i-o.md",tags:[],version:"current",sidebarPosition:30,frontMatter:{sidebar_position:30,sidebar_label:"File I/O"},sidebar:"tutorialSidebar",previous:{title:"Pandas",permalink:"/Python/pandas"},next:{title:"Udacity Learning Path",permalink:"/category/udacity-learning-path"}},l={},d=[{value:"What we&#39;re doing",id:"what-were-doing",level:2},{value:"File Systmes and Paths",id:"file-systmes-and-paths",level:2},{value:"open() function",id:"open-function",level:2},{value:"Plain Text",id:"plain-text",level:2},{value:"CSV",id:"csv",level:2},{value:"JSON",id:"json",level:2},{value:"Using Pandas",id:"using-pandas",level:2}];function c(e){const n={code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h2,{id:"what-were-doing",children:"What we're doing"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"Principles of File I/O: File systems; the pathlib module; and Path-like objects"}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"Plain Text: What are file-like objects; how to responsibly open (and close) files; and how to read data from and write data to external files"}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"JSON: What is JSON; loading JSON data from a file into Python; dumping data from Python into a file"}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"CSV: What is CSV; reading CSV data from a file into Python; writing data from Python to a file."}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"image",src:i(4090).Z+"",width:"1471",height:"448"})}),"\n",(0,a.jsx)(n.h2,{id:"file-systmes-and-paths",children:"File Systmes and Paths"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:"from pathlib import Path\nhere = Path('.')\nhere = here.resolve()\nparent = here.parent\nprint(parent)\nprint(here)\n"})}),"\n",(0,a.jsx)(n.h2,{id:"open-function",children:"open() function"}),"\n",(0,a.jsx)(n.p,{children:"In Python, the open() function serves as the primary method for file handling. It allows you to open files in various modes (such as read, write, append, etc.) and perform operations on them. Here's a breakdown of the open() function and its common usage:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.code,{children:"open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, ...)"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Parameters:"})}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"file"}),": The path or name of the file to be opened."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"mode"}),": Specifies the mode in which the file is opened (",(0,a.jsx)(n.code,{children:"'r'"})," for reading, ",(0,a.jsx)(n.code,{children:"'w'"})," for writing, ",(0,a.jsx)(n.code,{children:"'a'"})," for appending, ",(0,a.jsx)(n.code,{children:"'rb'"})," for reading in binary mode, etc.)."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"buffering"}),": Optional parameter for setting the buffering policy."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"encoding"}),": Optional parameter specifying the file's encoding."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"errors"}),": Optional parameter specifying how encoding/decoding errors are handled."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"newline"}),": Optional parameter for handling newline characters."]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Common Modes:"})}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"'r'"}),": Opens the file for reading (default mode)."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"'w'"}),": Opens the file for writing, truncating the file first."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"'a'"}),": Opens the file for appending."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"'rb'"}),", ",(0,a.jsx)(n.code,{children:"'wb'"}),", ",(0,a.jsx)(n.code,{children:"'ab'"}),": Modes for reading, writing, or appending in binary format."]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"plain-text",children:"Plain Text"}),"\n",(0,a.jsxs)(n.p,{children:["Python offers simple yet powerful functions for working with plain text files. The ",(0,a.jsx)(n.code,{children:"open()"})," function is the gateway to file manipulation."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:'# Writing to a text file\nwith open("sample.txt",\'w\') as file:\n    file.write("Hello World")\n\n# Reading from a text file\nwith open("sample.txt",\'r\') as file:\n    content = file.read()\n    print(content)\n'})}),"\n",(0,a.jsx)(n.h2,{id:"csv",children:"CSV"}),"\n",(0,a.jsx)(n.p,{children:"CSV stands for Comma-Seperate Values. It can be thought of as an Excel spreadsheet, with row representing objects and columns representing attributes."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"image",src:i(9822).Z+"",width:"2054",height:"890"})}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:"import csv\n\n# Writting to CSV file\ndata = [\n    ['Name', 'Age', 'Email'],\n    ['Alice', 25, 'alice@example.com'],\n    ['Bob', 30, 'bob@example.com']\n]\n\nwith open(\"sample.csv\",'w') as file:\n    csv_writer = csv.writer(file)\n    csv_writer.writerows(data)\n\n# Reading from CSV file\nwith open(\"sample.csv\",'r') as file:\n    reader = csv.reader(file)\n    next(reader)\n    for row in reader:\n        print(row)\n    \n"})}),"\n",(0,a.jsx)(n.h2,{id:"json",children:"JSON"}),"\n",(0,a.jsx)(n.p,{children:"JSON (JavaScript Object Notation) is widely used for data interchange"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:"import json\n\ndata = {\n    'name': 'John Doe',\n    'age': 35,\n    'email': 'john@example.com'\n}\n\n# Writing to a JSON file\nwith open(\"sample.json\",'w') as file:\n    json.dump(data, file)\n\n# Reading from a JSON file\nwith open(\"sample.json\",'r') as file:\n    data = json.load(file)\n    print(data)\n    \n"})}),"\n",(0,a.jsx)(n.h2,{id:"using-pandas",children:"Using Pandas"}),"\n",(0,a.jsx)(n.p,{children:"Pandas, a powerful library in Python, simplifies data manipulation tasks, especially when working with tabular data."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-python",children:"import pandas as pd\n\n# Reading from CSV using Pandas\ndata_frame = pd.read_csv('data.csv')\nprint(data_frame)\n\n# Writing to CSV using Pandas\ndata_frame.to_csv('new_pandas_data.csv', index=False)\n\n# Reading from JSON using Pandas\ndata_frame = pd.read_json('data.json')\nprint(data_frame)\n\n# Writing to JSON using Pandas\ndata_frame.to_json('new_pandas_data.json', orient='records')\n"})})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},9822:(e,n,i)=>{i.d(n,{Z:()=>a});const a=i.p+"assets/images/csv-57e67b8e35cd71449d973a0bac053d6c.png"},4090:(e,n,i)=>{i.d(n,{Z:()=>a});const a=i.p+"assets/images/overview-2a6915a7b365a5b480d99f8bd640ea80.jpg"},1151:(e,n,i)=>{i.d(n,{Z:()=>o,a:()=>s});var a=i(7294);const t={},r=a.createContext(t);function s(e){const n=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),a.createElement(r.Provider,{value:n},e.children)}}}]);