import { playText } from 'redux/slices/vfxSlice';
import store from 'redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import RadioactiveEnemy from 'game/entities/Radioactive/radiactive_enemy.ts';
import InfernoEnemy from 'game/entities/Inferno/inferno_enemy.ts';
import ScorpionEnemy from 'game/entities/Scorpion/scorpion_enemy.ts';
import SlimeEnemy from 'game/entities/Slime/slime_enemy.ts';
import LifelineEnemy from 'game/entities/Lifeline/lifeline_enemy.ts';
import RadioBoss from 'game/entities/Radioactive/radio_boss.ts';

export const level29Stars: Stars = [6, 40, 64];

const levelStars = level29Stars;

export const getLevel29 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 29', 'Radioactive']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new RadioactiveEnemy({ game, position: { x: 1, y: 40 } }));
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
      game.gameObjects.push(new InfernoEnemy({ game, position: { x: 40, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 4)) {
      game.gameObjects.push(new LifelineEnemy({ game, position: { x: 1, y: 10 } }));
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
        new RadioBoss({
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
