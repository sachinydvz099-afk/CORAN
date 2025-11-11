import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit = '20', offset = '0', unread_only = 'false' } = req.query;

    const where: any = { userId };
    if (unread_only === 'true') {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.notification.count({ where });

    res.json({
      notifications: notifications.map(n => ({
        notification_id: n.id,
        user_id: n.userId,
        type: n.type,
        payload: n.payload,
        is_read: n.isRead,
        created_at: n.createdAt,
      })),
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({
      notification_id: updated.id,
      is_read: updated.isRead,
    });
  } catch (error) {
    throw error;
  }
};
