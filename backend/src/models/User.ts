import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  subscriptionTier: string;
  creditsBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  subscriptionTier: { type: String, default: 'free' },
  creditsBalance: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', UserSchema);
