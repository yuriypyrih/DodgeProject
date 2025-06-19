import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import InfernoBoss from 'game/entities/Inferno/inferno_boss.ts';
import TetherBoss from 'game/entities/Tether/tether_boss.ts';

export const level39Stars: Stars = [50];

const levelStars = level39Stars;

export const getLevel39 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 39', 'Marathon V12', 'Boss Edition']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(
        new InfernoBoss({
          game,
          frequency: 60,
        }),
      );
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(
        new TetherBoss({
          game,
          frequency: 60,
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
