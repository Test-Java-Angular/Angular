import { EntityId, EntityState } from '@ngrx/signals/entities';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';

export type SelectedEntityState = { selectedEntityId: EntityId | null };
export function withSelectedEntity<Entity>() {
  return signalStoreFeature(
    { state: type<EntityState<Entity>>() },
    withState<SelectedEntityState>({ selectedEntityId: null }),
    withComputed(({ entityMap, selectedEntityId }) => ({
      getSelectedEntity: computed(() => {
        const selectedId = selectedEntityId();
        return selectedId ? entityMap()[selectedId] : null;
      }),
    })),
    withMethods(store => ({
      setSelectedId(id: EntityId | null) {
        patchState(store, { selectedEntityId: id });
      },
    })),
  );
}
