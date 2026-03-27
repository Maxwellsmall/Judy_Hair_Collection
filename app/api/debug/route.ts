import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ success: true, message: 'DB connected' });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message ?? 'Unknown error',
      code: error?.code,
    }, { status: 500 });
  }
}
