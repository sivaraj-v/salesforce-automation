import { Home, AppRoot, NotFound, List, ListToUsers, Product } from './modules';
const route_configuration = [
  {
    component: AppRoot,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
      {
        path: '/home',
        component: Home,
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