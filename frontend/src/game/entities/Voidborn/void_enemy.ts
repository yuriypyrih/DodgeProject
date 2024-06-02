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
  radius?: number;
  speed?: number;
};

export default class VoidEnemy extends GameObject {
  game: Game;
  radius: number;
  angle: number;
  speed: number;
  centered: boolean;

  constructor({ game, position, velX = 5, velY = 5, radius = 200, speed = 0.03 }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
    });

    this.game = game;
    this.radius = radius;
    this.angle = 180; // Start angle
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

  fear(_x: number, _y: number) {}

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
    // Update the angle for circular motion
    this.angle += this.speed;

    // Calculate the new position
    const tempPosX = this.game.canvas.canvasWidth / 2 + this.radius * Math.cos(this.angle) - this.gameObject.width / 2;
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

      this.gameObject.velX = (-8 / distance) * diffX;
      this.gameObject.velY = (-8 / distance) * diffY;
    }

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
        minus: 0.02,
        game: this.game,
      }),
    );
  }
}
