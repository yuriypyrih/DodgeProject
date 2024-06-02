import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import MimicEnemy from '../../entities/Mimic/mimic_enemy.ts';

export const level25Stars: Stars = [5, 15, 25, Infinity];
const levelStars = level25Stars;

export const getLevel25 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 25', 'Chaos Dungeon', 'Clown Fiesta']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 40 }, fullPower: true }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 60 }, fullPower: true }));
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
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 40 }, fullPower: true }));
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
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 40 }, fullPower: true }));
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
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 40 }, fullPower: true }));
    }
  }
  return null;
};
