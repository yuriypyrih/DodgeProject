import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import ReaperEnemy from '../../entities/Reaper/reaper_enemy.ts';
import PortalEnemy from '../../entities/Portal/portal_enemy.ts';
import VoidEnemy from '../../entities/Voidborn/void_enemy.ts';
import ScorpionEnemy from '../../entities/Scorpion/scorpion_enemy.ts';
import WormEnemy from '../../entities/Worm/worm_enemy.ts';

export const level24Stars: Stars = [15, 18, 21, 35, 40, 50];
const levelStars = level24Stars;

export const getLevel24 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 24', 'Marathon V5']));
    }
    if (game.spawner.roundTimer === sec(1)) {
      game.gameObjects.push(new PortalEnemy({ game, position: { x: 1, y: 40 } }));
      game.gameObjects.push(
        new PortalEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 40 }, reverted: true }),
      );
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new ReaperEnemy({ game, position: { x: 1, y: 20 }, velX: 5, velY: 0 }));
      game.gameObjects.push(new ReaperEnemy({ game, position: { x: 1, y: 120 }, velX: 5, velY: 0 }));
      game.gameObjects.push(
        new ReaperEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight / 2 }, velX: 5, velY: 0 }),
      );
      game.gameObjects.push(
        new ReaperEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 130 }, velX: 5, velY: 0 }),
      );
      game.gameObjects.push(
        new ReaperEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 30 }, velX: 5, velY: 0 }),
      );
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(new PortalEnemy({ game, position: { x: 1, y: 40 } }));
      game.gameObjects.push(
        new PortalEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 40 }, reverted: true }),
      );
    } else if (game.spawner.roundTimer === sec(8)) {
      game.gameObjects.push(new PortalEnemy({ game, position: { x: 1, y: 40 } }));
      game.gameObjects.push(
        new PortalEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 40 }, reverted: true }),
      );
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
    if (game.spawner.roundTimer === sec(levelStars[2] + 1.5)) {
      game.gameObjects.push(new VoidEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 2)) {
      game.gameObjects.push(new WormEnemy({ game, position: { x: 1, y: 1 } }));
      game.gameObjects.push(
        new VoidEnemy({
          game,
          position: { x: game.canvas.canvasWidth, y: game.canvas.canvasHeight },
          radius: 100,
          speed: 0.08,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 4)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 6)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 220 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 8)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 10)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 120 } }));
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
