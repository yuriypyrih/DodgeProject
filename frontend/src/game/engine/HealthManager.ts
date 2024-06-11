import Game from './game';
import store from '../../redux/store.ts';
import { playAnimation } from '../../redux/slices/vfxSlice.ts';
import { VFX } from '../enum/vfx.ts';
import { setHP } from '../../redux/slices/gameSlice.ts';
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
  lastTimeDamaged: number;
  buffered_dmg: number;
  lastWhoDamagedMe: string;

  constructor({ game }: TProps) {
    this.game = game;
    this.DEATH_THRESHOLD = -5;
    this.IMMUNITY_IN_MILLISEC = 1000;
    this.health = 100;
    this.isImmune = false;
    this.lastTimeDamaged = game.now;
    this.buffered_dmg = 0;
    this.lastWhoDamagedMe = '';
  }

  takeDamage(
    damage: number,
    options?: {
      isTrueDmg?: boolean;
      callback?: () => void;
      disableDefaultPulse?: boolean;
      lastWhoDamagedMe?: string;
      ImmunityShiftInMS?: number;
    },
  ) {
    if (!this.isImmune && !this.game.player.relicManager.isImmune) {
      const immunityShit = options && options.ImmunityShiftInMS ? options.ImmunityShiftInMS : 0;
      this.lastTimeDamaged = this.game.now + immunityShit;
      const CHAOS_EXTRA_DMG = 5;
      const calculatedDmg = this.game.player.isChaosActive ? damage + CHAOS_EXTRA_DMG : damage;
      if (options?.lastWhoDamagedMe) this.lastWhoDamagedMe = options.lastWhoDamagedMe;
      if (options?.isTrueDmg) {
        this.health -= calculatedDmg;
      } else {
        this.buffered_dmg += calculatedDmg;
      }

      // const relic = this.game.player.relicManager.relic;
      // const available_uses = this.game.player.relicManager.available_uses;
      // const hasGuardianAngel = relic && relic.id === AUGMENTS.GUARDIAN_ANGEL && available_uses > 0;
      if (!options?.disableDefaultPulse) {
        store.dispatch(playAnimation(VFX.PULSE_RED));
      }

      if (options?.callback) {
        options.callback();
      }
    }
  }

  reset() {
    this.health = 100;
    this.lastTimeDamaged = Date.now();
    this.buffered_dmg = 0;
  }

  update(_deltaNumber: number) {
    store.dispatch(setHP(this.health));
    const relicManager = this.game.player.relicManager;
    // Buffer all the dmg that you take into one value and use it at the end of calculations

    // Resetting health if above 100
    if (this.health > 100) this.health = 100;

    // Calculate isImmune
    this.isImmune = this.game.now - this.lastTimeDamaged < this.IMMUNITY_IN_MILLISEC;

    //Take the buffered dmg
    if (this.buffered_dmg > 0) {
      if (relicManager.relic?.id === AUGMENTS.STABILIZER) {
        this.health -= this.buffered_dmg * 0.8; // 20% dmg reduction
      } else if (relicManager.relic?.id === AUGMENTS.REGENERATION) {
        this.health -= this.buffered_dmg * 0.9; // 10% dmg reduction
      } else if (relicManager.berserkIsActive) {
        this.health -= this.buffered_dmg * 0.5; // 50% dmg reduction
      } else {
        this.health -= this.buffered_dmg;
      }
      this.buffered_dmg = 0;
    }
  }
}
