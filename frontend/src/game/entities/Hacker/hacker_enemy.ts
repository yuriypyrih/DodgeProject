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

export default class HackerEnemy extends GameObject {
  game: Game;
  randomizeMovement: number;
  feared_timer: number;

  constructor({ game, position, velX = 5, velY = 0 }: TProps) {
    super({
      id: ENTITY_ID.HACKER,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
    });

    this.game = game;
    this.randomizeMovement = 30;
    this.feared_timer = -1;
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
    this.feared_timer = 0;
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

  update(deltaTime: number) {
    // Fear calculation
    if (this.feared_timer > -1) this.feared_timer += deltaTime;
    if (this.feared_timer >= 4000) this.feared_timer = -1;

    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    // Creating a Trail particle and add it to the list
    this.game.particleObjects.push(
      new Trail({
        x: this.gameObject.position.x,
        y: this.gameObject.position.y,
        reductor: 12,
        color: COLOR.VENOM,
        width: this.gameObject.width,
        height: this.gameObject.height,
        life: 0.7,
        minus: 0.015,
        game: this.game,
      }),
    );

    this.randomizeMovement -= 1;
    if (this.randomizeMovement <= 0) {
      const MAX = 30;
      const MIN = 2;
      this.randomizeMovement = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
      const rand = Math.floor(Math.random() * 2);

      if (this.feared_timer > -1) {
        if (this.gameObject.velY === 0) {
          this.gameObject.velY = this.gameObject.position.y < this.game.player.gameObject.position.y ? -6 : 6;
          this.gameObject.velX = 0;
        } else {
          this.gameObject.velX = this.gameObject.position.x < this.game.player.gameObject.position.x ? -6 : 6;
          this.gameObject.velY = 0;
        }
      } else {
        if (this.gameObject.velY === 0) {
          this.gameObject.velY = rand === 0 ? 6 : -6;
          this.gameObject.velX = 0;
        } else {
          this.gameObject.velX = rand === 0 ? 6 : -6;
          this.gameObject.velY = 0;
        }
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

    if (this.gameObject.position.y <= 0) {
      this.gameObject.position.y = 1;
    } else if (this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height) {
      this.gameObject.position.y = this.game.canvas.canvasHeight - this.gameObject.height - 1;
    }
    if (this.gameObject.position.x <= 0) {
      this.gameObject.position.x = 1;
    } else if (this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width) {
      this.gameObject.position.x = this.game.canvas.canvasWidth - this.gameObject.width - 1;
    }
  }
}
