import { createStore } from '~app/utils/store';

export type HomeSortOrder = 'by-state' | 'by-category' | 'alphabetized';

export type ViewSettingsState = {
  homeSortOrder: HomeSortOrder;
  setHomeSortOrder: (homeSortOrder: HomeSortOrder) => void;
};

const { getServerState, useStore } = createStore<ViewSettingsState>(
  (set) => ({
    homeSortOrder: 'by-state',
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
    { label: 'Määrä', value: 'by-state' },
    { label: 'Kategoria', value: 'by-category' },
    { label: 'Aakkos', value: 'alphabetized' },
  ];
