import { playText } from 'redux/slices/vfxSlice';
import store from 'redux/store';
import { sec } from 'utils/deltaTime';
import BasicBoss from '../../entities/Basic/basic_boss.ts';
import BasicEnemy from '../../entities/Basic/basic_enemy.ts';
import Star from '../../entities/star';
import { Stars } from '../../types/Stars';
import Game from '../game';
import { isKeyBindingsArrows } from '../input.ts';

export const level1Stars: Stars = [16, 30, 40];

const levelStars = level1Stars;

export const getLevel1 = (game: Game): null => {
  const isArrows = isKeyBindingsArrows();
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 1', 'Scout']));
    } else if (game.spawner.roundTimer === sec(4.5)) {
      store.dispatch(playText([isArrows ? 'Use Arrows ←↑↓→ ' : 'Use AWSD', 'to move around']));
    } else if (game.spawner.roundTimer === sec(9)) {
      store.dispatch(playText(['Dodge the enemies']));
    } else if (game.spawner.roundTimer === sec(12)) {
      game.gameObjects.push(new BasicEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      store.dispatch(playText(['Collect all stars', 'to win!']));
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
      game.gameObjects.push(new BasicEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new BasicEnemy({ game, position: { x: 1, y: 60 } }));
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
      store.dispatch(
        playText([isArrows ? 'You can press Q to activate' : 'Your can press L to active', 'your Augment power']),
      );
    }
    if (game.spawner.roundTimer === sec(levelStars[1] + 3)) {
      game.gameObjects.push(
        new BasicBoss({
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
