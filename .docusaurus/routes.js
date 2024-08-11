import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'a37'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '7d5'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'c3b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '905'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '697'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'b9d'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', 'e69'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'f6e'),
    exact: true
  },
  {
    path: '/blog/5-hour-rule',
    component: ComponentCreator('/blog/5-hour-rule', '850'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '250'),
    exact: true
  },
  {
    path: '/blog/learning-in-the-age-ai',
    component: ComponentCreator('/blog/learning-in-the-age-ai', '2d8'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', 'e62'),
    exact: true
  },
  {
    path: '/blog/tags/ai',
    component: ComponentCreator('/blog/tags/ai', '2de'),
    exact: true
  },
  {
    path: '/blog/tags/learning',
    component: ComponentCreator('/blog/tags/learning', '259'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '690'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'b15'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'ca9'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'd88'),
            routes: [
              {
                path: '/AI/',
                component: ComponentCreator('/AI/', 'dde'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/ai-102',
                component: ComponentCreator('/AI/AI Engineer/ai-102', '9ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/Computer Vision/custom-form-recognizer-model',
                component: ComponentCreator('/AI/AI Engineer/Computer Vision/custom-form-recognizer-model', 'd6b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/Computer Vision/face-api',
                component: ComponentCreator('/AI/AI Engineer/Computer Vision/face-api', '600'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/Computer Vision/prebuilt-form-recognizer-models',
                component: ComponentCreator('/AI/AI Engineer/Computer Vision/prebuilt-form-recognizer-models', 'af2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/consume',
                component: ComponentCreator('/AI/AI Engineer/consume', 'e03'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/Knowledge Mining/About',
                component: ComponentCreator('/AI/AI Engineer/Knowledge Mining/About', 'c0c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/Natural Language Processing/About',
                component: ComponentCreator('/AI/AI Engineer/Natural Language Processing/About', '2ba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/Natural Language Processing/Azure AI Language service',
                component: ComponentCreator('/AI/AI Engineer/Natural Language Processing/Azure AI Language service', '9bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/Natural Language Processing/Azure AI Speech service',
                component: ComponentCreator('/AI/AI Engineer/Natural Language Processing/Azure AI Speech service', '377'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/AI Engineer/prepare',
                component: ComponentCreator('/AI/AI Engineer/prepare', 'c0b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI/roadmap',
                component: ComponentCreator('/AI/roadmap', 'd78'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Dynamics 365 Business Central/About',
                component: ComponentCreator('/Archive/Dynamics 365 Business Central/About', 'fe4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Dynamics 365 Business Central/architecture',
                component: ComponentCreator('/Archive/Dynamics 365 Business Central/architecture', '3e1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Dynamics 365 Business Central/Development/customize',
                component: ComponentCreator('/Archive/Dynamics 365 Business Central/Development/customize', '19b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Dynamics 365 Business Central/Development/getting-started',
                component: ComponentCreator('/Archive/Dynamics 365 Business Central/Development/getting-started', '3cd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Dynamics 365 Business Central/Development/objects',
                component: ComponentCreator('/Archive/Dynamics 365 Business Central/Development/objects', '103'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Dynamics 365 Business Central/Development/translation-files',
                component: ComponentCreator('/Archive/Dynamics 365 Business Central/Development/translation-files', 'cb0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Python/About',
                component: ComponentCreator('/Archive/Python/About', 'c29'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Python/file-i-o',
                component: ComponentCreator('/Archive/Python/file-i-o', '503'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Python/flask',
                component: ComponentCreator('/Archive/Python/flask', 'f53'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Python/numpy',
                component: ComponentCreator('/Archive/Python/numpy', '72e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Python/oop',
                component: ComponentCreator('/Archive/Python/oop', 'f94'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Python/pandas',
                component: ComponentCreator('/Archive/Python/pandas', '573'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Archive/Python/roadmap',
                component: ComponentCreator('/Archive/Python/roadmap', 'dc5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/ai--ml',
                component: ComponentCreator('/category/ai--ml', 'd80'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/ai-engineer-using-azure-services',
                component: ComponentCreator('/category/ai-engineer-using-azure-services', '1a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/ai-engineer-using-microsoft-azure',
                component: ComponentCreator('/category/ai-engineer-using-microsoft-azure', 'bbb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/computer-vision',
                component: ComponentCreator('/category/computer-vision', '6c3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/data-analyst',
                component: ComponentCreator('/category/data-analyst', '533'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/development',
                component: ComponentCreator('/category/development', '74a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/dynamics-365-business-central',
                component: ComponentCreator('/category/dynamics-365-business-central', '94a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/intermediate-python',
                component: ComponentCreator('/category/intermediate-python', '422'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/knowledge-mining',
                component: ComponentCreator('/category/knowledge-mining', '647'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/natural-language-processing',
                component: ComponentCreator('/category/natural-language-processing', '561'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/python',
                component: ComponentCreator('/category/python', '06c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/react',
                component: ComponentCreator('/category/react', 'e1c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/udacity-learning-projects',
                component: ComponentCreator('/category/udacity-learning-projects', '808'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CV',
                component: ComponentCreator('/CV', '93e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/intro',
                component: ComponentCreator('/intro', '283'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/About',
                component: ComponentCreator('/Udacity Courses/About', '3f5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/AI Engineer using Microsoft Azure/course_1',
                component: ComponentCreator('/Udacity Courses/AI Engineer using Microsoft Azure/course_1', '3f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/AI Engineer using Microsoft Azure/course-outline',
                component: ComponentCreator('/Udacity Courses/AI Engineer using Microsoft Azure/course-outline', '923'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/AI Engineer using Microsoft Azure/skills',
                component: ComponentCreator('/Udacity Courses/AI Engineer using Microsoft Azure/skills', 'ad9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/Data Analyst/course-outline',
                component: ComponentCreator('/Udacity Courses/Data Analyst/course-outline', '48f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/Data Analyst/investigate-dataset',
                component: ComponentCreator('/Udacity Courses/Data Analyst/investigate-dataset', '0ab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/Data Analyst/skills',
                component: ComponentCreator('/Udacity Courses/Data Analyst/skills', '8cc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/Intermediate Python/course-outline',
                component: ComponentCreator('/Udacity Courses/Intermediate Python/course-outline', '081'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/Intermediate Python/meme-generator',
                component: ComponentCreator('/Udacity Courses/Intermediate Python/meme-generator', 'a67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/Intermediate Python/near-earth-objects',
                component: ComponentCreator('/Udacity Courses/Intermediate Python/near-earth-objects', 'bca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/Intermediate Python/skills',
                component: ComponentCreator('/Udacity Courses/Intermediate Python/skills', '941'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/React/course-outline',
                component: ComponentCreator('/Udacity Courses/React/course-outline', 'df8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'd17'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
