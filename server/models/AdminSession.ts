import mongoose, { Document, Schema } from 'mongoose';

// Interface for Admin Session document
export interface IAdminSession extends Document {
  adminEmail: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Admin Session Schema (for managing admin sessions in database if needed)
const adminSessionSchema: Schema<IAdminSession> = new Schema(
  {
    adminEmail: {
      type: String,
      required: [true, 'Admin email is required'],
      trim: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: [true, 'Session token is required'],
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for cleanup queries
adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AdminSession = mongoose.model<IAdminSession>('AdminSession', adminSessionSchema);

export default AdminSession;
