'use client';

import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

interface AuthStore {
  isLogin: boolean;
  user: any | null;
  setUser: (user: any | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  user: null,
  setUser: (user) => set({ user, isLogin: !!user }),
  fetchUser: async () => {
    const { data } = await supabase.auth.getUser();
    set({ user: data.user ?? null, isLogin: true });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isLogin: false });
  },
}));
