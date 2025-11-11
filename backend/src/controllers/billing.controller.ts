import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getCredits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get this month's stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonthRecords = await prisma.billingRecord.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const creditsUsedThisMonth = thisMonthRecords.reduce(
      (sum, record) => sum + record.creditsUsed,
      0
    );

    const projectsThisMonth = await prisma.project.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    res.json({
      user_id: userId,
      credits_balance: user.creditsBalance,
      projects_this_month: projectsThisMonth,
      credits_used_this_month: creditsUsedThisMonth,
    });
  } catch (error) {
    throw error;
  }
};
