import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  promptText: string;
  targetLengthMinutes: number;
  style: string;
  status: string;
  currentVersionId?: mongoose.Types.ObjectId;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const ProjectSchema = new Schema<IProject>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  promptText: { type: String, required: true },
  targetLengthMinutes: { type: Number, required: true },
  style: { type: String, required: true },
  status: { type: String, default: 'draft' },
  currentVersionId: { type: Schema.Types.ObjectId, ref: 'Version' },
  thumbnailUrl: { type: String },
  completedAt: { type: Date },
}, {
  timestamps: true,
});

ProjectSchema.index({ userId: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
