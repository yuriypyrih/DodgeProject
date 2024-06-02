import { ENTITY_ID } from '../enum/entitiy_id';
import { COLOR } from '../enum/colors';
import GameObject from './gameObject';
import Game from './game';
import { Rectangle } from '../types/Rectangle';
import store from '../../redux/store';
import Trail from './trail';
import { playAnimation, playText } from '../../redux/slices/vfxSlice';
import { VFX } from '../enum/vfx';
import HealthManager from './HealthManager.ts';
import AfflictionManager from './AfflictionManager.ts';
import RelicManager from './RelicManager.ts';
import { AUGMENTS } from '../../lib/api/specs/api.ts';

type PlayerProps = {
  game: Game;
};

export default class Player extends GameObject {
  game: Game;
  healthManager: HealthManager;
  afflictionManager: AfflictionManager;
  relicManager: RelicManager;
  stars: number;
  milestone: boolean;
  maxSpeed: number;
  maxDiagonialSpeed: number;
  isChaosActive: boolean;
  developerMode: boolean;

  constructor({ game }: PlayerProps) {
    super({
      id: ENTITY_ID.PLAYER,
      width: 25,
      height: 25,
      position: {
        x: 0,
        y: 0,
      },
      velY: 0,
      velX: 0,
    });
    this.game = game;
    this.healthManager = new HealthManager({ game });
    this.afflictionManager = new AfflictionManager({ game });
    this.relicManager = new RelicManager({ game });
    this.stars = 0;
    this.milestone = false;
    this.developerMode = false;
    this.isChaosActive = false;

    this.gameObject.position = {
      x: game.canvas.canvasWidth / 2 - this.gameObject.width / 2,
      y: game.canvas.canvasHeight / 2 - this.gameObject.height / 2,
    };

    this.maxSpeed = 6;
    this.maxDiagonialSpeed = Math.ceil(this.maxSpeed / Math.sqrt(2));
  }

  moveLeft() {
    this.gameObject.velX = -this.maxSpeed;
  }

  moveRight() {
    this.gameObject.velX = this.maxSpeed;
  }

  moveUp() {
    this.gameObject.velY = -this.maxSpeed;
  }

  moveDown() {
    this.gameObject.velY = this.maxSpeed;
  }

  stopX() {
    this.gameObject.velX = 0;
  }

  stopY() {
    this.gameObject.velY = 0;
  }

  reset() {
    this.gameObject.position = {
      x: this.game.canvas.canvasWidth / 2 - this.gameObject.width / 2,
      y: this.game.canvas.canvasHeight / 2 - this.gameObject.height / 2,
    };
    this.stars = 0;
    this.milestone = false;
    this.isChaosActive = false;
    this.healthManager.reset();
    this.relicManager.reset();
    this.afflictionManager.reset();
  }

  getBounds() {
    const rectangle: Rectangle = {
      x: this.gameObject.position.x,
      y: this.gameObject.position.y,
      width: this.gameObject.width,
      height: this.gameObject.height,
    };
    return rectangle;
  }

  fear() {
    // DO nothing
  }

