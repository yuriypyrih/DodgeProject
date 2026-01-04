import Game from 'game/engine/game.ts';
import { ACHIEVEMENTS, AchievementState } from 'game/engine/achievements/achievements.ts';
import store from 'redux/store.ts';
import { addAchievementsToSend } from 'redux/slices/gameSlice.ts';
import { ACHIEVEMENT, AUGMENTS } from '../../lib/api/specs/api.ts';
import { getSec } from 'utils/deltaTime.ts';

type Trackables = {
  hasTakenDmg: boolean;
  phaseShiftLeftButtonPressed: boolean;
  fullOfHeartTimesDroppedBellowThreshold20: number;
  toxicSpritzTotalHeal: number;
  hasSurvived40SecondsInChaosDungeon: boolean;
  numberOfEnemiesScared: number;
  listOfEnemyHit: string[];
  callOfTheVoidWentOutside: boolean;
  totalFireDmg: number;
  numberOfStarsCollectedWhileBeingFrozen: number;
  activatedBerserkBeforeFirstStar: boolean;
  hasBeenHacked: boolean;
  stopwatchUsed: number;
};

type TProps = {
  game: Game;
};

type TrackablesUpdater = Partial<Trackables> | ((prev: Trackables) => Partial<Trackables>);

export default class AchievementManager {
  private readonly game: Game;
  trackables: Trackables;

  constructor({ game }: TProps) {
    this.game = game;
    this.trackables = this.createInitialTrackables();
  }

  updateTrackables(update: TrackablesUpdater) {
    const nextPartial = typeof update === 'function' ? update(this.trackables) : update;

    this.trackables = {
      ...this.trackables,
      ...nextPartial,
    };
  }

  takeHit(id?: string) {
    this.trackables.hasTakenDmg = true;
    if (id && !this.trackables.listOfEnemyHit.includes(id)) {
      this.trackables.listOfEnemyHit.push(id);
    }
  }

  unlock(name: ACHIEVEMENT, evaluateFunc: () => boolean): boolean {
    const achievement = ACHIEVEMENTS[name];
    if (!achievement) return false;

    if (achievement.unlocked) {
      return false;
    }

    if (evaluateFunc()) {
      achievement.unlocked = true;
      this.onAchievementUnlocked(achievement);
      return true;
    }

    return false;
  }
  evaluate(hasVictory?: boolean) {
    const game = this.game;
    const player = this.game.player;
    const selectedRelic = store.getState()?.authSlice.user?.selectedRelic;

    this.unlock(ACHIEVEMENT.THE_UNSEEN, () => {
      return (
        Boolean(hasVictory) &&
        game.level === 11 &&
        !this.trackables.hasTakenDmg &&
        selectedRelic !== AUGMENTS.NIGHT_VISION
      );
    });
    this.unlock(ACHIEVEMENT.PHASE_SHIFT, () => {
      return Boolean(hasVictory) && game.level === 14 && !this.trackables.phaseShiftLeftButtonPressed;
    });
    this.unlock(ACHIEVEMENT.FULL_OF_HEART, () => {
      return (
        Boolean(hasVictory) &&
        selectedRelic === AUGMENTS.HEAL &&
        this.trackables.fullOfHeartTimesDroppedBellowThreshold20 >= 2
      );
    });
    this.unlock(ACHIEVEMENT.TOXIC_SPRITZ, () => {
      return this.trackables.toxicSpritzTotalHeal > 200;
    });
    this.unlock(ACHIEVEMENT.NO_ESCAPE, () => {
      return getSec(this.game.spawner.chaosRoundTimer) >= 72 && this.game.level === 42;
    });
    this.unlock(ACHIEVEMENT.LIVING_NIGHTMARE, () => {
      return this.trackables.numberOfEnemiesScared >= 22;
    });
    this.unlock(ACHIEVEMENT.RESILIENCE, () => {
      return (
        Boolean(hasVictory) &&
        game.level === 31 &&
        selectedRelic === AUGMENTS.MEDITATE &&
        this.trackables.listOfEnemyHit.length >= 4
      );
    });
    this.unlock(ACHIEVEMENT.INNER_CONNECTION, () => {
      return (
        Boolean(hasVictory) &&
        game.level === 32 &&
        !this.trackables.hasTakenDmg &&
        selectedRelic === AUGMENTS.SYMBIOTIC_LINK
      );
    });
    this.unlock(ACHIEVEMENT.BIOHAZARD, () => {
      return Boolean(hasVictory) && game.level === 29 && this.trackables.activatedBerserkBeforeFirstStar;
    });
    this.unlock(ACHIEVEMENT.CALL_OF_THE_VOID, () => {
      return Boolean(hasVictory) && game.level === 20 && !this.trackables.callOfTheVoidWentOutside;
    });
    this.unlock(ACHIEVEMENT.PLAYING_WITH_FIRE, () => {
      return Boolean(hasVictory) && this.trackables.totalFireDmg >= 95;
    });
    this.unlock(ACHIEVEMENT.BITEFROST, () => {
      return Boolean(hasVictory) && game.level === 18 && this.trackables.numberOfStarsCollectedWhileBeingFrozen >= 3;
    });
    this.unlock(ACHIEVEMENT.DEATHLESS, () => {
      return Boolean(hasVictory) && game.level === 19 && selectedRelic === AUGMENTS.HARVESTER;
    });
    this.unlock(ACHIEVEMENT.GET_HACKED, () => {
      return game.level === 25 && player.isChaosActive && player.healthManager.lastWhoDamagedMe === 'Hacker Enemy';
    });
    this.unlock(ACHIEVEMENT.BORROW_TIME, () => {
      return this.trackables.stopwatchUsed >= 4 && player.isChaosActive;
    });
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
      listOfEnemyHit: [],
      callOfTheVoidWentOutside: false,
      totalFireDmg: 0,
      numberOfStarsCollectedWhileBeingFrozen: 0,
      hasSurvived40SecondsInChaosDungeon: false,
      hasBeenHacked: false,
      activatedBerserkBeforeFirstStar: false,
      stopwatchUsed: 0,
    };
  }

  private onAchievementUnlocked(achievement: AchievementState) {
    console.log(`❤️ Achievement unlocked: ${achievement.name} (+${achievement.reward})`);
    store.dispatch(addAchievementsToSend([achievement.name]));
  }
}
