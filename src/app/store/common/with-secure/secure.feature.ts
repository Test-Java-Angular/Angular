import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';

export type SecureState = {
  isAuth: boolean;
  user: unknown;
};

export function setAuthenticated(user: unknown) {
  return { isAuth: true, user };
}

export function logoutAuth() {
  return { isAuth: false, user: null };
}

export function withSecure() {
  return signalStoreFeature(
    withState<SecureState>({
      isAuth: false,
      user: null,
    }),
    withMethods((store) => ({
      async onLogout(urlAfterLogout?: string): Promise<void> {
        patchState(store, logoutAuth);
      },
      async onLogin(): Promise<void> {
        patchState(store, setAuthenticated({}));
      },
    })),
  );
}
