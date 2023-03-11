let menu=[
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        hideInMenu: false,
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'SmileOutlined',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'SmileOutlined',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'DashboardOutlined',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/analysis/1',
      },
      {
        name: 'analysis',
        icon: 'SmileOutlined',
        path: '/dashboard/analysis/:id',
        component: './dashboard/analysis',
      },
      {
        name: 'monitor',
        icon: 'SmileOutlined',
        path: '/dashboard/monitor',
        component: './dashboard/monitor',
      },
      {
        name: 'workplace',
        icon: 'SmileOutlined',
        path: '/dashboard/workplace',
        component: './dashboard/workplace',
      },
    ],
  },
  {
    path: '/form',
    icon: 'FormOutlined',
    name: 'form',
    routes: [
      {
        path: '/form',
        redirect: '/form/basic-form',
      },
      {
        name: 'basic-form',
        icon: 'SmileOutlined',
        path: '/form/basic-form',
        component: './form/basic-form',
      },
      {
        name: 'step-form',
        icon: 'SmileOutlined',
        path: '/form/step-form',
        component: './form/step-form',
      },
      {
        name: 'advanced-form',
        icon: 'SmileOutlined',
        path: '/form/advanced-form',
        component: './form/advanced-form',
      },
    ],
  },
  {
    path: '/list',
    icon: 'TableOutlined',
    name: 'list',
    routes: [
      {
        path: '/list/search',
        name: 'search-list',
        component: './list/search',
        routes: [
          {
            path: '/list/search',
            redirect: '/list/search/articles',
          },
          {
            name: 'articles',
            icon: 'SmileOutlined',
            path: '/list/search/articles',
            component: './list/search/articles',
          },
          {
            name: 'projects',
            icon: 'SmileOutlined',
            path: '/list/search/projects',
            component: './list/search/projects',
          },
          {
            name: 'applications',
            icon: 'SmileOutlined',
            path: '/list/search/applications',
            component: './list/search/applications',
          },
        ],
      },
      {
        path: '/list',
        redirect: '/list/table-list',
      },
      {
        name: 'table-list',
        icon: 'SmileOutlined',
        path: '/list/table-list',
        component: './list/table-list',
      },
      {
        name: 'basic-list',
        icon: 'SmileOutlined',
        path: '/list/basic-list',
        component: './list/basic-list',
      },
      {
        name: 'card-list',
        icon: 'SmileOutlined',
        path: '/list/card-list',
        component: './list/card-list',
      },
    ],
  },
  {
    path: '/profile',
    name: 'profile',
    icon: 'ProfileOutlined',
    routes: [
      {
        path: '/profile',
        redirect: '/profile/basic',
      },
      {
        name: 'basic',
        icon: 'SmileOutlined',
        path: '/profile/basic',
        component: './profile/basic',
      },
      {
        name: 'advanced',
        icon: 'SmileOutlined',
        path: '/profile/advanced',
        component: './profile/advanced',
      },
    ],
  },
  {
    name: 'result',
    icon: 'CheckCircleOutlined',
    path: '/result',
    routes: [
      {
        path: '/result',
        redirect: '/result/success',
      },
      {
        name: 'success',
        icon: 'SmileOutlined',
        path: '/result/success',
        component: './result/success',
      },
      {
        name: 'fail',
        icon: 'SmileOutlined',
        path: '/result/fail',
        component: './result/fail',
      },
    ],
  },
  {
    name: 'exception',
    icon: 'WarningOutlined',
    path: '/exception',
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        icon: 'SmileOutlined',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        icon: 'SmileOutlined',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        icon: 'SmileOutlined',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    name: 'account',
    icon: 'UserOutlined',
    path: '/account',
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      {
        name: 'center',
        icon: 'SmileOutlined',
        path: '/account/center',
        component: './account/center',
      },
      {
        name: 'settings',
        icon: 'SmileOutlined',
        path: '/account/settings',
        component: './account/settings',
      },
    ],
  },
  {
    name: 'editor',
    icon: 'BarChartOutlined',
    path: '/editor',
    routes: [
      {
        path: '/editor',
        redirect: '/editor/flow',
      },
      {
        name: 'flow',
        icon: 'SmileOutlined',
        path: '/editor/flow',
        component: './editor/flow',
      },
      {
        name: 'mind',
        icon: 'SmileOutlined',
        path: '/editor/mind',
        component: './editor/mind',
      },
      {
        name: 'koni',
        icon: 'SmileOutlined',
        path: '/editor/koni',
        component: './editor/koni',
      },
    ],
  },

  {
    name: 'sys',
    icon: 'UserAddOutlined',
    path: '/sys',
   // component: './custom',

    routes: [
      {
        name: 'iframe',
        icon: 'SmileOutlined',
        path: '/sys/iframe/:url',
        component: './sys/iframe',
      },
    ]
  },
  {
    name: 'custom',
    icon: 'UserAddOutlined',
    path: '/custom',
   // component: './custom',

    routes: [
      {
        name: 'basic',
        icon: 'SmileOutlined',
        path: '/custom/basic',
        component: './custom/basic',
      },
      {
        name: 'layout',
        icon: 'SmileOutlined',
        path: '/custom/layout',
        component: './custom/layout',
      },
      {
        name: 'table',
        icon: 'SmileOutlined',
        path: '/custom/table',
        component: './custom/table',
      },
      {
        name: 'login',
        icon: 'SmileOutlined',
        path: '/custom/login',
        component: './custom/login',
      },
      {
        name: 'reg',
        icon: 'SmileOutlined',
        path: '/custom/reg',
        component: './custom/reg',
      },
      {
        name: 'change',
        icon: 'SmileOutlined',
        path: '/custom/change',
        component: './custom/change',
      },
      {
        name: 'visual',
        icon: 'SmileOutlined',
        path: '/custom/visual/:page_id',
        component: './custom/visual',
      },
      {
        name: 'visual',
        icon: 'SmileOutlined',
        path: '/custom/basictable',
        component: './custom/basictable',
      },
    ]

  },

  {
    name: 'event',
    icon: 'UserAddOutlined',
    path: '/event',
    component: './event',
  },
  {
    path: '/',
    redirect: '/dashboard/analysis/1', //默认页
  },
  {
    component: '404',
  },
];

export default menu;
