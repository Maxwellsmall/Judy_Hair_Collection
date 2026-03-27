import mongoose, { Document, Schema } from 'mongoose';

// Interface for Category document
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  color: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Category Schema
const categorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /^[a-z0-9-]+$/.test(v),
        message: 'Slug must contain only lowercase letters, numbers, and hyphens',
      },
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      required: [true, 'Category color is required'],
      validate: {
        validator: (v: string) => /^#[0-9a-fA-F]{6}$/.test(v),
        message: 'Color must be a valid hex color (e.g. #f59e0b)',
      },
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ name: 1 });

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
