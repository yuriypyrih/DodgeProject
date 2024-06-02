import Game from './game';
import { COLOR } from '../enum/colors.ts';
import store from '../../redux/store.ts';
import { setPoisoned } from '../../redux/slices/gameSlice.ts';
import GameObject from './gameObject.ts';
import { relics } from './relics/relics_collection.ts';
import { playAnimation, playText } from '../../redux/slices/vfxSlice.ts';
import { VFX } from '../enum/vfx.ts';
import { AUGMENTS } from '../../lib/api/specs/api.ts';

type TProps = {
  game: Game;
};

export default class AfflictionManager {
  private game: Game;
  readonly MAGNET_POWER: number;
  isPoisoned: boolean;
  poisonTimer: number;
  poisonConsumed: 0;
  isHacked: boolean;
  frostIntensity: number;
  isDeathmarked: boolean;
  deathmarkStartTime: number;
  deathmark_aura_radius: number;
  readonly DEATHMARK_AURA_RADIUS_MAX: number;

  constructor({ game }: TProps) {
    this.game = game;
    this.MAGNET_POWER = 7; //Default 9
    this.isHacked = false;
    this.isPoisoned = false;
    this.poisonTimer = Date.now();
    this.poisonConsumed = 0;
    this.frostIntensity = 0;
    this.isDeathmarked = false;
    this.deathmarkStartTime = -1;
    this.DEATHMARK_AURA_RADIUS_MAX = 100;
    this.deathmark_aura_radius = this.DEATHMARK_AURA_RADIUS_MAX;
  }

  reset() {
    this.isHacked = false;
    this.isPoisoned = false;
    this.poisonTimer = Date.now();
    this.poisonConsumed = 0;
    this.frostIntensity = 0;
    this.isDeathmarked = false;
    this.deathmarkStartTime = -1;
    this.deathmark_aura_radius = this.DEATHMARK_AURA_RADIUS_MAX;
  }

  getHacked() {
    if (!this.isHacked) {
      this.isHacked = true;
      const relicManager = this.game.player.relicManager;
      relicManager.isStabilized = false;
      relicManager.berserkIsActive = false;
      relicManager.beaconPlaced = null;

      store.dispatch(playText(['HACKED']));
      store.dispatch(playAnimation(VFX.PULSE_HACKED));
      const foundRelic = relics.find((r) => r.id === AUGMENTS.HACKED);
      if (foundRelic) this.game.player.relicManager.assignRelic(foundRelic);
    }
  }

  getPoisoned(bonusDmg?: number) {
    if (!this.isPoisoned) {
      this.isPoisoned = true;
      store.dispatch(setPoisoned(true));
      store.dispatch(playText(['POISONED']));
      store.dispatch(playAnimation(VFX.PULSE_PURPLE));
    } else if (bonusDmg) {
      this.game.player.healthManager.buffered_dmg += bonusDmg;
    }
  }

  removePoison() {
    this.isPoisoned = false;
    store.dispatch(setPoisoned(false));
  }

  getDeathmarked() {
    if (!this.isDeathmarked) {
      this.isDeathmarked = true;
      this.deathmarkStartTime = Date.now();
      store.dispatch(playText(['DEATHMARKED']));
      store.dispatch(playAnimation(VFX.PULSE_DEATHMARK));
    }
  }

