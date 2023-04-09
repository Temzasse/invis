import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { create } from 'zustand';

import { type TabId } from './types';
import { useEvent } from '~utils/common';
import { getTab } from './utils';

type TabStacksStore = {
  stacks: Record<TabId, string[]>;
  push: (opts: { tab: TabId; url: string; isRoot: boolean }) => void;
  pop: (tab: TabId) => void;
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
    const newStack = isRoot ? [] : [...stacks[tab], url];
    set({ stacks: { ...stacks, [tab]: newStack } });
  },
  pop: (tab: TabId) => {
    const { stacks } = get();
    const newStack = stacks[tab].slice(0, -1);
    set({ stacks: { ...stacks, [tab]: newStack } });
  },
}));

export function useTabStacks() {
  const { events } = useRouter();
  const { stacks, push } = useTabStacksStore();

  const onRouteChange = useEvent((url: string) => {
    const { tab, isRoot } = getTab(url);

    if (!stacks[tab].includes(url)) {
      push({ tab, url, isRoot });
    }
  });

  useEffect(() => {
    events.on('routeChangeComplete', onRouteChange);

    return () => {
      events.off('routeChangeComplete', onRouteChange);
    };
  }, []); // eslint-disable-line

  return stacks;
}

export function useActiveTab() {
  const { pathname } = useRouter();
  const { tab: activeTab } = getTab(pathname);
  return activeTab;
}
