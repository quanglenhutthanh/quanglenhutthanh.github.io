import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', '9eb'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', 'fb0'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', 'f64'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', 'b9a'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', 'cb4'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '4ca'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '141'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '205'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '840'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', 'd3b'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', 'b87'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '2a5'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '284'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '94d'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '977'),
            routes: [
              {
                path: '/docs/About',
                component: ComponentCreator('/docs/About', '816'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/data-analyst-nd002',
                component: ComponentCreator('/docs/category/data-analyst-nd002', '048'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/intermediate-python-nd303',
                component: ComponentCreator('/docs/category/intermediate-python-nd303', '477'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/python',
                component: ComponentCreator('/docs/category/python', '5ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/udacity-learning-path',
                component: ComponentCreator('/docs/category/udacity-learning-path', 'e33'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/CV',
                component: ComponentCreator('/docs/CV', 'cb5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Python/About',
                component: ComponentCreator('/docs/Python/About', '8b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Python/numpy',
                component: ComponentCreator('/docs/Python/numpy', 'f0f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Udacity Courses/About',
                component: ComponentCreator('/docs/Udacity Courses/About', '45b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Udacity Courses/Data Analyst/course-outline',
                component: ComponentCreator('/docs/Udacity Courses/Data Analyst/course-outline', '786'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Udacity Courses/Data Analyst/skills',
                component: ComponentCreator('/docs/Udacity Courses/Data Analyst/skills', 'a3a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Udacity Courses/Intermediate Python/course-outline',
                component: ComponentCreator('/docs/Udacity Courses/Intermediate Python/course-outline', '8b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Udacity Courses/Intermediate Python/meme-generator',
                component: ComponentCreator('/docs/Udacity Courses/Intermediate Python/meme-generator', '058'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Udacity Courses/Intermediate Python/near-earth-objects',
                component: ComponentCreator('/docs/Udacity Courses/Intermediate Python/near-earth-objects', '634'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Udacity Courses/Intermediate Python/skills',
                component: ComponentCreator('/docs/Udacity Courses/Intermediate Python/skills', '0b9'),
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
    path: '/',
    component: ComponentCreator('/', '8da'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