  collision(rectangle: Rectangle) {
    // collision detected!
    if (
      this.gameObject.position.x < rectangle.x + rectangle.width &&
      this.gameObject.position.x + this.gameObject.width > rectangle.x &&
      this.gameObject.position.y < rectangle.y + rectangle.height &&
      this.gameObject.position.y + this.gameObject.height > rectangle.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  fearCollision(rectangle: Rectangle) {
    const FEAR_RANGE = 380;
    // collision detected!
    if (
      this.gameObject.position.x - FEAR_RANGE < rectangle.x + rectangle.width &&
      this.gameObject.position.x + this.gameObject.width + FEAR_RANGE > rectangle.x &&
      this.gameObject.position.y - FEAR_RANGE < rectangle.y + rectangle.height &&
      this.gameObject.position.y + this.gameObject.height + FEAR_RANGE > rectangle.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  victoryConditionCheck() {
    const maxStars = this.game.spawner.levelStars[this.game.level - 1];
    if (this.stars >= maxStars.length) {
      this.game.dispatchVictory(this.stars);
      return true;
    } else {
      return false;
    }
  }

  defeatConditionCheck() {
    if (this.healthManager.health <= this.healthManager.DEATH_THRESHOLD) {
      // Berserk Relic
      const relic = this.relicManager.relic;
      if (relic && relic.id === AUGMENTS.BERSERK && this.relicManager.available_uses > 0) {
        store.dispatch(playText(['BERSERK']));
        this.healthManager.health = 100;
        this.relicManager.berserkIsActive = true;
        this.relicManager.berserkTickTimer = this.game.now;
        this.afflictionManager.frostIntensity = 0;
        this.game.darkness = 0;
        this.relicManager.available_uses--;
        this.relicManager.updateRelic();
        this.relicManager.applyFear();
        return false;
      }

      //Guardian Angel Relic
      else if (relic && relic.id === AUGMENTS.GUARDIAN_ANGEL && this.relicManager.available_uses > 0) {
        store.dispatch(playText(['GUARDIAN ANGEL']));
        store.dispatch(playAnimation(VFX.PULSE_IMMUNITY));
        this.healthManager.health = 25;
        this.relicManager.guardianActivationTime = this.game.now;
        this.afflictionManager.removePoison();
        this.afflictionManager.frostIntensity = 0;
        this.game.darkness = 0;
        this.relicManager.available_uses--;
        this.relicManager.updateRelic();
        return false;
      } else if (!this.developerMode) {
        // store.dispatch(setGameState(GAME_STATE.PAGE_DEFEAT));
        // this.game.close();
        this.game.dispatchDefeat(this.stars);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = COLOR.WHITE;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
    this.afflictionManager.draw(context);
    this.relicManager.draw(context);
  }

  update(_deltaTime: number) {
    this.healthManager.update(_deltaTime);
    this.afflictionManager.update(_deltaTime);
    this.relicManager.update(_deltaTime);

    if (this.victoryConditionCheck()) return null;
    if (this.defeatConditionCheck()) return null;

    if (this.gameObject.velX !== 0 && this.gameObject.velY !== 0) {
      this.gameObject.velX > 0
        ? (this.gameObject.velX = this.maxDiagonialSpeed)
        : (this.gameObject.velX = this.maxDiagonialSpeed * -1);
      this.gameObject.velY > 0
        ? (this.gameObject.velY = this.maxDiagonialSpeed)
        : (this.gameObject.velY = this.maxDiagonialSpeed * -1);
    }

    // Updating the Player's position based on its velocity
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    // Creating a Trail particle and add it to the list
    this.game.particleObjects.push(
      new Trail({
        x: this.gameObject.position.x,
        y: this.gameObject.position.y,
        reductor: 0,
        color: this.afflictionManager.frostIntensity > 0 ? COLOR.LIGHT_BLUE : COLOR.WHITE,
        width: this.gameObject.width,
        height: this.gameObject.height,
        life: 0.2,
        minus: 0.03,
        game: this.game,
      }),
    );

    this.game.gameObjects.forEach((object: GameObject) => {
      if (this.collision(object.getBounds())) {
        // You're immune to dmg when healed
        if (object.gameObject.id === ENTITY_ID.STAR) {
          this.stars++;
          //IMPORTANT: First update the stars and then the hudProgress
          store.dispatch(playAnimation(VFX.PULSE_GOLD));
          this.game.spawner.updateHudProgress();
          this.game.gameObjects.splice(this.game.gameObjects.indexOf(object), 1);
          this.milestone = true;
          this.healthManager.lastTimeDamaged = this.game.now;
        }

        if (object.gameObject.id === ENTITY_ID.BASIC_ENEMY) {
          this.healthManager.takeDamage(25, { lastWhoDamagedMe: object.constructor.name });
        }

        if (object.gameObject.id === ENTITY_ID.REAPER) {
          this.healthManager.takeDamage(0, {
            disableDefaultPulse: true,
            callback: () => this.afflictionManager.getDeathmarked(),
          });
        }

        if (
          object.gameObject.id === ENTITY_ID.BOSS ||
          object.gameObject.id === ENTITY_ID.TITAN_BOSS ||
          object.gameObject.id === ENTITY_ID.SHADOW_BOSS
        ) {
          this.healthManager.takeDamage(40, { lastWhoDamagedMe: 'Boss' });
        }

        if (object.gameObject.id === ENTITY_ID.EXPLOSION) {
          this.healthManager.takeDamage(45, { isTrueDmg: true, lastWhoDamagedMe: 'Explosion' });
        }
        if (object.gameObject.id === ENTITY_ID.INFERNO_WALL) {
          this.healthManager.takeDamage(10, { isTrueDmg: true, lastWhoDamagedMe: 'Firewall', ImmunityShiftInMS: -500 });
        }
        if (object.gameObject.id === ENTITY_ID.FROSTY) {
          this.getHitByBodyAura(object, 25, 'Frosty Enemy');
          if (!this.relicManager.berserkIsActive) this.afflictionManager.frostIntensity += 2;
        }
        if (object.gameObject.id === ENTITY_ID.FROSTY_BULLET) {
          this.healthManager.takeDamage(10, {
            lastWhoDamagedMe: 'Bullet',
            callback: () => {
              this.afflictionManager.frostIntensity = 160;
              this.game.gameObjects.splice(this.game.gameObjects.indexOf(object), 1);
            },
          });
        }
        if (object.gameObject.id === ENTITY_ID.BULLET) {
          this.healthManager.takeDamage(10, {
            lastWhoDamagedMe: 'Bullet',
            callback: () => {
              this.game.gameObjects.splice(this.game.gameObjects.indexOf(object), 1);
            },
          });
        }
        if (object.gameObject.id === ENTITY_ID.VENOM) {
          this.healthManager.takeDamage(10, {
            lastWhoDamagedMe: 'Venom Enemy',
            disableDefaultPulse: !this.afflictionManager.isPoisoned,
            callback: () => this.afflictionManager.getPoisoned(20),
          });
        }
        if (object.gameObject.id === ENTITY_ID.HACKER) {
          this.healthManager.takeDamage(25, {
            disableDefaultPulse: true,
            lastWhoDamagedMe: 'Hacker Enemy',
            callback: () => {
              if (!this.afflictionManager.isHacked) {
                this.afflictionManager.getHacked();
              }
            },
          });
        }

        if (object.gameObject.id === ENTITY_ID.VENOM_BULLET) {
          this.healthManager.takeDamage(15, {
            disableDefaultPulse: !this.afflictionManager.isPoisoned,
            lastWhoDamagedMe: 'Bullet',
            callback: () => {
              this.afflictionManager.getPoisoned();
              this.game.gameObjects.splice(this.game.gameObjects.indexOf(object), 1);
            },
          });
        }

        if (object.gameObject.id === ENTITY_ID.SHADOW_AURA) {
          this.getHitByBodyAura(object, 25, 'Shadow Enemy');
          if (!this.relicManager.berserkIsActive) this.game.pumpDarkness(2);
        }

        if (object.gameObject.id === ENTITY_ID.MAGNET_AURA_PLUS) {
          this.afflictionManager.applyMagneticForce(object, 'plus');
        }
        if (object.gameObject.id === ENTITY_ID.MAGNET_AURA_MINUS) {
          this.afflictionManager.applyMagneticForce(object, 'minus');
        }
      } else {
        //console.log(object);
        //console.log("No collision");
      }
    }); //End of checking for collision with the gameObjects

    const gameWidth = this.game.canvas.canvasWidth;
    const gameHeight = this.game.canvas.canvasHeight;

    //Portal Enabled
    if (this.relicManager.relic?.id === AUGMENTS.PORTAL) {
      // Player Collision with left wall
      if (this.gameObject.position.x < 0) {
        store.dispatch(playAnimation(VFX.PULSE_PORTAL));
        this.gameObject.position.x = gameWidth - this.gameObject.width;
      }
      // Player Collision with right wall
      if (this.gameObject.position.x + this.gameObject.width > gameWidth) {
        store.dispatch(playAnimation(VFX.PULSE_PORTAL));
        this.gameObject.position.x = 0;
      }
    } else {
      // Player Collision with left wall
      if (this.gameObject.position.x < 0) this.gameObject.position.x = 0;

      // Player Collision with right wall
      if (this.gameObject.position.x + this.gameObject.width > gameWidth) {
        this.gameObject.position.x = gameWidth - this.gameObject.width;
      }
    }

    // Player Collision with top wall
    if (this.gameObject.position.y < 0) this.gameObject.position.y = 0;

    // Player Collision with bottom wall
    if (this.gameObject.position.y + this.gameObject.height > gameHeight) {
      this.gameObject.position.y = gameHeight - this.gameObject.height;
    }
  }

  getHitByBodyAura(obj: GameObject, damage: number, lastWhoDamagedMe?: string) {
    if (!this.healthManager.isImmune && !this.relicManager.isImmune) {
      if (
        this.collision({
          x: obj.gameObject.position.x,
          y: obj.gameObject.position.y,
          width: obj.gameObject.width,
          height: obj.gameObject.height,
        })
      ) {
        this.healthManager.takeDamage(damage, { lastWhoDamagedMe });
      }
    }
  }
}