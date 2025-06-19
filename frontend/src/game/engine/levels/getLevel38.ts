import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import PortalBoss from 'game/entities/Portal/portal_boss.ts';
import VenomBoss from 'game/entities/Venom/venom_boss.ts';

export const level38Stars: Stars = [50];

const levelStars = level38Stars;

export const getLevel38 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 38', 'Marathon V11', 'Boss Edition']));
    } else if (game.spawner.roundTimer === sec(2)) {
      // game.gameObjects.push(
      //   new PortalBoss({
      //     game,
      //   }),
      // );
      // game.gameObjects.push(
      //   new PortalBoss({
      //     game,
      //     reverted: true,
      //   }),
      // );
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(
        new VenomBoss({
          game,
          frequency: 80,
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
