import { inject } from '@angular/core';

import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { concatMap, debounceTime, distinctUntilChanged, pipe, tap } from 'rxjs';

import { WarehouseService } from '../../service';
import { PageableType, Warehouse } from '../../entities';
import {
  setError,
  setFulfilled,
  setPending,
  withProcessStatus,
  withRequestStatus,
  withSearchFilter,
  withSelectedEntity,
  withTotalItems,
} from '../common';
import { HttpErrorResponse } from '@angular/common/http';

const initialWarehouseFilterState: PageableType = {
  page: 0,
  size: 5,
  sort: 'uuid,desc',
};

export const WarehouseStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withEntities<Warehouse>(),
  withRequestStatus(),
  withSelectedEntity(),
  withTotalItems(),
  withSearchFilter(),
  withProcessStatus(),
  withMethods((store, warehouseService = inject(WarehouseService)) => ({
    loadAllWarehouses: rxMethod<PageableType>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending)),
        concatMap((filter) =>
          warehouseService.listWarehouses(filter).pipe(
            tapResponse({
              next: (pageResults) => {
                store.setTotal(pageResults.totalElements);
                store.setSize(pageResults.size);
                store.clearProcess();
                patchState(store, setAllEntities(pageResults.content));
                patchState(store, setFulfilled);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, setError(error));
              },
            })
          )
        )
      )
    ),
    deleteWarehouse: rxMethod<number>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending)),
        concatMap((id) =>
          warehouseService.deleteWarehouse(id).pipe(
            tapResponse({
              next: () => {
                store.setProcessed(true);
                patchState(store, setFulfilled);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, setError(error));
              },
            })
          )
        )
      )
    ),
    editWarehouse: rxMethod<Warehouse>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending)),
        concatMap((warehouse) =>
          warehouseService.editWarehouse(warehouse).pipe(
            tapResponse({
              next: (warehouse) => {
                store.setSelectedId(warehouse.id);
                store.setProcessed(true);
                patchState(store, setFulfilled);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, setError(error));
              },
            })
          )
        )
      )
    ),
    addWarehouse: rxMethod<Warehouse>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending)),
        concatMap((warehouse) =>
          warehouseService.addWarehouse(warehouse).pipe(
            tapResponse({
              next: (warehouse) => {
                console.log('Added warehouse:', warehouse);
                store.setProcessed(true);
                patchState(store, setFulfilled);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, setError(error));
              },
            })
          )
        )
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadAllWarehouses(initialWarehouseFilterState);
    },
  })
);
