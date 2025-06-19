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
import HackerEnemy from 'game/entities/Hacker/hacker_enemy.ts';
import TricksterEnemy from 'game/entities/Trickster/trickster_enemy.ts';
import InfernoBoss from 'game/entities/Inferno/inferno_boss.ts';
import TetherBoss from 'game/entities/Tether/tether_boss.ts';
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
