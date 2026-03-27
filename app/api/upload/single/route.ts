import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v2 as cloudinary } from 'cloudinary';
import { protectAdmin } from '../../../middleware/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const admin = await protectAdmin(cookieStore);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No image provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'judy-hair/categories', resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result as { secure_url: string; public_id: string });
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      data: { secureUrl: result.secure_url, publicId: result.public_id },
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
