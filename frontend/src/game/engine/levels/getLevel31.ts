import { playText } from 'redux/slices/vfxSlice';
import store from 'redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import TricksterEnemy from 'game/entities/Trickster/trickster_enemy.ts';
import PuppetEnemy from 'game/entities/Puppet/puppet_enemy.ts';
import TracerEnemy from 'game/entities/Tracer/tracer_enemy.ts';
import HackerEnemy from 'game/entities/Hacker/hacker_enemy.ts';
import PortalEnemy from 'game/entities/Portal/portal_enemy.ts';
import PuppetBoss from 'game/entities/Puppet/puppet_boss.ts';

export const level31Stars: Stars = [8, 42, 60];

const levelStars = level31Stars;

export const getLevel31 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 31', 'Puppet']));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.gameObjects.push(new PuppetEnemy({ game, position: { x: 1, y: 40 } }));
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
    if (game.spawner.roundTimer === sec(levelStars[0] + 1)) {
      game.gameObjects.push(new TracerEnemy({ game, position: { x: 40, y: 10 } }));
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 40, y: 100 } }));
      game.gameObjects.push(new TricksterEnemy({ game, position: { x: 40, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(levelStars[0] + 2)) {
      game.gameObjects.push(new PortalEnemy({ game, position: { x: 1, y: 40 } }));
      game.gameObjects.push(
        new PortalEnemy({ game, position: { x: 1, y: game.canvas.canvasHeight - 40 }, reverted: true }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[1])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 },
        }),
      );
    }
  } else if (game.spawner.executionSequence === 3) {
    game.clearEnemies();
    game.spawner.executionSequence++;
    game.spawner.roundTimer = sec(levelStars[1]) + 1;
  } else if (game.spawner.executionSequence === 4) {
    if (game.spawner.roundTimer === sec(levelStars[1] + 1)) {
      game.gameObjects.push(
        new PuppetBoss({
          game,
        }),
      );
    } else if (game.spawner.roundTimer === sec(levelStars[2])) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 },
        }),
      );
    }
  }
  return null;
};
