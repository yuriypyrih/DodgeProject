import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import ShadowEnemy from '../../entities/Shadow/shadow_enemy.ts';
import GhostEnemy from '../../entities/Ghost/ghost_enemy.ts';
import SlimeEnemy from '../../entities/Slime/slime_enemy.ts';
import TracerEnemy from '../../entities/Tracer/tracer_enemy.ts';
import VenomEnemy from '../../entities/Venom/venom_enemy.ts';
import FrostyEnemy from '../../entities/Frosty/frosty_enemy.ts';
import ReaperEnemy from '../../entities/Reaper/reaper_enemy.ts';

export const level27Stars: Stars = [100];
const levelStars = level27Stars;

export const getLevel27 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 27', 'Chaos Dungeon', 'Anubis Catacomb']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 400 } }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 200 } }));
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 100 } }));
    } else if (game.spawner.roundTimer === sec(5)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(6)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 80 } }));
    } else if (game.spawner.roundTimer === sec(7)) {
      game.gameObjects.push(new ReaperEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(8)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(9)) {
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.clearEnemies();
      store.dispatch(playText(['ENEMIES RESET']));
      game.spawner.roundTimer = sec(1);
      game.gameObjects.push(new Star({ game, position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 } }));
    }
  }
  return null;
};
