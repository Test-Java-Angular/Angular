
import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { PageableType } from '../../../entities';

export const initialFilterState: PageableType = {
  page: 0,
  size: 10,
  sort: 'uuid,desc'
};

export function withSearchFilter() {
  return signalStoreFeature(
    withState<PageableType>(initialFilterState),
    withMethods(store => ({
      setPage(page: number) {
        patchState(store, state => ({ ...state,  page }));
      },
      setSize(size: number) {
        patchState(store, state => ({ ...state, size }));
      },
      setSort(sort: string) {
        patchState(store, state => ({ ...state, sort }));
      },
    })),
  );
}
