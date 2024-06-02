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
};

export default class HackerBullet extends GameObject {
  game: Game;
  randomizeMovement: number;

  constructor({ game, position, velX = 5, velY = 5 }: TProps) {
    super({
      id: ENTITY_ID.BULLET,
      width: 5,
      height: 5,
      position,
      velY,
      velX,
    });

    this.game = game;
    this.randomizeMovement = 30;
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
    context.fillStyle = COLOR.DARK_GREEN;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
  }

  update(_deltaTime: number) {
    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    // Creating a Trail particle and add it to the list
    this.game.particleObjects.push(
      new Trail({
        x: this.gameObject.position.x,
        y: this.gameObject.position.y,
        reductor: 0,
        color: COLOR.VENOM,
        width: this.gameObject.width,
        height: this.gameObject.height,
        life: 0.8,
        minus: 0.04,
        game: this.game,
      }),
    );

    this.randomizeMovement -= 1;
    if (this.randomizeMovement <= 0) {
      const MAX = 30;
      const MIN = 2;
      this.randomizeMovement = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
      const rand = Math.floor(Math.random() * 2);

      if (this.gameObject.velY === 0) {
        this.gameObject.velY = rand === 0 ? 5 : -5;
        this.gameObject.velX = 0;
      } else {
        this.gameObject.velX = rand === 0 ? 5 : -5;
        this.gameObject.velY = 0;
      }
    }

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

    if (
      this.gameObject.position.y <= 0 ||
      this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height
    ) {
      this.game.gameObjects.splice(this.game.gameObjects.indexOf(this), 1);
    }
    if (this.gameObject.position.x <= 0) {
      this.gameObject.position.x = 1;
    } else if (this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width) {
      this.gameObject.position.x = this.game.canvas.canvasWidth - this.gameObject.width - 1;
    }
  }
}
