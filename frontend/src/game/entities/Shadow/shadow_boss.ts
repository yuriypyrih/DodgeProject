import { ENTITY_ID } from '../../enum/entitiy_id.ts';
import { COLOR } from '../../enum/colors.ts';
import GameObject from '../../engine/gameObject.ts';
import { Rectangle } from '../../types/Rectangle.ts';
import Game from '../../engine/game.ts';
import ShadowBullet from './shadow_bullet.ts';

type ShadowBossProps = {
  game: Game;
  position?: { x: number; y: number };
  velX?: number;
  velY?: number;
};

export default class ShadowBoss extends GameObject {
  game: Game;
  awaken: boolean;
  bullet_timer: number;
  awakening_timer: number;

  constructor({ game, position, velX = 0, velY = 0.3 }: ShadowBossProps) {
    super({
      id: ENTITY_ID.SHADOW_BOSS,
      width: 50,
      height: 50,
      position: position ? position : { x: game.canvas.canvasWidth / 2 - 25, y: -60 },
      velY,
      velX,
    });

    this.game = game;
    this.awaken = false;
    this.awakening_timer = 0;
    this.bullet_timer = 0;
  }

  fear() {
    // DO nothing
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

  awakenFunction() {
    if (!this.awaken && this.gameObject.position.y >= 10) {
      this.awaken = true;
      this.gameObject.velY = 0;
      this.gameObject.velX = 5;
    }
  }

  fireBullets() {
    this.bullet_timer++;
    if (this.awaken && this.bullet_timer % 40 === 0) {
      const offset = this.gameObject.velX > 0 ? 20 : -20;
      const origin_x = this.gameObject.position.x + this.gameObject.width / 2 + offset;
      const origin_y = this.gameObject.position.y + this.gameObject.height - 5;
      this.game.gameObjects.push(
        new ShadowBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: -4,
          velY: 3,
        }),
      );
      this.game.gameObjects.push(
        new ShadowBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: -1,
          velY: 4,
        }),
      );
      this.game.gameObjects.push(
        new ShadowBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 1,
          velY: 4,
        }),
      );
      this.game.gameObjects.push(
        new ShadowBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 4,
          velY: 3,
        }),
      );
    }
  }

  draw(context: any) {
    context.fillStyle = COLOR.BLACK;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
  }

  update(_deltaTime: number) {
    this.awakenFunction();
    this.fireBullets();
    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    if (
      this.gameObject.position.x <= 0 ||
      this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width
    )
      this.gameObject.velX *= -1;
  }
}