  applyMagneticForce(obj: GameObject, type: 'minus' | 'plus') {
    const player = this.game.player;

    player.getHitByBodyAura(obj, 25, 'Magnet');

    if (this.game.player.relicManager.isStabilized) return null;

    const diffY = Math.ceil(player.gameObject.position.y - (obj.gameObject.position.y + 5));
    const diffX = Math.ceil(player.gameObject.position.x - (obj.gameObject.position.x + 5));
    let distance = Math.ceil(
      Math.sqrt(
        (player.gameObject.position.x - obj.gameObject.position.x) *
          (player.gameObject.position.x - obj.gameObject.position.x) +
          (player.gameObject.position.y - obj.gameObject.position.y) *
            (player.gameObject.position.y - obj.gameObject.position.y),
      ),
    );

    if (distance < 1) distance = 1;

    if (distance < 30) return null;

    const max_distance = 300;
    const force = Math.min((max_distance - distance) / max_distance, 1);

    if (type === 'minus') {
      player.gameObject.position.x += (-this.MAGNET_POWER / distance) * diffX * force;
      player.gameObject.position.y += (-this.MAGNET_POWER / distance) * diffY * force;
    } else {
      player.gameObject.position.x -= (-this.MAGNET_POWER / distance) * diffX * force;
      player.gameObject.position.y -= (-this.MAGNET_POWER / distance) * diffY * force;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    const player = this.game.player;
    const relicManager = player.relicManager;

    if (this.frostIntensity > 0 && !relicManager.isStabilized) {
      let frosty_cube_size = 8;
      if (this.frostIntensity >= 40) {
        frosty_cube_size = 2;
      } else if (this.frostIntensity >= 30) {
        frosty_cube_size = 4;
      } else if (this.frostIntensity >= 20) {
        frosty_cube_size = 6;
      } else if (this.frostIntensity >= 10) {
        frosty_cube_size = 8;
      } else if (this.frostIntensity >= 1) {
        frosty_cube_size = 10;
      }
      context.fillStyle = COLOR.LIGHT_BLUE;
      context.fillRect(
        player.gameObject.position.x + frosty_cube_size,
        player.gameObject.position.y + frosty_cube_size,
        player.gameObject.width - frosty_cube_size * 2,
        player.gameObject.height - frosty_cube_size * 2,
      );
    }
    if (this.isDeathmarked) {
      context.strokeStyle = COLOR.BLACK;
      context.globalAlpha = 0.5;
      context.beginPath();
      context.arc(
        player.gameObject.position.x + player.gameObject.width / 2,
        player.gameObject.position.y + player.gameObject.height / 2,
        Math.max(this.deathmark_aura_radius, 1) / Math.sqrt(2),
        0,
        2 * Math.PI,
      );
      context.stroke();
      context.strokeStyle = COLOR.WHITE;
      context.globalAlpha = 0.3;
      context.beginPath();
      context.arc(
        player.gameObject.position.x + player.gameObject.width / 2,
        player.gameObject.position.y + player.gameObject.height / 2,
        Math.max(this.deathmark_aura_radius, 1) / Math.sqrt(2) + 2,
        0,
        2 * Math.PI,
      );
      context.stroke();
      context.globalAlpha = 1;
    }
  }

  update(_now: number) {
    const player = this.game.player;
    const relicManager = player.relicManager;

    if (this.frostIntensity > 0 && !relicManager.isStabilized && !relicManager.berserkIsActive) {
      if (this.frostIntensity >= 40) {
        player.maxSpeed = 1;
      } else if (this.frostIntensity >= 30) {
        player.maxSpeed = 2;
      } else if (this.frostIntensity >= 20) {
        player.maxSpeed = 3;
      } else if (this.frostIntensity >= 10) {
        player.maxSpeed = 4;
      } else if (this.frostIntensity >= 1) {
        player.maxSpeed = 5;
      }
      this.frostIntensity -= 1;
      player.maxDiagonialSpeed = Math.ceil(player.maxSpeed / Math.sqrt(2));
    } else {
      player.maxSpeed = 6;
      player.maxDiagonialSpeed = Math.ceil(player.maxSpeed / Math.sqrt(2));
    }

    if (this.isDeathmarked) {
      this.deathmark_aura_radius -= 0.2;
      if (this.deathmark_aura_radius < 0) {
        this.isDeathmarked = false;
        this.deathmark_aura_radius = this.DEATHMARK_AURA_RADIUS_MAX;
        if (!relicManager.isImmune) {
          store.dispatch(playAnimation(VFX.PULSE_RED));
          player.healthManager.health = relicManager.relic?.id === AUGMENTS.NIGHT_VISION ? 1 : -10;
          player.healthManager.lastWhoDamagedMe = 'Deathmark';
        }
      }
    }

    this.poisonTimer++;
    if (this.isPoisoned) {
      const freshPoison = Date.now();
      if (freshPoison - this.poisonTimer > 1000) {
        this.poisonTimer = freshPoison;
        if (!relicManager.isImmune) {
          const poisonDmg = relicManager.relic?.id === AUGMENTS.NIGHT_VISION ? 1 : 3;
          this.poisonConsumed += poisonDmg;
          player.healthManager.health -= poisonDmg;
          player.healthManager.lastWhoDamagedMe = 'Poison';
        }
      }
    }
  }
}
