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
    component: ComponentCreator('/', 'c81'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '565'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '1a0'),
            routes: [
              {
                path: '/About',
                component: ComponentCreator('/About', '7c3'),
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
                path: '/category/data-analyst',
                component: ComponentCreator('/category/data-analyst', '533'),
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
                path: '/category/natural-language-processing',
                component: ComponentCreator('/category/natural-language-processing', '561'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/category/projects',
                component: ComponentCreator('/category/projects', '573'),
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
                path: '/certificates',
                component: ComponentCreator('/certificates', 'c0f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/AI Engineer using Microsoft Azure/about',
                component: ComponentCreator('/Udacity Courses/AI Engineer using Microsoft Azure/about', 'fe8'),
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
                path: '/Udacity Courses/AI Engineer using Microsoft Azure/skills',
                component: ComponentCreator('/Udacity Courses/AI Engineer using Microsoft Azure/skills', 'ad9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/Data Analyst/about',
                component: ComponentCreator('/Udacity Courses/Data Analyst/about', '793'),
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
                path: '/Udacity Courses/Intermediate Python/about',
                component: ComponentCreator('/Udacity Courses/Intermediate Python/about', 'a6d'),
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
                path: '/Udacity Courses/Natural Language Processing/about',
                component: ComponentCreator('/Udacity Courses/Natural Language Processing/about', 'da4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/React/about',
                component: ComponentCreator('/Udacity Courses/React/about', '1fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/React/employee-polls',
                component: ComponentCreator('/Udacity Courses/React/employee-polls', 'a83'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Udacity Courses/React/my-reads',
                component: ComponentCreator('/Udacity Courses/React/my-reads', '3bc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', '7dd'),
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
