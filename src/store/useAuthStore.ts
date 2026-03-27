import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  role: string
  projectUuid?: string
  exhibitorId?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  expiresAt: number | null
  login: (user: User, expiresIn: number) => void
  logout: () => void
  setHydrated: () => void
  clearExpiredSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      expiresAt: null,
      login: (user, expiresIn) =>
        set({
          user,
          isAuthenticated: true,
          expiresAt: Date.now() + expiresIn * 1000,
        }),
      logout: () => set({ user: null, isAuthenticated: false, expiresAt: null }),
      setHydrated: () => set({ isHydrated: true }),
      clearExpiredSession: () =>
        set((state) => {
          if (!state.expiresAt) {
            return {
              user: null,
              isAuthenticated: false,
              expiresAt: null,
            }
          }

          if (state.expiresAt > Date.now()) {
            return state
          }

          return {
            user: null,
            isAuthenticated: false,
            expiresAt: null,
          }
        }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.clearExpiredSession()
        state?.setHydrated()
      },
    }
  )
)
