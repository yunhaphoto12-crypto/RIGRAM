import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  const response = NextResponse.json({ success: true });

  // 쿠키 삭제
  response.cookies.delete('userType');
  response.cookies.delete('schoolId');
  response.cookies.delete('userId');

  return response;
}
