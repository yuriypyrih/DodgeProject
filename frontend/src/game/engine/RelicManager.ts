import Game from './game';
import { Relic } from '../types/Relic.ts';
import { XY } from '../types/XY.ts';
import store from '../../redux/store.ts';
import { playAnimation } from '../../redux/slices/vfxSlice.ts';
import { VFX } from '../enum/vfx.ts';
import { setSelectedRelic } from '../../redux/slices/gameSlice.ts';
import GameObject from './gameObject.ts';
import { COLOR } from '../enum/colors.ts';
import { RELIC_TYPE } from '../enum/relic_type.ts';
import { AUGMENTS } from '../../lib/api/specs/api.ts';
import { getSec } from '../../utils/deltaTime.ts';

type TProps = {
  game: Game;
};

const IMMUNITY_TOTAL: number = 2000;
const GUARDIAN_TOTAL: number = 2000;
const BERSERK_TOTAL: number = 1000;

const REGEN_INTERVAL_TOTAL: number = 1;

export default class RelicManager {
  private game: Game;
  relic: Relic | null;
  available_uses: number;
  fear_animation_timer: number;
  isImmune: boolean;
  isStabilized: boolean;
  immunityActivationTime: number;
  guardianActivationTime: number;
  regenIntervalTime: number;
  berserkIsActive: boolean;
  berserkTickTimer: number;
  beaconPlaced: XY | null;

  constructor({ game }: TProps) {
    this.game = game;
    this.relic = null;
    this.available_uses = 0;
    this.fear_animation_timer = -1;
    this.isImmune = false;
    this.isStabilized = false;
    this.immunityActivationTime = 0;
    this.guardianActivationTime = 0;
    this.regenIntervalTime = 0;
    this.berserkIsActive = false;
    this.berserkTickTimer = 0;
    this.beaconPlaced = null;
  }

  assignRelic(relic: Relic | null) {
    this.relic = relic;
    if (relic) {
      this.available_uses = relic.max_uses;
      this.updateRelic();
    } else {
      this.available_uses = 0;
    }
  }

  updateRelic() {
    if (this.relic) {
      store.dispatch(
        setSelectedRelic({
          relic: this.relic.id,
          relic_available_uses: this.available_uses,
        }),
      );
    }
  }

  reset() {
    if (this.relic) {
      this.available_uses = this.relic.max_uses;
      this.fear_animation_timer = -1;
      this.isImmune = false;
      this.isStabilized = this.relic.id === AUGMENTS.STABILIZER;
      this.immunityActivationTime = 0;
      this.guardianActivationTime = 0;
      this.regenIntervalTime = 0;
      this.berserkIsActive = false;
      this.berserkTickTimer = 0;
      this.beaconPlaced = null;
      this.updateRelic();
    }
  }

  useActiveRelic() {
    const player = this.game.player;
    const healthManager = player.healthManager;
    const afflictionManager = player.afflictionManager;

    console.log('useActiveRelic ,', this.game.birthday);
    if (this.relic && this.available_uses > 0 && this.relic.type === RELIC_TYPE.ACTIVE) {
      this.available_uses--;
      this.updateRelic();
      if (this.relic.id === AUGMENTS.HEAL) {
        healthManager.health += 35;
        store.dispatch(playAnimation(VFX.PULSE_GREEN));
      }
      if (this.relic.id === AUGMENTS.IMMUNITY) {
        this.immunityActivationTime = Date.now();
        healthManager.health += 10;
        store.dispatch(playAnimation(VFX.PULSE_IMMUNITY));
      }
      if (this.relic.id === AUGMENTS.POISON_CURE) {
        healthManager.health += afflictionManager.poisonConsumed + 15;
        afflictionManager.poisonConsumed = 0;
        afflictionManager.removePoison();
        store.dispatch(playAnimation(VFX.PULSE_GREEN));
      }
      if (this.relic.id === AUGMENTS.FEAR) {
        this.applyFear();
      }
      if (this.relic.id === AUGMENTS.RECALL_BEACON) {
        if (this.beaconPlaced === null) {
          this.beaconPlaced = {
            x: player.gameObject.position.x + 8,
            y: player.gameObject.position.y + 8,
          };
        } else {
          player.gameObject.position.x = this.beaconPlaced.x - 8;
          player.gameObject.position.y = this.beaconPlaced.y - 8;
          this.beaconPlaced = null;
        }
      }
    }
  }

