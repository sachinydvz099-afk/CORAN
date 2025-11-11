import mongoose, { Schema, Document } from 'mongoose';

export interface ICharacter extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  role: string;
  imageUrl?: string;
  imageMetadata?: any;
  metadata?: any;
  voiceStyleId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  imageUrl: { type: String },
  imageMetadata: { type: Schema.Types.Mixed },
  metadata: { type: Schema.Types.Mixed },
  voiceStyleId: { type: Schema.Types.ObjectId, ref: 'VoiceStyle' },
}, {
  timestamps: true,
});

CharacterSchema.index({ projectId: 1 });

export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);
