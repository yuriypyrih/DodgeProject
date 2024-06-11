import InputHandler from './input';
import Player from './player';
import { GAME_STATE } from '../enum/game_state';
import { ENTITY_ID } from '../enum/entitiy_id';
import GameObject from './gameObject';
//import Menu from "./menu";
import Hud from './hud';
import Spawner from './spawner';
import Trail from './trail';
import { setGameState } from 'redux/slices/gameSlice';
import store from '../../redux/store';
import { Relic } from '../types/Relic.ts';
import { COLOR } from '../enum/colors.ts';
import { getMinMax } from 'utils/getMinMax.ts';
import { AUGMENTS } from '../../lib/api/specs/api.ts';

type GameProps = {
  canvasWidth: number;
  canvasHeight: number;
};

export default class Game {
  level: number;
  dev: boolean;
  gameObjects: GameObject[];
  particleObjects: Trail[];
  canvas: GameProps;
  gameState: GAME_STATE;
  player: Player;
  now: number;
  spawner: Spawner;
  hud: Hud;
  inputHandler: InputHandler;
  birthday: number;
  darkness: number; // 0 to 100;

  constructor({ canvasHeight, canvasWidth }: GameProps) {
    console.log('⚽️ GAME ENGINE CREATED');
    this.canvas = { canvasHeight, canvasWidth };
    this.birthday = Date.now();
    // experimental level;

    this.level = 1;
    // Dev option for debugging
    this.dev = false; // process.env.NODE_ENV === 'development';
    /**
     * gameObjects -> Player can interact with (Player excluded)
     * particleObject -> Player usually cannot interact with
     */
    this.gameObjects = [];

    this.particleObjects = [];

    this.gameState = GAME_STATE.CLOSED;

    this.spawner = new Spawner({ game: this });
    //this.menu = new Menu(this, this.spawner);
    this.hud = new Hud({ game: this });
    this.player = new Player({ game: this });
    this.now = Date.now();

    // TESTING
    // this.menu.playGame(this.level);

    this.inputHandler = new InputHandler({ game: this });
    this.inputHandler.initEvents();
    this.darkness = 0;
  }

  //This function runs once per reload of the page
  start(level: number, relic: Relic | null) {
    // Cleaning up any leftovers
    this.emptyReset();
    console.log('⛳️ LEVEL STARTED', level, relic);
    this.togglePause(GAME_STATE.PLAYING);
    this.level = level;
    this.player.relicManager.assignRelic(relic);
    this.spawner.startLevel(this.level);
  }

  setGameState(gameState: GAME_STATE) {
    this.gameState = gameState;
    store.dispatch(setGameState(this.gameState));
  }

  close() {
    this.gameObjects = [];
    this.particleObjects = [];
    // this.gameState = GAME_STATE.CLOSED;
    this.setGameState(GAME_STATE.CLOSED);
  }

  reset() {
    //This is the reset/replay button
    this.emptyReset();
    this.togglePause(GAME_STATE.PLAYING);
    this.spawner.startLevel(this.level);
  }

  emptyReset() {
    // Resting all the variables
    this.darkness = 0;
    this.gameObjects = [];
    this.particleObjects = [];
    this.player.reset();
    this.spawner.reset();
  }

  clearEnemies() {
    for (let i = 0; i < this.gameObjects.length; i++) {
      if (
        this.gameObjects[i].gameObject.id === ENTITY_ID.BASIC_ENEMY ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.VENOM ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.SHADOW_AURA ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.MAGNET_AURA_MINUS ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.MAGNET_AURA_MINUS ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.INFERNO_WALL ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.SNOWFLAKE ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.FROSTY ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.HACKER ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.REAPER
      ) {
        this.gameObjects.splice(i, 1);
        i--;
      }
    }
  }

  dispatchGameState(gameState: GAME_STATE) {
    this.gameState = gameState;
    store.dispatch(setGameState(this.gameState));
  }

  getDarkness() {
    return getMinMax(0, 1, this.darkness / 100);
  }

  pumpDarkness(increase: number) {
    if (this.darkness < 100) {
      this.darkness += increase;
    }
  }

  dispatchVictory(_stars: number) {
    this.setGameState(GAME_STATE.PAGE_VICTORY);
  }

  dispatchDefeat(_stars: number) {
    this.setGameState(GAME_STATE.PAGE_DEFEAT);
  }

  togglePause(optionalState?: GAME_STATE) {
    if (optionalState) {
      this.gameState = optionalState;
    } else if (this.gameState === GAME_STATE.PAUSED) {
      this.gameState = GAME_STATE.PLAYING;
    } else if (this.gameState === GAME_STATE.PLAYING) {
      this.gameState = GAME_STATE.PAUSED;
    }
    store.dispatch(setGameState(this.gameState));
  }

  update(deltaTime: number) {
    if (this.gameState === GAME_STATE.PLAYING) {
      this.now = Date.now();
      if (this.darkness > 0) {
        this.darkness -= 1;
      }
      this.particleObjects.forEach((object) => object.update(deltaTime));
      this.gameObjects.forEach((object) => object.update(deltaTime));
      this.spawner.update(deltaTime);
      this.hud.update(deltaTime);
      this.player.update(deltaTime);
    }
  }

  draw(context: CanvasRenderingContext2D) {
    const dark = this.getDarkness();
    if (dark) {
      context.globalAlpha = dark;
      context.fillStyle = COLOR.BLACK;
      context.fillRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
      context.globalAlpha = 1;
    }
    if (this.gameObjects.find((obj) => obj.gameObject.id === ENTITY_ID.SHADOW_BOSS)) {
      const gradient = context.createLinearGradient(0, 20, 0, this.canvas.canvasHeight);

      gradient.addColorStop(0, COLOR.BLACK + '00');
      gradient.addColorStop(0.1, COLOR.BLACK + '70');
      gradient.addColorStop(0.8, COLOR.BLACK);
      gradient.addColorStop(1, COLOR.BLACK);

      // Use the gradient to fill the rectangle
      context.fillStyle = gradient;
      context.fillRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
    }
    if (this.player.relicManager.relic?.id === AUGMENTS.NIGHT_VISION) {
      const centerX = this.canvas.canvasWidth / 2;
      const centerY = this.canvas.canvasHeight / 2;
      const innerRadius = 0;
      const outerRadius = 400; // Adjust as needed

      // Create a radial gradient
      const gradient = context.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);

      // Add color stops to the gradient
      gradient.addColorStop(0, COLOR.DARK_GREEN + '40'); // Green color at the center
      gradient.addColorStop(1, COLOR.DARK_GREEN + '00'); // Fade to transparent

      // Use the gradient to fill a circle (or the entire canvas)
      context.fillStyle = gradient;
      context.fillRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
    }
    this.particleObjects.forEach((object) => object.draw(context));
    this.gameObjects.forEach((object) => object.draw(context));
    this.hud.draw(context);
    this.player.draw(context);
  }
}
