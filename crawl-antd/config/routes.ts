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
        component: './spider',
    },
    {
        name: 'list.test',
        path: '/test',
        icon: 'crown',
        component: './test',
    },
    {
        component: './404',
    },
    {
        name: 'spideradd',
        path: '/spideradd',
        icon: 'crown',
        component: './spideradd',
    },
];
