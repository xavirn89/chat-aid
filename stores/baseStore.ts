import { create } from 'zustand';

interface UserStoreState {
  customOpenAIKey: string | null
  setCustomOpenAIKey: (key: string | null) => void
}

const useUserStore = create<UserStoreState>((set, get) => ({
  customOpenAIKey: null,
  setCustomOpenAIKey: (key) => set({ customOpenAIKey: key }),
}));

export default useUserStore;
