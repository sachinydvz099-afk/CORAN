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

// Guest user for no-auth mode
const guestUser: User = {
  user_id: 'guest',
  email: 'guest@example.com',
  name: 'Guest User',
  subscription_tier: 'free',
  credits_balance: 999999,
};

export const useAuthStore = create<AuthState>()((set) => ({
  token: 'guest-token', // Always authenticated as guest
  user: guestUser,
  setAuth: (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    set({ token, user });
  },
  logout: () => {
    // Do nothing in guest mode
  },
}));
