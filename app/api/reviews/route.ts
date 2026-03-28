import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import Review from '@models/Review';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '6');
    const limit = Math.min(Math.max(1, limitParam), 20);

    await connectDB();

    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: { reviews, count: reviews.length } });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, message: 'Error fetching reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewerName, rating, body: reviewBody } = body;

    if (!reviewerName || rating === undefined || rating === null || !reviewBody) {
      return NextResponse.json(
        { success: false, message: 'reviewerName, rating, and body are required' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    if (reviewBody.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Review body cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    if (reviewerName.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Reviewer name cannot exceed 100 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.create({
      reviewerName,
      rating,
      body: reviewBody,
      approved: false,
    });

    return NextResponse.json({ success: true, data: { review } }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, message: 'Error creating review' }, { status: 500 });
  }
}
