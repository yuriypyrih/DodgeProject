import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import FrostyEnemy from '../../entities/Frosty/frosty_enemy.ts';
import TracerEnemy from '../../entities/Tracer/tracer_enemy.ts';
import MagnetEnemy from '../../entities/Magnet/magnet_enemy.ts';
import InfernoEnemy from '../../entities/Inferno/inferno_enemy.ts';

export const level23Stars: Stars = [15, 18, 21, 35, 38, 42];
const levelStars = level23Stars;

export const getLevel23 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 23', 'Marathon V4']));
    }
    if (game.spawner.roundTimer === sec(1)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 20 } }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(5)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 220 } }));
    } else if (game.spawner.roundTimer === sec(7)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 320 } }));
    } else if (game.spawner.roundTimer === sec(9)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 20 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth - 50, y: 20 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 1) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[0]) + 1;
  } else if (game.spawner.executionSequence === 2) {
    if (game.spawner.roundTimer === sec(levelStars[1])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: 40, y: game.canvas.canvasHeight - 40 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 3) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[1]) + 1;
  } else if (game.spawner.executionSequence === 4) {
    if (game.spawner.roundTimer === sec(levelStars[2])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 - 20 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 5) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[2]) + 1;
    game.clearEnemies();
  } else if (game.spawner.executionSequence === 6) {
    if (game.spawner.roundTimer === sec(levelStars[2] + 1)) {
      game.gameObjects.push(new InfernoEnemy({ game, position: { x: 1, y: 20 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 3)) {
      game.gameObjects.push(new MagnetEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 5)) {
      game.gameObjects.push(new MagnetEnemy({ game, position: { x: 1, y: 220 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 7)) {
      game.gameObjects.push(new MagnetEnemy({ game, position: { x: 1, y: 320 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[3])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth - 50, y: 20 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 7) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[3]) + 1;
  } else if (game.spawner.executionSequence === 8) {
    if (game.spawner.roundTimer === sec(levelStars[4])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: 40, y: game.canvas.canvasHeight - 40 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 9) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[4]) + 1;
  } else if (game.spawner.executionSequence === 10) {
    if (game.spawner.roundTimer === sec(levelStars[5])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 - 20 },
        }),
      );
    }
  }
  return null;
};
