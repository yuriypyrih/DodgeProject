import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import GameObject from 'game/engine/gameObject.ts';
import { Rectangle } from 'game/types/Rectangle.ts';
import Game from 'game/engine/game.ts';
import VoidBullet from './void_bullet.ts';

type TProps = {
  game: Game;
  position?: { x: number; y: number };
  velX?: number;
  velY?: number;
  skipAwakening?: boolean;
  radius?: number;
  speed?: number;
};

export default class VoidBoss extends GameObject {
  game: Game;
  awaken: boolean;
  bullet_timer: number;
  awakening_timer: number;
  skipAwakening: boolean;
  radius: number;
  angle: number;
  speed: number;
  centered: boolean;

  constructor({ game, position, velX = 0, velY = 0.3, skipAwakening = false, radius = 160, speed = 0.025 }: TProps) {
    super({
      id: ENTITY_ID.BOSS,
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
    this.skipAwakening = skipAwakening;
    this.radius = radius;
    this.angle = 200; // Start angle
    this.speed = speed;
    this.centered = false;
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

  awakenFunction() {
    if (!this.awaken && this.skipAwakening) {
      this.awaken = true;
    } else if (!this.awaken && this.gameObject.position.y >= 20) {
      this.awaken = true;
      this.gameObject.velY = 0;
      this.gameObject.velX = 5;
    }
  }

  fireBullets() {
    this.bullet_timer++;
    if (this.awaken && this.bullet_timer % 40 === 0) {
      this.game.gameObjects.push(
        new VoidBullet({
          game: this.game,
          position: { x: this.gameObject.position.x, y: this.gameObject.position.y },
          velX: -4,
          velY: -4,
          angle: 0,
        }),
      );
      this.game.gameObjects.push(
        new VoidBullet({
          game: this.game,
          position: { x: this.gameObject.position.x + this.gameObject.width, y: this.gameObject.position.y },
          velX: 4,
          velY: -4,
          angle: 90,
        }),
      );
      this.game.gameObjects.push(
        new VoidBullet({
          game: this.game,
          position: {
            x: this.gameObject.position.x + this.gameObject.width,
            y: this.gameObject.position.y + this.gameObject.height,
          },
          velX: 4,
          velY: 4,
          angle: 180,
        }),
      );
      this.game.gameObjects.push(
        new VoidBullet({
          game: this.game,
          position: { x: this.gameObject.position.x, y: this.gameObject.position.y + this.gameObject.height },
          velX: -4,
          velY: 4,
          angle: 270,
        }),
      );
    }
  }

  draw(context: any) {
    context.fillStyle = COLOR.PURPLE;
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

    if (this.awaken) {
      this.angle += this.speed;
      const tempPosX =
        this.game.canvas.canvasWidth / 2 + this.radius * Math.cos(this.angle) - this.gameObject.width / 2;
      const tempPosY =
        this.game.canvas.canvasHeight / 2 + this.radius * Math.sin(this.angle) - this.gameObject.height / 2;
      if (this.centered) {
        this.gameObject.position.x = tempPosX;
        this.gameObject.position.y = tempPosY;
      } else {
        this.gameObject.position.x += this.gameObject.velX;
        this.gameObject.position.y += this.gameObject.velY;

        const diffY = Math.ceil(this.gameObject.position.y - tempPosY);
        const diffX = Math.ceil(this.gameObject.position.x - tempPosX);
        let distance = Math.ceil(
          Math.sqrt(
            (this.gameObject.position.x - tempPosX) * (this.gameObject.position.x - tempPosX) +
              (this.gameObject.position.y - tempPosY) * (this.gameObject.position.y - tempPosY),
          ),
        );

        if (distance < 5) {
          distance = 1;
          this.centered = true;
        }

        this.gameObject.velX = (-5 / distance) * diffX;
        this.gameObject.velY = (-5 / distance) * diffY;
      }
    } else {
      this.gameObject.position.x += this.gameObject.velX;
      this.gameObject.position.y += this.gameObject.velY;
    }
  }
}
