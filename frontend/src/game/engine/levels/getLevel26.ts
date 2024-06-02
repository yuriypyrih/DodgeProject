import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import VenomEnemy from '../../entities/Venom/venom_enemy.ts';
import InfernoEnemy from '../../entities/Inferno/inferno_enemy.ts';
import BomberEnemy from '../../entities/Bomber/bomber_enemy.ts';
import VoidEnemy from '../../entities/Voidborn/void_enemy.ts';
import ScorpionEnemy from '../../entities/Scorpion/scorpion_enemy.ts';
import HackerEnemy from '../../entities/Hacker/hacker_enemy.ts';
export const level26Stars: Stars = [5, 15, 25, Infinity];
const levelStars = level26Stars;
const RESET_THRESHOLD = 100;

export const getLevel26 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 26', 'Chaos Dungeon', 'Vipers Pit']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 40 } }));
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 240 } }));
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
      game.gameObjects.push(new InfernoEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new BomberEnemy({ game, position: { x: 1, y: 60 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 - 20 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 3) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[1]) + 1;
  } else if (game.spawner.executionSequence === 4) {
    if (game.spawner.roundTimer === sec(levelStars[1] + 1)) {
      game.gameObjects.push(new VoidEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2])) {
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
  } else if (game.spawner.executionSequence === 6) {
    if (game.spawner.roundTimer === sec(levelStars[2] + 1)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD)) {
      game.clearEnemies();
      store.dispatch(playText(['ENEMIES RESET']));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 1)) {
      game.gameObjects.push(new InfernoEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 2)) {
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 200 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 3)) {
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 80 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 4)) {
      game.gameObjects.push(new BomberEnemy({ game, position: { x: 1, y: 280 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 5)) {
      game.gameObjects.push(new VoidEnemy({ game, position: { x: 1, y: 40 } }));
      game.spawner.roundTimer = sec(levelStars[2]) + 1;
    }
  }
  return null;
};
