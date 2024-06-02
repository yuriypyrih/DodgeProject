import Game from './game';

type InputHandlerProps = {
  game: Game;
};

export enum KEY_BINDINGS {
  ARROWS = 'ARROWS',
  AWSD = 'AWSD',
}

const arrowsBindings = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'KeyQ'];
const awsdBindings = ['KeyA', 'KeyW', 'KeyD', 'KeyS', 'KeyL'];

export const isKeyBindingsAWSD = () => {
  return localStorage.getItem('keyBindings') === KEY_BINDINGS.AWSD;
};

const keyDownEvents = (event: any, game: Game) => {
  const actualBinding = isKeyBindingsAWSD() ? awsdBindings : arrowsBindings;

  switch (event.code) {
    case actualBinding[0]:
      game.player.moveLeft();
      break;
    case actualBinding[1]:
      game.player.moveUp();
      break;
    case actualBinding[2]:
      game.player.moveRight();
      break;
    case actualBinding[3]:
      game.player.moveDown();
      break;
    case actualBinding[4]:
      game.player.relicManager.useActiveRelic();
      break;
    case 'Space':
      game.togglePause();
      break;
    case 'Escape':
      game.togglePause();
      break;
  }
};

const keyUpEvents = (event: any, game: Game) => {
  const actualBinding = isKeyBindingsAWSD() ? awsdBindings : arrowsBindings;

  switch (event.code) {
    case actualBinding[0]:
      if (game.player.gameObject.velX < 0) game.player.stopX();
      break;
    case actualBinding[1]:
      if (game.player.gameObject.velY < 0) game.player.stopY();
      break;
    case actualBinding[2]:
      if (game.player.gameObject.velX > 0) game.player.stopX();
      break;
    case actualBinding[3]:
      if (game.player.gameObject.velY > 0) game.player.stopY();
      break;
  }
};

export default class InputHandler {
  game: Game;
  constructor({ game }: InputHandlerProps) {
    this.game = game;
  }

  initEvents() {
    document.addEventListener('keydown', (event) => keyDownEvents(event, this.game));
    document.addEventListener('keyup', (event) => keyUpEvents(event, this.game));
  }

  terminate() {
    document.removeEventListener('keydown', (event) => keyDownEvents(event, this.game));
    document.removeEventListener('keyup', (event) => keyUpEvents(event, this.game));
  }
}
