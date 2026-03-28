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
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json({ success: false, message: 'No images provided' }, { status: 400 });
    }

    const uploads: { secureUrl: string; publicId: string }[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Use base64 data URI — avoids upload_stream networking issues on Vercel
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: 'judy-hair/products',
        resource_type: 'image',
      });

      uploads.push({ secureUrl: result.secure_url, publicId: result.public_id });
    }

    return NextResponse.json({ success: true, data: { images: uploads, count: uploads.length } });
  } catch (err) {
    console.error('Multiple upload error:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
