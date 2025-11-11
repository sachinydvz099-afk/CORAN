import mongoose, { Schema, Document } from 'mongoose';

export interface IBillingRecord extends Document {
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  creditsUsed: number;
  amountCharged: number;
  description?: string;
  createdAt: Date;
}

const BillingRecordSchema = new Schema<IBillingRecord>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  creditsUsed: { type: Number, required: true },
  amountCharged: { type: Number, required: true },
  description: { type: String },
}, {
  timestamps: true,
});

BillingRecordSchema.index({ userId: 1 });

export const BillingRecord = mongoose.model<IBillingRecord>('BillingRecord', BillingRecordSchema);
