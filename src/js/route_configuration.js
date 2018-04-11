import { Home, AppRoot, NotFound, List, ListToUsers, Product } from './modules';
const route_configuration = [
  {
    component: AppRoot,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
        SEO: 'SEO_HOME'
      },
      {
        path: '/home',
        component: Home,
        SEO: 'SEO_HOME'
      },
      {
        path: '/list',
        component: ListToUsers
      },
      {
        path: '/product',
        component: Product
      },
      {
        path: '/users',
        component: List
      },
      {
        path: '*',
        component: NotFound
      }
    ]
  }
];
export default route_configuration;