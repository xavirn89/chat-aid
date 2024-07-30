import { create } from 'zustand'

interface ProvidersStoreState {
  twitchClientID: string | null
  setTwitchClientID: (twitchClientID: string) => void
  resetTwitchClientID: () => void

  twitchClientSecret: string | null
  setTwitchClientSecret: (twitchClientSecret: string) => void
  resetTwitchClientSecret: () => void

  twitchChannel: string | null
  setTwitchChannel: (twitchChannel: string) => void
  resetTwitchChannel: () => void

  twitchAccessToken: string | null
  setTwitchAccessToken: (twitchAccessToken: string) => void
  resetTwitchAccessToken: () => void

  twitchRefreshToken: string | null
  setTwitchRefreshToken: (twitchRefreshToken: string) => void
  resetTwitchRefreshToken: () => void

  openaiKey: string | null
  setOpenaiKey: (openaiKey: string) => void
  resetOpenaiKey: () => void

  openaiModel: string | null
  setOpenaiModel: (openaiModel: string) => void
  resetOpenaiModel: () => void

  chatMessages: string[]
  addChatMessage: (message: string) => void
  resetChatMessages: () => void
}

const useProvidersStore = create<ProvidersStoreState>((set, get) => ({
  twitchClientID: null,
  setTwitchClientID: (twitchClientID) => set({ twitchClientID }),
  resetTwitchClientID: () => set({ twitchClientID: null }),

  twitchClientSecret: null,
  setTwitchClientSecret: (twitchClientSecret) => set({ twitchClientSecret }),
  resetTwitchClientSecret: () => set({ twitchClientSecret: null }),

  twitchChannel: null,
  setTwitchChannel: (twitchChannel) => set({ twitchChannel }),
  resetTwitchChannel: () => set({ twitchChannel: null }),

  twitchAccessToken: null,
  setTwitchAccessToken: (twitchAccessToken) => set({ twitchAccessToken }),
  resetTwitchAccessToken: () => set({ twitchAccessToken: null }),

  twitchRefreshToken: null,
  setTwitchRefreshToken: (twitchRefreshToken) => set({ twitchRefreshToken }),
  resetTwitchRefreshToken: () => set({ twitchRefreshToken: null }),

  openaiKey: null,
  setOpenaiKey: (openaiKey) => set({ openaiKey }),
  resetOpenaiKey: () => set({ openaiKey: null }),

  openaiModel: null,
  setOpenaiModel: (openaiModel) => set({ openaiModel }),
  resetOpenaiModel: () => set({ openaiModel: null }),

  chatMessages: [],
  addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  resetChatMessages: () => set({ chatMessages: [] }),
}))

export default useProvidersStore