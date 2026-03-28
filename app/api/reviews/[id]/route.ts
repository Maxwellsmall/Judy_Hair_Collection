import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@lib/mongodb';
import Review from '@models/Review';
import { protectAdmin } from '../../../middleware/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const admin = await protectAdmin(cookieStore);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const update: Record<string, unknown> = {};

    if (typeof body.approved === 'boolean') {
      update.approved = body.approved;
    }
    if (typeof body.adminResponse === 'string') {
      update.adminResponse = body.adminResponse;
    }

    await connectDB();

    const review = await Review.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { review } });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, message: 'Error updating review' }, { status: 500 });
  }
}
