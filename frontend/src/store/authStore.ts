import { create } from 'zustand';

interface User {
  user_id: string;
  email: string;
  name: string;
  subscription_tier: string;
  credits_balance: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: localStorage.getItem('auth_token'),
  user: null,
  setAuth: (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ token: null, user: null });
  },
}));
