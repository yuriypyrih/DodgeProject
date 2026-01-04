import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import MimicEnemy from '../../entities/Mimic/mimic_enemy.ts';
import TetherEnemy from 'game/entities/Tether/tether_enemy.ts';
import TracerEnemy from 'game/entities/Tracer/tracer_enemy.ts';
import InfernoEnemy from 'game/entities/Inferno/inferno_enemy.ts';

export const level40Stars: Stars = [100];
const levelStars = level40Stars;

export const getLevel40 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 40', 'Chaos Dungeon', 'Singularity']));
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
      game.clearEnemies();
      store.dispatch(playText(['ENEMIES RESET']));
      game.spawner.roundTimer = sec(1);
      game.gameObjects.push(new Star({ game, position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 } }));
    }
  }
  return null;
};
