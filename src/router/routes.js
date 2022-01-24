import { RouteCode, RoutePath } from '../config/routeConstants'

export const defaultRoutes = [
  {
    code: RouteCode.ROOT,
    title: 'root',
    path: '/',
    component: RoutePath.ROOT,
    children: [
      {
        code: RouteCode.LAYOUT_BASIC,
        title: 'home',
        path: 'home',
        component: RoutePath.LAYOUT_BASIC,
        children: [
          {
            code: RouteCode.PAGE_HOME,
            title: 'index',
            path: 'index',
            component: RoutePath.PAGE_HOME,
          },
        ],
      },
    ],
  },
]
