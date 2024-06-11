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
  tailIsActivated?: boolean;
};

export default class ScorpionEnemy extends GameObject {
  game: Game;
  flickerColor: number;
  tailIsActivated: boolean;
  tailDelayTimer: number;
  startedPos: { x: number; y: number };
  disableTail: boolean;

  constructor({ game, position, velX = 5, velY = 5, tailIsActivated = false }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
      name: 'Scorpion Enemy',
    });

    this.game = game;
    this.flickerColor = 0;
    this.tailIsActivated = tailIsActivated;
    this.disableTail = tailIsActivated;
    this.tailDelayTimer = 0;
    this.startedPos = { ...position };
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

  fear(_x: number, _y: number) {}

  draw(context: any) {
    context.fillStyle = COLOR.RED;
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
    if (!this.tailIsActivated) {
      this.tailDelayTimer++;
      if (this.tailDelayTimer > 55) {
        this.tailIsActivated = true;
        this.game.gameObjects.push(
          new ScorpionEnemy({ game: this.game, position: this.startedPos, tailIsActivated: true }),
        );
      }
    }

    if (!this.disableTail) {
      // Creating a Trail particle and add it to the list
      this.game.particleObjects.push(
        new Trail({
          x: this.gameObject.position.x,
          y: this.gameObject.position.y,
          reductor: 12,
          color: this.flickerColor >= 6 ? COLOR.RED : COLOR.ORANGE,
          width: this.gameObject.width,
          height: this.gameObject.height,
          life: 1.2,
          minus: 0.02,
          game: this.game,
        }),
      );
      this.flickerColor++;
      if (this.flickerColor >= 12) this.flickerColor = 0;
    }

    if (this.gameObject.position.y <= 0) {
      this.gameObject.velY *= -1;
      this.gameObject.position.y = 1;
    }

    if (this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height) {
      this.gameObject.velY *= -1;
      this.gameObject.position.y = this.game.canvas.canvasHeight - (this.gameObject.height + 1);
    }

    if (this.gameObject.position.x <= 0) {
      this.gameObject.velX *= -1;
      this.gameObject.position.x = 1;
    }

    if (this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width) {
      this.gameObject.velX *= -1;
      this.gameObject.position.x = this.game.canvas.canvasWidth - (this.gameObject.width + 1);
    }
  }
}
