'use client';

import './globals.css';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/utils/supabase/client';
// import type { Metadata } from 'next';
// import localFont from 'next/font/local';
import { useEffect } from 'react';

// export const metadata: Metadata = {
//   title: 'RIGRAM',
//   description: 'Photobit에서 제작한 학교별 졸업 앨범',
//   icons: {
//     // icon: '/favicon.ico',
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setUser = useAuthStore((state) => state.setUser);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [fetchUser, setUser]);

  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
