import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'f71'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '196'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'f21'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '29e'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '7ee'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'a82'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '76a'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'd8d'),
    exact: true
  },
  {
    path: '/blog/5-hour-rule',
    component: ComponentCreator('/blog/5-hour-rule', '76c'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '47c'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '706'),
    exact: true
  },
  {
    path: '/blog/tags/learning',
    component: ComponentCreator('/blog/tags/learning', '5ab'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3ea'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '5ac'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'e6f'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '89c'),
            routes: [
              {
                path: '/AI Engineer/Computer Vision/custom-form-recognizer-model',
                component: ComponentCreator('/AI Engineer/Computer Vision/custom-form-recognizer-model', '3ba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/AI Engineer/Computer Vision/prebuilt-form-recognizer-models',
                component: ComponentCreator('/AI Engineer/Computer Vision/prebuilt-form-recognizer-models', '5c0'),
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
                path: '/category/python',
                component: ComponentCreator('/category/python', '06c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/udacity-learning-path',
                component: ComponentCreator('/category/udacity-learning-path', 'cb7'),
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
                path: '/Dynamics 365 Business Central/About',
                component: ComponentCreator('/Dynamics 365 Business Central/About', 'd5d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Dynamics 365 Business Central/Development/customize',
                component: ComponentCreator('/Dynamics 365 Business Central/Development/customize', 'cbb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Dynamics 365 Business Central/Development/getting-started',
                component: ComponentCreator('/Dynamics 365 Business Central/Development/getting-started', '277'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Dynamics 365 Business Central/Development/overview',
                component: ComponentCreator('/Dynamics 365 Business Central/Development/overview', '5d0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Dynamics 365 Business Central/Development/translation-files',
                component: ComponentCreator('/Dynamics 365 Business Central/Development/translation-files', '887'),
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
                path: '/Python/About',
                component: ComponentCreator('/Python/About', '913'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Python/file-i-o',
                component: ComponentCreator('/Python/file-i-o', '7b4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Python/flask',
                component: ComponentCreator('/Python/flask', 'e35'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Python/numpy',
                component: ComponentCreator('/Python/numpy', '2ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Python/oop',
                component: ComponentCreator('/Python/oop', 'f59'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Python/pandas',
                component: ComponentCreator('/Python/pandas', '5d6'),
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
