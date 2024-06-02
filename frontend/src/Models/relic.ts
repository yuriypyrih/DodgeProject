import { LEVEL_STATUS } from './enum/LEVEL_STATUS';
import { AUGMENTS } from '../lib/api/specs/api.ts';

export type Relic = {
  name: AUGMENTS;
  status: LEVEL_STATUS;
};
