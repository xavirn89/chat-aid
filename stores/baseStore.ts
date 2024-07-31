import { create } from 'zustand'

interface BaseStoreState {
  configurationOpen: boolean
  toggleConfigurationOpen: () => void
  setConfigurationOpen: (open: boolean) => void

  panelOpen: boolean
  togglePanelOpen: () => void
  setPanelOpen: (open: boolean) => void
}

const useBaseStore = create<BaseStoreState>((set, get) => ({
  configurationOpen: true,
  toggleConfigurationOpen: () => set({ configurationOpen: !get().configurationOpen }),
  setConfigurationOpen: (open) => set({ configurationOpen: open }),

  panelOpen: false,
  togglePanelOpen: () => set({ panelOpen: !get().panelOpen }),
  setPanelOpen: (open) => set({ panelOpen: open })
}))

export default useBaseStore
