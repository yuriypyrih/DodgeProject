import Game from './game';
import store from '../../redux/store.ts';
import { playAnimation } from 'redux/slices/vfxSlice.ts';
import { VFX } from '../enum/vfx.ts';
import { setHP } from 'redux/slices/gameSlice.ts';
import { AUGMENTS } from '../../lib/api/specs/api.ts';

type TProps = {
  game: Game;
};

export default class HealthManager {
  private game: Game;
  readonly DEATH_THRESHOLD: number;
  readonly IMMUNITY_IN_MILLISEC: number;
  health: number;
  isImmune: boolean;
  isImmuneSecondary: boolean;
  lastTimeDamaged: number;
  lastTimeDamagedSecondary: number;
  buffered_dmg: number;
  lastWhoDamagedMe: string;

  constructor({ game }: TProps) {
    this.game = game;
    this.DEATH_THRESHOLD = -5;
    this.IMMUNITY_IN_MILLISEC = 1000;
    this.health = 100;
    this.isImmune = false;
    this.isImmuneSecondary = false;
    this.lastTimeDamaged = game.now;
    this.lastTimeDamagedSecondary = game.now;
    this.buffered_dmg = 0;
    this.lastWhoDamagedMe = '';
  }

  takeDamage(
    damage: number,
    options?: {
      isTrueDmg?: boolean;
      callback?: () => void;
      bypassCallback?: () => void;
      disableDefaultPulse?: boolean;
      lastWhoDamagedMe?: string;
      ImmunityShiftInMS?: number;
      isSecondaryDamage?: boolean;
    },
  ) {
    const immunityShit = options && options.ImmunityShiftInMS ? options.ImmunityShiftInMS : 0;
    const CHAOS_EXTRA_DMG = 5;
    const calculatedDmg = this.game.player.isChaosActive ? damage + CHAOS_EXTRA_DMG : damage;

    if (options && options.isSecondaryDamage) {
      if (!this.isImmuneSecondary && !this.game.player.relicManager.isImmune) {
        this.lastTimeDamagedSecondary = this.game.now + immunityShit;
        if (options?.lastWhoDamagedMe) this.lastWhoDamagedMe = options.lastWhoDamagedMe;
        if (options?.isTrueDmg) {
          this.health -= calculatedDmg;
        } else {
          this.buffered_dmg += calculatedDmg;
        }
        if (!options?.disableDefaultPulse) {
          store.dispatch(playAnimation(VFX.PULSE_RED));
        }

        if (options?.callback) {
          options.callback();
        }
      }
    } else {
      if (!this.isImmune && !this.game.player.relicManager.isImmune) {
        this.lastTimeDamaged = this.game.now + immunityShit;
        if (options?.lastWhoDamagedMe) this.lastWhoDamagedMe = options.lastWhoDamagedMe;
        if (options?.isTrueDmg) {
          this.health -= calculatedDmg;
        } else {
          this.buffered_dmg += calculatedDmg;
        }
        if (!options?.disableDefaultPulse) {
          store.dispatch(playAnimation(VFX.PULSE_RED));
        }

        if (options?.callback) {
          options.callback();
        }
      }
    }
    if (options?.bypassCallback) {
      options.bypassCallback();
    }
  }

  reset() {
    this.health = 100;
    this.lastTimeDamaged = Date.now();
    this.buffered_dmg = 0;
  }

  update(_deltaNumber: number) {
    this.health = Math.round(this.health * 10) / 10;
    store.dispatch(setHP(this.health));
    const relicManager = this.game.player.relicManager;
    // Buffer all the dmg that you take into one value and use it at the end of calculations

    // Resetting health if above 100
    if (this.health > 100) this.health = 100;

    // Calculate isImmune
    this.isImmune = this.game.now - this.lastTimeDamaged < this.IMMUNITY_IN_MILLISEC;
    this.isImmuneSecondary = this.game.now - this.lastTimeDamagedSecondary < this.IMMUNITY_IN_MILLISEC;

    //Take the buffered dmg
    if (this.buffered_dmg > 0) {
      if (relicManager.isStabilized) {
        this.health -= this.buffered_dmg * 0.69; // 30% dmg reduction // 31% cuz
      } else if (relicManager.relic?.id === AUGMENTS.REGENERATION) {
        this.health -= this.buffered_dmg * 0.9; // 10% dmg reduction
      } else if (relicManager.berserkIsActive) {
        this.health -= this.buffered_dmg * 0.4; // 60% dmg reduction
      } else if (relicManager.relic?.id === AUGMENTS.DEMON_SOUL) {
        this.health -= this.buffered_dmg * 1.25; // 25% EXTRA dmg
      } else {
        this.health -= this.buffered_dmg;
      }
      this.buffered_dmg = 0;
    }
  }
}
