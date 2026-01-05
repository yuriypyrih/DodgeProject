// inputHandler.ts
import Game from './game';
import MobileControls from './mobileControls';

type InputHandlerProps = { game: Game };

export enum KEY_BINDINGS {
  ARROWS = 'ARROWS',
  AWSD = 'AWSD',
}

const arrowsBindings = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'KeyQ'];
const awsdBindings = ['KeyA', 'KeyW', 'KeyD', 'KeyS', 'KeyL'];

export const isKeyBindingsArrows = () => localStorage.getItem('keyBindings') === KEY_BINDINGS.ARROWS;

const keyDownEvents = (event: KeyboardEvent, game: Game) => {
  const actualBinding = isKeyBindingsArrows() ? arrowsBindings : awsdBindings;

  switch (event.code) {
    case actualBinding[0]:
      game.keyPressed();
      game.player.moveLeft();
      break;
    case actualBinding[1]:
      game.keyPressed();
      game.player.moveUp();
      break;
    case actualBinding[2]:
      game.keyPressed();
      game.player.moveRight();
      break;
    case actualBinding[3]:
      game.keyPressed();
      game.player.moveDown();
      break;
    case actualBinding[4]:
      game.player.relicManager.useActiveRelic();
      break;
    case 'Space':
    case 'Escape':
      game.togglePause();
      break;
  }
};

const keyUpEvents = (event: KeyboardEvent, game: Game) => {
  const actualBinding = isKeyBindingsArrows() ? arrowsBindings : awsdBindings;
  const player = game.player;

  switch (event.code) {
    case actualBinding[0]:
      game.keyPressed();
      if (
        (player.gameObject.velX < 0 && !player.afflictionManager.isTricked) ||
        (player.gameObject.velX > 0 && player.afflictionManager.isTricked)
      )
        player.stopX();
      break;
    case actualBinding[1]:
      game.keyPressed();
      if (
        (player.gameObject.velY < 0 && !player.afflictionManager.isTricked) ||
        (player.gameObject.velY > 0 && player.afflictionManager.isTricked)
      )
        player.stopY();
      break;
    case actualBinding[2]:
      game.keyPressed();
      if (
        (player.gameObject.velX > 0 && !player.afflictionManager.isTricked) ||
        (player.gameObject.velX < 0 && player.afflictionManager.isTricked)
      )
        player.stopX();
      break;
    case actualBinding[3]:
      game.keyPressed();
      if (
        (player.gameObject.velY > 0 && !player.afflictionManager.isTricked) ||
        (player.gameObject.velY < 0 && player.afflictionManager.isTricked)
      )
        player.stopY();
      break;
  }
};

export default class InputHandler {
  game: Game;
  private onKeyDown = (e: KeyboardEvent) => keyDownEvents(e, this.game);
  private onKeyUp = (e: KeyboardEvent) => keyUpEvents(e, this.game);
  private mobile?: MobileControls;

  constructor({ game }: InputHandlerProps) {
    this.game = game;
  }

  initEvents() {
    // Keyboard
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    // Mobile
    const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchPrimary) {
      this.mobile = new MobileControls(this.game);
      this.mobile.mount();

      // Prevent the page from scrolling when touching the canvas
      // (Add 'touch-action: none' to your <canvas> in CSS for iOS 13+)
      const canvas = document.querySelector('canvas');
      canvas?.setAttribute('style', `${canvas.getAttribute('style') ?? ''}; touch-action: none;`);
    }
  }

  terminate() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    this.mobile?.unmount();
  }
}
