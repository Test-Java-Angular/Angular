import { withProcessStatus, initialProcessStatus } from './process-status.feature';

describe('withProcessStatus', () => {
  let store: any;
  beforeEach(() => {
    store = withProcessStatus();
    Object.assign(store, { ...initialProcessStatus });
  });

  it('setProcessed actualiza el estado', () => {
    store.setProcessed(true);
    expect(store.isProcessed).toBe(true);
  });

  it('clearProcess limpia el estado', () => {
    store.setProcessed(true);
    store.clearProcess();
    expect(store.isProcessed).toBe(false);
  });
});