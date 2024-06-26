import Game from './game';
import { Relic } from '../types/Relic.ts';
import { XY } from '../types/XY.ts';
import store from '../../redux/store.ts';
import { playAnimation } from 'redux/slices/vfxSlice.ts';
import { VFX } from '../enum/vfx.ts';
import { setSelectedRelic } from 'redux/slices/gameSlice.ts';
import GameObject from './gameObject.ts';
import { COLOR } from '../enum/colors.ts';
import { RELIC_TYPE } from '../enum/relic_type.ts';
import { AUGMENTS } from '../../lib/api/specs/api.ts';
import { getSec } from 'utils/deltaTime.ts';
import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { calculateMissingHp } from 'utils/calculateMissingHp.ts';

type TProps = {
  game: Game;
};

const IMMUNITY_TOTAL: number = 2000;
const GUARDIAN_TOTAL: number = 2000;
const BERSERK_TOTAL: number = 1000;
const PORTAL_STABILIZED_TOTAL: number = 1000;
const STOPWATCH_TOTAL: number = 3000;

const BEACON_DELAY: number = 6000;

const REGEN_INTERVAL_TOTAL: number = 1;

export default class RelicManager {
  private game: Game;
  originalRelic: Relic | null;
  relic: Relic | null;
  available_uses: number;
  fear_animation_timer: number;
  isImmune: boolean;
  isStabilized: boolean;
  tempStabilizedTime: number;
  immunityActivationTime: number;
  guardianActivationTime: number;
  stopwatchActivationTime: number;
  regenIntervalTime: number;
  berserkIsActive: boolean;
  berserkTickTimer: number;
  beaconPlaced: XY | null;
  beaconPlacedTime: number;

  constructor({ game }: TProps) {
    this.game = game;
    this.originalRelic = null;
    this.relic = null;
    this.available_uses = 0;
    this.fear_animation_timer = -1;
    this.isImmune = false;
    this.isStabilized = false;
    this.tempStabilizedTime = 0;
    this.immunityActivationTime = 0;
    this.guardianActivationTime = 0;
    this.stopwatchActivationTime = 0;
    this.regenIntervalTime = 0;
    this.berserkIsActive = false;
    this.berserkTickTimer = 0;
    this.beaconPlaced = null;
    this.beaconPlacedTime = 0;
  }

  assignRelic(relic: Relic | null, saveOriginal: boolean = false) {
    if (saveOriginal) {
      this.originalRelic = this.relic;
    }
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
    if (this.originalRelic) {
      this.relic = this.originalRelic;
      this.originalRelic = null;
    }
    if (this.relic) {
      this.available_uses = this.relic.max_uses;
      this.fear_animation_timer = -1;
      this.isImmune = false;
      this.isStabilized = this.relic.id === AUGMENTS.STABILIZER;
      this.immunityActivationTime = 0;
      this.guardianActivationTime = 0;
      this.stopwatchActivationTime = 0;
      this.regenIntervalTime = 0;
      this.berserkIsActive = false;
      this.berserkTickTimer = 0;
      this.beaconPlaced = null;
      this.game.timeScale = 1;
      this.game.updateTimeCounter = 0;
      this.updateRelic();
    }
  }

  useActiveRelic() {
    const player = this.game.player;
    const healthManager = player.healthManager;
    const afflictionManager = player.afflictionManager;
    const now = this.game.now;

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
        this.game.player.healthManager.health += 15;
        store.dispatch(playAnimation(VFX.PULSE_IMMUNITY));
      }
      if (this.relic.id === AUGMENTS.POISON_CURE) {
        const missingHp = calculateMissingHp(healthManager.health, 5);
        const totalHealing = afflictionManager.poisonConsumed + 5 + missingHp;
        healthManager.health += totalHealing;
        afflictionManager.removePoison();
        afflictionManager.frostIntensity = -60;
        afflictionManager.isDeathmarked = false;
        this.game.darkness = 0;
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
          this.beaconPlacedTime = Date.now();
        } else {
          this.game.gameObjects.forEach((object: GameObject) => {
            // Very forgiving Bounds while recalling for collecting a star
            if (
              this.game.player.collision(
                object.getBounds(),
                { x: (this.beaconPlaced?.x as number) - 40, y: (this.beaconPlaced?.y as number) - 40 },
                105,
              )
            ) {
              if (object.gameObject.id === ENTITY_ID.STAR) {
                player.healthManager.health = 100;
                player.collectStar(object);
              }
            }
          });
          player.gameObject.position.x = this.beaconPlaced.x - 8;
          player.gameObject.position.y = this.beaconPlaced.y - 8;
          if (this.beaconPlacedTime < now - BEACON_DELAY) {
            this.applyFear();
          }
          this.beaconPlaced = null;
        }
      }
      if (this.relic.id === AUGMENTS.STOPWATCH) {
        this.stopwatchActivationTime = Date.now();
        store.dispatch(playAnimation(VFX.PULSE_LIGHT_BLUE));
        const missingHp = calculateMissingHp(healthManager.health, 50);
        healthManager.health += missingHp;
        this.game.player.resetMovement();
      }
    }
  }

  applyFear() {
    const player = this.game.player;
    this.fear_animation_timer = 0;
    player.afflictionManager.frostIntensity = -40;
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
      context.fillRect(this.beaconPlaced.x, this.beaconPlaced.y, 8, 8);

      if (this.beaconPlacedTime < now - BEACON_DELAY) {
        context.strokeStyle = COLOR.ORANGE;
        context.lineWidth = 1;
        context.strokeRect(this.beaconPlaced.x - 4, this.beaconPlaced.y - 4, 16, 16);
        context.beginPath();
        context.rect(
          player.gameObject.position.x - 4,
          player.gameObject.position.y - 4,
          player.gameObject.width + 8,
          player.gameObject.height + 8,
        );
        context.stroke();
      }
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

    // Control Stopwatch
    if (now - this.stopwatchActivationTime < STOPWATCH_TOTAL) {
      this.game.timeScale = 3;
    } else {
      this.game.timeScale = 1;
    }

    // Check if stabilized
    this.isStabilized =
      this.relic?.id === AUGMENTS.STABILIZER ||
      now - this.tempStabilizedTime < PORTAL_STABILIZED_TOTAL ||
      now - this.stopwatchActivationTime < STOPWATCH_TOTAL;

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

    if (this.relic?.id === AUGMENTS.HARVESTER && healthManager.health > 1) {
      healthManager.health = 1;
    }
  }
}
