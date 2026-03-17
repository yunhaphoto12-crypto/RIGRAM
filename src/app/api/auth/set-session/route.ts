import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userType, schoolId, userId } = await request.json();

    const response = NextResponse.json({ success: true });

    // HttpOnly 쿠키 설정 (더 안전함)
    response.cookies.set('userType', userType, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1일
      path: '/',
    });

    response.cookies.set('schoolId', schoolId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    response.cookies.set('userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('세션 설정 오류:', error);
    return NextResponse.json({ error: '세션 설정 실패' }, { status: 500 });
  }
}
