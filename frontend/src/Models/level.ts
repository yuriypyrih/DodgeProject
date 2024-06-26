import { LEVEL_STATUS } from './enum/LEVEL_STATUS';

export type Level = {
  level: number;
  description: string;
  status: LEVEL_STATUS;
  levelId: string;
  cost: number;
  chaosDungeon?: boolean;
};
