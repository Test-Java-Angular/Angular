import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageableType, PageResults, Rack } from '../../entities';

@Injectable({
  providedIn: 'root',
})
export class RackService {
  readonly http = inject(HttpClient);

  getRacks(warehouseId: number, pageable: PageableType) {
    const params = {
      ...pageable,
    };

    return this.http.get<PageResults<Rack>>(`/warehouse/${warehouseId}/racks`, {
      params,
    });
  }

  addRack(warehouseId: number, rack: Rack) {
    return this.http.post<Rack>(`/warehouse/${warehouseId}/racks`, rack);
  }

  deleteRack(warehouseId: number, rackId: number) {
    return this.http.delete<void>(`/warehouse/${warehouseId}/racks/${rackId}`);
  }
}
