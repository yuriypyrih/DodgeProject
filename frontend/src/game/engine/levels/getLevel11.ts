import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import ShadowEnemy from '../../entities/Shadow/shadow_enemy.ts';
import ShadowBoss from '../../entities/Shadow/shadow_boss.ts';
import WormEnemy from '../../entities/Worm/worm_enemy.ts';
import GhostEnemy from '../../entities/Ghost/ghost_enemy.ts';

export const level11Stars: Stars = [7, 35, 52];

const levelStars = level11Stars;

export const getLevel11 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 11', 'Shadow']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 1 } }));
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
    if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 40, y: 10 } }));
      game.gameObjects.push(new WormEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 100 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 4)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 60, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 6)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 60, y: 40 } }));
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
        new ShadowBoss({
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
