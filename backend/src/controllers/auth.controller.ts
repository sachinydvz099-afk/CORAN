import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      name,
      subscriptionTier: 'free',
      creditsBalance: 100, // Give 100 free credits
    });

    res.status(201).json({
      user_id: user._id,
      email: user.email,
      name: user.name,
      subscription_tier: user.subscriptionTier,
      credits_balance: user.creditsBalance,
      created_at: user.createdAt,
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      expires_in: 604800, // 7 days in seconds
      user: {
        user_id: user._id,
        email: user.email,
        name: user.name,
        subscription_tier: user.subscriptionTier,
        credits_balance: user.creditsBalance,
      },
    });
  } catch (error) {
    throw error;
  }
};
