import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import Product from '@models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const categories = await Product.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$categorySlug',
          name: { $first: '$category' },
          slug: { $first: '$categorySlug' },
          count: { $sum: 1 },
          latestImage: { $first: { $arrayElemAt: ['$images', 0] } },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        count: categories.length,
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching categories' },
      { status: 500 }
    );
  }
}
