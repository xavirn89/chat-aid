import { create } from 'zustand';

interface UserStoreState {
  accesToken: string | null;
  setAccessToken: (accessToken: string) => void;

  refreshToken: string | null;
  setRefreshToken: (refreshToken: string) => void;
}

const useStateStore = create<UserStoreState>((set, get) => ({
  accesToken: null,
  setAccessToken: (accessToken: string) => set({ accesToken: accessToken }),

  refreshToken: null,
  setRefreshToken: (refreshToken: string) => set({ refreshToken }),
}));

export default useStateStore;
