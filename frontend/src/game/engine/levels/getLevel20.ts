import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import VoidEnemy from '../../entities/Voidborn/void_enemy.ts';
import TitanEnemy from '../../entities/Titan/titan_enemy.ts';
import TracerEnemy from '../../entities/Tracer/tracer_enemy.ts';
import WormEnemy from '../../entities/Worm/worm_enemy.ts';
import VoidBoss from '../../entities/Voidborn/void_boss.ts';

export const level20Stars: Stars = [10, 38, 52];
const levelStars = level20Stars;

export const getLevel20 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 20', 'Voidborn']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new VoidEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(
        new VoidEnemy({
          game,
          position: { x: game.canvas.canvasWidth, y: game.canvas.canvasHeight },
          radius: 100,
          speed: 0.08,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 - 20 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 1) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[0]) + 1;
  } else if (game.spawner.executionSequence === 2) {
    if (game.spawner.roundTimer === sec(levelStars[0] + 1)) {
      game.gameObjects.push(new WormEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new TitanEnemy({ game, position: { x: 1, y: 50 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 - 20 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 3) {
    game.clearEnemies();
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[1]) + 1;
  } else if (game.spawner.executionSequence === 4) {
    if (game.spawner.roundTimer === sec(levelStars[1] + 1)) {
      game.gameObjects.push(
        new VoidBoss({
          game,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[2])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 },
        }),
      );
    }
  }
  return null;
};
