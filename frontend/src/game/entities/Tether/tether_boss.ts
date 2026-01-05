import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import GameObject from 'game/engine/gameObject.ts';
import { Rectangle } from 'game/types/Rectangle.ts';
import Game from 'game/engine/game.ts';
import TetherBullet from 'game/entities/Tether/tether_bullet.ts';
import { lineTouchesRect } from 'game/entities/Tether/tether_enemy.ts';
import { AUGMENTS } from '../../../lib/api/specs/api.ts';

type TProps = {
  game: Game;
  position?: { x: number; y: number };
  velX?: number;
  velY?: number;
  skipAwakening?: boolean;
  frequency?: number;
};

export default class TetherBoss extends GameObject {
  game: Game;
  awaken: boolean;
  bullet_timer: number;
  awakening_timer: number;
  skipAwakening: boolean;
  tetherLines: Array<{ x1: number; x2: number; y: number }>;
  frequency: number;

  constructor({ game, position, velX = 0, velY = 0.3, skipAwakening = false, frequency = 40 }: TProps) {
    super({
      id: ENTITY_ID.BOSS,
      width: 50,
      height: 50,
      position: position ? position : { x: game.canvas.canvasWidth / 2 - 25, y: -60 },
      velY,
      velX,
      symbiosisName: 'Tether',
    });

    this.game = game;
    this.awaken = false;
    this.awakening_timer = 0;
    this.bullet_timer = 0;
    this.skipAwakening = skipAwakening;
    this.frequency = frequency;
    this.tetherLines = [
      { x1: 0, x2: 600, y: 0 },
      { x1: 200, x2: 1200, y: -260 },
    ];
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
    if (!this.awaken && this.skipAwakening) {
      this.awaken = true;
    } else if (!this.awaken && this.gameObject.position.y >= 10) {
      this.awaken = true;
      this.gameObject.velY = 0;
      this.gameObject.velX = 5;
    }
  }

  fireBullets() {
    this.bullet_timer++;
    if (this.awaken && this.bullet_timer % this.frequency === 0) {
      const offset = this.gameObject.velX > 0 ? 20 : -20;
      const origin_x = this.gameObject.position.x + this.gameObject.width / 2 + offset;
      const origin_y = this.gameObject.position.y + this.gameObject.height - 5;
      this.game.gameObjects.push(
        new TetherBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: -3,
          velY: 4,
        }),
      );
      this.game.gameObjects.push(
        new TetherBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 0,
          velY: 5,
        }),
      );
      this.game.gameObjects.push(
        new TetherBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 3,
          velY: 4,
        }),
      );
    }
  }

  draw(context: any) {
    context.fillStyle = COLOR.DARK_BLUE;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
    context.fillStyle = COLOR.PORTAL_BLUE;
    context.fillRect(
      this.gameObject.position.x + 4,
      this.gameObject.position.y + 4,
      this.gameObject.width - 8,
      this.gameObject.height - 8,
    );
    if (this.awaken) {
      this.tetherLines.forEach((line) => {
        context.beginPath();
        context.moveTo(line.x1, line.y);
        context.lineTo(line.x2, line.y);
        context.lineWidth = 2;
        context.strokeStyle = COLOR.PORTAL_BLUE;
        context.stroke();
      });
    }
  }

  update(_deltaTime: number) {
    this.awakenFunction();
    this.fireBullets();
    if (this.awaken) {
      const player = this.game.player;
      const playerRect = {
        x: player.gameObject.position.x,
        y: player.gameObject.position.y,
        width: player.gameObject.width,
        height: player.gameObject.height,
      };

      this.tetherLines.forEach((line) => {
        line.y += 2;
        const touching = lineTouchesRect({ x: line.x1, y: line.y }, { x: line.x2, y: line.y }, playerRect);
        if (touching) {
          if (
            player.relicManager.relic?.id === AUGMENTS.SYMBIOTIC_LINK &&
            player.relicManager.symbioticLinked &&
            player.relicManager.available_uses > 0 &&
            this.gameObject.symbiosisName
          ) {
            player.relicManager.testSymbioticLink(this);
          } else {
            player.healthManager.takeDamage(25, { lastWhoDamagedMe: 'Tether line' });
          }
        }
        if (line.y > this.game.canvas.canvasHeight) {
          line.y = 0;
        }
      });
    }

    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    if (
      this.gameObject.position.x <= 0 ||
      this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width
    )
      this.gameObject.velX *= -1;
  }
}
