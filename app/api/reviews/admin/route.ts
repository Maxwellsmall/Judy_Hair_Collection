import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@lib/mongodb';
import Review from '@models/Review';
import { protectAdmin } from '../../../middleware/auth';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = cookies();
    const admin = await protectAdmin(cookieStore);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const reviews = await Review.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: { reviews, count: reviews.length } });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, message: 'Error fetching reviews' }, { status: 500 });
  }
}
