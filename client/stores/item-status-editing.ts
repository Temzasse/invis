import { create } from 'zustand';

type State = {
  isMulti: boolean;
  editable: Set<string>; // which items are editable at the moment
  edited: Record<string, string>; // id -> status
};

type Actions = {
  setIsMulti: (isMulti: boolean) => void;
  toggleItemEditable: (id: string) => void;
  clear: () => void;
};

type Store = State & Actions;

const initialState: State = {
  isMulti: false,
  editable: new Set(),
  edited: {},
};

export const useItemStatusEditing = create<Store>((set, get) => ({
  ...initialState,
  setIsMulti: (isMulti) => {
    set({ isMulti });
  },
  toggleItemEditable: (id) => {
    const editable = new Set(get().editable);
    if (editable.has(id)) {
      editable.delete(id);
    } else {
      editable.add(id);
    }
    set({ editable });
  },
  clear: () => {
    set({ ...initialState });
  },
}));
