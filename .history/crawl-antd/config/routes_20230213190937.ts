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
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: 'list.index',
    path: '/index',
    icon: 'crown',
    component: './index',
  },
  {
    name: 'spider',
    path: '/spider',
    icon: 'crown',
    routes: [
      {
        name: 'scrapy',
        path: '/spider/scrapy',
        component: './spider',
      },
      {
        name: 'spiderconfig',
        path: '/spider/:uuid',
        component: './spider/spiderconfig',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'spideradd',
    path: '/spideradd',
    icon: 'crown',
    component: './spideradd',
  },

  {
    component: './404',
  },
];
