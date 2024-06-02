import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import HackerEnemy from '../../entities/Hacker/hacker_enemy.ts';
import ScorpionEnemy from '../../entities/Scorpion/scorpion_enemy.ts';
import VenomEnemy from '../../entities/Venom/venom_enemy.ts';

export const level22Stars: Stars = [5, 8, 10, 20, 25, 30];
const levelStars = level22Stars;

export const getLevel22 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 22', 'Marathon V3']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 20 } }));
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight / 2 } }));
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 20 } }));
      game.gameObjects.push(new HackerEnemy({ game, position: { x: game.canvas.canvasWidth - 20, y: 20 } }));
      game.gameObjects.push(new HackerEnemy({ game, position: { x: game.canvas.canvasWidth / 2 - 20, y: 20 } }));
      game.gameObjects.push(
        new HackerEnemy({ game, position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight - 20 } }),
      );
      game.gameObjects.push(
        new HackerEnemy({ game, position: { x: game.canvas.canvasWidth - 20, y: game.canvas.canvasHeight / 2 } }),
      );
      game.gameObjects.push(
        new HackerEnemy({ game, position: { x: game.canvas.canvasWidth - 20, y: game.canvas.canvasHeight - 20 } }),
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
    if (game.spawner.roundTimer === sec(levelStars[2] + 1)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 20 } }));
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 80 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 3)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 120 } }));
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 180 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 5)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 220 } }));
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 280 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 7)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 320 } }));
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 380 } }));
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
