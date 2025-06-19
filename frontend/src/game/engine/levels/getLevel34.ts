import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import BomberEnemy from '../../entities/Bomber/bomber_enemy.ts';
import SlimeEnemy from '../../entities/Slime/slime_enemy.ts';
import BasicEnemy from '../../entities/Basic/basic_enemy.ts';
import SpeederEnemy from '../../entities/Speeder/speeder_enemy.ts';
import Star from '../../entities/star';
import TracerEnemy from '../../entities/Tracer/tracer_enemy.ts';
import WormEnemy from 'game/entities/Worm/worm_enemy.ts';
import GhostEnemy from 'game/entities/Ghost/ghost_enemy.ts';
import TetherEnemy from 'game/entities/Tether/tether_enemy.ts';
import InfernoEnemy from 'game/entities/Inferno/inferno_enemy.ts';

export const level34Stars: Stars = [50];

const levelStars = level34Stars;

export const getLevel34 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 34', 'Marathon', 'V7']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(new TetherEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new TetherEnemy({ game, position: { x: 1, y: 100 } }));
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(new TetherEnemy({ game, position: { x: 1, y: 200 } }));
    } else if (game.spawner.roundTimer === sec(5)) {
      game.gameObjects.push(new TetherEnemy({ game, position: { x: 1, y: 300 } }));
    } else if (game.spawner.roundTimer === sec(6)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(7)) {
      game.gameObjects.push(new InfernoEnemy({ game, position: { x: 1, y: 60 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.gameObjects.push(
        new Star({
          game,
          position: {
            x: game.canvas.canvasWidth - 60,
            y: game.canvas.canvasHeight - 60,
          },
        }),
      );
    }
  }
  return null;
};
