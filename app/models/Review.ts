import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  reviewerName: string;
  rating: number;
  body: string;
  approved: boolean;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    reviewerName: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      maxlength: [100, 'Reviewer name cannot exceed 100 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    body: {
      type: String,
      required: [true, 'Review body is required'],
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    adminResponse: {
      type: String,
      trim: true,
      maxlength: [1000, 'Response cannot exceed 1000 characters'],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ approved: 1, createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
