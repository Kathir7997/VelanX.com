import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('velanx_token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('velanx_token');
        localStorage.removeItem('velanx_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

      // Helper selectors
      isAdmin: () => get().user?.role === 'admin',
      isCustomer: () => get().user?.role === 'customer',
      isDriver: () => get().user?.role === 'driver',
      isWarehouseManager: () => get().user?.role === 'warehouse_manager',
      isAccountant: () => get().user?.role === 'accountant',
      isGeneralManager: () => get().user?.role === 'general_manager',
    }),
    {
      name: 'velanx-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
