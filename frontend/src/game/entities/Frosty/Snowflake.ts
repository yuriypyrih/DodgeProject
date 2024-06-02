import { ENTITY_ID } from 'game/enum/entitiy_id';
import GameObject from 'game/engine/gameObject';
import { Rectangle } from 'game/types/Rectangle';
import Game from 'game/engine/game';
import { COLOR } from '../../enum/colors.ts';

function drawHexagon(context: any, x: number, y: number, radius: number, color: string) {
  context.beginPath();
  for (let i = 0; i <= 6; i++) {
    // Calculate angle in radians for each corner of the hexagon
    const angle = (Math.PI / 3) * i - Math.PI / 2;

    // Calculate x and y position of the corner
    const cornerX = x + radius * Math.cos(angle);
    const cornerY = y + radius * Math.sin(angle);

    // Move to the first corner without drawing a line
    if (i === 0) context.moveTo(cornerX, cornerY);
    // Draw line to the next corner
    else context.lineTo(cornerX, cornerY);
  }
  context.strokeStyle = color; // Hexagon stroke color
  context.lineWidth = 2; // Hexagon stroke width
  context.stroke(); // Draw the hexagon
  context.lineWidth = 1;
}

type TProps = {
  game: Game;
  position: { x: number; y: number };
  velX?: number;
  velY?: number;
};

export default class Snowflake extends GameObject {
  game: Game;
  innerTimer: number;
  swapColors: boolean;

  constructor({ game, position, velX = 0, velY = 0 }: TProps) {
    super({
      id: ENTITY_ID.SNOWFLAKE,
      width: 20,
      height: 20,
      position,
      velY,
      velX,
    });

    this.game = game;
    this.innerTimer = 0;
    this.swapColors = false;
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

  draw(context: any) {
    drawHexagon(
      context,
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      12,
      this.swapColors ? COLOR.DARK_BLUE : COLOR.LIGHT_BLUE,
    );
    drawHexagon(
      context,
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      6,
      this.swapColors ? COLOR.LIGHT_BLUE : COLOR.DARK_BLUE,
    );
  }

  update(_deltaTime: number) {
    this.innerTimer++;
    if (this.innerTimer >= 50) {
      this.innerTimer = 0;
      this.swapColors = !this.swapColors;
    }

    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    if (this.gameObject.position.y >= this.game.canvas.canvasHeight - this.gameObject.height) {
      this.game.gameObjects.splice(this.game.gameObjects.indexOf(this), 1);
    }
  }
}
