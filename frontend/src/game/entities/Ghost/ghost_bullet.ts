import { ENTITY_ID } from '../../enum/entitiy_id.ts';
import { COLOR } from '../../enum/colors.ts';
import GameObject from '../../engine/gameObject.ts';
import { Rectangle } from '../../types/Rectangle.ts';
import Trail from '../../engine/trail.ts';
import Game from '../../engine/game.ts';
import { AUGMENTS } from '../../../lib/api/specs/api.ts';

type GhostBulletProps = {
  game: Game;
  position: { x: number; y: number };
  velX?: number;
  velY?: number;
};

export default class GhostBullet extends GameObject {
  game: Game;
  angle: number;
  initX: number;
  shadowAlpha: number;
  goStealth: boolean;
  stealthTimer: number;

  constructor({ game, position, velX = 0, velY = 2 }: GhostBulletProps) {
    super({
      id: ENTITY_ID.BULLET,
      width: 5,
      height: 5,
      position,
      velY,
      velX,
    });

    this.game = game;
    this.angle = 180;
    this.initX = this.gameObject.position.x;
    this.shadowAlpha = 1;
    this.goStealth = true;
    this.stealthTimer = 0;
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
    context.fillStyle = COLOR.LIGHT_GREY;
    context.globalAlpha = this.shadowAlpha;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
    context.globalAlpha = 1;
  }

  fear(x: number, y: number) {
    const size = this.gameObject.height / 2;
    if (this.gameObject.position.x + size <= x && this.gameObject.velX > 0) this.gameObject.velX *= -1;
    else if (this.gameObject.position.x + size > x && this.gameObject.velX < 0) this.gameObject.velX *= -1;
    if (this.gameObject.position.y + size <= y && this.gameObject.velY > 0) this.gameObject.velY *= -1;
    else if (this.gameObject.position.y + size > y && this.gameObject.velY < 0) this.gameObject.velY *= -1;
  }

  update(_deltaTime: number) {
    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;
    this.stealthTimer++;

    this.gameObject.position.x = this.initX + Math.cos(this.angle) * 60;
    this.angle += 0.1;

    let minShadowAlpha = 0;
    if (this.game.player.relicManager.relic?.id === AUGMENTS.NIGHT_VISION) {
      minShadowAlpha = 0.4;
    }

    if (this.goStealth && this.stealthTimer > 4) {
      this.shadowAlpha -= 0.01;
      if (this.shadowAlpha < minShadowAlpha) {
        this.shadowAlpha = minShadowAlpha;
        this.stealthTimer = 0;
        this.goStealth = false;
      }
    } else if (!this.goStealth && this.stealthTimer > 1) {
      this.shadowAlpha += 0.01;
      if (this.shadowAlpha > 1) {
        this.shadowAlpha = 1;
        this.stealthTimer = 0;
        this.goStealth = true;
      }
    }

    // Creating a Trail particle and add it to the list
    this.game.particleObjects.push(
      new Trail({
        x: this.gameObject.position.x,
        y: this.gameObject.position.y,
        reductor: 0,
        color: COLOR.LIGHT_GREY,
        width: this.gameObject.width,
        height: this.gameObject.height,
        life: this.getShadowTrailAlpha(),
        minus: 0.04,
        game: this.game,
      }),
    );

    if (
      this.gameObject.position.y <= 0 ||
      this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height
    ) {
      this.game.gameObjects.splice(this.game.gameObjects.indexOf(this), 1);
    }
    if (
      this.gameObject.position.x <= 0 ||
      this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width
    ) {
      this.game.gameObjects.splice(this.game.gameObjects.indexOf(this), 1);
    }
  }
  private getShadowTrailAlpha = () => {
    const alpha = this.shadowAlpha - 0.2;
    if (alpha < 0) return 0;
    else return alpha;
  };
}
