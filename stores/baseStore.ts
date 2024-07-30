import { create } from 'zustand';

interface BaseStoreState {
configurationOpen: boolean
  toggleConfigurationOpen: () => void
  setConfigurationOpen: (open: boolean) => void
}

const useBaseStore = create<BaseStoreState>((set, get) => ({
configurationOpen: false,
  toggleConfigurationOpen: () => set({ configurationOpen: !get().configurationOpen }),
  setConfigurationOpen: (open) => set({ configurationOpen: open }),
}));

export default useBaseStore;
