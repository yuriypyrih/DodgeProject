import { ENTITY_ID } from '../../enum/entitiy_id';
import { COLOR } from '../../enum/colors';
import GameObject from '../../engine/gameObject';
import { Rectangle } from '../../types/Rectangle';
import Game from '../../engine/game';
import store from '../../../redux/store.ts';
import { playAnimation } from '../../../redux/slices/vfxSlice.ts';
import { VFX } from '../../enum/vfx.ts';
import { getSec } from '../../../utils/deltaTime.ts';
import PortalBullet from './portal_bullet.ts';

type TProps = {
  game: Game;
  position?: { x: number; y: number };
  velX?: number;
  velY?: number;
  skipAwakening?: boolean;
  reverted?: boolean;
};

export default class PortalBoss extends GameObject {
  game: Game;
  awaken: boolean;
  bullet_timer: number;
  awakening_timer: number;
  reverted: boolean;
  skipAwakening: boolean;

  constructor({ game, position, velX = 0, velY = 0.3, skipAwakening = false, reverted = false }: TProps) {
    super({
      id: ENTITY_ID.BOSS,
      width: 50,
      height: 50,
      position: position
        ? position
        : { x: game.canvas.canvasWidth / 2 - 25, y: reverted ? game.canvas.canvasHeight + 10 : -60 },
      velY: reverted ? -0.3 : velY,
      velX,
    });

    this.game = game;
    this.awaken = false;
    this.awakening_timer = 0;
    this.bullet_timer = 0;
    this.skipAwakening = skipAwakening;
    this.reverted = reverted;
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
    // DO nothing
  }

  awakenFunction() {
    this.gameObject.velY = 0;
    this.gameObject.velX = 5;
  }

  fireBullets() {
    this.bullet_timer++;
    if (this.awaken && this.bullet_timer % 40 === 0) {
      const offset = this.gameObject.velX > 0 ? 20 : -20;
      const origin_x = this.gameObject.position.x + this.gameObject.width / 2 + offset;
      const origin_y = this.gameObject.position.y + (this.reverted ? -0 : this.gameObject.height - 5);
      this.game.gameObjects.push(
        new PortalBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: -3,
          velY: this.reverted ? -4 : 4,
          reverted: this.reverted,
        }),
      );
      this.game.gameObjects.push(
        new PortalBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: this.reverted ? -0.1 : 0.1,
          velY: this.reverted ? -5 : 5,
          reverted: this.reverted,
        }),
      );
      this.game.gameObjects.push(
        new PortalBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 3,
          velY: this.reverted ? -4 : 4,
          reverted: this.reverted,
        }),
      );
    }
  }

  draw(context: any) {
    context.fillStyle = this.reverted ? COLOR.PORTAL_BLUE : COLOR.PORTAL_ORANGE;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
  }

  update(_deltaTime: number) {
    this.awakening_timer += 1;
    if (!this.awaken) {
      if (getSec(this.awakening_timer) >= 4) {
        this.awakenFunction();
        this.awaken = true;
      }
    }
    this.fireBullets();
    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    if (this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width) {
      this.gameObject.position.x = 0;
      store.dispatch(playAnimation(VFX.PULSE_PORTAL));
    }
  }
}
