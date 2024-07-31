import { create } from 'zustand'

interface ProvidersStoreState {
  twitchClientID: string | null
  setTwitchClientID: (twitchClientID: string | null) => void
  resetTwitchClientID: () => void

  twitchClientSecret: string | null
  setTwitchClientSecret: (twitchClientSecret: string | null) => void
  resetTwitchClientSecret: () => void

  twitchChannel: string | null
  setTwitchChannel: (twitchChannel: string | null) => void
  resetTwitchChannel: () => void

  twitchAccessToken: string | null
  setTwitchAccessToken: (twitchAccessToken: string | null) => void
  resetTwitchAccessToken: () => void

  twitchRefreshToken: string | null
  setTwitchRefreshToken: (twitchRefreshToken: string | null) => void
  resetTwitchRefreshToken: () => void

  openaiKey: string | null
  setOpenaiKey: (openaiKey: string | null) => void
  resetOpenaiKey: () => void

  openaiModel: string | null
  setOpenaiModel: (openaiModel: string | null) => void
  resetOpenaiModel: () => void

  chatMessages: string[]
  addChatMessage: (message: string) => void
  resetChatMessages: () => void

  updateTime: number
  setUpdateTime: (updateTime: number) => void
  resetUpdateTime: () => void
  increaseUpdateTime: () => void
  decreaseUpdateTime: () => void
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

  openaiModel: 'gpt-3.5-turbo',
  setOpenaiModel: (openaiModel) => set({ openaiModel }),
  resetOpenaiModel: () => set({ openaiModel: null }),

  chatMessages: [],
  addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  resetChatMessages: () => set({ chatMessages: [] }),

  updateTime: 30,
  setUpdateTime: (updateTime) => set({ updateTime }),
  resetUpdateTime: () => set({ updateTime: 30 }),
  increaseUpdateTime: () => set((state) => ({ updateTime: state.updateTime + 1 })),
  decreaseUpdateTime: () => set((state) => ({ updateTime: state.updateTime - 1 })),
}))

export default useProvidersStore
