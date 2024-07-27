import { create } from 'zustand'

interface TwitchStoreState {
  twitchClientID: string | null
  setTwitchClientID: (twitchClientID: string) => void
  resetTwitchClientID: () => void

  twitchClientSecret: string | null
  setTwitchClientSecret: (twitchClientSecret: string) => void
  resetTwitchClientSecret: () => void

  channel: string | null
  setChannel: (channel: string) => void
  resetChannel: () => void

  accessToken: string | null
  setAccessToken: (accessToken: string) => void
  resetAccessToken: () => void

  refreshToken: string | null
  setRefreshToken: (refreshToken: string) => void
  resetRefreshToken: () => void

  chatMessages: string[]
  addChatMessage: (message: string) => void
  resetChatMessages: () => void
}

const useTwitchStore = create<TwitchStoreState>((set, get) => ({
  twitchClientID: null,
  setTwitchClientID: (twitchClientID) => set({ twitchClientID }),
  resetTwitchClientID: () => set({ twitchClientID: null }),

  twitchClientSecret: null,
  setTwitchClientSecret: (twitchClientSecret) => set({ twitchClientSecret }),
  resetTwitchClientSecret: () => set({ twitchClientSecret: null }),

  channel: null,
  setChannel: (channel) => set({ channel }),
  resetChannel: () => set({ channel: null }),

  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  resetAccessToken: () => set({ accessToken: null }),

  refreshToken: null,
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  resetRefreshToken: () => set({ refreshToken: null }),

  chatMessages: [],
  addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  resetChatMessages: () => set({ chatMessages: [] }),
}))

export default useTwitchStore