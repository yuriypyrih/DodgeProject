export enum ACHIEVEMENTS {
  BRONZE_COMPETENT = 'BRONZE_COMPETENT',
  SILVER_TALENTED = 'SILVER_TALENTED',
  GOLD_CMAMPION = 'GOLD_CMAMPION',
  OVERACHIEVER = 'OVERACHIEVER',
  PHASE_SHIFT = 'PHASE_SHIFT',
  THE_UNSEEN = 'THE_UNSEEN',
  FULL_OF_HEART = 'FULL_OF_HEART',
  TOXIC_SPRITZ = 'TOXIC_SPRITZ',
  NO_ESCAPE = 'NO_ESCAPE',
  LIVING_NIGHTMARE = 'LIVING_NIGHTMARE',
  RESILIENCE = 'RESILIENCE',
  INNER_CONNECTION = 'INNER_CONNECTION',
  BIOHAZARD = 'BIOHAZARD',
  CALL_OF_THE_VOID = 'CALL_OF_THE_VOID',
  PLAYING_WITH_FIRE = 'PLAYING_WITH_FIRE',
  BITEFROST = 'BITEFROST',
  DEATHLESS = 'DEATHLESS',
  GET_HACKED = 'GET_HACKED',
  BORROW_TIME = 'BORROW_TIME',
  LEADER = 'LEADER'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ACHIEVEMENT:
 *       type: string
 *       enum:
 *         - BRONZE_COMPETENT
 *         - SILVER_TALENTED
 *         - GOLD_CMAMPION
 *         - OVERACHIEVER
 *         - PHASE_SHIFT
 *         - THE_UNSEEN
 *         - FULL_OF_HEART
 *         - TOXIC_SPRITZ
 *         - NO_ESCAPE
 *         - LIVING_NIGHTMARE
 *         - RESILIENCE
 *         - INNER_CONNECTION
 *         - BIOHAZARD
 *         - CALL_OF_THE_VOID
 *         - PLAYING_WITH_FIRE
 *         - BITEFROST
 *         - DEATHLESS
 *         - GET_HACKED
 *         - BORROW_TIME
 *         - LEADER
 *       description: Enum representing player achievements
 */

export type AchievementState = {
  name: ACHIEVEMENTS;
  unlocked: boolean;
  reward: number;
};

export type AchievementsMap = {
  [K in ACHIEVEMENTS]: AchievementState;
};

export const ACHIEVEMENTS_OBJECT: AchievementsMap = {
  [ACHIEVEMENTS.BRONZE_COMPETENT]: {
    name: ACHIEVEMENTS.BRONZE_COMPETENT,
    unlocked: false,
    reward: 100
  },
  [ACHIEVEMENTS.SILVER_TALENTED]: {
    name: ACHIEVEMENTS.SILVER_TALENTED,
    unlocked: false,
    reward: 100
  },
  [ACHIEVEMENTS.GOLD_CMAMPION]: {
    name: ACHIEVEMENTS.GOLD_CMAMPION,
    unlocked: false,
    reward: 100
  },
  [ACHIEVEMENTS.OVERACHIEVER]: {
    name: ACHIEVEMENTS.OVERACHIEVER,
    unlocked: false,
    reward: 100
  },

  [ACHIEVEMENTS.THE_UNSEEN]: {
    name: ACHIEVEMENTS.THE_UNSEEN,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.PHASE_SHIFT]: {
    name: ACHIEVEMENTS.PHASE_SHIFT,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.FULL_OF_HEART]: {
    name: ACHIEVEMENTS.FULL_OF_HEART,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.TOXIC_SPRITZ]: {
    name: ACHIEVEMENTS.TOXIC_SPRITZ,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.NO_ESCAPE]: {
    name: ACHIEVEMENTS.NO_ESCAPE,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.LIVING_NIGHTMARE]: {
    name: ACHIEVEMENTS.LIVING_NIGHTMARE,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.RESILIENCE]: {
    name: ACHIEVEMENTS.RESILIENCE,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.INNER_CONNECTION]: {
    name: ACHIEVEMENTS.INNER_CONNECTION,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.BIOHAZARD]: {
    name: ACHIEVEMENTS.BIOHAZARD,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.CALL_OF_THE_VOID]: {
    name: ACHIEVEMENTS.CALL_OF_THE_VOID,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.PLAYING_WITH_FIRE]: {
    name: ACHIEVEMENTS.PLAYING_WITH_FIRE,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.BITEFROST]: {
    name: ACHIEVEMENTS.BITEFROST,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.DEATHLESS]: {
    name: ACHIEVEMENTS.DEATHLESS,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.GET_HACKED]: {
    name: ACHIEVEMENTS.GET_HACKED,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.BORROW_TIME]: {
    name: ACHIEVEMENTS.BORROW_TIME,
    unlocked: false,
    reward: 50
  },
  [ACHIEVEMENTS.LEADER]: {
    name: ACHIEVEMENTS.LEADER,
    unlocked: false,
    reward: 100
  }
};
