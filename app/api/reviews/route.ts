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
    let payload: { reviewerName?: unknown; rating?: unknown; body?: unknown };
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { reviewerName, rating, body: reviewBody } = payload;

    if (!reviewerName || rating === undefined || rating === null || !reviewBody) {
      return NextResponse.json(
        { success: false, message: 'reviewerName, rating, and body are required' },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);

    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    const bodyStr = String(reviewBody);
    const nameStr = String(reviewerName);

    if (bodyStr.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Review body cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    if (nameStr.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Reviewer name cannot exceed 100 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.create({
      reviewerName: nameStr,
      rating: ratingNum,
      body: bodyStr,
      approved: false,
    });

    return NextResponse.json({ success: true, data: { review } }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', JSON.stringify(error));
    const message = error instanceof Error ? error.message : 'Error creating review';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
