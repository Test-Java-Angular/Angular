import { Route } from '@angular/router';
import { PageNotFound } from '../components';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'warehouse',
    pathMatch: 'full',
  },
  {
    path: 'warehouse',
    loadChildren: () =>
      import('../modules/warehouse/warehouse.routes'),
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Page not found',
  }
];
