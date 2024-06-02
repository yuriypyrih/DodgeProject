import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import ScorpionEnemy from '../../entities/Scorpion/scorpion_enemy.ts';
import SlimeEnemy from '../../entities/Slime/slime_enemy.ts';
import VenomEnemy from '../../entities/Venom/venom_enemy.ts';
import TracerEnemy from '../../entities/Tracer/tracer_enemy.ts';
import VoidEnemy from '../../entities/Voidborn/void_enemy.ts';
import ScorpionBoss from '../../entities/Scorpion/scorpion_boss.ts';
import { COLOR } from '../../enum/colors.ts';

export const level21Stars: Stars = [14, 42, 52];
const levelStars = level21Stars;

export const getLevel21 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 21', 'Scorpion']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 40 } }));
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
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 120 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 3)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 50 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 4)) {
      game.gameObjects.push(new VoidEnemy({ game, position: { x: 1, y: 50 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 - 20 },
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
        new ScorpionBoss({
          game,
          color: COLOR.ORANGE,
        }),
      );
    }
    if (game.spawner.roundTimer === sec(levelStars[1] + 2)) {
      game.gameObjects.push(
        new ScorpionBoss({
          game,
          disableTail: true,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[2])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 },
        }),
      );
    }
  }
  return null;
};
