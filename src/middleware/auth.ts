import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Interface for JWT payload
interface JWTPayload {
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

// Interface for admin user
interface AdminUser {
  email: string;
  isAdmin: boolean;
}

// JWT Secret
const JWT_SECRET = process.env.SESSION_SECRET || 'judy_hair_collection_session_secret_key_change_in_production_2026';

/**
 * Middleware to verify admin authentication (App Router version)
 */
export const protectAdmin = async (cookieStore: ReturnType<typeof cookies>): Promise<AdminUser | null> => {
  try {
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (!decoded.isAdmin) {
      return null;
    }

    return {
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    };
  } catch {
    return null;
  }
};

/**
 * Generate JWT token for admin user
 */
export const generateAdminToken = (email: string): string => {
  return jwt.sign(
    {
      email,
      isAdmin: true,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};
