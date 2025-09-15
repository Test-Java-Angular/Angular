import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageableType, PageResults, Warehouse } from '../../entities';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private readonly http = inject(HttpClient);

  listWarehouses(pageable: PageableType) {
    const params = {
      ...pageable,
    };

    return this.http.get<PageResults<Warehouse>>(`/warehouses`, {
      params,
    });
  }

  getWarehouse(id: number) {
    return this.http.get<Warehouse>(`/warehouses/${id}`);
  }

  deleteWarehouse(id: number) {
    return this.http.delete<void>(`/warehouses/${id}`);
  }

  editWarehouse(warehouse: Warehouse) {
    return this.http.put<Warehouse>(`/warehouses/${warehouse.id}`, warehouse);
  }

  addWarehouse(warehouse: Warehouse) {
    return this.http.post<Warehouse>('/warehouses', warehouse);
  }
}
