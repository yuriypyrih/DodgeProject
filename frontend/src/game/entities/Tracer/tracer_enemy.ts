import { ENTITY_ID } from '../../enum/entitiy_id.ts';
import { COLOR } from '../../enum/colors.ts';
//import Trail from "../engine/trail";
import GameObject from '../../engine/gameObject.ts';
import { Rectangle } from '../../types/Rectangle.ts';
import Trail from '../../engine/trail.ts';
import Game from '../../engine/game.ts';

type TracerEnemyProps = {
  game: Game;
  position: { x: number; y: number };
  velX?: number;
  velY?: number;
};

export default class TracerEnemy extends GameObject {
  game: Game;
  maxSpeed: number;
  feared_timer: number;
  skip_trail: number;

  constructor({ game, position, velX = 0, velY = 0 }: TracerEnemyProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
      name: 'Tracer Enemy',
    });

    this.game = game;
    this.maxSpeed = 2.4;
    this.feared_timer = -1;
    this.skip_trail = 0;
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

  draw(context: any) {
    context.fillStyle = COLOR.YELLOW;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
  }
  fear() {
    this.feared_timer = 0;
  }

  update(deltaTime: number) {
    // Fear calculation
    if (this.feared_timer > -1) this.feared_timer += deltaTime;
    if (this.feared_timer >= 3000) this.feared_timer = -1;

    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.feared_timer > -1 ? -this.gameObject.velX : this.gameObject.velX;
    this.gameObject.position.y += this.feared_timer > -1 ? -this.gameObject.velY : this.gameObject.velY;

    // Creating a Trail particle and add it to the list
    this.skip_trail++;
    if (this.skip_trail % 4 === 0) {
      this.game.particleObjects.push(
        new Trail({
          x: this.gameObject.position.x,
          y: this.gameObject.position.y,
          reductor: 12,
          color: COLOR.YELLOW,
          width: this.gameObject.width,
          height: this.gameObject.height,
          life: 0.7,
          minus: 0.008,
          game: this.game,
        }),
      );
    }

    const diffY = Math.ceil(this.gameObject.position.y - (this.game.player.gameObject.position.y + 5));
    const diffX = Math.ceil(this.gameObject.position.x - (this.game.player.gameObject.position.x + 5));
    let distance = Math.ceil(
      Math.sqrt(
        (this.gameObject.position.x - this.game.player.gameObject.position.x) *
          (this.gameObject.position.x - this.game.player.gameObject.position.x) +
          (this.gameObject.position.y - this.game.player.gameObject.position.y) *
            (this.gameObject.position.y - this.game.player.gameObject.position.y),
      ),
    );

    if (distance < 1) distance = 1;

    this.gameObject.velX = (-this.maxSpeed / distance) * diffX;
    this.gameObject.velY = (-this.maxSpeed / distance) * diffY;
  }
}
