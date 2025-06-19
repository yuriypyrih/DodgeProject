import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime.ts';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import LifelineEnemy from 'game/entities/Lifeline/lifeline_enemy.ts';
import FrostyEnemy from 'game/entities/Frosty/frosty_enemy.ts';
import TracerEnemy from 'game/entities/Tracer/tracer_enemy.ts';
import GhostEnemy from 'game/entities/Ghost/ghost_enemy.ts';
import ReaperEnemy from 'game/entities/Reaper/reaper_enemy.ts';
import LifelineBoss from 'game/entities/Lifeline/lifeline_boss.ts';

export const level28Stars: Stars = [6, 40, 64];

const levelStars = level28Stars;

export const getLevel28 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 28', 'Lifeline']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new LifelineEnemy({ game, position: { x: 1, y: 40 } }));
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
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 40, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 50 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 4)) {
      game.gameObjects.push(new ReaperEnemy({ game, position: { x: 1, y: 220 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 5)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 10 } }));
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
        new LifelineBoss({
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
