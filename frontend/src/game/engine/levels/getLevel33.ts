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

export const level33Stars: Stars = [50];

const levelStars = level33Stars;

export const getLevel33 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 33', 'Marathon', 'V6']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(new WormEnemy({ game, position: { x: 1, y: 40 } }));
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 100 } }));
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 200 } }));
    } else if (game.spawner.roundTimer === sec(5)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 300 } }));
    } else if (game.spawner.roundTimer === sec(6)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(7)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 140 } }));
    } else if (game.spawner.roundTimer === sec(8)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 240 } }));
    } else if (game.spawner.roundTimer === sec(9)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 340 } }));
    } else if (game.spawner.roundTimer === sec(10)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 60 } }));
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
