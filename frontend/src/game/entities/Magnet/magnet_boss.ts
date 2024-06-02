import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import GameObject from 'game/engine/gameObject.ts';
import { Rectangle } from 'game/types/Rectangle.ts';
import Game from 'game/engine/game.ts';
import MagnetBullet from './magnet_bullet.ts';

type TProps = {
  game: Game;
  position?: { x: number; y: number };
  velX?: number;
  velY?: number;
  skipAwakening?: boolean;
};

export default class MagnetBoss extends GameObject {
  game: Game;
  awaken: boolean;
  bullet_timer: number;
  awakening_timer: number;
  skipAwakening: boolean;
  magnetLine1: number;
  magnetLine2: number;
  magnetLine3: number;

  constructor({ game, position, velX = 0, velY = 0.3, skipAwakening = false }: TProps) {
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
    this.magnetLine1 = 500;
    this.magnetLine2 = 700;
    this.magnetLine3 = 900;
  }

  getBounds() {
    const rectange: Rectangle = {
      x: this.gameObject.position.x,
      y: this.gameObject.position.y,
      width: this.gameObject.width,
      height: this.gameObject.height,
    };
    return rectange;
  }

  fear() {
    // DO nothing
  }

  awakenFunction() {
    if (!this.awaken && this.skipAwakening) {
      this.awaken = true;
    } else if (!this.awaken && this.gameObject.position.y >= 10) {
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
        new MagnetBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: -3,
          velY: 4,
        }),
      );
      this.game.gameObjects.push(
        new MagnetBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 0,
          velY: 5,
        }),
      );
      this.game.gameObjects.push(
        new MagnetBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 3,
          velY: 4,
        }),
      );
    }
  }

  private calculateValue(input: number): string {
    let result: number;

    if (input <= 200) {
      result = 0;
    } else if (input >= 500) {
      result = 1;
    } else {
      result = (input - 200) / (500 - 200);
    }

    return result.toFixed(2);
  }

  draw(context: any) {
    context.fillStyle = COLOR.RED;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );

    context.fillStyle = COLOR.LIGHT_BLUE;
    context.fillRect(
      this.gameObject.position.x + 4,
      this.gameObject.position.y + 4,
      this.gameObject.width - 8,
      this.gameObject.height - 8,
    );

    [this.magnetLine1, this.magnetLine2, this.magnetLine3].forEach((line) => {
      context.beginPath();
      context.moveTo(0, line);
      context.lineTo(this.game.canvas.canvasWidth, line);
      context.strokeStyle = COLOR.LIGHT_BLUE + String();
      context.globalAlpha = this.calculateValue(line);
      context.stroke();
      context.globalAlpha = 1;
    });
  }

  update(_deltaTime: number) {
    this.awakenFunction();
    this.fireBullets();

    const LINE_SPEED = 3;
    this.magnetLine1 -= LINE_SPEED;
    if (this.magnetLine1 <= 40) this.magnetLine1 = this.magnetLine3 + 200;
    this.magnetLine2 -= LINE_SPEED;
    if (this.magnetLine2 <= 40) this.magnetLine2 = this.magnetLine1 + 200;
    this.magnetLine3 -= LINE_SPEED;
    if (this.magnetLine3 <= 40) this.magnetLine3 = this.magnetLine2 + 200;

    const distanceFromMaxHeight = this.game.canvas.canvasHeight - this.game.player.gameObject.position.y;
    const playerForce = (this.game.canvas.canvasHeight / distanceFromMaxHeight) * 1.8;
    const playerFixedForce = Math.min(Number(playerForce.toFixed(2)), 5.2);
    this.game.player.gameObject.position.y -= playerFixedForce;

    this.game.gameObjects.forEach((obj) => {
      if (obj.gameObject.id === ENTITY_ID.BULLET) {
        const distanceFromMaxHeightBullet = this.game.canvas.canvasHeight - obj.gameObject.position.y;
        const bulletForce = this.game.canvas.canvasHeight / distanceFromMaxHeightBullet / 100;
        obj.gameObject.velY -= Number(bulletForce.toFixed(2));
      }
    });

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
