import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ProcessType } from '../../../entities';

export const initialProcessStatus: ProcessType = {
  isProcessed: false,
};

export function withProcessStatus() {
  return signalStoreFeature(
    withState<ProcessType>(initialProcessStatus),
    withMethods((store) => ({
      setProcessed(isProcessed: boolean) {
        patchState(store, (state) => ({ ...state, isProcessed }));
      },
      clearProcess() {
        patchState(store, (state) => ({ ...state, isProcessed: false }));
      },
    }))
  );
}
