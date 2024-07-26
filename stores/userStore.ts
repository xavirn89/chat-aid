import { create } from 'zustand';

interface UserStoreState {
  user: any;
  setUser: (user: any) => void;

  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
}

const useUserStore = create<UserStoreState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),

  isLogged: false,
  setIsLogged: (isLogged) => set({ isLogged }),
}));

export default useUserStore;
