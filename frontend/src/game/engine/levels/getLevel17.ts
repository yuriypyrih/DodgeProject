import { playText } from 'redux/slices/vfxSlice';
import store from 'redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from 'game/types/Stars';
import Game from 'game/engine/game';
import Star from 'game/entities/star.ts';
import VenomEnemy from '../../entities/Venom/venom_enemy.ts';
import InfernoEnemy from '../../entities/Inferno/inferno_enemy.ts';
import ShadowEnemy from '../../entities/Shadow/shadow_enemy.ts';
import HackerEnemy from '../../entities/Hacker/hacker_enemy.ts';
import SlimeEnemy from '../../entities/Slime/slime_enemy.ts';
import InfernoBoss from '../../entities/Inferno/inferno_boss.ts';

export const level17Stars: Stars = [7, 34, 52];

const levelStars = level17Stars;

export const getLevel17 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 17', 'Inferno']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new InfernoEnemy({ game, position: { x: 1, y: 40 } }));
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
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 40, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 50 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 4)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 50 } }));
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
        new InfernoBoss({
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
