import { playText } from '../../../redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from '../../../utils/deltaTime';
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

export const level27Stars: Stars = [6, 15, 25, Infinity];
const levelStars = level27Stars;

const RESET_THRESHOLD = 100;

export const getLevel27 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 25', 'Chaos Dungeon', 'Anubis Catacomb']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 160 } }));
    } else if (game.spawner.roundTimer === sec(2.5)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 1) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[0]) + 1;
  } else if (game.spawner.executionSequence === 2) {
    if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 160 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 4)) {
      game.gameObjects.push(new ReaperEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 - 20 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 3) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[1]) + 1;
  } else if (game.spawner.executionSequence === 4) {
    if (game.spawner.roundTimer === sec(levelStars[1] + 1)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 160 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[1] + 3)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: game.canvas.canvasHeight / 2 - 20 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 5) {
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[2]) + 1;
  } else if (game.spawner.executionSequence === 6) {
    if (game.spawner.roundTimer === sec(levelStars[2] + 1)) {
      game.gameObjects.push(new VenomEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + 3)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 1, y: 40 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD)) {
      game.clearEnemies();
      store.dispatch(playText(['ENEMIES RESET']));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 1)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 2)) {
      game.gameObjects.push(new FrostyEnemy({ game, position: { x: 1, y: 200 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 3)) {
      game.gameObjects.push(new GhostEnemy({ game, position: { x: 1, y: 80 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 4)) {
      game.gameObjects.push(new ReaperEnemy({ game, position: { x: 1, y: 280 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 5)) {
      game.gameObjects.push(new ShadowEnemy({ game, position: { x: 1, y: 160 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[2] + RESET_THRESHOLD + 6)) {
      game.gameObjects.push(new SlimeEnemy({ game, position: { x: 1, y: 1 } }));
      game.spawner.roundTimer = sec(levelStars[2]) + 1;
    }
  }
  return null;
};
