import { Routes } from '@angular/router';
import { WarehouseDetail } from './warehouse-detail/warehouse-detail';
import { WarehouseList } from './warehouse-list/warehouse-list';
import { warehouseResolver } from '../../resolvers';

const warehouseRoutes: Routes = [
  {
    path: '',
    component: WarehouseList,
    title: 'Warehouses',
  },
  {
    path: ':id',
    resolve: {
      warehouse: warehouseResolver,
    },
    children: [
      {
        path: 'show',
        component: WarehouseDetail,
        title: 'Warehouse Detail',
        data: {
          isEdit: false,
        },
      },
      {
        path: 'edit',
        component: WarehouseDetail,
        title: 'Edit Warehouse',
        data: {
          isEdit: true,
        },
      },
    ],
  },
];

export default warehouseRoutes;
