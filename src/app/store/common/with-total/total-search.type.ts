import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export type TotalEntitiesState = { totalItems: number };
export const initialTotalState: TotalEntitiesState = { totalItems: 0 };

export function withTotalItems() {
  return signalStoreFeature(
    withState<TotalEntitiesState>(initialTotalState),
    withMethods(store => ({
      setTotal(totalItems: number) {
        patchState(store, () => ({ totalItems }));
      },
    })),
  );
}
