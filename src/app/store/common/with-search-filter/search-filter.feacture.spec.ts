import { withSearchFilter, initialFilterState } from './search-filter.feature';

describe('withSearchFilter', () => {
  let state: any;
  let store: any;
  beforeEach(() => {
    state = { ...initialFilterState };
    store = withSearchFilter();
    store = { ...store, ...state };
  });

  it('setPage actualiza el page', () => {
    store.setPage(2);
    expect(store.page).toBe(2);
  });

  it('setSize actualiza el size', () => {
    store.setSize(20);
    expect(store.size).toBe(20);
  });

  it('setSort actualiza el sort', () => {
    store.setSort('name,asc');
    expect(store.sort).toBe('name,asc');
  });
});