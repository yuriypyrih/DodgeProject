// mobileControls.ts
import Game from './game';

type Vec = { x: number; y: number };

export default class MobileControls {
  private game: Game;

  private root!: HTMLDivElement;
  private joy!: HTMLDivElement;
  private knob!: HTMLDivElement;
  private augmentBtn!: HTMLButtonElement;

  private pointerId: number | null = null;
  private radius = 64; // px, joystick travel radius
  private deadzone = 10; // px, ignore tiny motions
  private allowDiagonal = true;

  constructor(game: Game) {
    this.game = game;
  }

  mount() {
    // Container that sits over the game (no layout shifts)
    this.root = document.createElement('div');
    this.root.className = 'mc-root';
    this.root.setAttribute('aria-hidden', 'true');
    this.root.style.cssText = `
      position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;
    `;

    // LEFT: joystick area
    this.joy = document.createElement('div');
    this.joy.className = 'mc-joy';
    this.joy.style.cssText = `
      position: absolute; left: 16px; bottom: 16px;
      width: 160px; height: 160px; border-radius: 9999px;
      background: rgba(255,255,255,0.04);
      outline: 1px solid rgba(255,255,255,0.12);
      display: grid; place-items: center;
      pointer-events: auto; touch-action: none; /* important for iOS */
      backdrop-filter: blur(2px);
    `;

    this.knob = document.createElement('div');
    this.knob.className = 'mc-knob';
    this.knob.style.cssText = `
      width: 72px; height: 72px; border-radius: 9999px;
      background: rgba(255,255,255,0.18);
      outline: 1px solid rgba(255,255,255,0.28);
      transform: translate(0px, 0px);
      transition: transform 80ms linear; backdrop-filter: blur(2px);
    `;
    this.joy.appendChild(this.knob);

    // RIGHT: augment button
    this.augmentBtn = document.createElement('button');
    this.augmentBtn.type = 'button';
    this.augmentBtn.className = 'mc-augment';
    this.augmentBtn.textContent = 'AUG';
    this.augmentBtn.style.cssText = `
      position: absolute; right: 16px; bottom: 16px;
      width: 96px; height: 96px; border-radius: 9999px;
      background: rgba(255,255,255,0.10);
      color: #fff; font-weight: 700; letter-spacing: 0.08em;
      border: 1px solid rgba(255,255,255,0.22);
      pointer-events: auto; touch-action: manipulation;
      backdrop-filter: blur(2px);
    `;

    // Assemble
    this.root.appendChild(this.joy);
    this.root.appendChild(this.augmentBtn);
    document.body.appendChild(this.root);

    // Events
    this.joy.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp, { passive: false });
    window.addEventListener('pointercancel', this.onPointerUp, { passive: false });

    this.augmentBtn.addEventListener('pointerdown', this.onAugment, { passive: true });

    // Optional: small hint vibration on mount if supported
    try {
      navigator.vibrate?.(10);
    } catch {
      //
    }
  }

  unmount() {
    this.joy.removeEventListener('pointerdown', this.onPointerDown as any);
    window.removeEventListener('pointermove', this.onPointerMove as any);
    window.removeEventListener('pointerup', this.onPointerUp as any);
    window.removeEventListener('pointercancel', this.onPointerUp as any);
    this.augmentBtn.removeEventListener('pointerdown', this.onAugment as any);
    this.root.remove();
  }

  // ========= Pointer → movement =========
  private onPointerDown = (e: PointerEvent) => {
    if (this.pointerId !== null) return;
    this.pointerId = e.pointerId;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    e.preventDefault();
    this.updateFromEvent(e);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.pointerId !== e.pointerId) return;
    e.preventDefault();
    this.updateFromEvent(e);
  };

  private onPointerUp = (e: PointerEvent) => {
    if (this.pointerId !== e.pointerId) return;
    this.pointerId = null;
    this.knob.style.transform = `translate(0px, 0px)`;
    const p = this.game.player;
    p.stopX();
    p.stopY();
  };

  private updateFromEvent(e: PointerEvent) {
    const rect = this.joy.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // clamp to radius
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(dist, this.radius);
    const nx = dist ? dx / dist : 0; // normalized
    const ny = dist ? dy / dist : 0;

    // move knob visually
    this.knob.style.transform = `translate(${nx * clamped}px, ${ny * clamped}px)`;

    // deadzone check per-axis
    const dz = this.deadzone;
    const move: Vec = { x: Math.abs(dx) > dz ? Math.sign(dx) : 0, y: Math.abs(dy) > dz ? Math.sign(dy) : 0 };

    this.applyMovement(move);
  }

  private applyMovement(dir: Vec) {
    // Note: screen Y grows downward; your API uses moveUp/moveDown—map accordingly
    const player = this.game.player;

    // X axis
    if (dir.x < 0) {
      this.game.keyPressed();
      player.moveLeft();
    } else if (dir.x > 0) {
      this.game.keyPressed();
      player.moveRight();
    } else {
      player.stopX();
    }

    // Y axis
    if (dir.y < 0) {
      this.game.keyPressed();
      player.moveUp();
    } else if (dir.y > 0) {
      this.game.keyPressed();
      player.moveDown();
    } else {
      player.stopY();
    }

    // If you ever want strict 4-way (no diagonals), uncomment:
    // if (!this.allowDiagonal) {
    //   if (Math.abs(dir.x) > Math.abs(dir.y)) { dir.y = 0; } else { dir.x = 0; }
    // }
  }

  // ========= Augment =========
  private onAugment = () => {
    try {
      navigator.vibrate?.(30);
    } catch {
      //
    }
    this.game.player.relicManager.useActiveRelic();
  };
}
