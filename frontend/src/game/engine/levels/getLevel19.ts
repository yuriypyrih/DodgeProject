import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import ReaperEnemy from '../../entities/Reaper/reaper_enemy.ts';
import SlimeEnemy from '../../entities/Slime/slime_enemy.ts';
import HackerEnemy from '../../entities/Hacker/hacker_enemy.ts';
import InfernoEnemy from '../../entities/Inferno/inferno_enemy.ts';
import FrostyEnemy from '../../entities/Frosty/frosty_enemy.ts';
import ReaperBoss from '../../entities/Reaper/reaper_boss.ts';

export const level19Stars: Stars = [10, 42, 60];
const levelStars = level19Stars;

export const getLevel19 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 19', 'Reaper']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new ReaperEnemy({ game, position: { x: 1, y: 40 } }));
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
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new InfernoEnemy({ game, position: { x: 1, y: 50 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 4)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 50 } }));
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
        new ReaperBoss({
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
