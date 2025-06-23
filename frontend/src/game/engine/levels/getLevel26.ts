import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import VenomEnemy from '../../entities/Venom/venom_enemy.ts';
import InfernoEnemy from '../../entities/Inferno/inferno_enemy.ts';
import BomberEnemy from '../../entities/Bomber/bomber_enemy.ts';
import VoidEnemy from '../../entities/Voidborn/void_enemy.ts';
import HackerEnemy from '../../entities/Hacker/hacker_enemy.ts';
import ScorpionEnemy from 'game/entities/Scorpion/scorpion_enemy.ts';
export const level26Stars: Stars = [100];
const levelStars = level26Stars;

export const getLevel26 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 26', 'Chaos Dungeon', 'Vipers Pit']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 100 } }));
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(new InfernoEnemy({ game, position: { x: 1, y: 200 } }));
    } else if (game.spawner.roundTimer === sec(5)) {
      game.gameObjects.push(new VoidEnemy({ game, position: { x: 1, y: 300 } }));
    } else if (game.spawner.roundTimer === sec(6)) {
      game.gameObjects.push(new BomberEnemy({ game, position: { x: 1, y: 400 } }));
    } else if (game.spawner.roundTimer === sec(7)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.clearEnemies();
      store.dispatch(playText(['ENEMIES RESET']));
      game.spawner.roundTimer = sec(1);
      game.gameObjects.push(new Star({ game, position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 } }));
    }
  }
  return null;
};
