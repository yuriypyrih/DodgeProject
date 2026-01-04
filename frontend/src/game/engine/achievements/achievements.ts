import { ACHIEVEMENT } from '../../../lib/api/specs/api';

export type AchievementState = {
  name: ACHIEVEMENT;
  unlocked: boolean;
  reward: number;
};

export type AchievementsMap = {
  [K in ACHIEVEMENT]: AchievementState;
};

export const ACHIEVEMENTS: AchievementsMap = {
  [ACHIEVEMENT.BRONZE_COMPETENT]: {
    name: ACHIEVEMENT.BRONZE_COMPETENT,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.SILVER_TALENTED]: {
    name: ACHIEVEMENT.SILVER_TALENTED,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.GOLD_CMAMPION]: {
    name: ACHIEVEMENT.GOLD_CMAMPION,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.OVERACHIEVER]: {
    name: ACHIEVEMENT.OVERACHIEVER,
    unlocked: false,
    reward: 100,
  },

  [ACHIEVEMENT.THE_UNSEEN]: {
    name: ACHIEVEMENT.THE_UNSEEN,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.PHASE_SHIFT]: {
    name: ACHIEVEMENT.PHASE_SHIFT,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.FULL_OF_HEART]: {
    name: ACHIEVEMENT.FULL_OF_HEART,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.TOXIC_SPRITZ]: {
    name: ACHIEVEMENT.TOXIC_SPRITZ,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.NO_ESCAPE]: {
    name: ACHIEVEMENT.NO_ESCAPE,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.LIVING_NIGHTMARE]: {
    name: ACHIEVEMENT.LIVING_NIGHTMARE,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.RESILIENCE]: {
    name: ACHIEVEMENT.RESILIENCE,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.INNER_CONNECTION]: {
    name: ACHIEVEMENT.INNER_CONNECTION,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.BIOHAZARD]: {
    name: ACHIEVEMENT.BIOHAZARD,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.CALL_OF_THE_VOID]: {
    name: ACHIEVEMENT.CALL_OF_THE_VOID,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.PLAYING_WITH_FIRE]: {
    name: ACHIEVEMENT.PLAYING_WITH_FIRE,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.BITEFROST]: {
    name: ACHIEVEMENT.BITEFROST,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.DEATHLESS]: {
    name: ACHIEVEMENT.DEATHLESS,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.GET_HACKED]: {
    name: ACHIEVEMENT.GET_HACKED,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.BORROW_TIME]: {
    name: ACHIEVEMENT.BORROW_TIME,
    unlocked: false,
    reward: 50,
  },
  [ACHIEVEMENT.LEADER]: {
    name: ACHIEVEMENT.LEADER,
    unlocked: false,
    reward: 100,
  },
};
