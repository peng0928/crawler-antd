export default [
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
    icon: 'BugOutlined',
    routes: [
      {
        name: 'webspider',
        path: '/spider/webspider',
        component: './spider/webspider',
        icon: 'BugFilled',
      },
      {
        name: 'pyspider',
        path: '/spider/pyspider',
        component: './spider/pyspider',
        icon: 'BugTwoTone',
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
      {
        name: 'webspiderdata',
        path: '/spider/webspider/res/:uuid',
        component: './spider/res/webspiderdata',
        hideInMenu: true,
      },
    ],
  },

  {
    name: 'task',
    path: '/task',
    icon: 'BarChartOutlined',
    component: './task/task',
  },
  {
    name: 'crontask',
    path: '/crontask',
    icon: 'FieldTimeOutlined',
    component: './task/crontask',
  },
  {
    name: 'settion',
    path: '/settion',
    icon: 'SettingFilled',
    component: './settion/settion',
  },
  {
    name: 'test',
    path: '/test',
    icon: 'crown',
    component: './test/test',
  },
  {
    name: 'test1',
    path: '/test/view/:id',
    component: './test/testview',
    hideInMenu: true,
  },
  {
    component: './404',
  },
];
