import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import HackerEnemy from '../../entities/Hacker/hacker_enemy.ts';
import PortalEnemy from '../../entities/Portal/portal_enemy.ts';
import MagnetEnemy from '../../entities/Magnet/magnet_enemy.ts';
import HackerBoss from '../../entities/Hacker/hacker_boss.ts';

export const level16Stars: Stars = [7, 25, 52];

const levelStars = level16Stars;

export const getLevel16 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 16', 'Hacker']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 50 } }));
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 400 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 1) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[0]) + 1;
  } else if (game.spawner.executionSequence === 2) {
    if (game.spawner.roundTimer === sec(levelStars[0] + 1)) {
      game.gameObjects.push(new PortalEnemy({ game, position: { x: 1, y: 40 } }));
      game.gameObjects.push(
        new PortalEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 40 }, reverted: true }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new MagnetEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 50 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 },
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
        new HackerBoss({
          game,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[2])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 },
        }),
      );
    }
  }
  return null;
};
