import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import RadioactiveEnemy from 'game/entities/Radioactive/radiactive_enemy.ts';
import ShadowEnemy from 'game/entities/Shadow/shadow_enemy.ts';
import FrostyEnemy from 'game/entities/Frosty/frosty_enemy.ts';
import ScorpionEnemy from 'game/entities/Scorpion/scorpion_enemy.ts';

export const level41Stars: Stars = [100];
const levelStars = level41Stars;

export const getLevel41 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 41', 'Chaos Dungeon', 'Metro Exodus']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(new RadioactiveEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 300 } }));
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 60 } }));
    } else if (game.spawner.roundTimer === sec(5)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 100, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(6)) {
      game.gameObjects.push(new ScorpionEnemy({ game, position: { x: 1, y: 300 } }));
    } else if (game.spawner.roundTimer === sec(7)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.clearEnemies();
      store.dispatch(playText(['ENEMIES RESET']));
      game.spawner.roundTimer = sec(1);
      game.gameObjects.push(new Star({ game, position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 } }));
    }
  }
  return null;
};
