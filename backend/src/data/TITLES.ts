import { ACHIEVEMENTS } from './ACHIEVEMENTS';

export enum TITLES {
  DEFAULT = 'DEFAULT',
  FIRE = 'FIRE',
  ICE = 'ICE',
  SHADOW = 'SHADOW',
  RAINBOW = 'RAINBOW',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PORTAL = 'PORTAL',
  VOID = 'VOID',
  HACKER = 'HACKER',
  ELECTRIC = 'ELECTRIC'
}
/**
 * @swagger
 * components:
 *   schemas:
 *     TITLES:
 *       type: string
 *       enum:
 *         - DEFAULT
 *         - FIRE
 *         - ICE
 *         - SHADOW
 *         - RAINBOW
 *         - BRONZE
 *         - SILVER
 *         - GOLD
 *         - PORTAL
 *         - VOID
 *         - HACKER
 *         - ELECTRIC
 *       description: Enum representing available player titles
 */

type TitleType = {
  textStyle: TITLES;
  name: string;
  cost: number;
  requiremnt?: string;
  achievements?: ACHIEVEMENTS[];
};

export const LocalTitles: TitleType[] = [
  {
    textStyle: TITLES.DEFAULT,
    name: 'Basic',
    cost: 0,
    requiremnt: '-',
    achievements: []
  },
  {
    textStyle: TITLES.BRONZE,
    name: 'Competent',
    cost: 10,
    requiremnt: 'Requires Bronze Competent achievement',
    achievements: [ACHIEVEMENTS.BRONZE_COMPETENT]
  },
  {
    textStyle: TITLES.SILVER,
    name: 'Talented',
    cost: 20,
    requiremnt: 'Requires Silver Talented achievement',
    achievements: [ACHIEVEMENTS.SILVER_TALENTED]
  },
  {
    textStyle: TITLES.GOLD,
    name: 'Champion',
    cost: 30,
    requiremnt: 'Requires Gold Champion achievement',
    achievements: [ACHIEVEMENTS.GOLD_CMAMPION]
  },
  {
    textStyle: TITLES.PORTAL,
    name: 'Traveler',
    cost: 150,
    requiremnt: 'Requires Phase Shift achievement',
    achievements: [ACHIEVEMENTS.PHASE_SHIFT]
  },
  {
    textStyle: TITLES.SHADOW,
    name: 'Shadow Lord',
    cost: 150,
    requiremnt: 'Requires The Unseen achievement',
    achievements: [ACHIEVEMENTS.THE_UNSEEN]
  },
  {
    textStyle: TITLES.RAINBOW,
    name: 'Brave',
    cost: 150,
    requiremnt: 'Requires Full of Heart achievement',
    achievements: [ACHIEVEMENTS.FULL_OF_HEART]
  },
  {
    textStyle: TITLES.VOID,
    name: 'Voidborn',
    cost: 200,
    requiremnt: 'Requires Call of the Void achievement',
    achievements: [ACHIEVEMENTS.CALL_OF_THE_VOID]
  },

  {
    textStyle: TITLES.HACKER,
    name: 'Hakcerman',
    cost: 300,
    requiremnt: 'Requires Get Hacked! achievement',
    achievements: [ACHIEVEMENTS.GET_HACKED]
  },
  {
    textStyle: TITLES.ICE,
    name: 'Iceborn',
    cost: 400,
    requiremnt: 'Requires Bitefrost achievement',
    achievements: [ACHIEVEMENTS.BITEFROST]
  },
  {
    textStyle: TITLES.FIRE,
    name: 'Pyromancer',
    cost: 400,
    requiremnt: 'Requires Playing with Fire achievement',
    achievements: [ACHIEVEMENTS.PLAYING_WITH_FIRE]
  },
  {
    textStyle: TITLES.ELECTRIC,
    name: 'Dodge Master',
    cost: 1000,
    requiremnt: 'Requires Borrow Time & Overachiever achievements',
    achievements: [ACHIEVEMENTS.BORROW_TIME, ACHIEVEMENTS.OVERACHIEVER]
  }
];
