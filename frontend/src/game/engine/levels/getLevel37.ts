import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import TracerBoss from 'game/entities/Tracer/tracer_boss.ts';
import FrostyBoss from 'game/entities/Frosty/frosty_boss.ts';

export const level37Stars: Stars = [50];

const levelStars = level37Stars;

export const getLevel37 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 37', 'Marathon V10', 'Boss Edition']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(
        new TracerBoss({
          game,
          // frequency: 60,
        }),
      );
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(
        new FrostyBoss({
          game,
          // frequency: 60,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.gameObjects.push(
        new Star({
          game,
          position: {
            x: game.canvas.canvasWidth / 2 - 20,
            y: 50,
          },
        }),
      );
    }
  }
  return null;
};
