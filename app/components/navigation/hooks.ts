import { useRouter } from 'next/router';
import { useEffect } from 'react';
import create from 'zustand';

import type { TabId } from './types';
import { useEvent } from '~app/utils/common';
import { getTab } from './utils';

type TabStacksStore = {
  stacks: Record<TabId, string[]>;
  push: (opts: { tab: TabId; url: string; isRoot: boolean }) => void;
};

export const useTabStacksStore = create<TabStacksStore>((set, get) => ({
  stacks: {
    home: [],
    categories: [],
    shoplist: [],
    settings: [],
  },
  push: ({ tab, url, isRoot }: Parameters<TabStacksStore['push']>[0]) => {
    const { stacks } = get();
    set({
      stacks: {
        ...stacks,
        [tab]: isRoot ? [] : [...stacks[tab], url],
      },
    });
  },
}));

export function useTabStacks() {
  const { events } = useRouter();
  const { stacks, push } = useTabStacksStore();

  const onRouteChange = useEvent((url: string) => {
    const { tab, isRoot } = getTab(url);
    push({ tab, url, isRoot });
  });

  useEffect(() => {
    events.on('routeChangeComplete', onRouteChange);

    return () => {
      events.off('routeChangeComplete', onRouteChange);
    };
  }, []); // eslint-disable-line

  return stacks;
}
