// Unique IDs for all achievements
import Game from 'game/engine/game.ts';

export enum ACHIEVEMENT {
  BRONZE_COMPETENT = 'BRONZE_COMPETENT',
  SILVER_TALENTED = 'SILVER_TALENTED',
  GOLD_ACHIEVER = 'GOLD_ACHIEVER',
  OVERACHIEVER = 'OVERACHIEVER',
  PHASE_SHIFT = 'PHASE_SHIFT',
  THE_UNSEEN = 'THE_UNSEEN',
  FULL_OF_HEART = 'FULL_OF_HEART',
  TOXIC_SPRITZ = 'TOXIC_SPRITZ',
  NO_ESCAPE = 'NO_ESCAPE',
  LIVING_NIGHTMARE = 'LIVING_NIGHTMARE',
  PERSEVIARANCE = 'PERSEVIARANCE',
  INNER_CONNECTION = 'INNER_CONNECTION',
  MUTATION_JUNKIE = 'MUTATION_JUNKIE',
  CALL_OF_THE_VOID = 'CALL_OF_THE_VOID',
  PLAYING_WITH_FIRE = 'PLAYING_WITH_FIRE',
  BITEFROST = 'BITEFROST',
  DEATHLESS = 'DEATHLESS',
  GET_HACKED = 'GET_HACKED',
  BORROW_TIME = 'BORROW_TIME',
  LEADER = 'LEADER',
}
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
    reward: 10,
  },
  [ACHIEVEMENT.SILVER_TALENTED]: {
    name: ACHIEVEMENT.SILVER_TALENTED,
    unlocked: false,
    reward: 20,
  },
  [ACHIEVEMENT.GOLD_ACHIEVER]: {
    name: ACHIEVEMENT.GOLD_ACHIEVER,
    unlocked: false,
    reward: 30,
  },
  [ACHIEVEMENT.OVERACHIEVER]: {
    name: ACHIEVEMENT.OVERACHIEVER,
    unlocked: false,
    reward: 100,
  },

  [ACHIEVEMENT.THE_UNSEEN]: {
    name: ACHIEVEMENT.THE_UNSEEN,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.PHASE_SHIFT]: {
    name: ACHIEVEMENT.PHASE_SHIFT,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.FULL_OF_HEART]: {
    name: ACHIEVEMENT.FULL_OF_HEART,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.TOXIC_SPRITZ]: {
    name: ACHIEVEMENT.TOXIC_SPRITZ,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.NO_ESCAPE]: {
    name: ACHIEVEMENT.NO_ESCAPE,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.LIVING_NIGHTMARE]: {
    name: ACHIEVEMENT.LIVING_NIGHTMARE,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.PERSEVIARANCE]: {
    name: ACHIEVEMENT.PERSEVIARANCE,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.INNER_CONNECTION]: {
    name: ACHIEVEMENT.INNER_CONNECTION,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.MUTATION_JUNKIE]: {
    name: ACHIEVEMENT.MUTATION_JUNKIE,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.CALL_OF_THE_VOID]: {
    name: ACHIEVEMENT.CALL_OF_THE_VOID,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.PLAYING_WITH_FIRE]: {
    name: ACHIEVEMENT.PLAYING_WITH_FIRE,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.BITEFROST]: {
    name: ACHIEVEMENT.BITEFROST,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.DEATHLESS]: {
    name: ACHIEVEMENT.DEATHLESS,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.GET_HACKED]: {
    name: ACHIEVEMENT.GET_HACKED,
    unlocked: false,
    reward: 100,
  },
  [ACHIEVEMENT.BORROW_TIME]: {
    name: ACHIEVEMENT.BORROW_TIME,
    unlocked: false,
    reward: 100,
  },

  [ACHIEVEMENT.LEADER]: {
    name: ACHIEVEMENT.LEADER,
    unlocked: false,
    reward: 200,
  },
};

type Trackables = {
  hasTakenDmg: boolean;
  phaseShiftLeftButtonPressed: boolean;
  fullOfHeartTimesDroppedBellowThreshold20: number;
  toxicSpritzTotalHeal: number;
  numberOfEnemiesScared: number;
  meditationTotalHeal: number;
  callOfTheVoidWentOutside: boolean;
  totalFireDmg: number;
  numberOfStarsCollectedWhileBeingFrozen: number;
  hasBeenHacked: boolean;
  stopwatchUsed: number;
};

type TProps = {
  game: Game;
};

export default class AchievementManager {
  private game: Game;
  trackables: Trackables;

  constructor({ game }: TProps) {
    this.game = game;
    this.trackables = this.createInitialTrackables();
  }

  updateTrackables(partial: Partial<Trackables>) {
    this.trackables = {
      ...this.trackables,
      ...partial,
    };
  }
  unlock(name: ACHIEVEMENT): boolean {
    const achievement = ACHIEVEMENTS[name];
    if (!achievement) return false;

    if (achievement.unlocked) {
      return false;
    }

    achievement.unlocked = true;
    this.onAchievementUnlocked(achievement);
    return true;
  }
  evaluate() {
    const game = this.game;
    // if (this.game.> 0) {
    //   this.unlock(ACHIEVEMENT.FIRST_KILL);
    // }

    // if (this.trackables.damageTaken === 0) {
    //   this.unlock(ACHIEVEMENT.NO_HIT_LEVEL);
    // }
  }

  reset() {
    this.trackables = this.createInitialTrackables();
  }

  private createInitialTrackables(): Trackables {
    return {
      hasTakenDmg: false,
      phaseShiftLeftButtonPressed: false,
      fullOfHeartTimesDroppedBellowThreshold20: 0,
      toxicSpritzTotalHeal: 0,
      numberOfEnemiesScared: 0,
      meditationTotalHeal: 0,
      callOfTheVoidWentOutside: false,
      totalFireDmg: 0,
      numberOfStarsCollectedWhileBeingFrozen: 0,
      hasBeenHacked: false,
      stopwatchUsed: 0,
    };
  }

  private onAchievementUnlocked(achievement: AchievementState) {
    console.log(`Achievement unlocked: ${achievement.name} (+${achievement.reward})`);
  }
}
