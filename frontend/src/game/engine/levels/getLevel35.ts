import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import SpeederBoss from 'game/entities/Speeder/speeder_boss.ts';
import BasicBoss from 'game/entities/Basic/basic_boss.ts';

export const level35Stars: Stars = [50];

const levelStars = level35Stars;

export const getLevel35 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 35', 'Marathon V8', 'Boss Edition']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(
        new SpeederBoss({
          game,
        }),
      );
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(
        new BasicBoss({
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
