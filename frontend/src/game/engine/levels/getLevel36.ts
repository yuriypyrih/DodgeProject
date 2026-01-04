import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import VoidBoss from 'game/entities/Voidborn/void_boss.ts';
import TitanBoss from 'game/entities/Titan/titan_boss.ts';

export const level36Stars: Stars = [50];

const levelStars = level36Stars;

export const getLevel36 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 36', 'Marathon V9', 'Boss Edition']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(
        new VoidBoss({
          game,
        }),
      );
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(
        new TitanBoss({
          game,
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
