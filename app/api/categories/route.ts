import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import Category from '@models/Category';
import { protectAdmin } from '@middleware/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({}).sort({ name: 1 });
    const count = categories.length;

    return NextResponse.json({
      success: true,
      data: { categories, count },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const admin = await protectAdmin(cookieStore);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name || !body.slug || !body.color) {
      return NextResponse.json(
        { success: false, message: 'name, slug, and color are required' },
        { status: 400 }
      );
    }

    const category = await Category.create(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: { category },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error creating category' },
      { status: 500 }
    );
  }
}
