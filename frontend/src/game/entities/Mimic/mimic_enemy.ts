import { ENTITY_ID } from '../../enum/entitiy_id.ts';
import { COLOR } from '../../enum/colors.ts';
import GameObject from '../../engine/gameObject.ts';
import { Rectangle } from '../../types/Rectangle.ts';
import Trail from '../../engine/trail.ts';
import Game from '../../engine/game.ts';
import SpeederEnemy from '../Speeder/speeder_enemy.ts';
import BasicEnemy from '../Basic/basic_enemy.ts';
import TracerEnemy from '../Tracer/tracer_enemy.ts';
import SlimeEnemy from '../Slime/slime_enemy.ts';
import VenomEnemy from '../Venom/venom_enemy.ts';
import BomberEnemy from '../Bomber/bomber_enemy.ts';
import WormEnemy from '../Worm/worm_enemy.ts';
import ShadowEnemy from '../Shadow/shadow_enemy.ts';
import GhostEnemy from '../Ghost/ghost_enemy.ts';
import HackerEnemy from '../Hacker/hacker_enemy.ts';
import InfernoEnemy from '../Inferno/inferno_enemy.ts';
import FrostyEnemy from '../Frosty/frosty_enemy.ts';
import ReaperEnemy from '../Reaper/reaper_enemy.ts';

type BasicEnemyProps = {
  game: Game;
  position: { x: number; y: number };
  velX?: number;
  velY?: number;
  fullPower?: boolean;
};

export default class MimicEnemy extends GameObject {
  game: Game;
  enemyMimicked: GameObject | null;
  mimicTimer: number;
  prevMimicked: number | null;
  fullPower: boolean;

  constructor({ game, position, velX = 5, velY = 5, fullPower = false }: BasicEnemyProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
    });

    this.game = game;
    this.enemyMimicked = null;
    this.mimicTimer = 120;
    this.prevMimicked = null;
    this.fullPower = fullPower;
  }

  getBounds() {
    if (this.enemyMimicked) {
      return this.enemyMimicked.getBounds();
    } else {
      const rectange: Rectangle = {
        x: this.gameObject.position.x,
        y: this.gameObject.position.y,
        width: this.gameObject.width,
        height: this.gameObject.height,
      };
      return rectange;
    }
  }

  fear(x: number, y: number) {
    if (this.enemyMimicked) {
      this.enemyMimicked.fear();
    } else {
      const size = this.gameObject.height / 2;
      if (this.gameObject.position.x + size <= x && this.gameObject.velX > 0) this.gameObject.velX *= -1;
      else if (this.gameObject.position.x + size > x && this.gameObject.velX < 0) this.gameObject.velX *= -1;
      if (this.gameObject.position.y + size <= y && this.gameObject.velY > 0) this.gameObject.velY *= -1;
      else if (this.gameObject.position.y + size > y && this.gameObject.velY < 0) this.gameObject.velY *= -1;
    }
  }

  draw(context: any) {
    if (this.enemyMimicked) {
      this.enemyMimicked.draw(context);
    } else {
      context.fillStyle = COLOR.WHITE;
      context.fillRect(
        this.gameObject.position.x,
        this.gameObject.position.y,
        this.gameObject.width,
        this.gameObject.height,
      );
    }
  }

  update(deltaTime: number) {
    this.mimicTimer--;
    if (this.mimicTimer <= 0) {
      this.mimicTimer = 160;
      const tempVelX = this.enemyMimicked ? this.enemyMimicked.gameObject.velX : this.gameObject.velX;
      const tempVelY = this.enemyMimicked ? this.enemyMimicked.gameObject.velY : this.gameObject.velY;
      const MAX_NUMBER = this.fullPower ? 13 : 7;
      const MIN_NUMBER = 0;
      let randomNum = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER)) + MIN_NUMBER;
      if (randomNum === this.prevMimicked) {
        if (randomNum === MAX_NUMBER - 1) randomNum = 0;
        else randomNum++;
      }
      this.prevMimicked = randomNum;
      if (randomNum === 0) {
        this.enemyMimicked = new BasicEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 5 : -5,
          velY: tempVelY >= 0 ? 5 : -5,
        });
      } else if (randomNum === 1) {
        this.enemyMimicked = new SpeederEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 2 : -2,
          velY: tempVelY >= 0 ? 11 : -11,
        });
      } else if (randomNum === 2) {
        this.enemyMimicked = new TracerEnemy({
          game: this.game,
          position: this.gameObject.position,
        });
      } else if (randomNum === 3) {
        this.enemyMimicked = new SlimeEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 1.8 : -1.8,
          velY: tempVelY >= 0 ? 5 : -5,
        });
      } else if (randomNum === 4) {
        this.enemyMimicked = new VenomEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 5 : -5,
          velY: tempVelY >= 0 ? 7 : -7,
        });
      } else if (randomNum === 5) {
        this.enemyMimicked = new BomberEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 5 : -5,
          velY: tempVelY >= 0 ? 5 : -5,
        });
      } else if (randomNum === 6) {
        this.enemyMimicked = new WormEnemy({
          game: this.game,
          position: this.gameObject.position,
        });
      } else if (randomNum === 7) {
        this.enemyMimicked = new ShadowEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 5 : -5,
          velY: tempVelY >= 0 ? 5 : -5,
        });
      } else if (randomNum === 8) {
        this.enemyMimicked = new GhostEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 5 : -5,
          velY: tempVelY >= 0 ? 5 : -5,
        });
      } else if (randomNum === 9) {
        this.enemyMimicked = new HackerEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: 5,
          velY: 0,
        });
      } else if (randomNum === 10) {
        this.enemyMimicked = new InfernoEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 5 : -5,
          velY: tempVelY >= 0 ? 5 : -5,
        });
      } else if (randomNum === 11) {
        this.enemyMimicked = new FrostyEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 5 : -5,
          velY: tempVelY >= 0 ? 5 : -5,
        });
      } else if (randomNum === 12) {
        this.enemyMimicked = new ReaperEnemy({
          game: this.game,
          position: this.gameObject.position,
          velX: tempVelX >= 0 ? 5 : -5,
          velY: tempVelY >= 0 ? 5 : -5,
        });
      }
      if (this.enemyMimicked) this.gameObject = this.enemyMimicked.gameObject;
    }
    if (this.enemyMimicked) {
      this.enemyMimicked.update(deltaTime);
    } else {
      // Updating the entity's position based on its velocity (if it has one)
      this.gameObject.position.x += this.gameObject.velX;
      this.gameObject.position.y += this.gameObject.velY;

      // Creating a Trail particle and add it to the list
      this.game.particleObjects.push(
        new Trail({
          x: this.gameObject.position.x,
          y: this.gameObject.position.y,
          reductor: 12,
          color: COLOR.WHITE,
          width: this.gameObject.width,
          height: this.gameObject.height,
          life: 0.7,
          minus: 0.02,
          game: this.game,
        }),
      );

      if (
        this.gameObject.position.y <= 0 ||
        this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height
      )
        this.gameObject.velY *= -1;
      if (
        this.gameObject.position.x <= 0 ||
        this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width
      )
        this.gameObject.velX *= -1;
    }
  }
}
