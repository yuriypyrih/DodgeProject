import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import MimicEnemy from '../../entities/Mimic/mimic_enemy.ts';

export const level25Stars: Stars = [100];
const levelStars = level25Stars;

export const getLevel25 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 25', 'Chaos Dungeon', 'Clown Fiesta']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 10 }, fullPower: true }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 100 }, fullPower: true }));
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 200 }, fullPower: true }));
    } else if (game.spawner.roundTimer === sec(5)) {
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 300 }, fullPower: true }));
    } else if (game.spawner.roundTimer === sec(6)) {
      game.gameObjects.push(new MimicEnemy({ game, position: { x: 1, y: 400 }, fullPower: true }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.clearEnemies();
      store.dispatch(playText(['ENEMIES RESET']));
      game.spawner.roundTimer = sec(1);
      game.gameObjects.push(new Star({ game, position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 } }));
    }
  }
  return null;
};
