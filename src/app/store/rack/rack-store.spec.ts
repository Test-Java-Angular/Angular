import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { RackStore } from './rack-store';
import { RackService } from '../../service';

describe('RackStore', () => {
  let store: InstanceType<typeof RackStore>;
  let rackService: jasmine.SpyObj<RackService>;

  beforeEach(() => {
    rackService = jasmine.createSpyObj<RackService>('RackService', [
      'getRacks',
      'addRack',
      'deleteRack',
    ]);

    TestBed.configureTestingModule({
      providers: [
        RackStore,
        { provide: RackService, useValue: rackService },
      ],
    });

    store = TestBed.inject(RackStore);
  });

  const filter = (warehouseId = 1, page = 0, size = 100) =>
    ({ warehouseId, pageable: { page, size } });

  const pageResults = (...content: any[]) => ({
    content,
    totalElements: content.length,
    size: 100,
  });

  describe('loadAllRacks', () => {
    it('load entities and mark fulfilled', fakeAsync(() => {
      const f = filter(1, 0, 100);
      const page = pageResults({ id: 1, name: 'Rack1', uuid: 'u1', type: 'A' });
      rackService.getRacks.and.returnValue(of(page));

      store.loadAllRacks(f);
      expect(rackService.getRacks).not.toHaveBeenCalled();
      tick(300);

      expect(rackService.getRacks).toHaveBeenCalledOnceWith(1, { page: 0, size: 100 });
      expect(store.entities().length).toBe(1);
      expect(store.entities().id).toBe(1);
      // withRequestStatus expose isFulfilled():
      expect(store.isFulfilled()).toBeTrue();
    }));

    it('set error and error()', fakeAsync(() => {
      const f = filter(2, 0, 50);
      const httpErr = new HttpErrorResponse({ status: 500, error: { msg: 'boom' } });
      rackService.getRacks.and.returnValue(throwError(() => httpErr));

      store.loadAllRacks(f);
      tick(300);

      expect(rackService.getRacks).toHaveBeenCalledOnceWith(2, { page: 0, size: 50 });
      expect(store.error()).toEqual({ msg: 'boom' });
      expect(store.isFulfilled()).toBeFalse();
    }));

    it('no repeat call (distinctUntilChanged)', fakeAsync(() => {
      const sameRef = filter(3, 0, 10);
      rackService.getRacks.and.returnValue(of(pageResults()));

      store.loadAllRacks(sameRef);
      tick(300);
      expect(rackService.getRacks).toHaveBeenCalledTimes(1);

      store.loadAllRacks(sameRef);
      tick(300);
      expect(rackService.getRacks).toHaveBeenCalledTimes(1);
    }));
  });

  describe('addRack', () => {
    it('set the rack and mark fulfilled', fakeAsync(() => {
      const dto = { type: 'EST' } as any;
      const created = { id: 123, type: 'EST' } as any;
      rackService.addRack.and.returnValue(of(created));

      store.addRack({ warehouseId: 1, rack: dto });
      tick(300);

      expect(rackService.addRack).toHaveBeenCalledOnceWith(1, dto);
      expect(store.selectedId()).toBe(123);
      expect(store.isFulfilled()).toBeTrue();
      expect(store.processed()).toBeTrue();
    }));

    it('propaga error al crear y lo expone en error()', fakeAsync(() => {
      const dto = { type: 'EST' } as any;
      const httpErr = new HttpErrorResponse({ status: 400, error: 'bad' });
      rackService.addRack.and.returnValue(throwError(() => httpErr));

      store.addRack({ warehouseId: 1, rack: dto });
      tick(300);

      expect(rackService.addRack).toHaveBeenCalledOnceWith(1, dto);
      expect(store.error()).toBe('bad');
      expect(store.isFulfilled()).toBeFalse();
    }));
  });

  describe('deleteRack', () => {
    it('no set and mark fulfilled after delete', fakeAsync(() => {
      rackService.deleteRack.and.returnValue(of({}));

      store.deleteRack({ warehouseId: 1, rackId: 999 });
      tick(300);

      expect(rackService.deleteRack).toHaveBeenCalledOnceWith(1, 999);
      expect(store.selectedId()).toBeNull();
      expect(store.isFulfilled()).toBeTrue();
      expect(store.processed()).toBeTrue();
    }));

    it('set error after delete and expose error', fakeAsync(() => {
      const httpErr = new HttpErrorResponse({ status: 404, error: { msg: 'not found' } });
      rackService.deleteRack.and.returnValue(throwError(() => httpErr));

      store.deleteRack({ warehouseId: 1, rackId: 999 });
      tick(300);

      expect(rackService.deleteRack).toHaveBeenCalledOnceWith(1, 999);
      expect(store.error()).toEqual({ msg: 'not found' });
      expect(store.isFulfilled()).toBeFalse();
    }));
  });
});
