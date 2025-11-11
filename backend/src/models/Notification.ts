import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  payload?: any;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true,
});

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
