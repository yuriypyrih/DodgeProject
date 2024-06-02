import { Level } from '../level';
import { LEVEL_STATUS } from '../enum/LEVEL_STATUS';
import Game from '../../game/engine/game';
import { Relic } from '../../game/types/Relic.ts';
import { GAME_STATE } from '../../game/enum/game_state';
import { relics } from '../../game/engine/relics/relics_collection';

export const LocalLevels: Level[] = [
  {
    level: 1,
    levelId: 'LVL_1',
    description: 'Scout',
    status: LEVEL_STATUS.LOCKED,
    cost: 0,
  },
  {
    level: 2,
    levelId: 'LVL_2',
    description: 'Speeder',
    status: LEVEL_STATUS.LOCKED,
    cost: 1,
  },
  {
    level: 3,
    levelId: 'LVL_3',
    description: 'Tracer',
    status: LEVEL_STATUS.LOCKED,
    cost: 1,
  },
  {
    level: 4,
    levelId: 'LVL_4',
    description: 'Worm',
    status: LEVEL_STATUS.LOCKED,
    cost: 1,
  },
  {
    level: 5,
    levelId: 'LVL_5',
    description: 'Slime',
    status: LEVEL_STATUS.LOCKED,
    cost: 1,
  },
  {
    level: 6,
    levelId: 'LVL_6',
    description: 'Bomber',
    status: LEVEL_STATUS.LOCKED,
    cost: 1,
  },
  {
    level: 7,
    levelId: 'LVL_7',
    description: 'Venom',
    status: LEVEL_STATUS.LOCKED,
    cost: 1,
  },
  {
    level: 8,
    levelId: 'LVL_8',
    description: 'Marathon.v1',
    status: LEVEL_STATUS.LOCKED,
    cost: 1,
  },
  {
    level: 9,
    levelId: 'LVL_9',
    description: 'Titan',
    status: LEVEL_STATUS.LOCKED,
    cost: 2,
  },
  {
    level: 10,
    levelId: 'LVL_10',
    description: 'Ghost',
    status: LEVEL_STATUS.LOCKED,
    cost: 2,
  },
  {
    level: 11,
    levelId: 'LVL_11',
    description: 'Shadow',
    status: LEVEL_STATUS.LOCKED,
    cost: 2,
  },
  {
    level: 12,
    levelId: 'LVL_12',
    description: 'Glitch',
    status: LEVEL_STATUS.LOCKED,
    cost: 2,
  },
  {
    level: 13,
    levelId: 'LVL_13',
    description: 'Marathon V2',
    status: LEVEL_STATUS.LOCKED,
    cost: 2,
  },
  {
    level: 14,
    levelId: 'LVL_14',
    description: 'Portal',
    status: LEVEL_STATUS.LOCKED,
    cost: 2,
  },
  {
    level: 15,
    levelId: 'LVL_15',
    description: 'Magnet',
    status: LEVEL_STATUS.LOCKED,
    cost: 2,
  },
  {
    level: 16,
    levelId: 'LVL_16',
    description: 'Hacker',
    status: LEVEL_STATUS.LOCKED,
    cost: 2,
  },
  {
    level: 17,
    levelId: 'LVL_17',
    description: 'Inferno',
    status: LEVEL_STATUS.LOCKED,
    cost: 3,
  },
  {
    level: 18,
    levelId: 'LVL_18',
    description: 'Frosty',
    status: LEVEL_STATUS.LOCKED,
    cost: 3,
  },
  {
    level: 19,
    levelId: 'LVL_19',
    description: 'Reaper',
    status: LEVEL_STATUS.LOCKED,
    cost: 3,
  },
  {
    level: 20,
    levelId: 'LVL_20',
    description: 'Voidborn',
    status: LEVEL_STATUS.LOCKED,
    cost: 3,
  },
  {
    level: 21,
    levelId: 'LVL_21',
    description: 'Scorpion',
    status: LEVEL_STATUS.LOCKED,
    cost: 3,
  },
  {
    level: 22,
    levelId: 'LVL_22',
    description: 'Marathon V3',
    status: LEVEL_STATUS.LOCKED,
    cost: 3,
  },
  {
    level: 23,
    levelId: 'LVL_23',
    description: 'Marathon V4',
    status: LEVEL_STATUS.LOCKED,
    cost: 3,
  },
  {
    level: 24,
    levelId: 'LVL_24',
    description: 'Marathon V5',
    status: LEVEL_STATUS.LOCKED,
    cost: 3,
  },
  {
    level: 25,
    levelId: 'LVL_25',
    description: 'Clown Fiesta',
    status: LEVEL_STATUS.LOCKED,
    chaosDungeon: true,
    cost: 10,
  },
  {
    level: 26,
    levelId: 'LVL_26',
    description: 'Vipers Pit',
    status: LEVEL_STATUS.LOCKED,
    chaosDungeon: true,
    cost: 10,
  },
  {
    level: 27,
    levelId: 'LVL_27',
    description: 'Anubis Catacomb',
    status: LEVEL_STATUS.LOCKED,
    chaosDungeon: true,
    cost: 10,
  },
];

type gameSliceType = {
  game: Game | null;
  level: number;
  levels: Level[];
  relics: Relic[];
  selectedRelic: Relic;
  hp: number;
  gameState: GAME_STATE;
  poisoned: boolean;
  progress: {
    max_stars: number;
    total_stars_collected: number;
    star_timers: number[];
  };
};

// @ts-ignore
const initialState: gameSliceType = {
  game: null,
  level: 1,
  levels: LocalLevels,
  relics: relics,
  selectedRelic: relics[1],
  hp: 0,
  gameState: GAME_STATE.PLAYING,
  poisoned: false,
  progress: {
    max_stars: 3,
    total_stars_collected: 0,
    star_timers: [],
  },
};
