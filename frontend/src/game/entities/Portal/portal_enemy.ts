import { ENTITY_ID } from '../../enum/entitiy_id.ts';
import { COLOR } from '../../enum/colors.ts';
import GameObject from '../../engine/gameObject.ts';
import { Rectangle } from '../../types/Rectangle.ts';
import Trail from '../../engine/trail.ts';
import Game from '../../engine/game.ts';
import store from '../../../redux/store.ts';
import { playAnimation } from '../../../redux/slices/vfxSlice.ts';
import { VFX } from '../../enum/vfx.ts';

type PortalEnemyProps = {
  game: Game;
  position: { x: number; y: number };
  velX?: number;
  velY?: number;
  reverted?: boolean;
};

export default class PortalEnemy extends GameObject {
  game: Game;

  constructor({ game, position, velX = 3, velY = 6.5, reverted }: PortalEnemyProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      width: 20,
      height: 20,
      position,
      velY: reverted ? velY * -1 : velY,
      velX,
      name: 'Portal Enemy',
    });

    this.game = game;
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

  fear(_x: number, _y: number) {}

  draw(context: any) {
    context.fillStyle = COLOR.PORTAL_ORANGE;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height / 2,
    );
    context.fillStyle = COLOR.PORTAL_BLUE;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y + this.gameObject.height / 2,
      this.gameObject.width,
      this.gameObject.height / 2,
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
        color: this.getDiagonialBottomRight() ? COLOR.PORTAL_ORANGE : COLOR.PORTAL_BLUE,
        width: this.gameObject.width,
        height: this.gameObject.height,
        life: 0.7,
        minus: 0.02,
        game: this.game,
      }),
    );

    if (
      this.gameObject.position.y <= 0 ||
      this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height
    )
      this.gameObject.velY *= -1;

    if (this.gameObject.position.x <= 0) {
      this.gameObject.position.x = this.game.canvas.canvasWidth - this.gameObject.width;
      this.gameObject.position.y = this.game.canvas.canvasHeight - this.gameObject.position.y;
      store.dispatch(playAnimation(VFX.PULSE_PORTAL));
    }
    if (this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width) {
      this.gameObject.position.x = 0;
      this.gameObject.position.y = this.game.canvas.canvasHeight - this.gameObject.height - this.gameObject.position.y;
      store.dispatch(playAnimation(VFX.PULSE_PORTAL));
      if (this.gameObject.position.y < 0) this.gameObject.position.y = 10;
      else if (this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height)
        this.gameObject.position.y = this.game.canvas.canvasHeight - this.gameObject.height - 10;
    }
  }

  private getDiagonialBottomRight() {
    return (
      (this.gameObject.velY > 0 && this.gameObject.velX > 0) || (this.gameObject.velY < 0 && this.gameObject.velX < 0)
    );
  }
}
