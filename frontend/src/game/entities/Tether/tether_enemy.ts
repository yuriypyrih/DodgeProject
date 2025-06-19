import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import GameObject from 'game/engine/gameObject.ts';
import { Rectangle } from 'game/types/Rectangle.ts';
import Trail from 'game/engine/trail.ts';
import Game from 'game/engine/game.ts';

type Vec2 = { x: number; y: number };
type Rect = { x: number; y: number; width: number; height: number };

// ─── point-inside-rect ---------------------------------------------------------
const isPointInside = (p: Vec2, r: Rect): boolean =>
  p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height;

// ─── line-segment intersection test (p0-p1 with p2-p3) -------------------------
const segsIntersect = (p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): boolean => {
  const det = (a: Vec2, b: Vec2): number => a.x * b.y - a.y * b.x;

  const s1 = { x: p1.x - p0.x, y: p1.y - p0.y };
  const s2 = { x: p3.x - p2.x, y: p3.y - p2.y };

  const denom = det(s1, s2);
  if (denom === 0) return false; // parallel / collinear

  const s = det({ x: p2.x - p0.x, y: p2.y - p0.y }, s2) / denom;
  const t = det({ x: p2.x - p0.x, y: p2.y - p0.y }, s1) / denom;

  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
};

// ─── main predicate ------------------------------------------------------------
export const lineTouchesRect = (a: Vec2, b: Vec2, rect: Rect): boolean => {
  // quick acceptance: either endpoint already inside
  if (isPointInside(a, rect) || isPointInside(b, rect)) return true;

  // edges of the rectangle
  const r: Vec2[] = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];

  // check segment against each of the four edges
  return (
    segsIntersect(a, b, r[0], r[1]) || // top
    segsIntersect(a, b, r[1], r[2]) || // right
    segsIntersect(a, b, r[2], r[3]) || // bottom
    segsIntersect(a, b, r[3], r[0]) // left
  );
};

type TProps = {
  game: Game;
  position: { x: number; y: number };
  velX?: number;
  velY?: number;
};

export default class TetherEnemy extends GameObject {
  game: Game;
  isTethered: boolean;

  constructor({ game, position, velX = 5, velY = 5 }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
      name: 'Tether Enemy',
      symbiosisName: 'Tether',
    });

    this.game = game;
    this.isTethered = false;
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

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.save(); // isolate our drawing state
    ctx.fillStyle = COLOR.PORTAL_BLUE;
    ctx.fillRect(this.gameObject.position.x, this.gameObject.position.y, this.gameObject.width, this.gameObject.height);

    // --- helpers ---
    const cubeCenterX = this.gameObject.position.x + this.gameObject.width * 0.5;
    const cubeCenterY = this.gameObject.position.y + this.gameObject.height * 0.5;
    const canvasCenterX = this.game.canvas.canvasWidth * 0.5;
    const canvasCenterY = this.game.canvas.canvasHeight * 0.5;

    if (this.isTethered) {
      // --- line from cube-centre → canvas-centre ---
      ctx.beginPath();
      ctx.moveTo(cubeCenterX, cubeCenterY);
      ctx.lineTo(canvasCenterX, canvasCenterY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLOR.PORTAL_BLUE;
      ctx.stroke();

      // --- dot in canvas centre ---
      ctx.beginPath();
      ctx.arc(canvasCenterX, canvasCenterY, 4, 0, Math.PI * 2);
      ctx.fill(); // same fillStyle from earlier (blue)
    }

    ctx.restore(); // restore whatever was on the stack
  };

  update(_deltaTime: number) {
    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    if (this.isTethered) {
      const player = this.game.player;
      const playerRect: Rect = {
        x: player.gameObject.position.x,
        y: player.gameObject.position.y,
        width: player.gameObject.width,
        height: player.gameObject.height,
      };

      const cubeCenter: Vec2 = {
        x: this.gameObject.position.x + this.gameObject.width * 0.5,
        y: this.gameObject.position.y + this.gameObject.height * 0.5,
      };

      const canvasCenter: Vec2 = {
        x: this.game.canvas.canvasWidth * 0.5,
        y: this.game.canvas.canvasHeight * 0.5,
      };
      const touching = lineTouchesRect(cubeCenter, canvasCenter, playerRect);
      if (touching) {
        player.healthManager.takeDamage(25, { lastWhoDamagedMe: 'Tether enemy' });
      }
    }

    // Creating a Trail particle and add it to the list
    this.game.particleObjects.push(
      new Trail({
        x: this.gameObject.position.x,
        y: this.gameObject.position.y,
        reductor: 12,
        color: COLOR.DARK_BLUE,
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
      this.isTethered = true;
    }

    if (this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height) {
      this.gameObject.velY *= -1;
      this.gameObject.position.y = this.game.canvas.canvasHeight - (this.gameObject.height + 1);
      this.isTethered = true;
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
