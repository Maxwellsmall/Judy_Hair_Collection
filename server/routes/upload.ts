import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // @ts-expect-error - folder is a valid Cloudinary parameter but missing from type definitions
    folder: 'bridafripride/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { quality: 'auto:good', fetch_format: 'auto' },
    ],
    public_id: () => {
      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      return `product-${uniqueSuffix}`;
    },
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (_req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * POST /api/upload/single
 * Upload single image
 */
router.post('/single', protectAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: (req.file as Express.Multer.File & { filename: string }).filename,
        secureUrl: req.file.path,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error uploading image',
    });
  }
});

/**
 * POST /api/upload/multiple
 * Upload multiple images
 */
router.post('/multiple', protectAdmin, upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
      return;
    }

    const uploadedImages = files.map((file) => ({
      url: file.path,
      publicId: (file as Express.Multer.File & { filename: string }).filename,
      secureUrl: file.path,
    }));

    res.json({
      success: true,
      message: `${files.length} image(s) uploaded successfully`,
      data: {
        images: uploadedImages,
        count: files.length,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error uploading images',
    });
  }
});

/**
 * DELETE /api/upload/:publicId
 * Delete image from Cloudinary
 */
router.delete('/:publicId', protectAdmin, async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;

    // Handle case where publicId could be an array
    const publicIdToDelete = Array.isArray(publicId) ? publicId[0] : publicId;

    const result = await cloudinary.uploader.destroy(publicIdToDelete);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image',
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
    });
  }
});

export default router;
