import { playText } from 'redux/slices/vfxSlice';
import store from 'redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import TricksterEnemy from 'game/entities/Trickster/trickster_enemy.ts';
import HackerEnemy from 'game/entities/Hacker/hacker_enemy.ts';
import WormEnemy from 'game/entities/Worm/worm_enemy.ts';
import MimicEnemy from 'game/entities/Mimic/mimic_enemy.ts';
import SpeederEnemy from 'game/entities/Speeder/speeder_enemy.ts';
import TricksterBoss from 'game/entities/Trickster/trickster_boss.ts';

export const level30Stars: Stars = [6, 40, 64];

const levelStars = level30Stars;

export const getLevel30 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 30', 'Trickster']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new TricksterEnemy({ game, position: { x: 1, y: 10 } }));
      game.gameObjects.push(new TricksterEnemy({ game, position: { x: 1, y: 300 } }));
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
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 40, y: 300 } }));
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 40, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new WormEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 4)) {
      game.gameObjects.push(new SpeederEnemy({ game, position: { x: 1, y: 10 } }));
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
        new TricksterBoss({
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
