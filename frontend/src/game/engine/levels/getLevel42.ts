import { playText } from 'redux/slices/vfxSlice';
import store from '../../../redux/store';
import { sec } from 'utils/deltaTime';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star.ts';
import MimicEnemy from '../../entities/Mimic/mimic_enemy.ts';
import PuppetEnemy from 'game/entities/Puppet/puppet_enemy.ts';
import HackerEnemy from 'game/entities/Hacker/hacker_enemy.ts';
import TricksterEnemy from 'game/entities/Trickster/trickster_enemy.ts';
import LifelineEnemy from 'game/entities/Lifeline/lifeline_enemy.ts';
import ReaperEnemy from 'game/entities/Reaper/reaper_enemy.ts';

export const level42Stars: Stars = [100];
const levelStars = level42Stars;

export const getLevel42 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      store.dispatch(playText(['LEVEL 42', 'Chaos Dungeon', 'Final Destination']));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.gameObjects.push(new LifelineEnemy({ game, position: { x: 1, y: 10 } }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.gameObjects.push(new PuppetEnemy({ game, position: { x: 1, y: 100 } }));
    } else if (game.spawner.roundTimer === sec(4)) {
      game.gameObjects.push(new HackerEnemy({ game, position: { x: 1, y: 200 } }));
    } else if (game.spawner.roundTimer === sec(5)) {
      game.gameObjects.push(new TricksterEnemy({ game, position: { x: 1, y: 300 } }));
    } else if (game.spawner.roundTimer === sec(6)) {
      game.gameObjects.push(new ReaperEnemy({ game, position: { x: 100, y: 1 } }));
    } else if (game.spawner.roundTimer === sec(7)) {
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
