import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v2 as cloudinary } from 'cloudinary';
import { protectAdmin } from '../../../middleware/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const admin = await protectAdmin(cookieStore);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const type = (formData.get('type') as string | null) || 'image';
    const file = (formData.get('file') as File | null) || (formData.get('image') as File | null);

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const isVideo = type === 'video';
    const folder = isVideo ? 'judy-hair/products/videos' : 'judy-hair/categories';
    const resourceType = isVideo ? 'video' : 'image';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: resourceType,
    });

    return NextResponse.json({
      success: true,
      data: { secureUrl: result.secure_url, publicId: result.public_id },
    });
  } catch (err) {
    console.error('Single upload error:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
