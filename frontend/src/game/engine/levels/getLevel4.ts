import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import BasicEnemy from '../../entities/Basic/basic_enemy.ts';
import SpeederEnemy from '../../entities/Speeder/speeder_enemy.ts';
import WormEnemy from '../../entities/Worm/worm_enemy.ts';
import WormBoss from '../../entities/Worm/worm_boss.ts';

export const level4Stars: Stars = [7, 18, 36];

const levelStars = level4Stars;

export const getLevel4 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 4', 'Worm']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new WormEnemy({ game, position: { x: 1, y: 40 } }));
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
      game.gameObjects.push(new BasicEnemy({ game, position: { x: 40, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new SpeederEnemy({ game, position: { x: 1, y: 30 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new SpeederEnemy({ game, position: { x: 1, y: 120 } }));
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
        new WormBoss({
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
