import mongoose, { Schema, Document } from 'mongoose';

export interface IRenderJob extends Document {
  projectId: mongoose.Types.ObjectId;
  jobType: string;
  payload?: any;
  status: string;
  startedAt?: Date;
  completedAt?: Date;
  outputUrl?: string;
  errorMessage?: string;
  createdAt: Date;
}

const RenderJobSchema = new Schema<IRenderJob>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  jobType: { type: String, required: true },
  payload: { type: Schema.Types.Mixed },
  status: { type: String, default: 'queued' },
  startedAt: { type: Date },
  completedAt: { type: Date },
  outputUrl: { type: String },
  errorMessage: { type: String },
}, {
  timestamps: true,
});

RenderJobSchema.index({ projectId: 1 });
RenderJobSchema.index({ status: 1 });

export const RenderJob = mongoose.model<IRenderJob>('RenderJob', RenderJobSchema);
