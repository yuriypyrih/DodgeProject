import { ACHIEVEMENT, TITLES } from '../../lib/api/specs/api.ts';

export type TitleType = {
  textStyle: TITLES;
  name: string;
  cost: number;
  requiremnt?: string;
  achievements?: ACHIEVEMENT[];
};
export const LocalTitles: TitleType[] = [
  {
    textStyle: TITLES.BRONZE,
    name: 'Competent',
    cost: 10,
    requiremnt: 'Requires Bronze Competent achievement',
    achievements: [ACHIEVEMENT.BRONZE_COMPETENT],
  },
  {
    textStyle: TITLES.SILVER,
    name: 'Talented',
    cost: 20,
    requiremnt: 'Requires Silver Talented achievement',
    achievements: [ACHIEVEMENT.SILVER_TALENTED],
  },
  {
    textStyle: TITLES.GOLD,
    name: 'Champion',
    cost: 30,
    requiremnt: 'Requires Gold Champion achievement',
    achievements: [ACHIEVEMENT.GOLD_CMAMPION],
  },
  {
    textStyle: TITLES.PORTAL,
    name: 'Traveler',
    cost: 150,
    requiremnt: 'Requires Phase Shift achievement',
    achievements: [ACHIEVEMENT.PHASE_SHIFT],
  },
  {
    textStyle: TITLES.SHADOW,
    name: 'Shadow Lord',
    cost: 150,
    requiremnt: 'Requires The Unseen achievement',
    achievements: [ACHIEVEMENT.THE_UNSEEN],
  },
  {
    textStyle: TITLES.RAINBOW,
    name: 'Brave',
    cost: 150,
    requiremnt: 'Requires Full of Heart achievement',
    achievements: [ACHIEVEMENT.FULL_OF_HEART],
  },
  {
    textStyle: TITLES.VOID,
    name: 'Voidborn',
    cost: 200,
    requiremnt: 'Requires Call of the Void achievement',
    achievements: [ACHIEVEMENT.CALL_OF_THE_VOID],
  },

  {
    textStyle: TITLES.HACKER,
    name: 'Hakcerman',
    cost: 300,
    requiremnt: 'Requires Get Hacked! achievement',
    achievements: [ACHIEVEMENT.GET_HACKED],
  },
  {
    textStyle: TITLES.ICE,
    name: 'Iceborn',
    cost: 400,
    requiremnt: 'Requires Bitefrost achievement',
    achievements: [ACHIEVEMENT.BITEFROST],
  },
  {
    textStyle: TITLES.FIRE,
    name: 'Pyromancer',
    cost: 400,
    requiremnt: 'Requires Playing with Fire achievement',
    achievements: [ACHIEVEMENT.PLAYING_WITH_FIRE],
  },
  {
    textStyle: TITLES.ELECTRIC,
    name: 'Dodge Master',
    cost: 1000,
    requiremnt: 'Requires Borrow Time & Overachiever achievements',
    achievements: [ACHIEVEMENT.BORROW_TIME, ACHIEVEMENT.OVERACHIEVER],
  },
];

type ArenaType = {
  name: string;
  url: string;
  cost: number;
  requiremnt?: string;
};

export const LocalArenas: ArenaType[] = [
  {
    name: 'Arena 1',
    url: 'arena1.png',
    cost: 100,
  },
];
