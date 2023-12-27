import { createPersistedStore } from '~/utils/store';

export type HomeSortOrder = 'by-state' | 'by-category' | 'alphabetized';

export type ViewSettingsState = {
  homeSortOrder: HomeSortOrder;
  setHomeSortOrder: (homeSortOrder: HomeSortOrder) => void;
};

const { getServerState, useStore } = createPersistedStore<ViewSettingsState>(
  (set) => ({
    homeSortOrder: 'alphabetized',
    setHomeSortOrder: (order: HomeSortOrder) => set({ homeSortOrder: order }),
  }),
  {
    version: 1,
    name: 'viewSettings',
  }
);

export const useViewSettings = useStore;
export const getServerViewSettings = getServerState;
export const HOME_SORT_OPTIONS: Array<{ value: HomeSortOrder; label: string }> =
  [
    { label: 'Aakkos', value: 'alphabetized' },
    { label: 'Kategoria', value: 'by-category' },
    { label: 'Määrä', value: 'by-state' },
  ];
