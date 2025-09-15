import { WarehouseStore } from './warehouse-store';
import { WarehouseService } from '../../service';
import { of, throwError } from 'rxjs';

describe('WarehouseStore', () => {
  let store: any;
  let warehouseService: jasmine.SpyObj<WarehouseService>;
  beforeEach(() => {
    warehouseService = jasmine.createSpyObj<WarehouseService>('WarehouseService', [
      'listWarehouses',
      'deleteWarehouse',
    ]);
    store = new WarehouseStore(warehouseService);
  });

  it('carga los almacenes correctamente', (done) => {
    warehouseService.listWarehouses.and.returnValue(of({
      content: [
        { id: 1, clientName: 'W', uuid: 'x', capacity: 44 }
      ], totalElements: 1, size: 5
    }));
    store.loadAllWarehouses({ page: 0, size: 5 }).subscribe(() => {
      expect(store.entities()).toBeTruthy();
      done();
    });
  });

  it('maneja error al cargar', (done) => {
    warehouseService.listWarehouses.and.returnValue(throwError(() => new Error('fallo')));
    store.loadAllWarehouses({ page: 0, size: 5 }).subscribe({
      error: () => {
        expect(store.error()).toBeTruthy();
        done();
      }
    });
  });

  it('elimina un almacen correctamente', (done) => {
    warehouseService.deleteWarehouse.and.returnValue(of({}));
    store.deleteWarehouse(1).subscribe(() => {
      expect(store.selectedEntityId()).toBeNull();
      done();
    });
  });
});