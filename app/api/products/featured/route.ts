import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import Product from '@models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    await connectDB();

    let products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    if (products.length === 0) {
      products = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        products,
        count: products.length,
      },
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching featured products' },
      { status: 500 }
    );
  }
}
