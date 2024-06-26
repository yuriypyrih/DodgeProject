import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import BomberEnemy from '../../entities/Bomber/bomber_enemy.ts';
import SlimeEnemy from '../../entities/Slime/slime_enemy.ts';
import BasicEnemy from '../../entities/Basic/basic_enemy.ts';
import SpeederEnemy from '../../entities/Speeder/speeder_enemy.ts';
import Star from '../../entities/star';
import TracerEnemy from '../../entities/Tracer/tracer_enemy.ts';

export const level8Stars: Stars = [10, 20, 30, 40, 50];

const levelStars = level8Stars;

export const getLevel8 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 8', 'Marathon', 'V1']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(new BasicEnemy({ game, position: { x: 0, y: 0 } }));
      game.gameObjects.push(
        new BasicEnemy({
          game,
          position: { x: 0, y: game.canvas.canvasHeight - 20 },
          velX: 5,
          velY: -5,
        }),
      );
      game.gameObjects.push(
        new BasicEnemy({
          game,
          position: {
            x: game.canvas.canvasWidth - 20,
            y: game.canvas.canvasHeight - 20,
          },
          velX: -5,
          velY: -5,
        }),
      );
      game.gameObjects.push(
        new BasicEnemy({
          game,
          position: {
            x: game.canvas.canvasWidth - 20,
            y: 0,
          },
          velX: -5,
          velY: 5,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.gameObjects.push(
        new Star({
          game,
          position: {
            x: game.canvas.canvasWidth - 60,
            y: game.canvas.canvasHeight - 60,
          },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 1) {
    game.clearEnemies();
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[0]) + 1;
  } else if (game.spawner.executionSequence === 2) {
    if (game.spawner.roundTimer === sec(levelStars[0] + 1.2)) {
      game.gameObjects.push(new SpeederEnemy({ game, position: { x: 0, y: 0 } }));
      game.gameObjects.push(
        new SpeederEnemy({
          game,
          position: { x: 0, y: game.canvas.canvasHeight - 20 },
          velX: 2,
          velY: -11,
        }),
      );
      game.gameObjects.push(
        new SpeederEnemy({
          game,
          position: {
            x: game.canvas.canvasWidth - 20,
            y: game.canvas.canvasHeight - 20,
          },
          velX: -2,
          velY: -11,
        }),
      );
      game.gameObjects.push(
        new SpeederEnemy({
          game,
          position: {
            x: game.canvas.canvasWidth - 20,
            y: 0,
          },
          velX: -2,
          velY: 11,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[1])) {
      game.gameObjects.push(
        new Star({
          game,
          position: {
            x: 60,
            y: 60,
          },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 3) {
    game.clearEnemies();
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[1]) + 1;
  } else if (game.spawner.executionSequence === 4) {
    if (game.spawner.roundTimer === sec(levelStars[1] + 1.2)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1] + 2.2)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 50 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1] + 3.2)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 100 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1] + 4.2)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 150 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2])) {
      game.gameObjects.push(
        new Star({
          game,
          position: {
            x: game.canvas.canvasWidth - 60,
            y: game.canvas.canvasHeight - 60,
          },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 5) {
    game.clearEnemies();
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[2]) + 1;
  } else if (game.spawner.executionSequence === 6) {
    if (game.spawner.roundTimer === sec(levelStars[2] + 1.2)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 1 } }));
      game.gameObjects.push(
        new TracerEnemy({
          game,
          position: { x: 1, y: game.canvas.canvasHeight },
        }),
      );
      game.gameObjects.push(
        new TracerEnemy({
          game,
          position: { x: game.canvas.canvasWidth, y: game.canvas.canvasHeight },
        }),
      );
      game.gameObjects.push(
        new TracerEnemy({
          game,
          position: { x: game.canvas.canvasWidth, y: 1 },
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[3])) {
      game.gameObjects.push(
        new Star({
          game,
          position: {
            x: 60,
            y: 60,
          },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 7) {
    game.clearEnemies();
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[3]) + 1;
  } else if (game.spawner.executionSequence === 8) {
    if (game.spawner.roundTimer === sec(levelStars[3] + 1.2)) {
      game.gameObjects.push(new BomberEnemy({ game, position: { x: 0, y: 0 } }));
      game.gameObjects.push(
        new BomberEnemy({
          game,
          position: { x: 0, y: game.canvas.canvasHeight - 20 },
          velX: 5,
          velY: -5,
        }),
      );
      game.gameObjects.push(
        new BomberEnemy({
          game,
          position: {
            x: game.canvas.canvasWidth - 20,
            y: game.canvas.canvasHeight - 20,
          },
          velX: -5,
          velY: -5,
        }),
      );
      game.gameObjects.push(
        new BomberEnemy({
          game,
          position: {
            x: game.canvas.canvasWidth - 20,
            y: 0,
          },
          velX: -5,
          velY: 5,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[4])) {
      game.gameObjects.push(
        new Star({
          game,
          position: {
            x: game.canvas.canvasWidth - 60,
            y: game.canvas.canvasHeight - 60,
          },
        }),
      );
    }
  }
  return null;
};
