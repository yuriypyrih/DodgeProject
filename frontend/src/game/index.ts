import Game from './engine/game';
import { GAME_STATE } from './enum/game_state';

let context: CanvasRenderingContext2D | null = null;

export const setContext = (newContext: any) => {
  context = newContext;
};

const startEngine = () => {
  const canvas = document.getElementById('gameScreen-canvas') as HTMLCanvasElement | null;

  if (canvas) {
    context = canvas.getContext('2d');
  }

  const GAME_WIDTH = 900;
  const GAME_HEIGHT = 500;

  const game = new Game({ canvasWidth: GAME_WIDTH, canvasHeight: GAME_HEIGHT });

  const FPS = 60;
  const FRAME_MS = 1000 / FPS;

  let nextTick = performance.now();
  let paintScheduled = false;
  const running = true;

  function schedulePaint() {
    if (paintScheduled) return;

    paintScheduled = true;
    requestAnimationFrame(() => {
      paintScheduled = false;

      if (game.gameState === GAME_STATE.PLAYING && context) {
        context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        game.update(FRAME_MS); // fixed cadence, as requested
        game.draw(context);
      }
    });
  }

  function tick() {
    if (!running) return;

    const now = performance.now();

    // Hard resync after long stalls (tab switch, GC, etc.)
    if (now > nextTick + 100) {
      nextTick = now;
    }

    schedulePaint();

    nextTick += FRAME_MS;
    const delay = Math.max(0, nextTick - performance.now());
    setTimeout(tick, delay);
  }

  setTimeout(tick, 0);

  return game;
};

export default startEngine;
