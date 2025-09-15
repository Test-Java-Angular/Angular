import { withSelectedEntity } from './selected-entity.feature';

describe('withSelectedEntity', () => {
  // Creamos un estado simulado similar al behavior de un signalStoreFeature
  let store: any;

  beforeEach(() => {
    // Simulación mínima del almacén y entities
    const fakeEntityMap = () => ({
      '1': { id: 1, name: 'entity1' },
      '2': { id: 2, name: 'entity2' }
    });

    // Agrega signals para selectedEntityId y entityMap
    let _selectedEntityId: string | number | null = null;
    const selectedEntityId = () => _selectedEntityId;
    const setSelectedId = (id: string | number | null) => { _selectedEntityId = id; };

    // Simula la estructura generada por signalStoreFeature
    const computedStore = withSelectedEntity<any>();

    // Mezclamos métodos definidos, simulando el store real
    store = {
      ...computedStore,
      entityMap: fakeEntityMap,
      selectedEntityId: selectedEntityId,
      setSelectedId: setSelectedId
    };
  });

  it('por defecto getSelectedEntity devuelve null', () => {
    expect(store.getSelectedEntity()).toBeNull();
  });

  it('setSelectedId establece la entidad seleccionada', () => {
    store.setSelectedId('1');
    const result = store.getSelectedEntity();
    expect(result).toEqual({ id: 1, name: 'entity1' });
  });

  it('getSelectedEntity devuelve null si el id seleccionado no existe', () => {
    store.setSelectedId('999');
    const result = store.getSelectedEntity();
    expect(result).toBeUndefined(); // porque no existe en entityMap
  });

  it('setSelectedId permite volver a null', () => {
    store.setSelectedId('2');
    expect(store.getSelectedEntity()).toEqual({ id: 2, name: 'entity2' });
    store.setSelectedId(null);
    expect(store.getSelectedEntity()).toBeNull();
  });
});