import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { generateAdminToken } from '../middleware/auth.js';

const router = Router();

// Rate limiter for login attempts (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/auth/login
 * Admin login endpoint
 */
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    // Check credentials against environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact administrator.',
      });
      return;
    }

    // Validate credentials
    if (email !== adminEmail || password !== adminPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Generate JWT token
    const token = generateAdminToken(email);

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    };

    res.cookie('admin_session', token, cookieOptions);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        email: adminEmail,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    });
  }
});

/**
 * POST /api/auth/logout
 * Admin logout endpoint
 */
router.post('/logout', async (_req: Request, res: Response) => {
  try {
    // Clear the cookie
    res.clearCookie('admin_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch {
    console.error('Logout error');
    res.status(500).json({
      success: false,
      message: 'An error occurred during logout',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current admin session info
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.admin_session;

    if (!token) {
      res.json({
        success: false,
        message: 'No active session',
      });
      return;
    }

    // Decode token to get admin info
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.SESSION_SECRET || 'bridafripride_session_secret_key_change_in_production_2026';

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; isAdmin: boolean };

    res.json({
      success: true,
      data: {
        email: decoded.email,
        isAdmin: decoded.isAdmin,
      },
    });
  } catch {
    res.json({
      success: false,
      message: 'No valid session',
    });
  }
});

export default router;
