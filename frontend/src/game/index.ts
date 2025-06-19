import Game from './engine/game';
import { GAME_STATE } from './enum/game_state';

let context: CanvasRenderingContext2D | null = null;

export const setContext = (newContext: any) => {
  context = newContext;
};

const startEngine = () => {
  const canvas = <HTMLCanvasElement>document.getElementById('gameScreen-canvas');

  if (canvas) {
    context = canvas.getContext('2d');
  }

  const GAME_WIDTH = 900;
  const GAME_HEIGHT = 500;

  const game = new Game({ canvasWidth: GAME_WIDTH, canvasHeight: GAME_HEIGHT });

  let lastTime = performance.now();
  const FPS = 60;
  const FRAME_TARGET = 1000 / FPS;

  function gameLoop(timestamp: number) {
    const deltaTime = timestamp - lastTime;

    if (deltaTime < FRAME_TARGET) {
      requestAnimationFrame(gameLoop);
      return;
    }

    lastTime = timestamp - (deltaTime % FRAME_TARGET);

    if (game.gameState === GAME_STATE.PLAYING && context !== null) {
      context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      game.update(deltaTime);
      game.draw(context);
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);

  return game;
};

export default startEngine;
