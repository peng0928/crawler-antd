﻿export default [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },

  {
    name: 'list.index',
    path: '/index',
    icon: 'crown',
    component: './spiderindex',
    routes: [],
  },
  {
    name: 'spider',
    path: '/spider',
    icon: 'crown',
    routes: [
      {
        name: 'webspider',
        path: '/spider/webspider',
        component: './spider/webspider',
      },
      {
        name: 'scrapy',
        path: '/spider/scrapy',
        component: './spider',
      },
      {
        name: 'spiderconfig',
        path: '/spider/scrapy/:uuid',
        component: './spider/spiderconfig',
        hideInMenu: true,
      },
      {
        name: 'webspideredit',
        path: '/spider/webspider/edit/:uuid',
        component: './spider/edit/webspideredit',
        hideInMenu: true,
      },
    ],
  },

  {
    name: 'task',
    path: '/task',
    icon: 'crown',
    component: './task/task',
  },
  {
    name: 'crontask',
    path: '/crontask',
    icon: 'crown',
    component: './task/crontask',
  },
  {
    name: 'settion',
    path: '/settion',
    icon: 'crown',
    component: './settion/settion',
  },
  {
    name: 'test',
    path: '/test',
    icon: 'crown',
    component: './test/test',
    routes: [
      {
        name: 'test',
        path: '/test/view/:id',
        component: './test/testview',
        hideInMenu: true,
      },
    ],
  },
  {
    component: './404',
  },
];
