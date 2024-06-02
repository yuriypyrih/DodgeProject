import { playText } from 'redux/slices/vfxSlice';
import store from 'redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from 'game/types/Stars';
import Game from 'game/engine/game';
import Star from 'game/entities/star.ts';
import PortalEnemy from 'game/entities/Portal/portal_enemy.ts';
import TitanEnemy from 'game/entities/Titan/titan_enemy.ts';
import SlimeEnemy from 'game/entities/Slime/slime_enemy.ts';
import TracerEnemy from 'game/entities/Tracer/tracer_enemy.ts';
import PortalBoss from 'game/entities/Portal/portal_boss.ts';

export const level14Stars: Stars = [7, 34, 62];

const levelStars = level14Stars;

export const getLevel14 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 14', 'Portal']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new PortalEnemy({ game, position: { x: 1, y: 40 } }));
      game.gameObjects.push(
        new PortalEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 40 }, reverted: true }),
      );
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
      game.gameObjects.push(new TitanEnemy({ game, position: { x: 40, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 50 } }));
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
        new PortalBoss({
          game,
        }),
      );
      game.gameObjects.push(
        new PortalBoss({
          game,
          reverted: true,
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
