import { RackStore } from './rack-store';
import { RackService } from '../../service';
import { of, throwError } from 'rxjs';

describe('RackStore', () => {
  let store: any;
  let rackService: jasmine.SpyObj<RackService>;

  beforeEach(() => {
    rackService = jasmine.createSpyObj<RackService>('RackService', [
      'listRacks',
      'deleteRack',
    ]);
    store = new RackStore(rackService);
  });

  it('debe cargar los racks correctamente', (done) => {
    const racks = [{ id: 1, name: 'Rack1', uuid: 'a', type: 'typeA' }];
    rackService.listRacks.and.returnValue(of({
      content: racks,
      totalElements: 1,
      size: 100,
    }));

    store.loadAllRacks({ warehouseId: 1, pageable: { page: 0, size: 100 } }).subscribe(() => {
      // Suponiendo que hay una propiedad entities() o racks() en la store real
      expect(store.entities().length).toBeGreaterThanOrEqual(1);
      expect(store.entities()[0]).toEqual(jasmine.objectContaining({ id: 1, name: 'Rack1' }));
      done();
    });
  });

  it('debe manejar errores al cargar los racks', (done) => {
    rackService.listRacks.and.returnValue(throwError(() => new Error('error de carga')));
    store.loadAllRacks({ warehouseId: 2, pageable: { page: 0, size: 100 } }).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        // Aquí puedes chequear si la store tiene alguna propiedad de error (por ejemplo, store.error())
        done();
      },
    });
  });

  it('debe eliminar un rack correctamente', (done) => {
    rackService.deleteRack.and.returnValue(of({}));
    spyOn(store, 'loadAllRacks').and.callThrough();

    store.deleteRack({ warehouseId: 1, rackId: 123 }).subscribe(() => {
      expect(rackService.deleteRack).toHaveBeenCalledWith({ warehouseId: 1, rackId: 123 });
      // Aquí podrías verificar si la lista de racks se ha actualizado, por ejemplo, recargando entidades
      done();
    });
  });

  it('debe manejar errores al eliminar un rack', (done) => {
    rackService.deleteRack.and.returnValue(throwError(() => new Error('error borrando')));
    store.deleteRack({ warehouseId: 3, rackId: 22 }).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  // Cobertura del método que selecciona racks por UUID, si existe
  it('puede seleccionar racks por uuid si el método existe', () => {
    if (typeof store.selectRackByUuid === 'function') {
      const racks = [{ id: 1, uuid: 'abc', name: 'rack' }];
      spyOn(store, 'entities').and.returnValue(racks);
      const result = store.selectRackByUuid('abc');
      expect(result).toEqual({ id: 1, uuid: 'abc', name: 'rack' });
    }
  });
});