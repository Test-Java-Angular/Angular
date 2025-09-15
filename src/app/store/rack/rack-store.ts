import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, debounceTime, distinctUntilChanged, pipe, tap } from 'rxjs';

import { Rack, RackAddType, RackDeleteType, RackSearchType } from '../../entities';
import {
  setError,
  setFulfilled,
  setPending,
  withProcessStatus,
  withRequestStatus,
  withSearchFilter,
  withSelectedEntity
} from '../common';
import { RackService } from '../../service';

export const RackStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withEntities<Rack>(),
  withRequestStatus(),
  withSelectedEntity(),
  withSearchFilter(),
  withProcessStatus(),
  withMethods((store, rackService = inject(RackService)) => ({
    loadAllRacks: rxMethod<RackSearchType>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending)),
        concatMap((filter) =>
          rackService.getRacks(filter.warehouseId, filter.pageable).pipe(
            tapResponse({
              next: (pageResults) => {
                patchState(store, setAllEntities(pageResults.content));
                store.setProcessed(false);
                patchState(store, setFulfilled);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, setError(error));
              }
            })
          )
        )
      )
    ),
    addRack: rxMethod<RackAddType>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending)),
        concatMap(({ warehouseId, rack }) =>
          rackService.addRack(warehouseId, rack).pipe(
            tapResponse({
              next: (rack) => {
                store.setSelectedId(rack.id);
                store.setProcessed(true);
                patchState(store, setFulfilled);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, setError(error));
              }
            })
          )
        )
      )
    ),
    deleteRack: rxMethod<RackDeleteType>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, setPending)),
        concatMap(({ warehouseId, rackId }) =>
          rackService.deleteRack(warehouseId, rackId).pipe(
            tapResponse({
              next: () => {
                store.setProcessed(true);
                store.setSelectedId(null);
                patchState(store, setFulfilled);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, setError(error));
              }
            })
          )
        )
      )
    )
  }))
);
