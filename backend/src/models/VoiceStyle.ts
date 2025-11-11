import mongoose, { Schema, Document } from 'mongoose';

export interface IVoiceStyle extends Document {
  name: string;
  language: string;
  accent: string;
  description?: string;
  sampleUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VoiceStyleSchema = new Schema<IVoiceStyle>({
  name: { type: String, required: true },
  language: { type: String, required: true },
  accent: { type: String, required: true },
  description: { type: String },
  sampleUrl: { type: String },
}, {
  timestamps: true,
});

export const VoiceStyle = mongoose.model<IVoiceStyle>('VoiceStyle', VoiceStyleSchema);
