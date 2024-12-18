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

export default class BipolarEnemy extends GameObject {
  game: Game;
  aggressive: boolean;

  constructor({ game, position, velX = 5, velY = 5 }: TProps) {
    super({
      id: ENTITY_ID.BIPOLAR,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
      name: 'Bipolar Enemy',
      symbiosisName: 'Bipolar',
    });

    this.game = game;
    this.aggressive = true;
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
    context.fillStyle = this.aggressive ? COLOR.PRIMARY : COLOR.RED;
    context.fillRect(
      this.gameObject.position.x + 6,
      this.gameObject.position.y + 6,
      this.gameObject.width - 12,
      this.gameObject.height - 12,
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
        reductor: 12,
        color: this.aggressive ? COLOR.RED : COLOR.PRIMARY,
        width: this.gameObject.width,
        height: this.gameObject.height,
        life: 0.7,
        minus: 0.02,
        game: this.game,
      }),
    );

    if (this.gameObject.position.y <= 0) {
      this.gameObject.velY *= -1;
      this.gameObject.position.y = 1;
      this.aggressive = !this.aggressive;
    }

    if (this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height) {
      this.gameObject.velY *= -1;
      this.gameObject.position.y = this.game.canvas.canvasHeight - (this.gameObject.height + 1);
      this.aggressive = !this.aggressive;
    }

    if (this.gameObject.position.x <= 0) {
      this.gameObject.velX *= -1;
      this.gameObject.position.x = 1;
      this.aggressive = !this.aggressive;
    }

    if (this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width) {
      this.gameObject.velX *= -1;
      this.gameObject.position.x = this.game.canvas.canvasWidth - (this.gameObject.width + 1);
      this.aggressive = !this.aggressive;
    }
  }
}
