import { withRequestStatus } from './with-request-status.feature';

enum WithRequestStatusEnum {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED'
}

describe('withRequestStatus', () => {
  let store: any;

  beforeEach(() => {
    // Instanciar y extender el estado simulado
    store = withRequestStatus();
    // Mock interno observable para controlar el estado
    let _requestStatus: any = WithRequestStatusEnum.IDLE;
    store.requestStatus = () => _requestStatus;
    // Helper para cambiar el estado
    store._setStatus = (status: any) => _requestStatus = status;
  });

  it('inicia en estado IDLE', () => {
    expect(store.currentStatus()).toBe(WithRequestStatusEnum.IDLE);
    expect(store.isPending()).toBe(false);
    expect(store.isFulfilled()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('detecta correctamente el estado PENDING', () => {
    store._setStatus(WithRequestStatusEnum.PENDING);
    expect(store.isPending()).toBe(true);
    expect(store.isFulfilled()).toBe(false);
    expect(store.currentStatus()).toBe(WithRequestStatusEnum.PENDING);
    expect(store.error()).toBeNull();
  });

  it('detecta correctamente el estado FULFILLED', () => {
    store._setStatus(WithRequestStatusEnum.FULFILLED);
    expect(store.isPending()).toBe(false);
    expect(store.isFulfilled()).toBe(true);
    expect(store.currentStatus()).toBe(WithRequestStatusEnum.FULFILLED);
    expect(store.error()).toBeNull();
  });

  it('devuelve error cuando el estado es un objeto', () => {
    const errorStatus = { error: 'Ha fallado la petición', code: 500 };
    store._setStatus(errorStatus);
    expect(store.currentStatus()).toBe(errorStatus);
    expect(store.error()).toBe('Ha fallado la petición');
    expect(store.isPending()).toBe(false);
    expect(store.isFulfilled()).toBe(false);
  });

  it('error retorna null si el objeto no tiene error', () => {
    const noErrorStatus = { code: 202 };
    store._setStatus(noErrorStatus);
    expect(store.error()).toBeUndefined();
  });
});