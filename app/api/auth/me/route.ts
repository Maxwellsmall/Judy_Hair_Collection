import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No active session',
      });
    }

    const JWT_SECRET = process.env.SESSION_SECRET || 'judy_hair_collection_session_secret_key_change_in_production_2026';
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; isAdmin: boolean };

    return NextResponse.json({
      success: true,
      data: {
        email: decoded.email,
        isAdmin: decoded.isAdmin,
      },
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: 'No valid session',
    });
  }
}
