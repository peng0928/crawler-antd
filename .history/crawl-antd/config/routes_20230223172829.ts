export default [
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
    path: '/',
    icon: 'crown',
    component: './index',
    // routes: []
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
      },      {
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
    component: './404',
  },
];
