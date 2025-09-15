import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export enum WithRequestStatusEnum {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
}
export type RequestStatus = WithRequestStatusEnum | HttpErrorResponse;
export type RequestStatusState = { requestStatus: RequestStatus };

export function setPending(): RequestStatusState {
  return { requestStatus: WithRequestStatusEnum.PENDING };
}

export function setFulfilled(): RequestStatusState {
  return { requestStatus: WithRequestStatusEnum.FULFILLED };
}

export function setError(error: HttpErrorResponse): RequestStatusState {
  return { requestStatus: error };
}

export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({
      requestStatus: WithRequestStatusEnum.IDLE,
    }),
    withComputed(({ requestStatus }) => ({
      isPending: computed(
        () => requestStatus() === WithRequestStatusEnum.PENDING,
      ),
      isFulfilled: computed(
        () => requestStatus() === WithRequestStatusEnum.FULFILLED,
      ),
      currentStatus: computed(() => requestStatus()),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    })),
  );
}
