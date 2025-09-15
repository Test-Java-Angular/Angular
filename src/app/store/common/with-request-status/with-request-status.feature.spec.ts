import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { patchState, signalStore } from '@ngrx/signals';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
  WithRequestStatusEnum,
} from './with-request-status.feature';

describe('withRequestStatus feature', () => {
  const RequestStatusTestStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withRequestStatus()
  );

  let store: InstanceType<typeof RequestStatusTestStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestStatusTestStore],
    });
    store = TestBed.inject(RequestStatusTestStore);
  });

  it('initialState: idle, no pending, no fulfilled, error = null', () => {
    expect(store.currentStatus()).toBe(WithRequestStatusEnum.IDLE);
    expect(store.isPending()).toBeFalse();
    expect(store.isFulfilled()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('setPending:', () => {
    patchState(store, setPending);
    expect(store.currentStatus()).toBe(WithRequestStatusEnum.PENDING);
    expect(store.isPending()).toBeTrue();
    expect(store.isFulfilled()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('setFulfilled:', () => {
    patchState(store, setFulfilled);
    expect(store.currentStatus()).toBe(WithRequestStatusEnum.FULFILLED);
    expect(store.isPending()).toBeFalse();
    expect(store.isFulfilled()).toBeTrue();
    expect(store.error()).toBeNull();
  });

  it('setError with objet: currentStatus is HttpErrorResponse and error() return payload', () => {
    const httpError = new HttpErrorResponse({
      status: 500,
      error: { message: 'boom' },
    });
    patchState(store, setError(httpError));
    const status = store.currentStatus();
    expect(status).toBe(httpError);
    expect(store.isPending()).toBeFalse();
    expect(store.isFulfilled()).toBeFalse();
    expect(store.error()).toEqual({ message: 'boom' });
  });

  it('setError with string: error() is string', () => {
    const httpError = new HttpErrorResponse({
      status: 400,
      error: 'bad request',
    });
    patchState(store, setError(httpError));
    expect(store.currentStatus()).toBe(httpError);
    expect(store.error()).toBe('bad request');
  });

  it('idemPow: multiple setPending/setFulfilled', () => {
    patchState(store, setPending);
    patchState(store, setPending);
    expect(store.isPending()).toBeTrue();

    patchState(store, setFulfilled);
    patchState(store, setFulfilled);
    expect(store.isFulfilled()).toBeTrue();
  });
});
