import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import GameObject from 'game/engine/gameObject.ts';
import { Rectangle } from 'game/types/Rectangle.ts';
import Trail from 'game/engine/trail.ts';
import Game from 'game/engine/game.ts';

type TProps = {
  game: Game;
  position: { x: number; y: number };
  velX?: number;
  velY?: number;
  horizontalToRight?: boolean;
  verticalToBottom?: boolean;
};

export default class LifelineEnemy extends GameObject {
  game: Game;
  aggressive: boolean;
  zigTimer: number;
  swapTimer: number;
  velX_max: number;
  velX_min: number;
  velY_min: number;
  velY_max: number;

  constructor({ game, position, velX = 2, velY = 6, horizontalToRight = true, verticalToBottom = true }: TProps) {
    super({
      id: ENTITY_ID.BIPOLAR,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
      name: 'Lifeline Enemy',
      symbiosisName: 'Lifeline',
    });

    this.game = game;
    this.aggressive = false;
    this.zigTimer = 0;
    this.swapTimer = 0;
    this.velX_max = horizontalToRight ? 6 : -6;
    this.velX_min = horizontalToRight ? 2 : -2;
    this.velY_max = verticalToBottom ? 6 : -6;
    this.velY_min = verticalToBottom ? 2 : -2;
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

  fear(x: number, y: number) {
    const size = this.gameObject.height / 2;
    if (this.gameObject.position.x + size <= x && this.gameObject.velX > 0) this.gameObject.velX *= -1;
    else if (this.gameObject.position.x + size > x && this.gameObject.velX < 0) this.gameObject.velX *= -1;
    if (this.gameObject.position.y + size <= y && this.gameObject.velY > 0) this.gameObject.velY *= -1;
    else if (this.gameObject.position.y + size > y && this.gameObject.velY < 0) this.gameObject.velY *= -1;
  }

  draw(context: any) {
    context.fillStyle = this.aggressive ? COLOR.RED : COLOR.PRIMARY;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
    context.fillStyle = this.aggressive ? COLOR.BLACK : COLOR.RED;
    context.fillRect(
      this.gameObject.position.x + 6,
      this.gameObject.position.y + 6,
      this.gameObject.width - 12,
      this.gameObject.height - 12,
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
        color: this.aggressive ? COLOR.RED : COLOR.PRIMARY,
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
