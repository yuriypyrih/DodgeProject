import mongoose, { Document, Schema } from 'mongoose';
import { LEVELS } from '../data/LEVELS';
import { AUGMENTS } from '../data/AUGMENTS';

interface IScoreRecord extends Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  level: LEVELS;
  augment: AUGMENTS;
  userRank?: number;
}

const scoreRecordSchema: Schema<IScoreRecord> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  augment: {
    type: String,
    required: true
  }
});

export const ScoreRecord = mongoose.model<IScoreRecord>(
  'ScoreRecord',
  scoreRecordSchema
);
