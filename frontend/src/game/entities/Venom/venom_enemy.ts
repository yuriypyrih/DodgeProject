import { ENTITY_ID } from '../../enum/entitiy_id.ts';
import { COLOR } from '../../enum/colors.ts';
//import Trail from "../engine/trail";
import GameObject from '../../engine/gameObject.ts';
import { Rectangle } from '../../types/Rectangle.ts';
import Trail from '../../engine/trail.ts';
import Game from '../../engine/game.ts';

type VenomEnemyProps = {
  game: Game;
  position: { x: number; y: number };
  velX?: number;
  velY?: number;
  horizontalToRight?: boolean;
  verticalToBottom?: boolean;
};

export default class VenomEnemy extends GameObject {
  game: Game;
  zigTimer: number;
  swapTimer: number;
  velX_max: number;
  velX_min: number;
  velY_min: number;
  velY_max: number;

  constructor({
    game,
    position,
    velX = 2,
    velY = 6,
    horizontalToRight = true,
    verticalToBottom = true,
  }: VenomEnemyProps) {
    super({
      id: ENTITY_ID.VENOM,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
    });

    this.game = game;
    this.zigTimer = 0;
    this.swapTimer = 0;
    this.velX_max = horizontalToRight ? 6 : -6;
    this.velX_min = horizontalToRight ? 2 : -2;
    this.velY_max = verticalToBottom ? 6 : -6;
    this.velY_min = verticalToBottom ? 2 : -2;
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

  fear(x: number, y: number) {
    const size = this.gameObject.height / 2;
    if (this.gameObject.position.x + size <= x && this.gameObject.velX > 0) {
      this.velX_max *= -1;
      this.velX_min *= -1;
    } else if (this.gameObject.position.x + size > x && this.gameObject.velX < 0) {
      this.velX_max *= -1;
      this.velX_min *= -1;
    }
    if (this.gameObject.position.y + size <= y && this.gameObject.velY > 0) {
      this.velY_max *= -1;
      this.velY_min *= -1;
    } else if (this.gameObject.position.y + size > y && this.gameObject.velY < 0) {
      this.velY_max *= -1;
      this.velY_min *= -1;
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

  update(deltaTime: number) {
    this.swapTimer++;

    this.zigTimer += deltaTime;
    if (this.zigTimer < 120) {
      this.gameObject.velX = this.velX_min;
      this.gameObject.velY = this.velY_max;
    } else if (this.zigTimer < 240) {
      this.gameObject.velX = this.velX_max;
      this.gameObject.velY = this.velY_min;
    } else {
      this.zigTimer = 0;
    }

    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    // Creating a Trail particle and add it to the list

    this.game.particleObjects.push(
      new Trail({
        x: this.gameObject.position.x,
        y: this.gameObject.position.y,
        reductor: 12,
        color: COLOR.PURPLE,
        width: this.gameObject.width,
        height: this.gameObject.height,
        life: 1,
        minus: 0.02,
        game: this.game,
      }),
    );
    if (this.gameObject.position.y <= 0) {
      this.gameObject.position.y = 0;
      this.velY_max *= -1;
      this.velY_min *= -1;
    }

    if (this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height) {
      this.gameObject.position.y = this.game.canvas.canvasHeight - this.gameObject.height;
      this.velY_max *= -1;
      this.velY_min *= -1;
    }

    if (this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width) {
      this.gameObject.position.x = this.game.canvas.canvasWidth - this.gameObject.width;
      this.velX_max *= -1;
      this.velX_min *= -1;
    }
    if (this.gameObject.position.x <= 0) {
      this.gameObject.position.x = 0;
      this.velX_max *= -1;
      this.velX_min *= -1;
    }
  }
}
