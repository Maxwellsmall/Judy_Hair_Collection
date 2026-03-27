import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import Product from '@models/Product';
import { protectAdmin } from '@middleware/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const admin = await protectAdmin(cookieStore);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    if (typeof body.featured !== 'boolean') {
      return NextResponse.json(
        { success: false, message: '`featured` must be a boolean' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      { featured: body.featured },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product featured status updated',
      data: { product },
    });
  } catch (error) {
    console.error('Error updating featured status:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating featured status' },
      { status: 500 }
    );
  }
}