  applyFear() {
    const player = this.game.player;
    this.fear_animation_timer = 0;
    player.afflictionManager.frostIntensity = 0;
    this.game.darkness = 0;
    this.game.gameObjects.forEach((object: GameObject) => {
      if (player.fearCollision(object.getBounds())) {
        object.fear(player.gameObject.position.x + 12, player.gameObject.position.y + 12);
      }
    });
  }

  draw(context: CanvasRenderingContext2D) {
    const player = this.game.player;
    const now = this.game.now;
    if (now - this.immunityActivationTime < IMMUNITY_TOTAL || now - this.guardianActivationTime < GUARDIAN_TOTAL) {
      context.strokeStyle = COLOR.GOLD;
      context.globalAlpha = 0.4;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(
        player.gameObject.position.x + player.gameObject.width / 2,
        player.gameObject.position.y + player.gameObject.height / 2,
        25,
        0,
        2 * Math.PI,
      );
      context.stroke();
      context.globalAlpha = 1;
      context.strokeRect(
        player.gameObject.position.x - 4,
        player.gameObject.position.y - 4,
        player.gameObject.width + 8,
        player.gameObject.height + 8,
      );
      context.lineWidth = 1;
    }
    if (this.fear_animation_timer > -1) {
      context.strokeStyle = COLOR.RED;
      context.globalAlpha = Math.min(1, 1 - this.fear_animation_timer / 300);
      context.beginPath();
      context.arc(
        player.gameObject.position.x + player.gameObject.width / 2,
        player.gameObject.position.y + player.gameObject.height / 2,
        this.fear_animation_timer / Math.sqrt(2),
        0,
        2 * Math.PI,
      );
      context.stroke();
      context.globalAlpha = 1;
    }
    if (this.isStabilized) {
      context.strokeStyle = COLOR.PRIMARY;
      context.beginPath();
      context.rect(
        player.gameObject.position.x - 4,
        player.gameObject.position.y - 4,
        player.gameObject.width + 8,
        player.gameObject.height + 8,
      );
      context.stroke();
    }
    if (this.relic?.id === AUGMENTS.RECALL_BEACON && this.beaconPlaced) {
      context.fillStyle = COLOR.WHITE;
      context.fillRect(this.beaconPlaced.x, this.beaconPlaced.y, 10, 10);
    }
  }

  update(_deltaTime: number) {
    const now = this.game.now;
    const healthManager = this.game.player.healthManager;
    if (this.fear_animation_timer > -1) this.fear_animation_timer += 8;

    // Disable fear animation
    if (this.fear_animation_timer >= 300) this.fear_animation_timer = -1;

    // Check for Immunity
    this.isImmune =
      now - this.immunityActivationTime < IMMUNITY_TOTAL || now - this.guardianActivationTime < GUARDIAN_TOTAL;

    if (this.relic?.id === AUGMENTS.REGENERATION) {
      this.regenIntervalTime++;

      if (getSec(this.regenIntervalTime, 2) > REGEN_INTERVAL_TOTAL) {
        healthManager.health += 2;
        this.regenIntervalTime = 0;
      }
    }

    if (this.berserkIsActive) {
      this.berserkTickTimer++;
      const now = Date.now();
      if (now - this.berserkTickTimer > BERSERK_TOTAL) {
        this.berserkTickTimer = now;
        healthManager.health -= 4;
      }
    }
  }
}
