import { withSelectedEntity } from './selected-entity.feature';

describe('withSelectedEntity', () => {

  let store: any;

  beforeEach(() => {

    const fakeEntityMap = () => ({
      '1': { id: 1, name: 'entity1' },
      '2': { id: 2, name: 'entity2' }
    });

    let _selectedEntityId: string | number | null = null;
    const selectedEntityId = () => _selectedEntityId;
    const setSelectedId = (id: string | number | null) => { _selectedEntityId = id; };
    const getSelectedEntity = () => store.entityMap()[_selectedEntityId];

    const computedStore = withSelectedEntity<any>();

    store = {
      ...computedStore,
      entityMap: fakeEntityMap,
      selectedEntityId: selectedEntityId,
      setSelectedId: setSelectedId,
      getSelectedEntity: getSelectedEntity,
    };
  });

  it('getSelectedEntity return null', () => {
    expect(store.getSelectedEntity()).toBeNull();
  });

  it('setSelectedId return entity', () => {
    store.setSelectedId('1');
    const result = store.getSelectedEntity();
    expect(result).toEqual({ id: 1, name: 'entity1' });
  });

  it('getSelectedEntity if id not exist', () => {
    store.setSelectedId('999');
    const result = store.getSelectedEntity();
    expect(result).toBeUndefined();
  });

  it('setSelectedId set to null', () => {
    store.setSelectedId('2');
    expect(store.getSelectedEntity()).toEqual({ id: 2, name: 'entity2' });
    store.setSelectedId(null);
    expect(store.getSelectedEntity()).toBeNull();
  });
});