import { AUGMENTS } from '../lib/api/specs/api.ts';

export type ScoreRecord = {
  _id: string;
  userId: string;
  userName: string;
  augment: AUGMENTS;
  level: string;
  score: number;
  place?: number;
};
