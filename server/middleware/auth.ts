import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
interface AdminUser {
  email: string;
  isAdmin: boolean;
}

declare module 'express' {
  interface Request {
    adminUser?: AdminUser;
  }
}

// JWT Secret (should be moved to environment variables in production)
const JWT_SECRET = process.env.SESSION_SECRET || 'bridafripride_session_secret_key_change_in_production_2026';

// Interface for JWT payload
interface JWTPayload {
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

/**
 * Middleware to verify admin authentication
 * Checks for JWT token in cookies and validates it
 */
export const protectAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies.admin_session;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Check if user is admin
    if (!decoded.isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
      return;
    }

    // Attach user info to request
    req.adminUser = {
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
    return;
  }
};

/**
 * Optional auth middleware - doesn't fail if no token,
 * but attaches user info if valid token exists
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.admin_session;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      req.adminUser = {
        email: decoded.email,
        isAdmin: decoded.isAdmin,
      };
    }
  } catch {
    // Silently fail - optional auth
  }

  next();
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
      expiresIn: '7d', // 7 days as per specification
    }
  );
};
