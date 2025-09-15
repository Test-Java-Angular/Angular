import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { WarehouseService } from '../../service';
import { Warehouse } from '../../entities';

export const warehouseResolver: ResolveFn<Warehouse> = (route, state) => {
  const warehouseService = inject(WarehouseService);
  const warehouseId = route.params.id;
  return warehouseService.getWarehouse(warehouseId);
};
