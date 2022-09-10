import create, { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

import type { RequestCookies } from '~app/types/cookies';
import { isBrowser } from '~app/utils/common';
import { cookieStorage } from '~app/utils/cookie';

export function createStore<State>(
  setup: StateCreator<State>,
  opts: { version: number; name: string }
) {
  const store = create<State>()(
    persist(setup as any, {
      version: opts.version,
      name: opts.name,
      getStorage: () => cookieStorage,
    })
  );

  function useStore(initialState: Partial<State>) {
    return { ...store(), ...(!isBrowser() ? initialState : {}) };
  }

  function getServerState(cookies: RequestCookies): Partial<State> {
    const { version, state } = JSON.parse(cookies[opts.name] || '{}');
    return opts.version === version ? state : {};
  }

  return { store, useStore, getServerState };
}
