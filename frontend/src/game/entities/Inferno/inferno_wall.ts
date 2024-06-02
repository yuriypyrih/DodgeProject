import { ENTITY_ID } from 'game/enum/entitiy_id';
import GameObject from 'game/engine/gameObject';
import { Rectangle } from 'game/types/Rectangle';
import Game from 'game/engine/game';

const SMALL_SIDE = 60;

const getPosition = (side: 'bottom' | 'top' | 'right' | 'left', game: Game) => {
  if (side === 'top' || side === 'left') {
    return { x: 0, y: 0 };
  } else if (side === 'right') {
    return { x: game.canvas.canvasWidth - SMALL_SIDE, y: 0 };
  } else if (side === 'bottom') {
    return { x: 0, y: game.canvas.canvasHeight - SMALL_SIDE };
  } else {
    return { x: 0, y: 0 };
  }
};

const getDimensions = (side: 'bottom' | 'top' | 'right' | 'left', game: Game) => {
  if (side === 'top' || side === 'bottom') {
    return { width: game.canvas.canvasWidth, height: SMALL_SIDE };
  } else if (side === 'left' || side === 'right') {
    return { width: SMALL_SIDE, height: game.canvas.canvasHeight };
  } else {
    return { width: 100, height: 100 };
  }
};

const getGradientPosition = (side: 'bottom' | 'top' | 'right' | 'left', position: { x: number; y: number }) => {
  if (side === 'top') {
    return [position.x, position.y, position.x, position.y + SMALL_SIDE];
  } else if (side === 'left') {
    return [position.x, position.y, position.x + SMALL_SIDE, position.y];
  } else if (side === 'right') {
    return [position.x + SMALL_SIDE - 2, position.y, position.x, position.y];
  } else if (side === 'bottom') {
    return [position.x, position.y + SMALL_SIDE - 2, position.x, position.y];
  } else {
    return [100, 100, 100, 100];
  }
};

type ExplosionProps = {
  game: Game;
  side: 'bottom' | 'top' | 'right' | 'left';
  duration?: number | null;
};

export default class InfernoWall extends GameObject {
  game: Game;
  side: 'bottom' | 'top' | 'right' | 'left';
  duration: number | null;
  innerTimer: number;

  constructor({ game, side, duration = 100 }: ExplosionProps) {
    super({
      id: ENTITY_ID.INFERNO_WALL,
      ...getDimensions(side, game),
      position: getPosition(side, game),
      velY: 0,
      velX: 0,
    });

    this.game = game;
    this.side = side;
    this.duration = duration;
    this.innerTimer = 0;
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
    const gradient = context.createLinearGradient(...getGradientPosition(this.side, this.gameObject.position));
    const currentSec = this.innerTimer;
    // Calculate how much time is left until the duration is reached
    const timeLeft = this.duration !== null ? this.duration - currentSec : 0;

    // Calculate the opacity based on the remaining time
    const MAX_OPACITY =
      this.duration === null
        ? 1
        : timeLeft <= 1 || currentSec >= this.duration
          ? 0 // If the duration has been reached or only 1 second is left, set opacity to 0
          : Math.min(timeLeft / this.duration, 1); // Otherwise, calculate the proportional opacity

    gradient.addColorStop(0, `rgba(255, 255, 0, ${Math.max(MAX_OPACITY, 0)} )`); // Ensures opacity doesn't go below 0
    gradient.addColorStop(0.1, `rgba(255, 0, 0, ${Math.max(MAX_OPACITY * 0.4, 0)})`); // Adjusts the mid-color opacity
    gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);

    // Use the gradient to fill the rectangle
    context.fillStyle = gradient;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
  }

  update(_deltaTime: number) {
    if (this.duration !== null) {
      this.innerTimer++;

      if (this.innerTimer >= this.duration - 20) {
        this.game.gameObjects.splice(this.game.gameObjects.indexOf(this), 1);
      }
    }
  }
}
