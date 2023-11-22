"use strict";(self.webpackChunksrc=self.webpackChunksrc||[]).push([[3938],{7783:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var n=a(5893),s=a(1151);const r={sidebar_position:20,sidebar_label:"Project: Exploring Near-Earth Objects"},o="Project: Exploring Near-Earth Objects",i={id:"Udacity Courses/Intermediate Python/near-earth-objects",title:"Project: Exploring Near-Earth Objects",description:"In this project, you'll use Python - and the skills we've developed throughout this course - to search for and explore close approaches of near-Earth objects (NEOs), using data from NASA/JPL's Center for Near-Earth Object Studies.",source:"@site/docs/Udacity Courses/Intermediate Python/near-earth-objects.md",sourceDirName:"Udacity Courses/Intermediate Python",slug:"/Udacity Courses/Intermediate Python/near-earth-objects",permalink:"/Udacity Courses/Intermediate Python/near-earth-objects",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Udacity Courses/Intermediate Python/near-earth-objects.md",tags:[],version:"current",sidebarPosition:20,frontMatter:{sidebar_position:20,sidebar_label:"Project: Exploring Near-Earth Objects"},sidebar:"tutorialSidebar",previous:{title:"Nanodegree Skills",permalink:"/Udacity Courses/Intermediate Python/skills"},next:{title:"Project: Meme Generator",permalink:"/Udacity Courses/Intermediate Python/meme-generator"}},c={},l=[{value:"Overview",id:"overview",level:2},{value:"Understanding the Near-Earth Object Close Approach Datasets",id:"understanding-the-near-earth-object-close-approach-datasets",level:2},{value:"Description",id:"description",level:2},{value:"Understanding Project Tasks",id:"understanding-project-tasks",level:3},{value:"Coding Style",id:"coding-style",level:2},{value:"Getting Started",id:"getting-started",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Installation",id:"installation",level:3},{value:"Usage",id:"usage",level:2}];function d(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"project-exploring-near-earth-objects",children:"Project: Exploring Near-Earth Objects"}),"\n",(0,n.jsx)(t.p,{children:"In this project, you'll use Python - and the skills we've developed throughout this course - to search for and explore close approaches of near-Earth objects (NEOs), using data from NASA/JPL's Center for Near-Earth Object Studies."}),"\n",(0,n.jsxs)(t.p,{children:["Source code: ",(0,n.jsx)(t.a,{href:"https://github.com/quanglenhutthanh/Near-Earth_Project",children:"https://github.com/quanglenhutthanh/Near-Earth_Project"})]}),"\n",(0,n.jsx)(t.h2,{id:"overview",children:"Overview"}),"\n",(0,n.jsx)(t.p,{children:"At a high-level, you'll create Python code that implements a command-line tool to inspect and query a dataset of NEOs and their close approaches to Earth."}),"\n",(0,n.jsx)(t.p,{children:"Concretely, you'll have to read data from both a CSV file and a JSON file, convert that data into structured Python objects, perform filtering operations on the data, limit the size of the result set, and write the results to a file in a structured format, such as CSV or JSON."}),"\n",(0,n.jsx)(t.p,{children:"When complete, you'll be able to inspect the properties of the near-Earth objects in the data set and query the data set of close approaches to Earth using any combination of the following filters:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Occurs on a given date."}),"\n",(0,n.jsx)(t.li,{children:"Occurs on or after a given start date."}),"\n",(0,n.jsx)(t.li,{children:"Occurs on or before a given end date."}),"\n",(0,n.jsx)(t.li,{children:"Approaches Earth at a distance of at least (or at most) X astrononical units."}),"\n",(0,n.jsx)(t.li,{children:"Approaches Earth at a relative velocity of at least (or at most) Y kilometers per second."}),"\n",(0,n.jsx)(t.li,{children:"Has a diameter that is at least as large as (or at least as small as) Z kilometers."}),"\n",(0,n.jsx)(t.li,{children:"Is marked by NASA as potentially hazardous (or not)."}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"By completing this project, you'll have demonstrated an ability to:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Represent structured data in Python."}),"\n",(0,n.jsx)(t.li,{children:"Extract data from structured files into Python."}),"\n",(0,n.jsx)(t.li,{children:"Transform the data within Python according to some desired behavior."}),"\n",(0,n.jsx)(t.li,{children:"Save the results in a structured way to a file."}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"Along the way, you'll have to be able to:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Write Python functions to transform data and perform algorithms."}),"\n",(0,n.jsx)(t.li,{children:"Design Python classes to encapsulate useful data types."}),"\n",(0,n.jsx)(t.li,{children:"Provide interface abstractions for complex implementations."}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"understanding-the-near-earth-object-close-approach-datasets",children:"Understanding the Near-Earth Object Close Approach Datasets"}),"\n",(0,n.jsx)(t.p,{children:"This project contains two important datasets."}),"\n",(0,n.jsx)(t.p,{children:"One dataset (neos.csv) contains information about semantic, physical, orbital and model parameters for certain small bodies (asteroids and comets, mostly) in our solar system. The other dataset (cad.json) contains information about NEO close approaches - moments in time when the orbit of an astronomical body brings it close to Earth."}),"\n",(0,n.jsx)(t.h2,{id:"description",children:"Description"}),"\n",(0,n.jsx)(t.h3,{id:"understanding-project-tasks",children:"Understanding Project Tasks"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Task 0"})," : Inspect the data. (",(0,n.jsx)(t.code,{children:"neo.csv"})," and ",(0,n.jsx)(t.code,{children:"cad.json"}),")"]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Task 1"})," : build model to represent the data. (",(0,n.jsx)(t.code,{children:"models.py"}),")"]}),"\n",(0,n.jsx)(t.p,{children:"The first thing we'll do is create Python objects to represent our data. In particular, we're going to create two classes in the models.py file:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"A NearEarthObject class, to represent the data for a single near-Earth object."}),"\n",(0,n.jsx)(t.li,{children:"A CloseApproach class, to represent the data for a single close approach of an NEO."}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Task 2"})," : Extract data from structured files into Python objects."]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["In ",(0,n.jsx)(t.code,{children:"extract.py"}),", we'll write functions that takes the paths to our data files and extract structured data."]}),"\n",(0,n.jsxs)(t.li,{children:["In ",(0,n.jsx)(t.code,{children:"database.py"}),", we'll capture this data in an NEODatabase, precompute auxiliary data structures, interconnect the NearEarthObjects and CloseApproaches, and provide the ability to fetch NEOs by designation or by name."]}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Task 3:"})," Query close approaches with user-specified criteria."]}),"\n",(0,n.jsxs)(t.p,{children:["You'll implement the ",(0,n.jsx)(t.code,{children:"create\\_filters"})," function in the filters.py file."]}),"\n",(0,n.jsxs)(t.p,{children:["Query the database of close approaches using user-specified criteria. (",(0,n.jsx)(t.code,{children:"database.py"}),")."]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Task 4"})," : Report the results (write.py)"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"write\\_to\\_csv"}),": Write a stream of CloseApproach objects to a specific CSV file."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"write\\_to\\_json"}),": Write a stream of CloseApproach objects to a specific JSON file."]}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"coding-style",children:"Coding Style"}),"\n",(0,n.jsxs)(t.p,{children:["Produce python code that satisfie PEP 8. You can install pycodestyle with ",(0,n.jsx)(t.code,{children:"pip install pycodestyle"})," and check your code with ",(0,n.jsx)(t.code,{children:"pycodestyle ./"})]}),"\n",(0,n.jsxs)(t.p,{children:["Write python comments that satisfy PEP-0257. You can install pydocstyle with ",(0,n.jsx)(t.code,{children:"pip install pydocstyle"})," and check your code with ",(0,n.jsx)(t.code,{children:"pydocstyle ./"})]}),"\n",(0,n.jsx)(t.h2,{id:"getting-started",children:"Getting Started"}),"\n",(0,n.jsx)(t.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,n.jsx)(t.p,{children:"Using Python 3.8 or later, install the required packages listed in requirements.txt using pip or your favorite package manager"}),"\n",(0,n.jsx)(t.h3,{id:"installation",children:"Installation"}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.code,{children:"pip install -r requirements.txt"})}),"\n",(0,n.jsx)(t.h2,{id:"usage",children:"Usage"}),"\n",(0,n.jsxs)(t.p,{children:["This project is driven by the ",(0,n.jsx)(t.code,{children:"main.py"})," script. That means that you'll run ",(0,n.jsx)(t.code,{children:"python3 main.py ... ... ..."})," at the command line to invoke the program that will call your code."]}),"\n",(0,n.jsxs)(t.p,{children:["At a command line, you can run ",(0,n.jsx)(t.code,{children:"python3 main.py --help"})," for an explanation of how to invoke the script."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-cmd",children:"usage: main.py [-h] [--neofile NEOFILE] [--cadfile CADFILE] {inspect,query,interactive} ...\nExplore past and future close approaches of near-Earth objects.\n\npositional arguments:\n  {inspect,query,interactive}\n\noptional arguments:\n  -h, --help            show this help message and exit\n  --neofile NEOFILE     Path to CSV file of near-Earth objects.\n  --cadfile CADFILE     Path to JSON file of close approach data.\n\n\n"})}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"inspect"})," subcommand inspects a single NEO, printing its details in a human-readable format. The NEO is specified with exactly one of the --pdes option (the primary designation) and the --name option (the IAU name). The --verbose flag additionally prints out, in a human-readable form, all known close approaches to Earth made by this NEO. Each of these options has an abbreviated version."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{children:"$ python3 main.py inspect --help\nusage: main.py inspect [-h] [-v] (-p PDES | -n NAME)\nInspect an NEO by primary designation or by name.\n\nExample:\n\n# Inspect the NEO with a primary designation of 433 (that's Eros!)\n$ python3 main.py inspect --pdes 433\nNEO 433 (Eros) has a diameter of 16.840 km and is not potentially hazardous.\n\n# Inspect the NEO with an IAU name of \"Halley\" (that's Halley's Comet!)\n$ python3 main.py inspect --name Halley\nNEO 1P (Halley) has a diameter of 11.000 km and is not potentially hazardous.\n\n"})}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"query"})," subcommand is significantly more advanced - a query generates a collection of close approaches that match a set of specified filters, and either displays a limited set of those results to standard output or writes the structured results to a file."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{children:"$ python3 main.py query --help\nusage: main.py query [-h] [-d DATE] [-s START_DATE] [-e END_DATE] [--min-distance DISTANCE_MIN] [--max-distance DISTANCE_MAX]\n                     [--min-velocity VELOCITY_MIN] [--max-velocity VELOCITY_MAX] [--min-diameter DIAMETER_MIN]\n                     [--max-diameter DIAMETER_MAX] [--hazardous] [--not-hazardous] [-l LIMIT] [-o OUTFILE]\n\nExample:\n# Show (the first) three close approaches on July 29th, 1969.\n$ python3 main.py query --date 1969-07-29 --limit 3\nOn 1969-07-29 01:47, '408982' approaches Earth at a distance of 0.36 au and a velocity of 24.24 km/s.\nOn 1969-07-29 13:33, '2010 MA' approaches Earth at a distance of 0.21 au and a velocity of 8.80 km/s.\nOn 1969-07-29 19:56, '464798' approaches Earth at a distance of 0.10 au and a velocity of 8.02 km/s.\n\n# Show (the first) three close approaches in 2050.\n$ python3 main.py query --start-date 2050-01-01 --limit 3\nOn 2050-01-01 04:18, '2019 AY9' approaches Earth at a distance of 0.31 au and a velocity of 8.31 km/s.\nOn 2050-01-01 06:00, '162361' approaches Earth at a distance of 0.19 au and a velocity of 9.08 km/s.\nOn 2050-01-01 09:55, '2009 LW2' approaches Earth at a distance of 0.04 au and a velocity of 19.02 km/s.\n\n\n"})}),"\n",(0,n.jsxs)(t.p,{children:["There's a third useful subcommand named ",(0,n.jsx)(t.code,{children:"interactive"}),". This subcommand first loads the database and then starts a command loop so that you can repeatedly run inspect and query subcommands on the database without having to wait to reload the data each time you want to run a new command, which saves an extraordinary amount of time. This can be extremely helpful, as it lets you speed up your development cycle and even show off the project more easily to friends."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{children:"$ python3 main.py interactive\n\nExplore close approaches of near-Earth objects. Type `help` or `?` to list commands and `exit` to exit.\n(neo) inspect --pdes 433\nNEO 433 (Eros) has a diameter of 16.840 km and is not potentially hazardous.\n(neo) help i\nShorthand for `inspect`.\n(neo) i --name Halley\nNEO 1P (Halley) has a diameter of 11.000 km and is not potentially hazardous.\n(neo) query --date 2020-12-31 --limit 2\nOn 2020-12-31 05:48, '2010 PQ10' approaches Earth at a distance of 0.45 au and a velocity of 21.69 km/s.\nOn 2020-12-31 16:00, '2015 YA' approaches Earth at a distance of 0.17 au and a velocity of 5.65 km/s.\n(neo) q --date 2021-3-14 --min-velocity 10\nOn 2021-03-14 06:17, '2019 DS1' approaches Earth at a distance of 0.39 au and a velocity of 20.17 km/s.\nOn 2021-03-14 20:19, '483656' approaches Earth at a distance of 0.06 au and a velocity of 12.09 km/s.\n...\n\n\n"})})]})}function h(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},1151:(e,t,a)=>{a.d(t,{Z:()=>i,a:()=>o});var n=a(7294);const s={},r=n.createContext(s);function o(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);