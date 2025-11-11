import mongoose, { Schema, Document } from 'mongoose';

export interface IScene extends Document {
  projectId: mongoose.Types.ObjectId;
  sceneNumber: number;
  title: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
  status: string;
  storyboardUrl?: string;
  dialogueText?: string;
  characters: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SceneSchema = new Schema<IScene>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  sceneNumber: { type: Number, required: true },
  title: { type: String, required: true },
  startTimeSeconds: { type: Number, required: true },
  endTimeSeconds: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  storyboardUrl: { type: String },
  dialogueText: { type: String },
  characters: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
}, {
  timestamps: true,
});

SceneSchema.index({ projectId: 1, sceneNumber: 1 }, { unique: true });

export const Scene = mongoose.model<IScene>('Scene', SceneSchema);
