export enum TEXT_STYLE {
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
  ELECTRIC = 'ELECTRIC',
}
type TitleType = {
  textStyle: TEXT_STYLE;
  name: string;
  cost: number;
  requiremnt?: string;
};

export const LocalTitles: TitleType[] = [
  {
    textStyle: TEXT_STYLE.BRONZE,
    name: 'Competent',
    cost: 10,
    requiremnt: 'Requires Bronze Competent achievement',
  },
  {
    textStyle: TEXT_STYLE.SILVER,
    name: 'Talented',
    cost: 20,
    requiremnt: 'Requires Silver Talented achievement',
  },
  {
    textStyle: TEXT_STYLE.GOLD,
    name: 'Champion',
    cost: 30,
    requiremnt: 'Requires Gold Champion achievement',
  },
  {
    textStyle: TEXT_STYLE.PORTAL,
    name: 'Traveler',
    cost: 150,
    requiremnt: 'Requires Phase Shift achievement',
  },
  {
    textStyle: TEXT_STYLE.SHADOW,
    name: 'Shadow Lord',
    cost: 150,
    requiremnt: 'Requires The Unseen achievement',
  },
  {
    textStyle: TEXT_STYLE.RAINBOW,
    name: 'Brave',
    cost: 150,
    requiremnt: 'Requires Full of Heart achievement',
  },
  {
    textStyle: TEXT_STYLE.VOID,
    name: 'Voidborn',
    cost: 200,
    requiremnt: 'Requires Call of the Void achievement',
  },

  {
    textStyle: TEXT_STYLE.HACKER,
    name: 'Hakcerman',
    cost: 300,
    requiremnt: 'Requires Get Hacked! achievement',
  },
  {
    textStyle: TEXT_STYLE.ICE,
    name: 'Iceborn',
    cost: 400,
    requiremnt: 'Requires Bitefrost achievement',
  },
  {
    textStyle: TEXT_STYLE.FIRE,
    name: 'Pyromancer',
    cost: 400,
    requiremnt: 'Requires Playing with Fire achievement',
  },
  {
    textStyle: TEXT_STYLE.ELECTRIC,
    name: 'Dodge Master',
    cost: 999,
    requiremnt: 'Requires Borrow Time & Overachiever achievements',
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
